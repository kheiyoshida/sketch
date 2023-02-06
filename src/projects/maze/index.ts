import p5 from "p5"
import { randomBetween } from "../sk_01/utils"
import { renderGUI, renderHelp } from "./gui"
import { Mapper } from "./mapper"
import { Maze } from "./maze"
import { Frame, intervalRender, render, transRender } from "./render"

export let bgColor: p5.Color
export let fill: p5.Color
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
  p.touchStarted = () => false
  p.touchEnded = () => false
  p.touchMoved = () => false
}

let mapOpen = false

const setupMaze = () => {
  const maze = new Maze(20)
  const mapper = new Mapper(maze)

  const frames = (magnify=1):Frame[] => [
    1, 0.7, 0.3, 0.2, 0.05, 0.03, 0.02
  ].map(scale => {
    const r = randomBetween(0.95,1.05)
    return createFrame(
      [
        ww*magnify*scale*r,
        wh*magnify*scale*r
      ]
    )})

  render(frames(1), maze)
  
  const go = () => {
    if (!maze.canProceed) return
    intervalRender(interval, [
      () => render(frames(1.05), maze),
      () => render(frames(1.1), maze),
      () => render(frames(1.2), maze),
      () => render(frames(1.3), maze),
      () => render(frames(1.4), maze),
      () => render(frames(1.5), maze),
      () => render(frames(1.6), maze),
      () => {
        const res = maze.navigate()
        if (res) {
          mapper.track(res)
        }
        render(frames(1), maze)
      }
    ])
  }

  const turn = (dir: 'r'|'l') => {
    const d = dir === 'r' ? -1 : 1
    intervalRender(interval, [
      () => transRender(frames(0.85),maze, d*ww*0.01),
      () => transRender(frames(0.9),maze, d*ww*0.03),
      () => transRender(frames(0.95),maze, d*ww*0.08),
      () => transRender(frames(),maze, d*ww*0.11),
      () => {
        maze.turn(dir)
        render(frames(), maze)
      }
    ])
  }

  const callMap = () => {
    if (!mapOpen) {
      mapper.open(maze.current, maze.direction)
      mapOpen = true
    } else {
      render(frames(1), maze)
      mapOpen = false
    }
  }

  if (ww < 1000) {
    const {map, up, right, left} = renderGUI(ww, wh)
    map.touchStarted(callMap)
    up.touchStarted(go)
    right.touchStarted(() => turn('r'))
    left.touchStarted(() => turn('l'))
  } else {
    const keyCodeMap = {
      [p.UP_ARROW]: go,
      [p.RIGHT_ARROW]: () => turn('r'),
      [p.LEFT_ARROW]: () => turn('l'),
      [p.DOWN_ARROW]: callMap,
      [p.ENTER]: callMap,
    } as const
    const keyMap = {
      'm': callMap,
      'w': go,
      'a': () => turn('l'),
      's': callMap,
      'd': () => turn('r'),
    } as const
    p.keyPressed = () => {
      if (p.keyCode in keyCodeMap) {
        keyCodeMap[p.keyCode]()
      }
      if (p.key in keyMap) {
        keyMap[p.key as keyof typeof keyMap]()
      }
    }
  }

  renderHelp(ww, wh)
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
