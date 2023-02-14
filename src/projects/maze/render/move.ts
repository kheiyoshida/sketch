import { Conf } from "../config"
import { Maze } from "../core/maze"
import { intervalRender, render, transRender } from "."
import { frames } from "./frame"
import { renderCorridorToNextFloor } from "./scene"
import { framePaint } from "./draw"
import { colorCopy, pushPop } from "../../../lib/utils"

const goMoveMagnifySeq = [1.05, 1.1, 1.24, 1.33, 1.5, 1.65, 1.8, 1.9]
export const goMove = (
  maze: Maze, 
  after: VoidFunction
) => {
  intervalRender(
    Conf.interval,
    goMoveMagnifySeq.map((m) => () => render(frames(m), maze)),
    after
  )
}

const second = Conf.magnifyRates[1]
const magnifyDownStairs = Array(12).fill(null).map((_, i) => second / i).reverse()
export const goDownStairsMove = (
  maze: Maze, 
  after: VoidFunction
) => {
  const wh = Conf.wh
  intervalRender(
    Conf.interval*3,
    magnifyDownStairs.map( (hd, i) => {
      const fixed = wh * 0.1
      const r:number = 1 + i * ((1/second-1)/magnifyDownStairs.length)
      // const r = i % 2 === 0 ? _r * 1.02 : _r * 0.98
      return () => {
        pushPop(() => {
          // fade color
          const alpha = p.alpha(Conf.colors.stroke) - i * 25
          const c = colorCopy(Conf.colors.stroke)
          c.setAlpha(alpha)
          p.stroke(c)
          // render frames 
          transRender(
            frames(r * 1.05),
            maze, 
            [
              0,
              i % 2 === 0 
                ? -wh*hd*r*1.20 - fixed*2
                : -wh*hd*r*1.20 - fixed*1.8
            ]
          )
        })
      }
    }).concat([framePaint]),
    () => intervalRender(
      Conf.interval*2,
      goMoveMagnifySeq.slice(6).map((m) => () => {
        framePaint()
        renderCorridorToNextFloor(frames(m))
      }),
      after
    )
  )
}

export const turnMove = (
  maze: Maze, 
  direction: 'r'|'l',
  after: VoidFunction
) => {
  const d = direction === 'r' ? -1 : 1
  const ww = Conf.ww
  intervalRender(
    Conf.interval, 
    [
      () => transRender(frames(0.85),maze, [d*ww*0.01, 0]),
      () => transRender(frames(0.9),maze, [d*ww*0.03, 0]),
      () => transRender(frames(0.95),maze, [d*ww*0.08, 0]),
      () => transRender(frames(1),maze, [d*ww*0.11, 0]),
    ], 
    after
  ) 
}