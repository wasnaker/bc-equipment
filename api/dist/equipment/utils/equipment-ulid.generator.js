"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEquipmentUlid = generateEquipmentUlid;
const crypto_1 = require("crypto");
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
function encode(value, length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result = ALPHABET[Number(value & 31n)] + result;
        value >>= 5n;
    }
    return result;
}
/** Monotonicity is not required here; uniqueness is enforced by the database. */
function generateEquipmentUlid() {
    const timestamp = BigInt(Date.now());
    const randomness = BigInt(`0x${(0, crypto_1.randomBytes)(10).toString('hex')}`);
    return encode(timestamp, 10) + encode(randomness, 16);
}
