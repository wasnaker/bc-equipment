import { randomBytes } from 'crypto';

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
function encode(value: bigint, length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result = ALPHABET[Number(value & 31n)] + result;
    value >>= 5n;
  }
  return result;
}

/** Monotonicity is not required here; uniqueness is enforced by the database. */
export function generateEquipmentUlid(): string {
  const timestamp = BigInt(Date.now());
  const randomness = BigInt(`0x${randomBytes(10).toString('hex')}`);
  return encode(timestamp, 10) + encode(randomness, 16);
}
