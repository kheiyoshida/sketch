import { pushPop } from "../../../lib/utils"
import { Maze, Node } from "../core/maze"
import { compass, Direction } from '../core/direction'
import { extractLayer, Frame } from "./frame"
import { deadEnd, edge, framePaint, front, isDeadEnd, side } from "./draw"
import { renderStair } from "./scene"

export type PathPattern = 'wall'|'corridor'

export type Terrain = {
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
  node?: Node,
) => {
  if (layer === 0) {
    framePaint()
  }

  const currentNode = node || maze.currentNode
  const { frontLayer, backLayer } = extractLayer(frames, layer)

  // if the stair appears, it's always just one pattern for rendering. 
  if (currentNode.stair === true) {
    return renderStair(frontLayer, backLayer, layer===0)
  }
  
  const direction = maze.direction
  const far = layer === 4
  const around = lookAround(direction, currentNode, far)

  side(frontLayer, 'l', around.left)
  side(frontLayer, 'r', around.right)
  front(backLayer, around.front)

  if (isDeadEnd(around)) {
    deadEnd(backLayer, layer === 0)
  }

  if (around.front === 'corridor') {
    if (around.left === 'corridor') {
      edge(frontLayer, 'l')
    }
    if (around.right === 'corridor') {
      edge(frontLayer, 'r')
    }
    if (layer <3) {
      render(
        frames, maze, layer+2,
        maze.getFrontNode({dist: layer/2+1})!
      )
    }
  }
}

export const intervalRender = (
  interval: number,
  renSeq: Array<VoidFunction>,
  after?: VoidFunction,
) => {
  for(let i = 0; i<renSeq.length; i++) {
    const ren = renSeq[i]
    setTimeout(
      () => {
        // console.log(i)
        ren()
      }
      , (i+1) * interval)
  }
  if (after) {
    setTimeout(after, (renSeq.length+1) * interval)
  }
}

export const transRender = (
  frames: Frame[],
  maze: Maze,
  trans: number[],
) => {
  framePaint()
  pushPop(() => {
    p.translate(trans[0], trans[1])
    render(frames, maze, 0)
  })
}
