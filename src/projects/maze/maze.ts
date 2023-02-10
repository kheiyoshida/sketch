import { random } from "../../lib/utils"

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
  get matrix() {
    return this._matrix
  }

  public current: number[] = [0,0]
  public direction: Direction = 'n'

  get currentNode () {
    return this._matrix[this.current[0]][this.current[1]]!
  }

  private builder: MatrixBuilder
  private director: BuildDirector

  constructor(public size:number) {
    this.builder = new MatrixBuilder(size)
    this.director = new BuildDirector(this.builder)
    this.director.buildMatrix(this.current)
    this._matrix = this.builder.getResult()
  }

  private genFloor() {
    // might change builder's size,
    // or fillRate here according to the game's state
    this.director.buildMatrix(this.current)
    this._matrix = this.builder.getResult()
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

// Director. Knows what to do based on the current situation.
class BuildDirector {
  private builder!: Builder
  constructor(builder:Builder) {
    this.setBuilder(builder)
  }
  public setBuilder(builder: Builder) {
    this.builder = builder
  }
  public buildMatrix(
    current: number[],
    fill = 0.5,
    conn = 0.5
  ) {
    this.builder.setNode(current)
    this.builder.seedNodes(fill)
    this.builder.connectNodes(conn)
  }
}

interface Builder {
  reset(): void
  setNode(pos: number[]): Node
  seedNodes(fillRate: number): void
  connectNodes(connRate: number): void
}

// Concrete Builder
class MatrixBuilder implements Builder {
  private matrix!:Matrix

  constructor(
    private size = 30,
  ) {
    this.reset()
  }

  public getResult() {
    const matrix = this.matrix
    this.reset()
    return matrix
  }

  public reset() {
    this.matrix = Array.from(Array(this.size), () => new Array(this.size).fill(null))
  }

  public setNode(pos: number[]) {
    const newNode = new Node(pos)
    this.matrix[pos[0]][pos[1]] = newNode
    return newNode
  }

  public seedNodes(fillRate: number) {
    for (let i = 0; i< this.size; i++) {
      for (let j = 0; j< this.size; j++) {
        if (random(fillRate)) {
          this.matrix[i][j] = new Node([i,j])
        }
      }
    }
  }

  private adjacentPos(d: Direction, i: number,j: number):number[]|null {
    switch(d) {
      case 'n':
        return i>0 ? [i-1, j] : null
      case 'e':
        return j<this.size-1 ? [i, j+1] : null
      case 's':
        return i<this.size-1 ? [i+1, j] : null
      case 'w':
        return j>0 ? [i, j-1] : null
    }
  }

  private adjacentNode(d: Direction, i: number,j: number) {
    const pos = this.adjacentPos(d,i,j)
    if (pos) {
      return this.matrix[pos[0]][pos[1]]
    }
  }

  public setEdge(node: Node, d: Direction) {
    const adj = this.adjacentNode(d, node.pos[0], node.pos[1])
    if (adj) {
      node.set({[d]: true})
      adj.set({[compass('o', d)]: true})
    }
    return adj
  }

  private connectDistantNodes = (n1: Node, n2: Node) => {
    const dis = n1.distance(n2)
    const d = n1.direction(n2)
    const [i, j] = n1.pos
    const pos = this.adjacentPos(d, i, j)!
    let adj = this.matrix[pos[0]][pos[1]]
    if (!adj) {  
      const [y, x] = pos
      const newNode = this.setNode([y,x])
      this.matrix[y][x] = newNode
      adj = newNode
    }
    this.setEdge(n1, d)
    if (dis !== 1) {
      this.connectDistantNodes(adj, n2)
    }
  }

  public connectNodes(connRate: number) {
    // connect the nodes randomly, storing the clusters
    const clusters:Set<Node>[] = []
    for (let i = 0; i< this.size; i++) {
      for (let j = 0; j< this.size; j++) {
        const node = this.matrix[i][j]
        if (node) {
          const cluster = clusters.find(c => c.has(node))
          if (!cluster) {
            clusters.push(new Set([node]))
          }
          for (const d of NESW) {
            if (random(connRate)) {
              const adj = this.setEdge(node, d)
              if (adj && cluster && !cluster.has(adj)) {
                cluster.add(adj)
              }
            }
          }
        }
      }
    }

    // connect the clusters
    while(clusters.length !== 1) {
      const cl1 = clusters[0]
      for (const cl2 of clusters.slice(1)) {
        for (const cl2Node of cl2) {
          let dis = 1000
          let startNode:Node|undefined
          let nearestNode:Node|undefined
          for (const cl1Node of cl1) {
            const dist = cl1Node.distance(cl2Node)
            if (dist < dis) {
              dis = dist
              startNode = cl1Node
              nearestNode = cl2Node
            }
          }
          if (startNode && nearestNode) {
            this.connectDistantNodes(startNode, nearestNode)
            for (const n of cl2) {
              cl1.add(n)
            }
            clusters.splice(clusters.findIndex(s => s === cl2), 1)
          }
        }
      }
    }    
  }
}

type Edges = {
  [k in Direction]: boolean
}

export class Node {
  private _edges: Edges
  get edges() {
    return this._edges
  }

  constructor(
    public pos: number[],
    edges?: {[k in Direction]?: boolean}
  ) {
    this._edges = {
      n: edges?.n || false,
      e: edges?.e || false,
      s: edges?.s || false,
      w: edges?.w || false
    }
  }

  public set(edges: {[k in Direction]?: boolean}) {
    this._edges = Object.assign({...this._edges}, edges) 
  }

  public distance(other:Node) {
    return Math.abs(other.pos[0] - this.pos[0]) + Math.abs(other.pos[1]- this.pos[1])
  }

  public direction(other: Node, prefer: 'ns'|'ew' = 'ns') {
    let ns, ew

    if (this.pos[0] < other.pos[0]) {
      ns = 's'
    } else if (this.pos[0] > other.pos[0]) {
      ns = 'n'
    }
    
    if (this.pos[1] < other.pos[1]) {
      ew = 'e'
    } else if (this.pos[1] > other.pos[1]) {
      ew = 'w'
    }

    if (!ns && !ew) {
      throw Error('directioin must be compared between two different nodes')
    }

    if (prefer === 'ns') {
      return (ns || ew) as Direction
    } else {
      return (ew || ns) as Direction
    }
  }
}
