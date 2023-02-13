import { pushPop } from "../../../lib/utils"
import { Layer } from "./frame"
import { PathPattern, Terrain } from "."
import { img } from "./wall"

export const pointLine = (p1: number[], p2: number[]) => {
  p.line(p1[0], p1[1], p2[0], p2[1])
}

export const framePaint = () => {
  pushPop(() => {
    p.noStroke()
    p.rect(-p.windowWidth, -p.windowHeight, 3 * p.windowWidth, 3 * p.windowHeight)
  })
}

export const side = (
  l: Layer,
  direction: 'r'|'l',
  pattern: PathPattern
) => {
  if (pattern === 'corridor') {
    if (direction==='l') {
      pointLine(l.back.tl, [l.front.tl[0], l.back.tl[1]])
      pointLine(l.back.bl, [l.front.bl[0], l.back.bl[1]])
    } else {
      pointLine(l.back.tr, [l.front.tr[0], l.back.tr[1]])
      pointLine(l.back.br, [l.front.br[0], l.back.br[1]])
    }
  } else {
    if (direction==='l') {
      pointLine(l.front.tl, l.back.tl)
      pointLine(l.front.bl, l.back.bl)
    } else {
      pointLine(l.front.tr, l.back.tr)
      pointLine(l.front.br, l.back.br)
    }
  }
}

export const front = (
  l: Layer,
  pattern: PathPattern|'dark',
) => {
  if(pattern === 'corridor') {
    pointLine(l.front.tl, l.back.tl)
    pointLine(l.front.tr, l.back.tr)
    pointLine(l.front.bl, l.back.bl)
    pointLine(l.front.br, l.back.br)
  } else if (pattern === 'wall') {
    pointLine(l.front.tl, l.front.tr)
    pointLine(l.front.bl, l.front.br)
  } else {
    pointLine(l.front.tl, l.back.tl)
    pointLine(l.front.tr, l.back.tr)
    pointLine(l.front.bl, l.back.bl)
    pointLine(l.front.br, l.back.br)
    pushPop(() => {
      p.fill(10, 0.2)
      p.noStroke()
      p.rect(
        l.back.tl[0], l.back.tl[1],
        (l.back.tr[0]-l.back.tl[0]), 
        (l.back.bl[1]-l.back.tl[1])
      )
    })
  }
}

export const edge = (
  l: Layer,
  direction: 'r' | 'l',
) => {
  if (direction === 'r') {
    pointLine(l.back.tr, l.back.br)
  } else {
    pointLine(l.back.tl, l.back.bl)
  }
}

export const dark = (
  l: Layer,
  a: Terrain
) => {
  if (
    a.left === a.right && 
    a.right === a.front && 
    a.front === 'wall'
  ) {
    pushPop(() => {
      p.noStroke()
      p.fill(0,100)
      p.rect(
        l.front.tl[0], l.front.tl[1],
        (l.front.tr[0]-l.front.tl[0]), 
        (l.front.bl[1]-l.front.tl[1])
      )
      p.fill(20)
      p.rect(
        l.back.tl[0],
        l.back.tl[1],
        (l.back.tr[0]-l.back.tl[0]),
        (l.back.bl[1]-l.back.tl[1])
      )
      img(
        l.back.tl,
        [(l.back.tr[0]-l.back.tl[0]),
        (l.back.bl[1]-l.back.tl[1])],
      )
    })
  }
}