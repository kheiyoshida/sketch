import p5 from "p5"
import { randomBetween } from "./utils"

const SCALE = 2
const s = (size: number) => SCALE * size

const V = {
  w: s(1000),
  h: s(1000),
  c: s(500),
} as const

const C = {
  white: 255,
  gray: 50,
  black: 0,
}

export const setup = (p:p5) => {
  const fillColor = p.color(255,255,255, 80)
  const bgColor = p.color(100,255,200, 50)
  p.createCanvas(V.w, V.h)
  p.background(C.gray)
  p.strokeWeight(1)
  
  // circle
  p.fill(fillColor)
  const bigR = s(800)
  p.ellipse(V.c,V.c, bigR)

  const baumkuchen = (
    outerR: number,
    innerR: number,
    start: number,
    end: number,
  ) => {
    // arc
    p.fill(randomBetween(C.black, C.gray))
    p.arc(V.c,V.c, innerR, outerR, start, end)
  
    // erase
    p.fill(fillColor)
    p.arc(V.c,V.c, outerR, innerR, start, end)
  }

  const circleLoop = (callback: (a1:number,a2:number) => void) => {
    let angle = 0
    while (angle < p.TWO_PI) {
      angle += randomBetween(0, p.QUARTER_PI)
      const a1 = angle
      angle += randomBetween(0, p.HALF_PI)
      const a2 = angle
      callback(a1, a2)
    }
  }

  let baseR = bigR + randomBetween(0, s(200))
  while (baseR > 0) {
    baseR -= randomBetween(s(0), s(10))
    const outerR = baseR
    baseR -= randomBetween(s(5), s(15))
    const innerR = baseR

    circleLoop(
      (a1, a2) => baumkuchen(outerR, innerR, a1, a2)
    )
  }

  const timestamp = (new Date()).toISOString()
  p.saveCanvas(timestamp, 'png')
}


export const draw = (p:p5) => {
  
}