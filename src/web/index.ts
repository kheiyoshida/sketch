import { PubWork, published } from "./pub"

export const home = () => {
  head()
  published.forEach(w => genPage(w))
}

const head = () => {
  const h1 = document.createElement('h1')
  h1.innerText = 'sketch.kheiyoshida.com'
  document.body.appendChild(h1)
}

const genPage = (w:PubWork) => {
  const d = document.createElement('div')
  const a = document.createElement('a')
  a.href = w.path
  a.innerText = w.path
  d.appendChild(a)
  document.body.appendChild(d)
}
