import {test} from 'node:test';
import assert from 'node:assert/strict';
import {clientId} from '../lib/client-id.ts';
test('client IDs work with getRandomValues alone and set UUID version and variant bits',()=>{const provider={getRandomValues<T extends ArrayBufferView|null>(bytes:T):T{new Uint8Array(bytes!.buffer).fill(255);return bytes;}};assert.equal(clientId(provider),'ffffffff-ffff-4fff-bfff-ffffffffffff');});
test('real browser-compatible random IDs are unique and accepted by the server format',()=>{const ids=Array.from({length:100},()=>clientId());assert.equal(new Set(ids).size,100);for(const id of ids)assert.match(id,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);});
