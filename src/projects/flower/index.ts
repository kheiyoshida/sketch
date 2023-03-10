import p5 from "p5"
import { DrawFn, moment, sequence } from "../../lib/sequence"
import { random, randomBetween, vline } from "../../lib/utils"

let bgColor: p5.Color
let unit: number

const setup = () => {
  p.createCanvas(p.windowWidth, p.windowHeight)
  bgColor = p.color(10)
  p.background(bgColor)
  p.fill(bgColor)
  unit = p.height / 30
  p.frameRate(1000/30)
  p.angleMode(p.DEGREES)
  p.stroke(200,80)
  p.noLoop()

  const seeds = initSeeds()
  sequence(
    () => moment(
      seeds.map(s => () => grow(s))
    ),
    1000/30
  )
}

const initSeeds = () => {
  const seedNum = randomBetween(3,7)
  
  const seeds:p5.Vector[] = []
  for (let i = 0; i<seedNum; i++) {
    const seed = p.createVector(
      p.random(p.width/5, p.width*4/5),
      p.height
    )
    seeds.push(seed)
  }
  return seeds
}

const grow = (root: p5.Vector, n=0) => {
  if (n> 15) {
    return [null]
  }
  if (n > 15 && random(0.8)) {
    return bloom(root)
  }
  if (n > 10 && random(0.2)) {
    return bloom(root)
  }

  const v = root.copy()
  v.add(
    p.random(-unit*2, unit*2),
    p.random(-unit*1.5, 0)
  )
  vline(root, v)

  const next:(DrawFn|null)[] = []
  if (random(0.5)) {
    next.push(() => grow(v, n+1))
  }
  if (random(0.8)) {
    next.push(() => grow(v, n+1))
  }
  return next
}

const bloom = (root: p5.Vector) => {
  const directions = Math.floor(randomBetween(3, 11))
  const devided = 360 / directions
  const vari = randomBetween(-30, 30)
  const circle = Array(directions).fill(0).map((_, x) => x * devided + vari)
  const rootDegree = randomBetween(0, 360)
  const petals:DrawFn[] = []
  for(const degree of circle) {
    petals.push(
      () => petal(root, degree, rootDegree)
    )
  }
  return petals
}

const petal = (root: p5.Vector, degree: number, rootDegree: number, n=0) => {
  if (n>5) return [null]

  const length = randomBetween(0, unit/3)
  const d = p5.Vector.fromAngle(p.radians(degree+rootDegree), length)
  const v = root.copy().add(d)

  vline(root, v)

  const vari = randomBetween(-50, 50)

  const next: DrawFn[] = []
  if (random(0.8)) {
    next.push(
      () => petal(v, degree, rootDegree-vari, n+1)
    )
    next.push(
      () => petal(v, degree, rootDegree+vari, n+1)
    )
  }
  return next
}

export default <Sketch>{
  setup,
  draw: () => {},
  windowResized: () => {}
}
