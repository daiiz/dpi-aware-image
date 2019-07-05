# dpi-aware-image

An _img_ element which determine own physical width and height by considering source png image's DPI.

```
$ npm install
$ npm run build
$ npm run demo
```

Open http://localhost:9001/demo/index.html

## Usage
```html
<style>
  /* Optional */
  dpi-aware-image {
    display: inline-block;
    --max-width: 100%;
    --max-height: 300px;
  }
</style>

<dpi-aware-image src='/demo/dist/icon.png'></dpi-aware-image>
```

## Demos
- https://daiiz.github.io/dpi-aware-image/demo/index.html
- https://daiiz.github.io/dpi-aware-image/demo/vs.html
- https://daiiz.github.io/dpi-aware-image/demo/demo.html
- https://daiiz.github.io/dpi-aware-image/demo/gyazo.html
