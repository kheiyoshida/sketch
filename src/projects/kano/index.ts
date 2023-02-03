
import { V } from "./constants"
import { bloom } from "../../lib/flower"

const setup = () => {
  p.createCanvas(V.w, V.h)
  p.strokeWeight(1)
  p.point(V.c, V.c, )
  p.angleMode(p.DEGREES)
  p.noLoop()
  p.background(100, 30)
}


const draw = () => {
  bloom(V.c, V.c, {w: 10, len: 400, num: 23})
  // p.saveCanvas(Date.now().toLocaleString(), 'png')
}


export default <Sketch>{
  setup,
  draw
}
