import {parsePngFormat} from 'png-dpi-reader-writer'

class DpiAwareImage extends HTMLElement {
  constructor () {
    super()
    this.attrs = Object.create(null)
    for (let i = 0; i < this.attributes.length; i++) {
      const attrName = this.attributes[i].name
      if (!['id', 'class', 'src'].includes(attrName)) {
        this.attrs[attrName] = this.attributes[i].value
      }
    }
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
      if (!res.ok) throw new Error(res.statusText)
      const arrayBuffer = await res.arrayBuffer()
      // Read PNG pHYs chunk and detect DPI
      // https://tools.ietf.org/html/rfc2083#page-22
      return parsePngFormat(arrayBuffer)
    } catch (err) {
      return {}
    }
  }

  async attributeChangedCallback (attr, oldVal, newVal) {
    if (oldVal === newVal) return
    switch (attr) {
      case 'src': {
        if (!newVal) return
        this.removeOlder()
        const {width, height, dpi} = await this.getImageSize(newVal)
        if (!width || !height || !dpi) {
          return this.renderImg(newVal)
        }
        this.renderSvg(newVal, {width, height, dpi})
        break
      }
    }
  }

  renderImg (srcUrl) {
    const img = document.createElement('img')
    img.setAttribute('src', srcUrl)
    img.id = 'dpi-aware-image'
    for (const attr in this.attrs) {
      img.setAttribute(attr, this.attrs[attr])
    }
    this.root.appendChild(img)
  }

  renderSvg (srcUrl, {width, height, dpi}) {
    const dpr = dpi / 72
    width = width / dpr
    height = height / dpr
    const viewBox = `0 0 ${width} ${height}`
    const span = document.createElement('span')
    const attrs = Object.keys(this.attrs)
      .map(name => `${name}="${this.attrs[name]}"`).join(' ')
    span.innerHTML = `
      <svg id='dpi-aware-image'
        width='${width}' height='${height}' viewBox='${viewBox}'>
        <foreignObject x='0' y='0' width='100%' height='100%'>
          <img width='100%' height='100%' src='${srcUrl}' ${attrs} />
        </foreignObject>
      </svg>
    `
    this.root.appendChild(span.firstElementChild)
  }

  removeOlder () {
    const older = this.root.querySelector('#dpi-aware-image')
    if (older) older.remove()
  }

  render () {
    this.root = this.attachShadow({mode: 'open'})
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
    `
  }
}

module.exports = { DpiAwareImage }
