/* pHYs Portable Network Graphics */
class PhysPng extends HTMLElement {
  constructor () {
    super()
    this.pngSignature = '89 50 4E 47 0D 0A 1A 0A'
    this.width = 0
    this.height = 0
    this.dpi = 72
    this.render()
  }

  static get is () { return 'phys-png' }
  static get observedAttributes () { return ['src'] }

  setImgSize () {
    if (this.dpi === 72) return
    this.img.style.width = `${this.width / (this.dpi / 72)}px`
    // this.img.style.height = `${this.height / (this.dpi / 72)}px`
  }

  padZero2digits (hex) {
    return (`00${hex.toUpperCase()}`).slice('-2')
  }

  padZero8digits (hex) {
    return (`00000000${hex.toUpperCase()}`).slice('-8')
  }

  // 32-byteの2進数を10進数に変換
  binToDec (a, b, c, d) {
    let dec = 0
    let power = 31
    const bin = [a, b, c, d].join('')
    for (let i = 0; i < bin.length; i++) {
      dec += +bin[i] * Math.pow(2, power)
      power -= 1
    }
    return dec
  }

  async attributeChangedCallback (attr, oldVal, newval) {
    const srcUrl = this.getAttribute('src')
    const followdpi = this.getAttribute('followdpi')
    if (!this.img || !srcUrl) return
    if (followdpi === null) {
      this.img.setAttribute('src', srcUrl)
      return
    }

    const xhr = new XMLHttpRequest()
    xhr.open('GET', srcUrl, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = () => {
      console.log(srcUrl)
      const arrayBuffer = xhr.response
      if (arrayBuffer) {
        this.readChunks(arrayBuffer)
        this.setImgSize()
      }
      this.img.setAttribute('src', srcUrl)
    }
    xhr.onerror = err => {
      console.error(err)
      this.img.setAttribute('src', srcUrl)
    }
    xhr.send(null)
  }

  readIHDR (byteArray, ptr) {
    // Length
    ptr += 4

    // Chunk Type (49 48 44 52)
    const chunkType = [
      byteArray[ptr], byteArray[ptr + 1], byteArray[ptr + 2], byteArray[ptr + 3]
    ].map(v => this.padZero2digits(v.toString(16)))
    console.log(chunkType)
    ptr += chunkType.length

    // Width
    const width = [
      byteArray[ptr], byteArray[ptr + 1], byteArray[ptr + 2], byteArray[ptr + 3]
    ].map(v => this.padZero8digits(v.toString(2)))
    this.width = parseInt(width.join(''), 2)
    console.log('width', this.width)
    ptr += width.length

    // Height
    const height = [
      byteArray[ptr], byteArray[ptr + 1], byteArray[ptr + 2], byteArray[ptr + 3]
    ].map(v => this.padZero8digits(v.toString(2)))
    this.height = parseInt(height.join(''), 2)
    console.log('height', this.height)
    ptr += height.length

    // ビット深度
    ptr += 1

    // カラータイプ
    const colorType = byteArray[ptr]
    ptr += 1

    // 圧縮手法, フィルター手法, インターレース手法, CRC
    ptr += (1 + 1 + 1 + 4)

    return ptr
  }

  readpHYs (byteArray, ptr) {
    const pixelsPerUnitXAxis = parseInt([
      byteArray[ptr], byteArray[ptr + 1], byteArray[ptr + 2], byteArray[ptr + 3]
    ].map(v => this.padZero8digits(v.toString(2))).join(''), 2)
    const pixelsPerUnitYAxis = parseInt([
      byteArray[ptr + 4], byteArray[ptr + 5], byteArray[ptr + 6], byteArray[ptr + 7]
    ].map(v => this.padZero8digits(v.toString(2))).join(''), 2)
    const unitSpecifier = byteArray[ptr + 8] // meters
    if (unitSpecifier > 0) {
      // dots per inch を計算する
      this.dpi = Math.floor(
        Math.max(pixelsPerUnitXAxis, pixelsPerUnitYAxis) / (unitSpecifier * 39.3))
    }
    console.log({pixelsPerUnitXAxis, pixelsPerUnitYAxis, unitSpecifier, dpi: this.dpi})
  }

  isPngFile (byteArray) {
    /* PNG ファイルシグネチャ (89 50 4E 47 0D 0A 1A 0A) */
    const signature = [
      byteArray[0], byteArray[1], byteArray[2], byteArray[3],
      byteArray[4], byteArray[5], byteArray[6], byteArray[7]
    ].map(v => this.padZero2digits(v.toString(16)))
    return signature.join(' ') === this.pngSignature
  }

  readChunks (arrayBuffer) {
    const byteArray = new Uint8Array(arrayBuffer)
    let ptr = 0

    /* PNGファイルシグネチャ確認 */
    if (!this.isPngFile(byteArray)) return
    ptr += 8

    /* IHDRチャンク */
    ptr = this.readIHDR(byteArray, ptr)

    while (true) {
      if (ptr >= byteArray.length) break

      let chunkLength = [
        byteArray[ptr], byteArray[ptr + 1], byteArray[ptr + 2], byteArray[ptr + 3]
      ].map(v => this.padZero8digits(v.toString(2)))
      chunkLength = this.binToDec(...chunkLength)
      ptr += 4
      const chunkType = new TextDecoder('utf-8').decode(new Uint8Array([
        byteArray[ptr], byteArray[ptr + 1], byteArray[ptr + 2], byteArray[ptr + 3]
      ]))
      ptr += 4
      // Chunk Data
      switch (chunkType) {
        case 'pHYs': {
          this.readpHYs(byteArray, ptr)
          break
        }
        case 'IDAT':
        case 'IEND': {
          break
        }
        default: {
          console.log('length:', chunkLength, 'type:', chunkType)
        }
      }
      ptr += chunkLength
      // CRC
      ptr += 4
    }
  }

  render () {
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = `<img class='img' />`
    this.img = shadowRoot.querySelector('img.img')
  }
}

customElements.define(PhysPng.is, PhysPng)
