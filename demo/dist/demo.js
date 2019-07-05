(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _src = require("../../src/");

window.customElements.define(_src.DpiAwareImage.is, _src.DpiAwareImage);

},{"../../src/":7}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.crc=crc;// https://tools.ietf.org/html/rfc2083#page-94
const crcTable=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918000,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];/* Update a running CRC with the bytes buf[0..len-1] */function updateCrc(crc,buf,len){for(let n=0;n<len;n++){crc=crc>>>8^crcTable[(crc^buf[n])&255]}return crc}/* Return the CRC of the bytes buf[0..len-1]. */function crc(buf){return(updateCrc(-1,buf,buf.length)^-1)>>>0;// u32
}
},{}],3:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});Object.defineProperty(exports,"writePngDpi",{enumerable:true,get:function(){return _writer.writePngDpi}});Object.defineProperty(exports,"parsePngFormat",{enumerable:true,get:function(){return _reader.parsePngFormat}});Object.defineProperty(exports,"convertToDataURI",{enumerable:true,get:function(){return _share.convertToDataURI}});Object.defineProperty(exports,"convertToByteArray",{enumerable:true,get:function(){return _share.convertToByteArray}});var _writer=require("./writer");var _reader=require("./reader");var _share=require("./share");
},{"./reader":4,"./share":5,"./writer":6}],4:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.parsePngFormat=parsePngFormat;var _share=require("./share");function parsePngFormat(arrayBuffer){const ptr={pos:0};const byteArray=new Uint8Array(arrayBuffer);return readChunks(byteArray,ptr)}const readpHYs=(byteArray,ptr)=>{// https://tools.ietf.org/html/rfc2083#page-22
const pixelsPerUnitXAxis=parseInt((0,_share.readBytes)(byteArray,ptr,4).map(v=>(0,_share.toBin)(v,8)).join(""),2);const pixelsPerUnitYAxis=parseInt((0,_share.readBytes)(byteArray,ptr,4).map(v=>(0,_share.toBin)(v,8)).join(""),2);const unitSpecifier=(0,_share.readBytes)(byteArray,ptr,1).pop();let dpi=72;if(unitSpecifier===1){// dots per inch を計算する
dpi=Math.floor(Math.max(pixelsPerUnitXAxis,pixelsPerUnitYAxis)/(unitSpecifier*39.3))}return dpi};const readChunks=(byteArray,ptr)=>{if(!(0,_share.isPng)(byteArray,ptr)){return{width:undefined,height:undefined,dpi:undefined}}const{width,height}=(0,_share.readIHDR)(byteArray,ptr);let dpi;while(true){if(ptr.pos>=byteArray.length)break;let chunkLength=(0,_share.readBytes)(byteArray,ptr,4).map(v=>(0,_share.toBin)(v,8));chunkLength=parseInt(chunkLength.join(""),2);const chunkType=(0,_share.readBytes)(byteArray,ptr,4).join(" ");if(chunkType===(0,_share.getCharCodes)("IDAT")||chunkType===(0,_share.getCharCodes)("IEND"))break;switch(chunkType){case(0,_share.getCharCodes)("pHYs"):dpi=readpHYs(byteArray,ptr);break;default:ptr.pos+=chunkLength;}ptr.pos+=4;// CRC
}return{width,height,dpi}};
},{"./share":5}],5:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.isPng=isPng;exports.readBytes=readBytes;exports.readIHDR=readIHDR;exports.getCharCodes=getCharCodes;exports.convertToDataURI=convertToDataURI;exports.convertToByteArray=convertToByteArray;exports.toHex=exports.toBin=void 0;const toBin=(value,digits)=>value.toString(2).padStart(digits,"0");exports.toBin=toBin;const toHex=(value,digits)=>value.toString(16).padStart(digits,"0");exports.toHex=toHex;function isPng(byteArray,ptr){const pngSignature="89 50 4E 47 0D 0A 1A 0A";const signature=readBytes(byteArray,ptr,8).map(v=>toHex(v,2));return signature.join(" ").toUpperCase()===pngSignature}function readBytes(byteArray,ptr,byteLength){const{pos}=ptr;const res=byteArray.slice(pos,pos+byteLength);ptr.pos+=byteLength;return Array.from(res)}function readIHDR(byteArray,ptr){// https://tools.ietf.org/html/rfc2083#page-15
// Length, ChunkType
ptr.pos+=4+4;let width=readBytes(byteArray,ptr,4).map(v=>toBin(v,8));width=parseInt(width.join(""),2);let height=readBytes(byteArray,ptr,4).map(v=>toBin(v,8));height=parseInt(height.join(""),2);// Bit depth, Color type, Compression method, Filter method, nterlace method, CRC
ptr.pos+=1+1+1+1+1+4;return{width,height}}function getCharCodes(str){return str.split("").map(c=>c.charCodeAt(0)).join(" ")}const dataURIScheme="data:image/png;base64,";function convertToDataURI(arrayBuffer){const byteArray=new Uint8Array(arrayBuffer);return dataURIScheme+btoa(byteArray.reduce((data,byte)=>{return data+String.fromCharCode(byte)},""))}function convertToByteArray(dataURI){if(!dataURI.startsWith(dataURIScheme))return[];const rawStr=atob(dataURI.split(dataURIScheme)[1]);const array=new Uint8Array(new ArrayBuffer(rawStr.length));for(let i=0;i<rawStr.length;i++){array[i]=rawStr.charCodeAt(i)}return array}
},{}],6:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.writePngDpi=writePngDpi;var _crc=require("./crc32");var _share=require("./share");function bytes(num,byteLength){const binStr=num.toString(2).padStart(byteLength*8,"0");const binArr=binStr.match(/\d{8}/g);return binArr.map(v=>parseInt(v,2))}function insertChunkPhys(byteArray,ptr,dpi=72){const type="pHYs".split("").map(c=>c.charCodeAt(0));// Number of pixels per unit when DPI is 72
// Number of pixels per unit when devicePixelRatio is 1
const PX_PER_METER=2835;const dpr=dpi/72;const pixelsPerMeter=Math.floor(PX_PER_METER*dpr);const data=[...bytes(pixelsPerMeter,4),...bytes(pixelsPerMeter,4),1];const pHYsChunk=[0,0,0,9,// 9 bytes
...type,...data,...bytes((0,_crc.crc)([...type,...data]),4)];const pos=ptr.pos-8;const newByteArray=new Uint8Array([...Array.from(byteArray.slice(0,pos)),...pHYsChunk,...Array.from(byteArray.slice(pos))]);ptr.pos+=pHYsChunk.length;return newByteArray}function writePngDpi(arrayBuffer,dpi=72){const ptr={pos:0};const byteArray=new Uint8Array(arrayBuffer);if(!(0,_share.isPng)(byteArray,ptr))return byteArray;(0,_share.readIHDR)(byteArray,ptr);let hasChunkPhys=false;let newByteArray;while(true){if(ptr.pos>=byteArray.length)break;let chunkLength=(0,_share.readBytes)(byteArray,ptr,4).map(v=>(0,_share.toBin)(v,8));chunkLength=parseInt(chunkLength.join(""),2);const chunkType=(0,_share.readBytes)(byteArray,ptr,4).join(" ");if(chunkType===(0,_share.getCharCodes)("IDAT")){if(!hasChunkPhys){newByteArray=insertChunkPhys(byteArray,ptr,dpi);hasChunkPhys=true}break}if(chunkType===(0,_share.getCharCodes)("IEND"))break;switch(chunkType){case(0,_share.getCharCodes)("pHYs"):hasChunkPhys=true;}ptr.pos+=chunkLength+4;// CRC
}return newByteArray||byteArray}
},{"./crc32":2,"./share":5}],7:[function(require,module,exports){
"use strict";

var _pngDpiReaderWriter = require("png-dpi-reader-writer");

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

      return (0, _pngDpiReaderWriter.parsePngFormat)(arrayBuffer);
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

module.exports = {
  DpiAwareImage
};

},{"png-dpi-reader-writer":3}]},{},[1]);
