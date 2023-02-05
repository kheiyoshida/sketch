import p5 from "p5"
import { Maze } from "./maze"
import { Frame, render } from "./render"

let bgColor: p5.Color
let fill: p5.Color
let unit: number
let fps = 30
let ww: number, wh : number

const setup = () => {
  [ww, wh] = [p.windowWidth, p.windowHeight]
  p.createCanvas(ww, wh)
  // bgColor = p.color(10, 0)
  bgColor = p.color(0,0,0)
  p.stroke(255, 200)
  fill = bgColor
  // fill.setAlpha(50)
  p.fill(fill)
  
  p.background(bgColor)
  unit = p.TWO_PI / 60
  p.frameRate(fps)
  setupMaze()
  p.noLoop()
}

let magnify = 1;

const setupMaze = () => {
  const maze = new Maze()

  const frames:Frame[] = [
    createFrame(
      [ww*magnify, wh*magnify]
    ),
    createFrame(
      [ww*magnify*0.8, wh*magnify*0.8]
    ),
    createFrame(
      [ww*magnify*0.5, wh*magnify*0.5]
    ),
    createFrame(
      [ww*magnify*0.25, wh*magnify*0.25]
    ),
    createFrame(
      [ww*magnify*0.1, wh*magnify*0.1]
    ),
    createFrame(
      [ww*magnify*0.05, wh*magnify*0.05]
    ),
    createFrame(
      [ww*magnify*0.04, wh*magnify*0.04]
    ),
  ]
  
  render(frames, maze)

  p.keyPressed = function () {
    if ([p.UP_ARROW, p.RIGHT_ARROW, p.LEFT_ARROW].includes(p.keyCode)) {
      switch (p.keyCode) {
        case p.UP_ARROW:
          maze.navigate()
          render(frames, maze)
          break;
        case p.RIGHT_ARROW:
          maze.turn('r')
          render(frames, maze)
          break;
        case p.LEFT_ARROW:
          maze.turn('l')
          render(frames, maze)
          break;
        case p.DOWN_ARROW:
          maze.turn('l')
          render(frames, maze)
          maze.turn('l')
          render(frames, maze)
          break;
      }
    } 
  }
}

export const createFrame = (rectWH: number[]):Frame => {
  const h1 = (ww - rectWH[0]) / 2
  const h2 = h1 + rectWH[0]
  const v1 = (wh - rectWH[1]) / 2
  const v2 = v1 + rectWH[1]
  return {
    tl: [h1, v1],
    tr: [h2, v1],
    bl: [h1, v2],
    br: [h2, v2]
  }
}

export default <Sketch> {
  setup,
  draw: ()=>{},
}
