import { pushPop } from "../../lib/utils"
import { compass, Direction, Maze, Node } from "./maze"
import { img } from "./wall"

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

type PathPattern = 'wall'|'corridor'

const pointLine = (p1: number[], p2: number[]) => {
  p.line(p1[0], p1[1], p2[0], p2[1])
}

const framePaint = () => {
  pushPop(() => {
    p.noStroke()
    p.rect(-p.windowWidth, -p.windowHeight, 3 * p.windowWidth, 3 * p.windowHeight)
  })
}

const side = (
  l: Layer,
  direction: 'r'|'l',
  pattern: PathPattern
) => {
  if (pattern === 'corridor') {
    if (direction==='l') {
      pointLine(l.back.tl, [l.front.tl[0], l.back.tl[1]])
      pointLine(l.back.bl, [l.front.bl[0], l.back.bl[1]])
    } else {
      pointLine(l.back.tr, [l.front.tr[0], l.back.tr[1]])
      pointLine(l.back.br, [l.front.br[0], l.back.br[1]])
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
  pattern: PathPattern|'dark',
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

const edge = (
  l: Layer,
  direction: 'r' | 'l',
) => {
  if (direction === 'r') {
    pointLine(l.back.tr, l.back.br)
  } else {
    pointLine(l.back.tl, l.back.bl)
  }
}

const dark = (
  l: Layer,
  a: Terrain
) => {
  if (
    a.left === a.right && 
    a.right === a.front && 
    a.front === 'wall'
  ) {
    pushPop(() => {
      p.noStroke()
      p.fill(0,100)
      p.rect(
        l.front.tl[0], l.front.tl[1],
        (l.front.tr[0]-l.front.tl[0]), 
        (l.front.bl[1]-l.front.tl[1])
      )
      p.fill(20)
      p.rect(
        l.back.tl[0],
        l.back.tl[1],
        (l.back.tr[0]-l.back.tl[0]),
        (l.back.bl[1]-l.back.tl[1])
      )
      img(
        l.back.tl,
        [(l.back.tr[0]-l.back.tl[0]),
        (l.back.bl[1]-l.back.tl[1])],
      )
    })
  }
}

type Terrain = {
  left: PathPattern
  right: PathPattern
  front: PathPattern | 'dark'
}

const lookAround = (d: Direction, node: Node, far:boolean):Terrain => {
  const f = node.edges[d]
  const l = node.edges[compass('l', d)]
  const r = node.edges[compass('r', d)]
  return {
    front: f 
      ? 
        far 
          ? 'dark' 
          : 'corridor' 
      : 'wall',
    left: l ? 'corridor' : 'wall',
    right: r ? 'corridor' : 'wall'
  }
}

export const render = (
  frames: Frame[],
  maze: Maze,
  layer = 0,
  scene = 1,
  node?: Node,
) => {
  if (layer === 0) {
    framePaint()
  }

  const currentNode = node || maze.currentNode
  const frontLayer: Layer = {front: frames[layer], back: frames[layer+1]} 
  const backLayer: Layer = {front: frames[layer+1], back: frames[layer+2]}

  // if the stair appears, it's always just one pattern for rendering. 
  if (currentNode.stair === true) {
    return renderStair(frontLayer, backLayer, layer===0, scene)
  }

  const direction = maze.direction
  const far = layer === 4
  const around = lookAround(direction, currentNode, far)

  side(frontLayer, 'l', around.left)
  side(frontLayer, 'r', around.right)
  front(backLayer, around.front)
  dark(backLayer, around)

  if (around.front === 'corridor') {
    if (around.left === 'corridor') {
      edge(frontLayer, 'l')
    }
    if (around.right === 'corridor') {
      edge(frontLayer, 'r')
    }
    if (layer <3) {
      render(
        frames, maze, layer+2, scene,
        maze.getFrontNode({dist: layer/2+1})!
      )
    }
  }
}

const renderStair = (f: Layer, b: Layer, current: boolean, scene: number) => {
  
  // ceiling
  pointLine(f.front.tl, f.back.bl)
  pointLine(f.front.tr, f.back.br)
  pointLine(f.back.bl, f.back.br)
  
  // next floor from distance
  if (!current) {
    pointLine(f.front.bl, f.front.br)
    pointLine(b.front.bl, [b.front.bl[0], f.front.bl[1]])
    pointLine(b.front.br, [b.front.br[0], f.front.br[1]])
  }
  // next floor when going down
  else {
    const secondFront = assumeSecondFrame(b.front)
    pointLine(b.front.bl, secondFront.bl)
    pointLine(b.front.br, secondFront.br)
    pushPop(() => {
      p.stroke(200, 100)
      const secondBack = assumeSecondFrame(b.back)
      const adjust = p.windowHeight * 0.015 * scene * scene * (scene<5?1.8: 1)
      pointLine(
        [b.front.bl[0], secondBack.bl[1]+adjust],
        [b.front.br[0], secondBack.br[1]+adjust]
      )
    })
  }
}

// helper. move this somehwere
const assumeSecondFrame = (f: Frame):Frame => {
  const frameHeight = f.bl[1] - f.tl[1]
  const secondFrameBottom = f.bl[1] + frameHeight
  return {
    tl: f.bl,
    tr: f.br,
    bl: [f.bl[0], secondFrameBottom],
    br: [f.br[0], secondFrameBottom]
  }
}

export const intervalRender = (
  interval: number,
  renSeq: Array<() => void>
) => {
  for(let i = 0; i<renSeq.length; i++) {
    const ren = renSeq[i]
    setTimeout(ren, (i+1) * interval)
  }
}

export const transRender = (
  frames: Frame[],
  maze: Maze,
  trans: number[],
  scene?: number
) => {
  pushPop(() => {
    p.translate(trans[0], trans[1])
    render(frames, maze, 0, scene)
  })
}
