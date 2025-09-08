import { NextRequest, NextResponse } from 'next/server';
import { ensureVaultTables, getDbPool } from '@/lib/db';
import { decryptAesGcm, encryptAesGcm, generateRandomBytes, wrapDataKey } from '@/lib/crypto';
import type { NextRequest } from 'next/server';
import { scanBuffer } from './scan';

function getUserId(req: NextRequest): string | null {
  // TODO: integrate with real auth; for now accept header X-User-Id
  return req.headers.get('x-user-id');
}

export async function GET(req: NextRequest) {
  await ensureVaultTables();
  const pool = getDbPool();
  const userId = getUserId(req);
  const { rows } = await pool.query(`
    select d.id, d.name, d.mime_type, d.size_bytes, d.description, d.type, d.created_at
    from vault_documents d
    left join vault_document_access a on a.document_id = d.id
    where ($1::text is null) or (a.user_id = $1)
    order by d.created_at desc
  `, [userId]);
  return NextResponse.json(rows.map(r => ({
    id: r.id,
    name: r.name,
    mimeType: r.mime_type,
    sizeBytes: Number(r.size_bytes),
    description: r.description ?? undefined,
    type: r.type ?? undefined,
    createdAt: r.created_at,
  })));
}

export async function POST(request: NextRequest) {
  await ensureVaultTables();
  const form = await request.formData();
  const file = form.get('file');
  const nameProvided = (form.get('name') as string) || '';
  const description = (form.get('description') as string) || null;
  const type = (form.get('documentType') as string) || null;
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  const fileBuf = Buffer.from(await file.arrayBuffer());
  const dataKey = generateRandomBytes(32);
  const scan = await scanBuffer(fileBuf);
  if (!scan.clean) {
    return NextResponse.json({ error: 'File failed security scan', reason: scan.reason }, { status: 400 });
  }
  const { ciphertext, iv: contentIv, tag: contentTag } = encryptAesGcm(fileBuf, dataKey);
  const { encryptedKey, iv: keyIv, tag: keyTag, keyVersion } = wrapDataKey(dataKey);

  const originalName = file.name || 'document';
  const ext = originalName.match(/\.[^./\\]+$/)?.[0] || '';
  const hasExt = /\.[^./\\]+$/.test(nameProvided);
  const storedName = (nameProvided && (hasExt ? nameProvided : nameProvided + ext)) || originalName;

  const mimeType = file.type || 'application/octet-stream';
  const sizeBytes = file.size;

  const pool = getDbPool();
  const userId = getUserId(request) || null;
  const { rows } = await pool.query(
    `insert into vault_documents (name, mime_type, size_bytes, description, type, owner_id, key_version, encrypted_data_key, data_key_iv, data_key_tag, content_iv, content_tag, ciphertext)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) returning id, created_at`,
    [storedName, mimeType, sizeBytes, description, type, userId, keyVersion, encryptedKey, keyIv, keyTag, contentIv, contentTag, ciphertext]
  );
  const docId = rows[0].id;
  if (userId) {
    await pool.query(`insert into vault_document_access (document_id, user_id, role) values ($1, $2, 'owner') on conflict do nothing`, [docId, userId]);
  }
  await pool.query(`insert into vault_document_audit (document_id, user_id, action) values ($1, $2, 'upload')`, [docId, userId]);
  return NextResponse.json({ id: docId, createdAt: rows[0].created_at });
}


