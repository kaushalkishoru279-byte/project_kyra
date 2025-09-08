import { NextRequest, NextResponse } from 'next/server';
import { ensureVaultTables, getDbPool } from '@/lib/db';
import { unwrapDataKey, decryptAesGcm } from '@/lib/crypto';
import type { NextRequest } from 'next/server';

function getUserId(req: NextRequest): string | null {
  return req.headers.get('x-user-id');
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  await ensureVaultTables();
  const { searchParams } = new URL(request.url);
  const download = searchParams.get('download') === '1';
  const { id } = await context.params;

  const pool = getDbPool();
  const userId = getUserId(request);
  const { rows } = await pool.query(`
    select d.name, d.mime_type, d.size_bytes, d.encrypted_data_key, d.data_key_iv, d.data_key_tag, d.content_iv, d.content_tag, d.ciphertext, d.key_version
    from vault_documents d
    left join vault_document_access a on a.document_id = d.id
    where d.id = $1 and (($2::text is null) or (a.user_id = $2))
  `, [id, userId]);
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const r = rows[0] as any;
  const dataKey = unwrapDataKey(r.encrypted_data_key, r.data_key_iv, r.data_key_tag, r.key_version);
  const plaintext = decryptAesGcm(r.ciphertext, dataKey, r.content_iv, r.content_tag);

  const headers = new Headers();
  headers.set('Content-Type', r.mime_type);
  headers.set('Content-Length', String(r.size_bytes));
  headers.set('Cache-Control', 'private, max-age=0, must-revalidate');
  const disposition = download ? 'attachment' : 'inline';
  headers.set('Content-Disposition', `${disposition}; filename="${encodeURIComponent(r.name)}"`);
  await pool.query(`insert into vault_document_audit (document_id, user_id, action) values ($1, $2, $3)`, [id, userId, download ? 'download' : 'view']);
  return new NextResponse(plaintext, { status: 200, headers });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  await ensureVaultTables();
  const { id } = await context.params;
  const pool = getDbPool();
  await pool.query(`delete from vault_documents where id = $1`, [id]);
  return new NextResponse(null, { status: 204 });
}


