import p5 from "p5"
import { pushPop } from "../../lib/utils"
import { randomBetween } from "../sk_01/utils"

let bgColor: p5.Color
let fill: p5.Color

let unit: number

const setup = () => {
  p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
  bgColor = p.color(10, 0)
  p.stroke(255, 200)
  
  fill = bgColor
  fill.setAlpha(50)
  p.fill(fill)
  p.background(bgColor)
  unit = p.TWO_PI / 60
  
}

const draw = () => {

  p.rect(-p.width/2, -p.height/2, p.width, p.height)

  const rand = randomBetween(0, 10) * 4
  const ms = Math.floor(p.millis()/10)
  const sec = Math.floor(p.millis() / 1000)
  const min = sec * 60
  const hour = min * 60
  
  
  const run = () => {

    pushPop(() => {
      p.rotateY(ms*0.001)
      time(sec,min,hour, 300)
    })
  
    pushPop(() => {
      p.rotateX(ms*0.002)
      time(sec,min,hour, 400)
    })
  }
  run()

  pushPop(() => {
    p.rotateX(p.PI)
    p.rotateY(p.PI)
    run()
  })

  p.pointLight(255, 0, 0, -10, -100, 10)
}

const time = (
  sec: number,min: number,hour:number,
  size: number = 600
) => {
  pushPop(() => {
    p.rotateX(p.HALF_PI)
    p.rotateY(p.QUARTER_PI)
    
    
    // p.circle(0,0,size)
    p.torus(size, 10, 12, 6)
    clock(sec, size/2)
    clock(min, size/3)
    clock(hour,size/6)
  })
}

function clock(time: number, r: number, root?: p5.Vector, recursion = 3) {
  if (recursion == 0) return
  const [x,y] = root ? [root.x, root.y] : [0,0]
  const pt = p.createVector(
    p.cos(time * unit) * r,
    p.sin(time * unit) * r,
  )
  
  // gene(pt, time, r, recursion)
  p.line(
    x,y,
    pt.x, pt.y
  )
  clock(time*2, r, pt, recursion-1)
  clock(time*3, r, pt, recursion-1)
}


export default <Sketch> {
  setup,
  draw,
}