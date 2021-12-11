//import Easing from "../easing";
import { KeyFrames, State } from "../keyframe";
import SceneObject from "../scene-object";

export default abstract class ScreenObject<
  T extends ScreenObjectState
> extends SceneObject<T> {
  private filters: ScreenObjectFilter<any, T, this>[] = [];

  constructor(state: T, protected fill: string) {
    super(state);
  }

  addFilter(filter: ScreenObjectFilter<any, T, this>) {
    this.filters.push(filter);
  }

  applyFilter() {
    for (const filter of this.filters) {
      for (const frame of filter.toKeyFrame(this).frames) {
        this.keyFrames.addKeyFrame(frame.sec, frame.state, frame.easing);
      }
    }
  }
}

export interface ScreenObjectState extends State {
  x: number;
  y: number;
}

export abstract class ScreenObjectFilter<
  S extends State,
  T extends ScreenObjectState,
  U extends ScreenObject<T>
> {
  private _keyFrames: KeyFrames<S>;

  constructor(state: S) {
    this._keyFrames = new KeyFrames(state);
  }

  get keyFrames() {
    return this._keyFrames;
  }

  abstract toKeyFrame(object: U): KeyFrames<Partial<T>>;
}
