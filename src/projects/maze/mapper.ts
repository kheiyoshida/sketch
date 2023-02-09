import { pushPop } from "../../lib/utils";
import { Direction, Matrix, Maze, NESW } from "./maze";

type GridItem = {
  visited: boolean
}

type Grid = Array<Array<GridItem|null>>

export class Mapper {
  private _grid: Grid
  private _builder: GridBuilder
  constructor(_maze: Maze) {
    this._builder = new GridBuilder()
    this._grid = this._builder.build(_maze.matrix, _maze.size)
  }

  track({from, dest}: {from: number[], dest: number[]}) {
    const [gi, gj] = [dest[0]*2, dest[1]*2]
    this._grid[gi][gj]!.visited = true
    if (from[0] !== dest[0]) {
      const i = from[0] + dest[0]
      this._grid[i][gj]!.visited = true
    } else {
      const j = from[1] + dest[1]
      this._grid[gi][j]!.visited = true
    }
  }
  
  open(current: number[], d: Direction) {
    this._draw(current[0]*2, current[1]*2, NESW.indexOf(d))
  }

  mapSizing = 0.88
  private _draw(ci: number, cj: number, d: number) {
    const gridL = this._grid.length
    const scr = Math.min(p.windowWidth, p.windowHeight)
    const max = scr * this.mapSizing
    const pos = [
      (p.windowWidth - max) / 2,
      (p.windowHeight - max) / 2
    ]
    p.square(pos[0], pos[1], max)

    // 
    const k = 1.44
    const nodeSize = (2 * max) / ((1+k)*gridL + (1-k))
    const edgeSize = k * nodeSize
    const sizeAvg = (nodeSize + edgeSize) / 2
    p.push()
    p.noStroke()
    
    for (let i = 0; i<gridL; i++) {
      for (let j = 0; j<gridL; j++) {
        const itm = this._grid[i][j]
        if (itm && itm.visited) {
          p.fill(100, 200)
          const [ie, je] = [i%2===0, j%2===0]
          if (ie && je) {
            p.rect(
              pos[0] + sizeAvg * j,
              pos[1] + sizeAvg * i,
              nodeSize,
              nodeSize
            )
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
          } else {
            if (!je) {
              p.rect(
                pos[0] + sizeAvg * (j-1) + nodeSize,
                pos[1] + sizeAvg * i,
                edgeSize,
                nodeSize
              )
            } else {
              p.rect(
                pos[0] + sizeAvg * j,
                pos[1] + sizeAvg * (i-1) + nodeSize,
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
}

class GridBuilder {

  build(matrix: Matrix, matrixSize: number):Grid {
    const gridSize = 2 * matrixSize - 1
    const grid:Grid = Array.from(Array(gridSize), () => new Array(gridSize).fill(null))

    for (let i = 0; i< matrixSize; i++) {
      for (let j = 0; j< matrixSize; j++) {
        const node = matrix[i][j]
        if (node) {
          grid[i*2][j*2] = {
            visited: false
          }
          if (node.edges.e) {
            grid[i*2][j*2+1] = {
              visited: false
            }
          }
          if (node.edges.s) {
            grid[i*2+1][j*2] = {
              visited: false
            }
          }
        }
      }
    }
    grid[0][0] = { visited: true }

    return grid
  }
}