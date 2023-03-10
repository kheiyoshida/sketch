import p5 from "p5";
import { colorCopy, pushPop, random, randomColor, vline } from "../../../lib/utils";
import { randomBetween } from "../../sk_01/utils";
import { Conf } from "../config";
import { getDeadEndItem, putDeadEndItem } from "../core/deadend";
import { sequence, DrawFn, moment } from "../../../lib/sequence";

export const emptyPicture = (
  pos: number[],
  size: number[]
) => {
  pushPop(() => {
    // p.noStroke()
    p.fill(Conf.colors.wallPicture)
    p.rect(
      pos[0], pos[1],
      size[0], size[1],
    )
  })
}

export const FlowerConf = {
  minSeedNum: 3,
  maxSeedNum: 7,
  minPetalLen: 0,
  maxPetalLen: 2,
  faceWall: false,
}

let unit: number

const setupPicture = (size:number[]) => {
  const g = p.createGraphics(size[0], size[1])
  g.background(Conf.colors.wallPicture)
  const c = colorCopy(Conf.colors.wallPicture)
  c.setAlpha(10)
  g.fill(c)
  g.stroke(255)
  unit = g.height / 30
  return g
}

export const callWallPicture = (
  pos: number[], size:number[], nodePos: number[]
) => {
  const item = getDeadEndItem(nodePos)
  if (item) {
    emptyPicture(pos, size)
  } 
  else {
    const g = setupPicture(size)
    const seeds = initSeeds(g)
    const c = randomColor()
    c.setAlpha(120)
    g.stroke(c)
    sequence(
      () => moment(
        seeds.map(s => () => grow(g, s)),
        () => {
          graphicOverDraw(g)
          changeStrokeColor(g)
        },
        renderGraphic(g,pos)
      ),
      Conf.interval / 2
    )
    putDeadEndItem(nodePos, true)
  }
}

const graphicOverDraw = (g: p5.Graphics) => {
  g.push()
  g.stroke(Conf.colors.mellowStroke)
  g.rect(0,0,g.width, g.height)
  g.pop()
}

const changeStrokeColor = (g: p5.Graphics) => {
  if(random(0.2)) {
    const c = randomColor()
    c.setAlpha(120)
    g.stroke(c)
  }
}

const renderGraphic = (g: p5.Graphics, pos: number[]) => () => {
  p.image(g, pos[0], pos[1])
}

const initSeeds = (g: p5.Graphics) => {
  const seedNum = randomBetween(
    FlowerConf.minSeedNum,
    FlowerConf.maxSeedNum,
  )
  
  const seeds:p5.Vector[] = []
  for (let i = 0; i<seedNum; i++) {
    const seed = g.createVector(
      g.random(g.width/5, g.width*4/5),
      g.height
    )
    seeds.push(seed)
  }
  return seeds
}

const grow = (g: p5.Graphics, root: p5.Vector, n=0) => {
  if (n> 15) {
    return [null]
  }
  if (n > 10 && random(0.8)) {
    return bloom(g, root)
  }
  if (n > 5 && random(0.2)) {
    return bloom(g, root)
  }

  const v = root.copy()
  v.add(
    p.random(-unit*2, unit*2),
    p.random(-unit*3, 0)
  )

  g.line(root.x, root.y, v.x, v.y)

  const next:(DrawFn|null)[] = []
  if (random(0.5)) {
    next.push(() => grow(g, v, n+1))
  }
  if (random(0.5)) {
    next.push(() => grow(g, v, n+1))
  }
  return next
}

const bloom = (g: p5.Graphics, root: p5.Vector) => {
  const directions = Math.floor(randomBetween(3, 11))
  const devided = 360 / directions
  const vari = randomBetween(-30, 30)
  const circle = Array(directions).fill(0).map((_, x) => x * devided + vari)
  const rootDegree = randomBetween(0, 360)
  const petals:DrawFn[] = []
  for(const degree of circle) {
    petals.push(
      () => petal(g, root, degree, rootDegree)
    )
  }
  return petals
}

const petal = (g: p5.Graphics, root: p5.Vector, degree: number, rootDegree: number, n=0) => {
  if (n>5) return [null]

  const length = randomBetween(
    unit * FlowerConf.minPetalLen,
    unit * FlowerConf.maxPetalLen
  )
  const d = p5.Vector.fromAngle(p.radians(degree+rootDegree), length)
  const v = root.copy().add(d)

  g.line(root.x, root.y, v.x, v.y)

  const vari = randomBetween(-50, 50)

  const next: DrawFn[] = []
  if (random(0.8)) {
    next.push(
      () => petal(g, v, degree, rootDegree-vari, n+1)
    )
    next.push(
      () => petal(g, v, degree, rootDegree+vari, n+1)
    )
  }
  return next
}
