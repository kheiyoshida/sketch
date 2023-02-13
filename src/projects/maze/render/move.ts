import { Conf } from "../config"
import { Maze } from "../core/maze"
import { intervalRender, render, transRender } from "."
import { frames } from "./frame"

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

export const goDownStairsMove = (
  maze: Maze, 
  after: VoidFunction
) => {
  const wh = Conf.wh
  intervalRender(
    Conf.interval*3,
    [
      () => transRender(frames(1.05),maze, [0, -wh*0.1], 1),
      () => transRender(frames(1.1),maze, [0, -wh*0.3], 2),
      () => transRender(frames(1.2),maze, [0, -wh*0.58], 3),
      () => transRender(frames(1.4),maze, [0, -wh*0.74], 4),
      () => transRender(frames(1.6),maze, [0, -wh*0.88], 5),
      () => transRender(frames(1.8),maze, [0, -wh*0.92], 6), 
    ], 
    after
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