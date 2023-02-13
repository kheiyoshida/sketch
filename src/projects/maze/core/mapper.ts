import { Matrix, Maze } from "./maze";

type Cell = {
  visited: boolean
}

export type Grid = Array<Array<Cell|null>>

export class Mapper {
  private _grid!: Grid
  get grid () {
    return this._grid
  }

  constructor(maze: Maze) {
    this.reset(maze)
  }

  public reset(maze: Maze) {
    this._grid = buildGrid(maze.matrix, maze.size)
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
}

const buildGrid = (matrix: Matrix, matrixSize: number):Grid => {
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
  return grid
}
