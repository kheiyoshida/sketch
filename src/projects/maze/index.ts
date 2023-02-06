import p5 from "p5"
import { pushPop } from "../../lib/utils"
import { Maze } from "./maze"
import { Frame, intervalRender, render, transRender } from "./render"

let bgColor: p5.Color
let fill: p5.Color
let ww: number, wh : number
const fps = 30
const interval = 1000 / fps

const setup = () => {
  [ww, wh] = [p.windowWidth, p.windowHeight]
  p.createCanvas(ww, wh)
  bgColor = p.color(0,0,0)
  p.stroke(255, 200)
  fill = bgColor
  p.fill(fill)
  p.background(bgColor)
  setupMaze()
  p.noLoop()
}

const setupMaze = () => {
  const maze = new Maze()

  const frames = (magnify=1):Frame[] => [
    1, 0.8, 0.3, 0.2, 0.05, 0.03, 0.02
  ].map(scale => createFrame(
      [ww*magnify*scale, wh*magnify*scale]
    ))

  render(frames(1), maze)

  p.keyPressed = function () {
    switch (p.keyCode) {
      case p.UP_ARROW:
        intervalRender(interval, [
          () => render(frames(1.05), maze),
          () => render(frames(1.1), maze),
          () => render(frames(1.2), maze),
          () => render(frames(1.3), maze),
          () => render(frames(1.4), maze),
          () => render(frames(1.5), maze),
          () => {
            maze.navigate()
            render(frames(1), maze)
          }
        ])
        break;
      case p.RIGHT_ARROW:
      case p.LEFT_ARROW:
        const d = p.keyCode === p.RIGHT_ARROW ? -1 : 1
        intervalRender(interval, [
          () => transRender(frames(0.85),maze, d*ww*0.01),
          () => transRender(frames(0.9),maze, d*ww*0.03),
          () => transRender(frames(0.95),maze, d*ww*0.08),
          () => transRender(frames(),maze, d*ww*0.11),
          () => {
            maze.turn(d === -1 ? 'r' : 'l')
            render(frames(), maze)
          }
        ])
        break;
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
