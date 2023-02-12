import { pushPop } from "../../lib/utils";
import { Direction, Matrix, Maze, NESW } from "./maze";

type GridItem = {
  visited: boolean
}

type Grid = Array<Array<GridItem|null>>

export class Mapper {
  private grid: Grid
  private builder: GridBuilder

  constructor(maze: Maze) {
    this.builder = new GridBuilder()
    this.grid = this.builder.build(maze.matrix, maze.size)
  }

  public reset(maze: Maze) {
    this.grid = this.builder.build(maze.matrix, maze.size)
  }

  public track({from, dest}: {from: number[], dest: number[]}) {
    const [gi, gj] = [dest[0]*2, dest[1]*2]
    this.grid[gi][gj]!.visited = true
    if (from[0] !== dest[0]) {
      const i = from[0] + dest[0]
      this.grid[i][gj]!.visited = true
    } else {
      const j = from[1] + dest[1]
      this.grid[gi][j]!.visited = true
    }
  }
  
  public open(current: number[], d: Direction) {
    this.draw(current[0]*2, current[1]*2, NESW.indexOf(d))
  }

  // TODO: refactor later when it needs detailed config
  // config
  mapSizing = 0.88
  private draw(ci: number, cj: number, d: number) {
    // determine position
    const max = Math.min(p.width, p.height) * this.mapSizing
    const pos = [
      (p.width- max) / 2,
      (p.height - max) / 2
    ]
    
    // calc sizings
    const gridL = this.grid.length
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
        const itm = this.grid[i][j]
        if (itm && itm.visited) {
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
    grid[0][0] = {visited: true}
    return grid
  }
}