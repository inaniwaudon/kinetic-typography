import { KeyFrames, State } from "./keyframe";
import { width, height } from "./main";
import Matrix from "./matrix";
import SceneObject from "./scene-object";
import ScreenObject, { ScreenObjectState } from "./screen-object/screen-object";

export default class Layer extends SceneObject<LayerState> {
  objects: ScreenObject<ScreenObjectState>[];
  private filters: LayerFilter<State>[] = [];
  private bufferFrames: ImageData[] = [];
  private static bufferNo = 10;

  addFilter(filter: LayerFilter<State>) {
    this.filters.push(filter);
  }

  applyFilter() {
    for (const filter of this.filters) {
      for (const frame of filter.toKeyFrame().frames) {
        this.keyFrames.addKeyFrame(frame.sec, frame.state, frame.easing);
      }
    }
  }

  call(context: CanvasRenderingContext2D, sec: number) {
    super.call(context, sec);
    this.objects.forEach((obj) => obj.call(context, sec));
    this.bufferFrames.push(context.getImageData(0, 0, width, height));
    if (this.bufferFrames.length > Layer.bufferNo) {
      this.bufferFrames.shift();
    }
    this.filters.forEach((filter) =>
      filter.process(
        context,
        filter.keyFrames.calculate(sec),
        this.bufferFrames
      )
    );
  }

  draw(context: CanvasRenderingContext2D, state: LayerState) {
    const radian = (state.rotate / 360) * 2 * Math.PI;
    const matrix = new Matrix()
      .translate(-width / 2 - state.x, -height / 2 - state.y)
      .rotate(radian)
      .zoom(state.scale)
      .translate(width / 2 + state.x, height / 2 + state.y).forTransform;
    context.setTransform(...matrix);
  }
}

interface LayerState extends State {
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

export abstract class LayerFilter<S extends State> {
  private _keyFrames: KeyFrames<S>;

  constructor(state: S) {
    this._keyFrames = new KeyFrames(state);
  }

  get keyFrames() {
    return this._keyFrames;
  }

  abstract process(
    context: CanvasRenderingContext2D,
    state: S,
    bufferFrames: ImageData[]
  ): void;
  abstract toKeyFrame(): KeyFrames<Partial<LayerState>>;
}
