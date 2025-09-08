import crypto from 'crypto';

function getMasterKey(): Buffer {
  const keyB64 = process.env.MASTER_KEY;
  if (!keyB64) throw new Error('MASTER_KEY is not set');
  const buf = Buffer.from(keyB64, 'base64');
  if (buf.length !== 32) throw new Error('MASTER_KEY must be 32 bytes (base64 of 32 bytes)');
  return buf;
}

export function generateRandomBytes(length: number): Buffer {
  return crypto.randomBytes(length);
}

export function encryptAesGcm(plaintext: Buffer, key: Buffer): { ciphertext: Buffer; iv: Buffer; tag: Buffer } {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { ciphertext, iv, tag };
}

export function decryptAesGcm(ciphertext: Buffer, key: Buffer, iv: Buffer, tag: Buffer): Buffer {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext;
}

export function wrapDataKey(dataKey: Buffer, keyVersion: number = 1): { encryptedKey: Buffer; iv: Buffer; tag: Buffer; keyVersion: number } {
  const masterKey = getMasterKey();
  const { ciphertext, iv, tag } = encryptAesGcm(dataKey, masterKey);
  return { encryptedKey: ciphertext, iv, tag, keyVersion };
}

export function unwrapDataKey(encryptedKey: Buffer, iv: Buffer, tag: Buffer, keyVersion: number = 1): Buffer {
  // Future: choose KMS or master key based on keyVersion
  const masterKey = getMasterKey();
  return decryptAesGcm(encryptedKey, masterKey, iv, tag);
}


