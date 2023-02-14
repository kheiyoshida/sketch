import { random, randomIntBetween } from "../../../lib/utils"
import { compass, Direction, NESW } from "./direction"
import { connRate, INITIAL_FLOOR_SIZE, fillRate, floorSize } from "./domain"

export type Matrix = Array<Array<Node|null>>

export class Maze {
  
  private _matrix!: Matrix
  get matrix() {
    return this._matrix
  }

  private _current!: number[]
  get current() {
    return this._current
  }

  private _stairPos!: number[]
  get stairPos() {
    return this._stairPos
  }

  public _direction: Direction = 's'
  get direction() {
    return this._direction
  }

  get currentNode () {
    return this._matrix[this.current[0]][this.current[1]]!
  }

  private _floor: number = 1
  get floor() {
    return this._floor
  }

  get size() {
    return this.builder.size
  }

  private builder: MatrixBuilder
  private director: BuildDirector

  constructor() {
    this.builder = new MatrixBuilder()
    this.director = new BuildDirector(this.builder)
    this.generate()
  }

  private generate() {
    this.director.buildMatrix(this.floor)
    const {
      matrix, initialPos, initialDir, stairPos
    } = this.builder.getResult()
    this._matrix = matrix
    this._current = initialPos
    this._direction = initialDir
    this._stairPos = stairPos
  }

  public turn(d: 'r'|'l') {
    this._direction = compass(d, this.direction)
  }

  public getFrontLoc(dist=1) {
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

  public getFrontNode({dist}:{dist:number}={dist:1}) {
    const l = this.getFrontLoc(dist)
    return this._matrix[l[0]][l[1]]
  }

  get canProceed() {
    return this.currentNode!.edges[this.direction]
  }
  
  public navigate() {
    if (this.canProceed) {
      const from = this.current
      this._current = this.getFrontLoc()
      return {from, dest: this.current}
    }
  }

  get reachedStair() {
    return this.current[0] === this.stairPos[0] 
      && this.current[1] === this.stairPos[1]
  }

  public goDownStairs() {
    this._floor += 1
    this.generate()
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
  public buildMatrix(floor: number, retry = 0) {
    try {
      this._buildMatrix(
        floor, 
        retry > 1 ? {fs: retry*1, fill: retry * 0.05} : undefined
      )
    } catch (e) {
      if (e instanceof BuildError && retry < 7) {
        this.buildMatrix(floor, retry+1)
      } else {
        console.error(e)
        throw Error('exceeded max retry times')
      }
    }
  }
  private _buildMatrix(
    floor: number, 
    adjust?: {[k in 'fs'|'fill']: number}
  ) {
    const fs = floorSize(floor) + (adjust ? adjust.fs : 0)
    const fill = fillRate(floor) + (adjust ? adjust.fill : 0)
    const conn = connRate(floor)
    this.builder.reset(fs)
    this.builder.seedNodes(fill)
    this.builder.connectNodes(conn)
    this.builder.determineInitialPos()
    this.builder.setStair()
  }
}

interface Builder {
  reset(size:number): void
  setNode(pos: number[]): Node
  seedNodes(fillRate: number): void
  connectNodes(connRate: number): void
  determineInitialPos(): void
  setStair(): void
}

class BuildError extends Error {
  constructor(public type: 'no-deadend'|'no-corridor') {
    super()
  }
}

// Concrete Builder
class MatrixBuilder implements Builder {
  private matrix!:Matrix
  private initialPos: number[]|undefined
  private stairPos: number[]|undefined

  private _size!: number
  private setSize(size: number) {
    this._size = size
  }
  get size() {
    return this._size
  }

  constructor() {
    this.reset(INITIAL_FLOOR_SIZE)
  }

  public getResult() {
    const matrix = this.matrix
    if (!this.initialPos) {
      throw Error('initial position is not set')
    }
    if (!this.stairPos) {
      throw Error('stair position is not set')
    }
    const initialNode = matrix[this.initialPos[0]][this.initialPos[1]]!
    const direction = compass(random(0.5) ? 'r' : 'l', initialNode.corridorDirection!)
    return {
      matrix, 
      initialPos: this.initialPos, 
      initialDir: direction,
      stairPos: this.stairPos
    }
  }

  public reset(size: number) {
    this.setSize(size)
    this.matrix = Array.from(
      Array(this.size), () => new Array(this.size).fill(null)
    )
  }

  public setNode(pos: number[]) {
    const newNode = new Node(pos)
    this.matrix[pos[0]][pos[1]] = newNode
    return newNode
  }

  public seedNodes(
    fillRate: number, 
    maxNodes = 100,
    nodes?: number,
    retry?: number
  ) {
    let numOfNodes = nodes || 0
    for (let i = 0; i< this.size; i++) {
      for (let j = 0; j< this.size; j++) {
        if (random(fillRate)) {
          numOfNodes += 1
          if (numOfNodes < maxNodes) {
            this.matrix[i][j] = new Node([i,j])
          } else {
            break
          }
        }
      }
    }
    if (numOfNodes < 2) {
      this.seedNodes(fillRate+0.05, maxNodes, numOfNodes)
      if (retry && retry > 5) {
        throw Error("matrix couldn't be filled enough. consider setting higher fillRate")
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

    let i = 0

    // connect the clusters
    while(clusters.length !== 1) {
      i += 1 
      if (i > 300) {
        throw Error('exceeded max loop')
      }
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

  public determineInitialPos() {
    const corridors = []
    for (let i = 0; i< this.size; i++) {
      for (let j = 0; j< this.size; j++) {
        const node = this.matrix[i][j]
        if (node && node.isCorridor) {
          corridors.push(node)
        }
      }
    }
    if (!corridors.length) {
      throw new BuildError('no-corridor')
    }
    const initial = corridors[randomIntBetween(0, corridors.length)]
    this.initialPos = initial.pos
  }

  public setStair() {
    const deadEnds = []
    for (let i = 0; i< this.size; i++) {
      for (let j = 0; j< this.size; j++) {
        const node = this.matrix[i][j]
        if (node && node.isDeadEnd) {
          deadEnds.push(node)
        }
      }
    }
    if (!deadEnds.length) {
      throw new BuildError('no-deadend')
    }
    const staierNode = deadEnds[randomIntBetween(0, deadEnds.length)]
    staierNode.setStair()
    this.stairPos = staierNode.pos
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

  private _stair: boolean = false
  public get stair() {
    return this._stair
  }

  public setStair() {
    this._stair = true
  }

  get isDeadEnd() {
    return Object.values(this._edges)
      .filter(v => v===true).length === 1
  }

  get corridorDirection(): Direction|undefined {
    if (this._edges.e) {
      if (this._edges.w && !this._edges.n && !this._edges.s) {
        return 'e'
      }
    } else if (this._edges.n) {
      if (this._edges.s && !this._edges.w && !this._edges.e) {
        return 'n'
      }
    }
  }

  get isCorridor() {
    return Boolean(this.corridorDirection)
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
