import { PubWork, published } from "./pub"

export const home = () => {
  head()
  pages()  
}

const head = () => {
  const h1 = document.createElement('h1')
  h1.innerText = 'sketch.kheiyoshida.com'
  document.body.appendChild(h1)
}

const pages = () => {
  const ul = document.createElement('ul')
  published.forEach(w => ul.appendChild(genPage(w)))
  document.body.appendChild(ul)
}

const genPage = (w:PubWork) => {
  const li = document.createElement('li')
  const a = document.createElement('a')
  a.href = w.path
  a.innerText = w.path
  li.appendChild(a)
  return li
}
