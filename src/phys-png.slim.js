/* Physical Portable Network Graphics */
class PhysPng extends HTMLElement {
  constructor () {
    super()
    this.pngSignature = '89 50 4E 47 0D 0A 1A 0A'
    this.width = 0
    this.height = 0
    this.dpi = 72
    this.byteArray = null
    this.ptr = 0
    this.render()
  }

  static get is () { return 'phys-png' }
  static get observedAttributes () { return ['src'] }

  setImgSize () {
    if (this.dpi === 72) return
    this.img.style.width = `${this.width / (this.dpi / 72)}px`
  }

  padZero (str, digits) {
    const zeros = '0'.repeat(digits)
    return (`${zeros}${str.toUpperCase()}`).slice(`-${digits}`)
  }

  readBytes (bytes, ptr) {
    const headPtr = ptr || this.ptr
    const res = []
    for (let i = 0; i < bytes; i++) {
      res.push(this.byteArray[headPtr + i])
    }
    if (!ptr) this.ptr += bytes
    return res
  }

  toHex (value, digits) {
    return this.padZero(value.toString(16), digits)
  }

  toBin (value, digits) {
    return this.padZero(value.toString(2), digits)
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

  readIHDR () {
    // Length
    this.ptr += 4

    // Chunk Type (49 48 44 52)
    const chunkType = this.readBytes(4).map(v => this.toHex(v, 2))
    // ptr += chunkType.length

    // Width
    const width = this.readBytes(4).map(v => this.toBin(v, 8))
    this.width = parseInt(width.join(''), 2)
    // ptr += width.length

    // Height
    const height = this.readBytes(4).map(v => this.toBin(v, 8))
    this.height = parseInt(height.join(''), 2)
    // ptr += height.length

    // ビット深度, カラータイプ, 圧縮手法, フィルター手法, インターレース手法, CRC
    this.ptr += (1 + 1 + 1 + 1 + 1 + 4)
    // return ptr
  }

  readpHYs () {
    const ptr = this.ptr
    const pixelsPerUnitXAxis = parseInt(
      this.readBytes(4, ptr).map(v => this.toBin(v, 8)).join(''), 2)
    const pixelsPerUnitYAxis = parseInt(
      this.readBytes(4, ptr).map(v => this.toBin(v, 8)).join(''), 2)

    const unitSpecifier = this.readBytes(1, ptr + 8) // meters
    if (unitSpecifier > 0) {
      // dots per inch を計算する
      this.dpi = Math.floor(
        Math.max(pixelsPerUnitXAxis, pixelsPerUnitYAxis) / (unitSpecifier * 39.3))
    }
    console.log({
      pixelsPerUnitXAxis, pixelsPerUnitYAxis, unitSpecifier,
      src: this.getAttribute('src'),
      dpi: this.dpi
    })
  }

  isPngFile () {
    /* PNG ファイルシグネチャ (89 50 4E 47 0D 0A 1A 0A) */
    const signature = this.readBytes(8).map(v => this.toHex(v, 2))
    return signature.join(' ') === this.pngSignature
  }

  readChunks (arrayBuffer) {
    this.byteArray = new Uint8Array(arrayBuffer)
    // let ptr = 0

    /* PNGファイルシグネチャ確認 */
    if (!this.isPngFile()) return
    // ptr += 8

    /* IHDRチャンク */
    // ptr = this.readIHDR()
    this.readIHDR()

    while (true) {
      if (this.ptr >= this.byteArray.length) break

      let chunkLength = this.readBytes(4).map(v => this.toBin(v, 8))
      chunkLength = parseInt(chunkLength.join(''), 2)
      // ptr += 4
      const chunkType = new TextDecoder('utf-8')
        .decode(new Uint8Array(this.readBytes(4)))
      // ptr += 4

      // Chunk Data
      if (chunkType === 'IDAT' || chunkType === 'IEND') break
      switch (chunkType) {
        case 'pHYs':
          this.readpHYs()
      }
      this.ptr += chunkLength
      // CRC
      this.ptr += 4
    }
  }

  render () {
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = `<img class='img' />`
    this.img = shadowRoot.querySelector('img.img')
  }
}

customElements.define(PhysPng.is, PhysPng)
