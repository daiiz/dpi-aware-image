/* Physical Portable Network Graphics */
class PhysPng extends HTMLElement {
  constructor (...props) {
    super(...props)
    this.pngSignature = /^89 50 4E 47 0D 0A 1A 0A$/i
    this.byteArray = null
    this.ptr = 0
    this.initImg()
    this.render()
  }

  static get is () { return 'phys-png' }
  static get observedAttributes () { return ['src'] }

  get metadata () {
    return {
      rawWidth: this.width,
      rawHeight: this.height,
      maxSize: this.maxSize,
      dpi: this.dpi,
      src: this.getAttribute('src')
    }
  }

  connectedCallback () {
    this.initImg()
  }

  async attributeChangedCallback (attr, oldVal, newVal) {
    if (newVal === oldVal) return
    const srcUrl = newVal
    const followdpi = this.getAttribute('followdpi')
    if (!this.img || !srcUrl) return
    if (!!oldVal) this.initImg()
    if (followdpi === null) {
      this.img.setAttribute('src', srcUrl)
      return
    }
    const res = await fetch(srcUrl, {mode: 'cors'})
    const arrayBuffer = await res.arrayBuffer()
    if (arrayBuffer) {
      this.readChunks(arrayBuffer)
      this.setImgSize()
    }
    this.img.setAttribute('src', srcUrl)
  }

  initImg () {
    this.width = 0
    this.height = 0
    this.dpi = 72
    this.maxSize = {}

    if (!this.img) return
    this.img.removeAttribute('src')
    this.img.removeAttribute('style')
    this.img.style.display = 'block'
    const maxWidth = this.getAttribute('max-width') || null
    const maxHeight = this.getAttribute('max-height') || null
    if (maxWidth) {
      this.maxSize.maxWidth = maxWidth
    }else if (maxHeight) {
      this.maxSize.maxHeight = maxHeight
    }
  }

  setImgSize () {
    const key = (Object.keys(this.maxSize) || [])[0]
    const calcPhysPx = px => {
      return `${px / (this.dpi / 72)}px`
    }

    if (!!key) this.img.style[key] = `${this.maxSize[key]}`
    if (this.dpi === 72) return

    if (!key) {
      this.img.style.width = calcPhysPx(this.width)
      return
    }

    if (/width/i.test(key)) {
      this.img.style.width = calcPhysPx(this.width)
    } else {
      this.img.style.height = calcPhysPx(this.height)
    }
  }

  readBytes (bytes) {
    const res = this.byteArray.slice(this.ptr, this.ptr + bytes)
    this.ptr += bytes
    // Convert Uint8Array to Array
    return Array.from(res)
  }

  toHex (value, digits) {
    return value.toString(16).padStart(digits, '0')
  }

  toBin (value, digits) {
    return value.toString(2).padStart(digits, '0')
  }

  readIHDR () {
    // Length, ChunkType
    this.ptr += (4 + 4)

    // Width
    const width = this.readBytes(4).map(v => this.toBin(v, 8))
    this.width = parseInt(width.join(''), 2)

    // Height
    const height = this.readBytes(4).map(v => this.toBin(v, 8))
    this.height = parseInt(height.join(''), 2)

    // ビット深度, カラータイプ, 圧縮手法, フィルター手法, インターレース手法, CRC
    this.ptr += (1 + 1 + 1 + 1 + 1 + 4)
  }

  readpHYs () {
    const pixelsPerUnitXAxis = parseInt(
      this.readBytes(4).map(v => this.toBin(v, 8)).join(''), 2)
    const pixelsPerUnitYAxis = parseInt(
      this.readBytes(4).map(v => this.toBin(v, 8)).join(''), 2)
    const unitSpecifier = this.readBytes(1) // meters
    if (unitSpecifier > 0) {
      // dots per inch を計算する
      this.dpi = Math.floor(
        Math.max(pixelsPerUnitXAxis, pixelsPerUnitYAxis) / (unitSpecifier * 39.3))
    }
  }

  isPngFile () {
    const signature = this.readBytes(8).map(v => this.toHex(v, 2))
    return signature.join(' ').match(this.pngSignature)
  }

  readChunks (arrayBuffer) {
    this.ptr = 0
    this.byteArray = new Uint8Array(arrayBuffer)
    /* PNGファイルシグネチャ確認 */
    if (!this.isPngFile()) return
    /* IHDRチャンク */
    this.readIHDR()

    while (true) {
      if (this.ptr >= this.byteArray.length) break

      let chunkLength = this.readBytes(4).map(v => this.toBin(v, 8))
      chunkLength = parseInt(chunkLength.join(''), 2)

      const chunkType = new TextDecoder('utf-8')
        .decode(new Uint8Array(this.readBytes(4)))

      // Chunk Data
      if (chunkType === 'IDAT' || chunkType === 'IEND') break
      switch (chunkType) {
        case 'pHYs':
          this.readpHYs()
          break
        default:
          this.ptr += chunkLength
      }
      // CRC
      this.ptr += 4
    }
  }

  render () {
    const shadowRoot = this.attachShadow({mode: 'open'})
    this.img = document.createElement('img')
    shadowRoot.appendChild(this.img)
  }
}

customElements.define(PhysPng.is, PhysPng)
