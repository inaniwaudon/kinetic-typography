import { State } from "./keyframe";
import { LayerFilter } from "./layer";
import { width, height } from "./main";

const getPixelPosition = (x: number, y: number) => (y * width + x) * 4;

// scan line
export class LayerScanLineFilter extends LayerFilter<LayerScanLineState> {
  toKeyFrame() {
    return null;
  }

  process(context: CanvasRenderingContext2D, state: LayerScanLineState) {
    const imageData = context.getImageData(0, 0, width, height);
    const lineHeight = Math.floor(state.lineHeight);
    const clipHeight = Math.floor(state.clipHeight);
    for (let y = 0; y < height; y++) {
      const surplus = y % (lineHeight + clipHeight);
      if (surplus > lineHeight) {
        for (let x = 0; x < width; x++) {
          for (let i = 0; i < 3; i++) {
            imageData.data[(y * width + x) * 4 + i] = 0;
          }
        }
      }
    }
    context.putImageData(imageData, 0, 0);
  }
}

interface LayerScanLineState extends State {
  lineHeight: number;
  clipHeight: number;
}

// color shift
export class LayerColorShiftFilter extends LayerFilter<LayerColorShiftFilterState> {
  toKeyFrame() {
    return null;
  }

  process(
    context: CanvasRenderingContext2D,
    state: LayerColorShiftFilterState
  ) {
    const imageData = context.getImageData(0, 0, width, height);
    const shiftWidth = Math.floor(state.width);
    // R
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        imageData.data[(y * width + x - 1) * 4] =
          imageData.data[(y * width + x - 1 + shiftWidth) * 4];
      }
    }
    // B
    for (let y = height - 1; y >= 0; y--) {
      for (let x = width - 1; x >= 0; x--) {
        imageData.data[(y * width + x - 1) * 4 + 2] =
          imageData.data[(y * width + x - 1 - shiftWidth) * 4 + 2];
      }
    }
    context.putImageData(imageData, 0, 0);
  }
}

interface LayerColorShiftFilterState extends State {
  width: number;
}

// afterimage
export class LayerAfterImageFilter extends LayerFilter<LayerAfterImageFilterState> {
  toKeyFrame() {
    return null;
  }

  process(
    context: CanvasRenderingContext2D,
    state: LayerAfterImageFilterState,
    bufferFrames: ImageData[]
  ) {
    const imageData = context.createImageData(width, height);
    for (let i = 0; i < Math.min(state.frames, bufferFrames.length); i++) {
      const frame = bufferFrames[bufferFrames.length - i - 1];
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          for (let color_i = 0; color_i < 3; color_i++) {
            const pos = getPixelPosition(x, y) + color_i;
            imageData.data[pos] += frame.data[pos] / i;
          }
          const pos = getPixelPosition(x, y) + 3;
          imageData.data[pos] = Math.min(
            imageData.data[pos] + frame.data[pos],
            255
          );
        }
      }
    }
    console.log(imageData);
    context.putImageData(imageData, 0, 0);
  }
}

interface LayerAfterImageFilterState extends State {
  frames: number;
}
