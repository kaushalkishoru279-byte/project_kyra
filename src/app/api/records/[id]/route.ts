import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getDbPool, ensureRecordsTable } from '@/lib/db';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  await ensureRecordsTable();
  const { searchParams } = new URL(request.url);
  const download = searchParams.get('download') === '1';
  const { id } = await context.params;

  const pool = getDbPool();
  const { rows } = await pool.query(
    `select name, mime_type, size_bytes, content from medical_records where id = $1`,
    [id]
  );
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const row = rows[0] as { name: string; mime_type: string; size_bytes: string | number; content: Buffer };
  const headers = new Headers();
  headers.set('Content-Type', row.mime_type);
  headers.set('Content-Length', String(row.size_bytes));
  headers.set('Cache-Control', 'private, max-age=0, must-revalidate');
  headers.set('Accept-Ranges', 'bytes');

  const disposition = download ? 'attachment' : 'inline';
  headers.set('Content-Disposition', `${disposition}; filename="${encodeURIComponent(row.name)}"`);

  return new NextResponse(row.content, { status: 200, headers });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  await ensureRecordsTable();
  const { id } = await context.params;
  const pool = getDbPool();
  await pool.query(`delete from medical_records where id = $1`, [id]);
  return new NextResponse(null, { status: 204 });
}


