import { pushPop } from "../../../lib/utils"
import { Conf } from "../config"
import { Direction, NESW } from "../core/direction"
import { Grid } from "../core/mapper"

export const renderMap = (
  grid: Grid,
  current: number[], 
  direction: Direction,
  floor: number
) => {

  const [ci, cj] = [
    current[0]*2,
    current[1]*2,
  ]
  
  const d = NESW.indexOf(direction)

  // determine position
  const max = Math.min(Conf.ww, Conf.wh) * Conf.mapSizing
  const pos = [
    (Conf.ww- max) / 2,
    (Conf.wh - max) / 2
  ]

  // show floor on the left top of the map
  p.text(`B${floor}F`, pos[0], pos[1])
  
  // calc sizings
  const gridL = grid.length
  const k = 1.44
  const nodeSize = (2 * max) / ((1+k)*gridL + (1-k))
  const edgeSize = k * nodeSize
  const sizeAvg = (nodeSize + edgeSize) / 2

  const drawGrid = (posX: number, posY: number, w: number, h: number) => {
    p.rect(
      pos[0] + posX,
      pos[1] + posY,
      w, h
    )
  }

  p.rect(pos[0], pos[1], max)
  p.push()
  p.noStroke()
  
  for (let i = 0; i<gridL; i++) {
    for (let j = 0; j<gridL; j++) {
      const itm = grid[i][j]
      if (itm && itm) {
        p.fill(100, 200)
        const [ie, je] = [i%2===0, j%2===0]
        // node
        if (ie && je) {
          drawGrid(
            sizeAvg * j, 
            sizeAvg * i,
            nodeSize, 
            nodeSize
          )
          // current position
          if (ci === i && cj === j) {
            pushPop(() => {
              p.fill(255)
              p.translate(
                pos[0] + sizeAvg * j + nodeSize / 2,
                pos[1] + sizeAvg * i + nodeSize / 2,
              )
              p.rotate(d * p.HALF_PI)
              p.triangle(
                0, -nodeSize / 2,
                nodeSize / 2, nodeSize / 2,
                -nodeSize / 2, nodeSize / 2,
              )
            })
          }
        } 
        // edge
        else {
          if (!je) {
            drawGrid(
              sizeAvg * (j-1) + nodeSize,
              sizeAvg * i,
              edgeSize,
              nodeSize
            )
          } else {
            drawGrid(
              sizeAvg * j,
              sizeAvg * (i-1) + nodeSize,
              nodeSize,
              edgeSize,
            )
          }
        }
      }
    }
  }
  p.pop()
}