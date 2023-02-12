import p5 from "p5"
import { pushPop, randomBetween } from "../../lib/utils"
import { renderGUI, renderHelp } from "./gui"
import { Mapper } from "./mapper"
import { Maze } from "./maze"
import { Frame, intervalRender, render, transRender } from "./render"
import { music } from "./sound"
import { start as toneStart } from 'tone'

export let bgColor: p5.Color
export let fill: p5.Color
let ww: number, wh : number
const fps = 30
const interval = 1000 / fps

let mad = 1

let started = false

const setup = () => {
  [ww, wh] = [p.windowWidth, p.windowHeight]
  const c = p.createCanvas(ww, wh)
  bgColor = p.color(0,250)
  p.stroke(200, 200)
  fill = bgColor

  p.fill(fill)
  p.background(bgColor)
  p.noLoop()
  p.touchStarted = () => false
  p.touchEnded = () => false
  p.touchMoved = () => false

  p.textSize(32)
  p.text('TAP/CLICK TO PLAY', 0, 32)

  const fadein = music()
  const start = () => {
    if (!started) {
      started = true
      setupMaze()
      toneStart()
      fadein()
    }
  }
  
  c.mousePressed(start)
  c.touchStarted(start)
}

let mapOpen = false

const setupMaze = () => {
  const maze = new Maze()
  const mapper = new Mapper(maze)

  const magnifyRates = [
    1, 0.7, 0.3, 0.2, 0.09, 0.04, 0.02
  ]

  const frames = (magnify=1):Frame[] => 
    magnifyRates.map(scale => {
      // const blur = 0.05 * (1 + mad/1000)
      // const r = randomBetween(1-blur,1+blur)
      return createFrame(
        [
          ww*magnify*scale,
          wh*magnify*scale
        ]
      )
    }
  )

  render(frames(1), maze)
  
  const go = () => {
    if (!maze.canProceed) return
    intervalRender(interval, [
      () => render(frames(1.05), maze),
      () => render(frames(1.1), maze),
      () => render(frames(1.24), maze),
      () => render(frames(1.33), maze),
      () => render(frames(1.5), maze),
      () => render(frames(1.65), maze),
      () => render(frames(1.8), maze),
      () => render(frames(1.9), maze),
      () => {
        const res = maze.navigate()
        if (res) {
          mapper.track(res)
        }
        render(frames(1), maze)
        if (maze.reachedStair) {
          goDownStairs()
        }
      }
    ])
  }

  const goDownStairs = () => {
    // animate
    intervalRender(interval*3,
      [
      () => transRender(frames(1.05),maze, [0, -wh*0.1], 1),
      () => transRender(frames(1.1),maze, [0, -wh*0.3], 2),
      () => transRender(frames(1.2),maze, [0, -wh*0.58], 3),
      () => transRender(frames(1.4),maze, [0, -wh*0.74], 4),
      () => transRender(frames(1.6),maze, [0, -wh*0.88], 5),
      () => transRender(frames(1.8),maze, [0, -wh*0.92], 6),
      // () => transRender(frames(1.9),maze, [0, -wh*0.9], 7),
      () => {
        // generate next floor
        maze.goDownStairs()
        render(frames(1), maze)
        mapper.reset(maze)
      }
    ]
    )
  }

  const turn = (dir: 'r'|'l') => {
    const d = dir === 'r' ? -1 : 1
    intervalRender(interval, [
      () => transRender(frames(0.85),maze, [d*ww*0.01, 0]),
      () => transRender(frames(0.9),maze, [d*ww*0.03, 0]),
      () => transRender(frames(0.95),maze, [d*ww*0.08, 0]),
      () => transRender(frames(),maze, [d*ww*0.11, 0]),
      () => {
        maze.turn(dir)
        render(frames(), maze)
      }
    ])
    mad += 1
  }

  const callMap = () => {
    if (!mapOpen) {
      mapper.open(maze.current, maze.direction)
      mapOpen = true
    } else {
      render(frames(1), maze)
      mapOpen = false
    }
    mad += 10
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
