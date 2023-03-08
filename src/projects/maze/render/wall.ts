import p5 from "p5";
import { colorCopy, pushPop, randomColor } from "../../../lib/utils";
import { randomBetween } from "../../sk_01/utils";
import { Conf } from "../config";
import { getDeadEndItem, putDeadEndItem } from "../core/deadend";

export function callWallPicture(
  pos: number[], size:number[], nodePos: number[]
) {
  const item = getDeadEndItem(nodePos)
  if (item) {
    p.image(item, pos[0], pos[1])
  } 
  else {
    const g = setupPicture(size)
    drawPicture(
      nodePos,
      pos, g,
      () => bloom(
        g,
        [randomBetween(0, g.width), 0]
      )
    )
  }
}

function setupPicture(size:number[]) {
  const g = p.createGraphics(size[0], size[1])
  g.background(Conf.colors.wallPicture)
  const c = colorCopy(Conf.colors.wallPicture)
  c.setAlpha(20)
  g.fill(c)
  g.stroke(255)
  return g
}

type Fn = () => Fn

function drawPicture(
  nodePos: number[],
  pos: number[], 
  g: p5.Graphics,
  fn: Fn,
  n = 0
) {
  if (n>10) {
    putDeadEndItem(nodePos, g)
    return
  }

  const next = fn()
  p.image(g, pos[0], pos[1])

  setTimeout(() => {
    drawPicture(
      nodePos,
      pos,
      g,
      next,
      n+1
    )
  }, 30)
}

function bloom(g: p5.Graphics, pos: number[]) {
  
  const dest = [
    randomBetween(0, g.width), randomBetween(0, g.height)
  ]

  g.push()

  g.noStroke()
  g.rect(0, 0, g.width, g.height)

  g.stroke(255)
  g.line(pos[0], pos[1], dest[0], dest[1])

  g.pop()

  return () => bloom(g, dest)
}
