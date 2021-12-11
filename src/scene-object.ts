import { KeyFrames, State } from "./keyframe";

export default abstract class SceneObject<T extends State> {
  private _keyFrames: KeyFrames<T>;

  constructor(args: T) {
    this._keyFrames = new KeyFrames<T>(args);
  }

  get keyFrames() {
    return this._keyFrames;
  }

  call(context: CanvasRenderingContext2D, sec: number) {
    this.draw(context, this.keyFrames.calculate(sec));
  }

  abstract draw(context: CanvasRenderingContext2D, state: T): void;
}
