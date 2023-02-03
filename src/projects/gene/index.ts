import p5 from "p5";
import { Gene, gene } from "./gene";
import { expand } from "../../lib/expand";
import { randomBetween } from "../../lib/utils";

let bgColor:p5.Color;

let geneStack:Gene[] = []

let center: p5.Vector
let root: p5.Vector

let canvasWidth: number
let canvasHeight: number

const setup = () => {
  canvasWidth = p.windowWidth 
  canvasHeight = p.windowHeight 
  p.createCanvas(canvasWidth, canvasHeight)

  // Color
  bgColor = p.color(5)
  p.background(bgColor)
  bgColor.setAlpha(80)
  p.fill(bgColor)
  p.stroke(255)

  // p.line(0,0, p.windowWidth, p.windowHeight)

  // Config
  p.frameRate(30)
  p.angleMode(p.DEGREES)
  // p.noLoop()

  center = p.createVector(canvasWidth/2, canvasHeight/2)
  root = p.createVector(0, 0)

  seed()


}

let rootAngle = 2

const randomSeed = (x1: number, y1: number, x2: number, y2: number) => {
  const x = randomBetween(x1, x2)
  const y = randomBetween(y1, y2)
  return p.createVector(x, y)
}

const seed = () => {
  // rootAngle = (rootAngle + 1) % 360
  const s = randomSeed(center.x-500, center.y-100, center.x+500, center.y+100)
  geneStack = geneStack.concat(
    expand<Gene>(
      s,
      2,
      (degree) => new Gene(s, 17, 40, 30, degree),
      rootAngle
    )
  )
}


const draw = () => {

  rootAngle+=1

  let nextStack:Gene[] = []
  for (const g of geneStack) {
    const r = g!.grow(rootAngle)
    nextStack = nextStack.concat(r)
  }
  geneStack = nextStack
  
  // Overray frame
  p.noStroke()
  p.rect(0, 0, canvasWidth, canvasHeight)
  p.stroke(255)

  if (geneStack.length === 0) {
    console.log('out of gene')
    seed()
  }

  if (geneStack.length > 100) {
    // p.noLoop()
    seed()
    // p.saveCanvas('gene', 'png')
  }

  if (geneStack.length > 10000) {
    p.noLoop()
  }
}


export default <Sketch>{
  setup,
  draw,
  windowResized: () => {}
}
