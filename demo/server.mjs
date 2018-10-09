import polka from 'polka'
import serveStatic from 'serve-static'
import path from 'path'

const PORT = 9001
const {PWD} = process.env

const app = polka()
app
  .use(serveStatic(path.resolve(PWD)))
  .use(serveStatic(path.resolve(PWD, 'demo')))
  .use(serveStatic(path.resolve(PWD, 'src')))
  .listen(PORT, _ => {
    console.log(`> Running on http://localhost:${PORT}`)
  })

