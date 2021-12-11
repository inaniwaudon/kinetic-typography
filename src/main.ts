import Layer from "./layer";

export const [width, height] = [1920, 1080];
const fps = 30;

let canvas: HTMLCanvasElement, context: CanvasRenderingContext2D;
let frameCount = 0;

export const setup = (layers: Layer[]) => {
  canvas = document.getElementsByTagName("canvas")[0];
  canvas.width = width;
  canvas.height = height;
  context = canvas.getContext("2d");

  // filter
  for (const layer of layers) {
    for (const object of layer.objects) {
      object.applyFilter();
    }
  }
};

export const loop = (layers: Layer[]) => {
  const sec = frameCount / fps;
  context.clearRect(0, 0, width, height);
  for (const layer of layers) {
    layer.call(context, sec);
  }
  frameCount++;
  setTimeout(() => {
    loop(layers);
  }, 1000 / fps);
};
