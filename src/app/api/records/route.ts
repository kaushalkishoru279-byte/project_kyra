import { NextRequest, NextResponse } from 'next/server';
import { getDbPool, ensureRecordsTable } from '@/lib/db';

// Ensure table exists on first import
void ensureRecordsTable();

export async function GET() {
  await ensureRecordsTable();
  const pool = getDbPool();
  const { rows } = await pool.query(
    `select id, name, mime_type, size_bytes, tags, created_at from medical_records order by created_at desc`
  );
  return NextResponse.json(
    rows.map(r => ({
      id: r.id,
      name: r.name as string,
      mimeType: r.mime_type as string,
      sizeBytes: Number(r.size_bytes),
      tags: (r.tags as string[]) ?? [],
      createdAt: r.created_at,
    }))
  );
}

export async function POST(request: NextRequest) {
  await ensureRecordsTable();
  const form = await request.formData();
  const file = form.get('file');
  const providedName = (form.get('name') as string) || '';
  const tagsRaw = (form.get('tags') as string) || '';
  const tags = tagsRaw
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mimeType = file.type || 'application/octet-stream';
  const sizeBytes = file.size;
  const originalName = file.name || 'document';
  // Ensure stored name includes an extension; if user-provided name lacks one, append original extension
  const originalExtMatch = originalName.match(/\.[^./\\]+$/);
  const hasExt = /\.[^./\\]+$/.test(providedName);
  const storedName = (providedName && (hasExt ? providedName : (originalExtMatch ? providedName + originalExtMatch[0] : providedName))) || originalName;

  const pool = getDbPool();
  const { rows } = await pool.query(
    `insert into medical_records (name, mime_type, size_bytes, tags, content) values ($1, $2, $3, $4, $5) returning id, created_at`,
    [storedName, mimeType, sizeBytes, tags, bytes]
  );

  return NextResponse.json({ id: rows[0].id, createdAt: rows[0].created_at });
}


