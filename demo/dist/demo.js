(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _src = require("../../src/");

window.customElements.define(_src.DpiAwareImage.is, _src.DpiAwareImage);

},{"../../src/":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.crc = crc;
// https://tools.ietf.org/html/rfc2083#page-94
const crcTable = [0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7, 0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5, 0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F, 0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D, 0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433, 0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01, 0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65, 0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F, 0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7, 0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B, 0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79, 0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D, 0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713, 0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777, 0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9, 0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF, 0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D];
/* Update a running CRC with the bytes buf[0..len-1] */

function updateCrc(crc, buf, len) {
  for (let n = 0; n < len; n++) {
    crc = crc >>> 8 ^ crcTable[(crc ^ buf[n]) & 0xff];
  }

  return crc;
}
/* Return the CRC of the bytes buf[0..len-1]. */


function crc(buf) {
  return (updateCrc(-1, buf, buf.length) ^ -1) >>> 0; // u32
}
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "writePngDpi", {
  enumerable: true,
  get: function () {
    return _writer.writePngDpi;
  }
});
Object.defineProperty(exports, "readPngDpi", {
  enumerable: true,
  get: function () {
    return _reader.readPngDpi;
  }
});
exports.writeChunkPhys = exports.convertToByteArray = exports.convertToDataURI = void 0;

var _writer = require("./writer");

var _reader = require("./reader");

const dataURIScheme = 'data:image/png;base64,';

const convertToDataURI = byteArray => {
  return dataURIScheme + btoa(byteArray.reduce((data, byte) => {
    return data + String.fromCharCode(byte);
  }, ''));
};

exports.convertToDataURI = convertToDataURI;

const convertToByteArray = dataURI => {
  if (!dataURI.startsWith(dataURIScheme)) return [];
  const rawStr = atob(dataURI.split(dataURIScheme)[1]);
  const array = new Uint8Array(new ArrayBuffer(rawStr.length));

  for (let i = 0; i < rawStr.length; i++) {
    array[i] = rawStr.charCodeAt(i);
  }

  return array;
};

exports.convertToByteArray = convertToByteArray;
const writeChunkPhys = _writer.writePngDpi;
exports.writeChunkPhys = writeChunkPhys;
},{"./reader":4,"./writer":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readPngDpi = readPngDpi;

var _utils = require("./utils");

function readPngDpi(arrayBuffer) {
  const ptr = {
    pos: 0
  };
  const byteArray = new Uint8Array(arrayBuffer);
  return readChunks(byteArray, ptr);
}

const readpHYs = (byteArray, ptr) => {
  // https://tools.ietf.org/html/rfc2083#page-22
  const pixelsPerUnitXAxis = parseInt((0, _utils.readBytes)(byteArray, ptr, 4).map(v => (0, _utils.toBin)(v, 8)).join(''), 2);
  const pixelsPerUnitYAxis = parseInt((0, _utils.readBytes)(byteArray, ptr, 4).map(v => (0, _utils.toBin)(v, 8)).join(''), 2);
  const unitSpecifier = (0, _utils.readBytes)(byteArray, ptr, 1).pop();
  let dpi = 72;

  if (unitSpecifier === 1) {
    // dots per inch を計算する
    dpi = Math.floor(Math.max(pixelsPerUnitXAxis, pixelsPerUnitYAxis) / (unitSpecifier * 39.3));
  }

  return dpi;
};

const readChunks = (byteArray, ptr) => {
  if (!(0, _utils.isPng)(byteArray, ptr)) {
    return {
      width: undefined,
      height: undefined,
      dpi: undefined
    };
  }

  const {
    width,
    height
  } = (0, _utils.readIHDR)(byteArray, ptr);
  let dpi;

  while (true) {
    if (ptr.pos >= byteArray.length) break;
    let chunkLength = (0, _utils.readBytes)(byteArray, ptr, 4).map(v => (0, _utils.toBin)(v, 8));
    chunkLength = parseInt(chunkLength.join(''), 2);
    const chunkType = new TextDecoder('utf-8').decode(new Uint8Array((0, _utils.readBytes)(byteArray, ptr, 4)));
    if (chunkType === 'IDAT' || chunkType === 'IEND') break;

    switch (chunkType) {
      case 'pHYs':
        dpi = readpHYs(byteArray, ptr);
        break;

      default:
        ptr.pos += chunkLength;
    }

    ptr.pos += 4; // CRC
  }

  return {
    width,
    height,
    dpi
  };
};
},{"./utils":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bytes = bytes;
exports.isPng = isPng;
exports.readBytes = readBytes;
exports.readIHDR = readIHDR;
exports.toHex = exports.toBin = void 0;

const toBin = (value, digits) => value.toString(2).padStart(digits, '0');

exports.toBin = toBin;

const toHex = (value, digits) => value.toString(16).padStart(digits, '0');

exports.toHex = toHex;

function bytes(num, bytes) {
  const binStr = num.toString(2).padStart(bytes * 8, '0');
  const binArr = binStr.match(/\d{8}/g);
  return binArr.map(v => parseInt(v, 2));
}

function isPng(byteArray, ptr) {
  const pngSignature = /^89 50 4E 47 0D 0A 1A 0A$/i;
  const signature = readBytes(byteArray, ptr, 8).map(v => toHex(v, 2));
  return signature.join(' ').match(pngSignature);
}

function readBytes(byteArray, ptr, bytes) {
  const {
    pos
  } = ptr;
  const res = byteArray.slice(pos, pos + bytes);
  ptr.pos += bytes;
  return Array.from(res);
}

function readIHDR(byteArray, ptr) {
  // https://tools.ietf.org/html/rfc2083#page-15
  // Length, ChunkType
  ptr.pos += 4 + 4; // Width

  let width = readBytes(byteArray, ptr, 4).map(v => toBin(v, 8));
  width = parseInt(width.join(''), 2); // Height

  let height = readBytes(byteArray, ptr, 4).map(v => toBin(v, 8));
  height = parseInt(height.join(''), 2); // Bit depth, Color type, Compression method, Filter method, nterlace method, CRC

  ptr.pos += 1 + 1 + 1 + 1 + 1 + 4;
  return {
    width,
    height
  };
}
},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writePngDpi = writePngDpi;

