'use strict'

let table

function initBig5Table() {
  // https://en.wikipedia.org/wiki/Big5
  const ranges = [
    [0x8140, 0xA0FE],
    [0xA140, 0xA3BF],
    [0xA3C0, 0xA3FE],
    [0xA440, 0xC67E],
    [0xC6A1, 0xC8FE],
    [0xC940, 0xF9D5],
    [0xF9D6, 0xFEFE],
  ]

  table = new Uint16Array(65536)
  table.fill(0xFFFF)
  const dec = new TextDecoder('big5')
  for (const [begin, end] of ranges) {
    for (let b = begin; b <= end; b++) {
      let b1 = b >> 8;
      let b2 = b & 0xFF;
      let b3 = (b2 << 8) | b1;
      let c = dec.decode(new Uint16Array([ b3 ]));
      table[c.charCodeAt(0)] = b3;
    }
  }
}

const NodeJsBufAlloc = typeof Buffer === 'function' && Buffer.allocUnsafe

const defaultOnAlloc = NodeJsBufAlloc
  ? (len) => NodeJsBufAlloc(len)
  : (len) => new Uint8Array(len)

const defaultOnError = () => 63   // '?'


export default function(str, opt = {}) {
  if (!table) {
    initBig5Table()
  }
  const onAlloc = opt.onAlloc || defaultOnAlloc
  const onError = opt.onError || defaultOnError

  const buf = onAlloc(str.length * 2)
  let n = 0

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i)
    if (code < 0x80) {
      buf[n++] = code
      continue
    }
    const big5 = table[code]

    if (big5 !== 0xFFFF) {
      buf[n++] = big5
      buf[n++] = big5 >> 8
    } else if (code === 8364) {
      // 8364 == '€'.charCodeAt(0)
      // Code Page 936 has a single-byte euro sign at 0x80
      buf[n++] = 0x80
    } else {
      const ret = onError(i, str)
      if (ret === -1) {
        break
      }
      if (ret > 0xFF) {
        buf[n++] = ret
        buf[n++] = ret >> 8
      } else {
        buf[n++] = ret
      }
    }
  }
  return buf.subarray(0, n)
}
