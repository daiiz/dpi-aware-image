import {readPngDpi} from 'png-phys-chunk-writer'

export class DpiAwareImage extends HTMLElement {
  constructor () {
    super()
    this.render()
  }

  static get is () {
    return 'dpi-aware-image'
  }

  static get observedAttributes () {
    return ['src']
  }

  async getImageSize (srcUrl) {
    try {
      const res = await fetch(srcUrl, {mode: 'cors'})
      const arrayBuffer = await res.arrayBuffer()
      return readPngDpi(arrayBuffer)
    } catch (err) {
      return {}
    }
  }

  async attributeChangedCallback (attr, oldVal, newVal) {
    if (oldVal === newVal) return
    switch (attr) {
      case 'src': {
        if (!newVal) return
        if (this.getAttribute('followdpi') === null) {
          return this.renderImg(newVal)
        }
        const {width, height, dpi} = await this.getImageSize(newVal)
        console.log(width, height, dpi)
        if (!width || !height || !dpi) {
          return this.renderImg(newVal)
        }
        this.renderSvg(newVal, {width, height, dpi})
        break
      }
    }
  }

  connectedCallback () {}

  renderImg (srcUrl) {
    const img = document.createElement('img')
    img.setAttribute('src', srcUrl)
    img.className = 'dpi-aware-image'
    this.root.appendChild(img)
  }

  renderSvg (srcUrl, {width, height, dpi}) {
    const dpr = dpi / 72
    width = width / dpr
    height = height / dpr
    const viewBox = `0 0 ${width} ${height}`
    const span = document.createElement('span')
    span.innerHTML = `
      <svg class='dpi-aware-image'
        width='${width}' height='${height}' viewBox='${viewBox}'>
        <foreignObject x='0' y='0' width='100%' height='100%'>
          <img width='100%' height='100%' src='${srcUrl}' />
        </foreignObject>
      </svg>
    `
    this.root.appendChild(span.firstElementChild)
  }

  render () {
    this.root = this.attachShadow({mode: 'open'})
    this.root.innerHTML = `
      <style>
        .dpi-aware-image {
          width: auto;
          height: auto;
          max-width: var(--max-width);
          max-height: var(--max-height);
          display: var(--display);
        }
        .dpi-aware-image img {
          display: block;
        }
      </style>
    `
    console.log(this.root.host, this)
  }
}