var _crc = require("./crc32");

var _utils = require("./utils");

function insertChunkPhys(byteArray, ptr, dpr = 1) {
  const type = [112, 72, 89, 115]; // "pHYs"
  // Number of pixels per unit when devicePixelRatio is 1

  const PX_PER_METER = 2835;
  const pixelsPerMeter = Math.floor(PX_PER_METER * dpr);
  const data = [...(0, _utils.bytes)(pixelsPerMeter, 4), ...(0, _utils.bytes)(pixelsPerMeter, 4), 1];
  const pHYsChunk = [0, 0, 0, 9, // 9 bytes
  ...type, ...data, ...(0, _utils.bytes)((0, _crc.crc)([...type, ...data]), 4)];
  const pos = ptr.pos - 8;
  const newByteArray = new Uint8Array([...Array.from(byteArray.slice(0, pos)), ...pHYsChunk, ...Array.from(byteArray.slice(pos))]);
  ptr.pos += pHYsChunk.length;
  return newByteArray;
}

function writePngDpi(byteArray, dpr = 1) {
  const ptr = {
    pos: 0
  };
  if (!(0, _utils.isPng)(byteArray, ptr)) return byteArray;
  (0, _utils.readIHDR)(byteArray, ptr);
  let hasChunkPhys = false;
  let newByteArray;

  while (true) {
    if (ptr.pos >= byteArray.length) break;
    let chunkLength = (0, _utils.readBytes)(byteArray, ptr, 4).map(v => (0, _utils.toBin)(v, 8));
    chunkLength = parseInt(chunkLength.join(''), 2);
    const chunkType = new TextDecoder('utf-8').decode(new Uint8Array((0, _utils.readBytes)(byteArray, ptr, 4)));

    if (chunkType === 'IDAT') {
      if (!hasChunkPhys) {
        newByteArray = insertChunkPhys(byteArray, ptr, dpr);
        hasChunkPhys = true;
      }

      break;
    }

    if (chunkType === 'IEND') break;

    switch (chunkType) {
      case 'pHYs':
        hasChunkPhys = true;
    }

    ptr.pos += chunkLength + 4; // CRC
  }

  return newByteArray || byteArray;
}
},{"./crc32":2,"./utils":5}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DpiAwareImage = void 0;

var _pngPhysChunkWriter = require("png-phys-chunk-writer");

class DpiAwareImage extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  static get is() {
    return 'dpi-aware-image';
  }

  static get observedAttributes() {
    return ['src'];
  }

  async getImageSize(srcUrl) {
    try {
      const res = await fetch(srcUrl, {
        mode: 'cors'
      });
      if (!res.ok) throw new Error(res.statusText);
      const arrayBuffer = await res.arrayBuffer(); // Read PNG pHYs chunk and detect DPI
      // https://tools.ietf.org/html/rfc2083#page-22

      return (0, _pngPhysChunkWriter.readPngDpi)(arrayBuffer);
    } catch (err) {
      return {};
    }
  }

  async attributeChangedCallback(attr, oldVal, newVal) {
    if (oldVal === newVal) return;

    switch (attr) {
      case 'src':
        {
          if (!newVal) return;
          this.removeOlder();

          if (this.getAttribute('followdpi') === null) {
            return this.renderImg(newVal);
          }

          const {
            width,
            height,
            dpi
          } = await this.getImageSize(newVal);

          if (!width || !height || !dpi) {
            return this.renderImg(newVal);
          }

          this.renderSvg(newVal, {
            width,
            height,
            dpi
          });
          break;
        }
    }
  }

  renderImg(srcUrl) {
    const img = document.createElement('img');
    img.setAttribute('src', srcUrl);
    img.id = 'dpi-aware-image';
    this.root.appendChild(img);
  }

  renderSvg(srcUrl, {
    width,
    height,
    dpi
  }) {
    const dpr = dpi / 72;
    width = width / dpr;
    height = height / dpr;
    const viewBox = `0 0 ${width} ${height}`;
    const span = document.createElement('span');
    span.innerHTML = `
      <svg id='dpi-aware-image'
        width='${width}' height='${height}' viewBox='${viewBox}'>
        <foreignObject x='0' y='0' width='100%' height='100%'>
          <img width='100%' height='100%' src='${srcUrl}' />
        </foreignObject>
      </svg>
    `;
    this.root.appendChild(span.firstElementChild);
  }

  removeOlder() {
    const older = this.root.querySelector('#dpi-aware-image');
    if (older) older.remove();
  }

  render() {
    this.root = this.attachShadow({
      mode: 'open'
    });
    this.root.innerHTML = `
      <style>
        #dpi-aware-image {
          width: auto;
          height: auto;
          max-width: var(--max-width);
          max-height: var(--max-height);
          display: block;
        }
        #dpi-aware-image img {
          display: block;
        }
      </style>
    `;
  }

}

exports.DpiAwareImage = DpiAwareImage;

},{"png-phys-chunk-writer":3}]},{},[1]);
