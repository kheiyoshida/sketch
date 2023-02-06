import { randomBetween } from "../../lib/utils"

export type Matrix = Array<Array<Node|null>>
export type Direction = 'n'|'e'|'s'|'w'

export const NESW = ['n', 'e', 's', 'w'] as const
export const compass = (d: 'r'|'l'|'o', currentDirection: Direction) => {
  let i = NESW.indexOf(currentDirection)
  switch (d) {
    case 'r':
      return NESW[(i+1)%4]
    case 'l':
      return NESW[(i+3)%4]
    case 'o':
      return NESW[(i+2)%4]
  }
}

export class Maze {
  
  private _matrix: Matrix
  private _builder: MatrixBuilder
  current: number[] = [0,0]
  direction: Direction = 'n'

  get currentNode () {
    return this._matrix[this.current[0]][this.current[1]]!
  }

  constructor(public size:number) {
    this._builder = new MatrixBuilder(size)
    this._matrix = this._builder.build()
  }

  get matrix() {
    return this._matrix
  }

  turn(d: 'r'|'l') {
    this.direction = compass(d, this.direction)
  }

  getFrontLoc(dist=1) {
    switch(this.direction) {
      case 'n':
        return [this.current[0]-dist, this.current[1]]
      case 'e':
        return [this.current[0], this.current[1]+dist]
      case 's':
        return [this.current[0]+dist, this.current[1]]
      case 'w':
        return [this.current[0], this.current[1]-dist]
    }
  }

  getFrontNode({dist}:{dist:number}={dist:1}) {
    const l = this.getFrontLoc(dist)
    return this._matrix[l[0]][l[1]]
  }

  get canProceed() {
    return this.currentNode!.edges[this.direction]
  }
  
  navigate() {
    if (this.canProceed) {
      const from = this.current
      this.current = this.getFrontLoc()
      return {from, dest: this.current}
    }
  }
}

class MatrixBuilder {
  constructor(
    private size = 30,
    private fill = 0.68
  ) {}

  gen() {
    return Math.random() < this.fill
  }

  build() {
    const matrix:Matrix = Array.from(Array(this.size), () => new Array(this.size).fill(null))

    // place nodes
    matrix[0][0] = new Node()
    for (let i = 0; i< this.size; i++) {
      for (let j = 0; j< this.size; j++) {
        if (this.gen()) {
          matrix[i][j] = new Node()
        }
      }
    }

    // put edges
    const adjacent = (d: Direction, i: number,j: number) => {
      switch(d) {
        case 'n':
          return i>0 ? matrix[i-1][j] : null
        case 'e':
          return j<this.size-1 ? matrix[i][j+1] : null
        case 's':
          return i<this.size-1 ? matrix[i+1][j] : null
        case 'w':
          return j>0 ? matrix[i][j-1] : null
      }
    }
    const lookAround = (i:number, j: number) => {
      const around = {} as {[k in Direction]?: boolean}
      for (const direction of NESW) {
        if (adjacent(direction, i, j)) {
          Object.assign(around, {[direction]: true})
        }
      }
      return around
    }
    for (let i = 0; i< this.size; i++) {
      for (let j = 0; j< this.size; j++) {
        const node = matrix[i][j]
        if (node) {
          const around = lookAround(i,j)
          for (const d in around) {
            if (this.gen()) {
              node
                .set({[d]: true})
              adjacent(d as Direction, i, j)!
                .set({[compass('o', d as Direction)]: true})
            }
          }
        }
      }
    }
    return matrix
  } 
}

type Edges = {
  [k in Direction]: boolean
}

export class Node {
  private _edges: Edges

  constructor(edges?: {[k in Direction]?: boolean}) {
    this._edges = {
      n: edges?.n || false,
      e: edges?.e || false,
      s: edges?.s || false,
      w: edges?.w || false
    }
  }

  set(edges: {[k in Direction]?: boolean}) {
    this._edges = Object.assign({...this._edges}, edges) 
  }

  get edges() {
    return this._edges
  }
}
