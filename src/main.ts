import Layer from "./layer";
import { initialize } from "./script";

let video: HTMLVideoElement;
export const [width, height] = [1920, 1080];
const fps = 30;

let canvas: HTMLCanvasElement, context: CanvasRenderingContext2D;

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

const drawFrame = (layers: Layer[], frameCount: number) => {
  const sec = frameCount / fps;
  context.clearRect(0, 0, width, height);
  for (const layer of layers) {
    layer.call(context, sec);
  }
};

export const drawAllFrames = (layers: Layer[], sec: number) => {
  return new Promise<void>((resolve) => {
    const loop = (frameCount: number) => {
      drawFrame(layers, frameCount);
      if (frameCount < sec * fps) {
        setTimeout(() => {
          loop(frameCount + 1);
        }, 1000 / fps);
      } else {
        resolve();
      }
    };
    loop(0);
  });
};

window.addEventListener("load", () => {
  video = document.getElementsByTagName("video")[0];
  const convertButton = document.getElementById("convert");
  convertButton.onclick = () => {
    const layers = initialize();
    outputVideo(layers);
  };
});

export const outputVideo = async (layers: Layer[]) => {
  setup(layers);
  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, {
    mimeType: "video/webm;codecs=vp9",
  });

  recorder.ondataavailable = (e) => {
    const blob = new Blob([e.data], { type: e.data.type });
    video.src = URL.createObjectURL(blob);
  };

  recorder.start();
  const sec = 2;
  await drawAllFrames(layers, sec);
  recorder.stop();
};
