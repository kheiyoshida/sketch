import { pushPop } from "../../lib/utils"
import { compass, Maze, Node } from "./maze"

export type Frame = {
  tl: number[],
  tr: number[],
  bl: number[],
  br: number[]
}

export type Layer = {
  front: Frame
  back: Frame
}

const pointLine = (p1: number[], p2: number[]) => {
  p.line(p1[0], p1[1], p2[0], p2[1])
}

export const framePaint = () => {
  p.rect(0, 0, p.windowWidth, p.windowHeight)
}

const side = (
  l: Layer,
  direction: 'r'|'l',
  pattern: 'corridor'|'wall'
) => {
  if (pattern === 'corridor') {
    if (direction==='l') {
      pointLine(l.back.tl, [l.front.tl[0], l.back.tl[1]])
      pointLine(l.back.bl, [l.front.bl[0], l.back.bl[1]])
      pointLine(l.front.tl, l.front.bl)
    } else {
      pointLine(l.back.tr, [l.front.tr[0], l.back.tr[1]])
      pointLine(l.back.br, [l.front.br[0], l.back.br[1]])
      pointLine(l.front.tr, l.front.br)
    }
  } else {
    if (direction==='l') {
      pointLine(l.front.tl, l.back.tl)
      pointLine(l.front.bl, l.back.bl)
    } else {
      pointLine(l.front.tr, l.back.tr)
      pointLine(l.front.br, l.back.br)
    }
  }
}

const front = (
  l: Layer,
  pattern: 'corridor'|'wall'|'dark',
) => {
  if(pattern === 'corridor') {
    pointLine(l.front.tl, l.back.tl)
    pointLine(l.front.tr, l.back.tr)
    pointLine(l.front.bl, l.back.bl)
    pointLine(l.front.br, l.back.br)
  } else if (pattern === 'wall') {
    pointLine(l.front.tl, l.front.tr)
    pointLine(l.front.bl, l.front.br)
  } else {
    pointLine(l.front.tl, l.back.tl)
    pointLine(l.front.tr, l.back.tr)
    pointLine(l.front.bl, l.back.bl)
    pointLine(l.front.br, l.back.br)
    pushPop(() => {
      p.fill(10, 0.2)
      p.noStroke()
      p.rect(
        l.back.tl[0], l.back.tl[1],
        (l.back.tr[0]-l.back.tl[0]), 
        (l.back.bl[1]-l.back.tl[1])
      )
    })
  }
}

type PathPattern = 'wall'|'corridor'

type Terrain = {
  left: PathPattern
  right: PathPattern
  front: PathPattern | 'dark'
}

const lookAround = (maze: Maze, node: Node, far:boolean):Terrain => {
  const f = node.edges[maze.direction]
  const l = node.edges[compass('l', maze.direction)]
  const r = node.edges[compass('r', maze.direction)]
  return {
    front: f 
      ? far ? 'dark' : 'corridor' 
      : 'wall',
    left: l ? 'corridor' : 'wall',
    right: r ? 'corridor' : 'wall'
  }
}

export const render = (
  frames: Frame[],
  maze: Maze,
  layer = 0,
  node?: Node,
) => {
  if (layer === 0) {
    framePaint()
  }

  const frontLayer = {front: frames[layer], back: frames[layer+1]} 
  const backLayer = {front: frames[layer+1], back: frames[layer+2]}
  const around = lookAround(maze, node || maze.currentNode, layer===4)

  side(frontLayer, 'l', around.left)
  side(frontLayer, 'r', around.right)
  front(backLayer, around.front)

  if (around.front === 'corridor' && layer<3) {
    render(
      frames, maze, layer+2, 
      maze.getFrontNode({dist: layer/2+1})!
    )
  }
}

