import p5 from "p5"
import { randomBetween } from "./utils"

export function bloom(
  x: number, 
  y: number,
  petal: {
    w: number,
    len: number,
    num: number,
  }
) {
  const root = p.createVector(x, y)
  const devided = 360 / petal.num
  const circle = Array(petal.num).fill(0).map((_, x) => x * devided)
  for (const degree of circle) {
    p.fill(randomBetween(200, 230))    
    drawPetal(root, petal.len, petal.w, degree)
  }
}


export function drawPetal(
  root: p5.Vector,
  chord: number,
  angle: number,
  rotate: number = 0
) {
  const halfChord = chord / 2
  const halfA = angle / 2

  const arcX = halfChord
  const arcY = halfChord / p.tan(halfA)
  const radius = halfChord / p.sin(halfA)
  const diameter = 2 * radius

  p.push()
  
  p.translate(root.x, root.y)
  p.rotate(rotate)
  p.arc(
    arcX, arcY, 
    diameter, diameter, 
    270 - halfA, 270 + halfA, 
    p.CHORD
  )
  p.pop()
}
