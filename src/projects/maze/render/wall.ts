import p5 from "p5";
import { random } from "../../../lib/utils";
import { randomBetween } from "../../sk_01/utils";
import { Conf } from "../config";

export function img(pos: number[], size:number[]) {
  let img = p.createImage(size[0],size[1]);
  img.loadPixels();

  // helper for writing color to array
  function writeColor(
    image:p5.Image, 
    x:number, y:number, 
    red:number, green:number, blue:number, alpha:number
  ) {
    let index = (x + y * p.width) * 4;
    image.pixels[index] = red;
    image.pixels[index + 1] = green;
    image.pixels[index + 2] = blue;
    image.pixels[index + 3] = alpha;
  }

  let x, y;
  // fill with random colors
  for (y = 0; y < img.height; y++) {
    for (x = 0; x < img.width; x++) {
      let red = p.random(120);
      let green = p.random(255);
      let blue = p.random(255);
      let alpha = 10;
      writeColor(img, x, y, red, green, blue, alpha);
    }
  }

  img.updatePixels();
  p.image(img, pos[0], pos[1]);
}

export function putPicture(pos: number[], size:number[]) {
  const pic = generatePicture(size)
  p.image(pic, pos[0], pos[1]);
}

export function generatePicture(size:number[]) {
  const g = p.createGraphics(size[0], size[1])
  drawPicture(g)
  return g
}

function drawPicture(g: p5.Graphics) {
  g.background(Conf.colors.wallPicture)
  const c = Conf.colors.wallPicture
  c.setAlpha(200)
  g.stroke(255)
  g.frameRate(Conf.fps)

  g.line(
    randomBetween(0, g.width),
    randomBetween(0, g.height),
    randomBetween(0, g.width),
    randomBetween(0, g.height),
  )
  g.fill(c)
  
}
