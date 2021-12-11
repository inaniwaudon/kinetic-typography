import { formatDiagnostic } from "../node_modules/typescript/lib/typescript";
import Easing, { easings } from "./easing";

export type State = {
  [key in string]: number | number[];
};

interface Frame<T extends State> {
  sec: number;
  state: Partial<T>;
  easing?: Easing;
}

export class KeyFrames<T extends State> {
  private _frames: Frame<T>[] = [];

  get frames() {
    return this._frames;
  }

  get filledFrames(): Frame<T>[] {
    return this.frames.map((frame) => ({
      sec: frame.sec,
      state: this.calculate(frame.sec),
      easing: frame.easing,
    }));
  }

  constructor();
  constructor(state: T);
  constructor(state?: T) {
    if (state) {
      this.frames.push({ sec: 0.0, state });
    }
  }

  addKeyFrame(sec: number, state: Partial<T>, easing: Easing) {
    const existingFrame = this.frames.reduce(
      (previous, frame) => (frame.sec === sec ? frame : previous),
      null
    );
    if (existingFrame) {
      for (const key in state) {
        existingFrame.state[key] = state[key];
      }
    } else {
      this.frames.push({ sec, state: state, easing });
    }
  }

  calculate(sec: number): T {
    const startState: T = {} as T;
    const endState: Partial<T> = {};
    const startSec: { [key in keyof T]: number } = {} as any;
    const endSec: Partial<{ [key in keyof T]: number }> = {};
    const endEasing: Partial<{ [key in keyof T]: Easing }> = {};

    for (const frame of this.frames) {
      // start
      if (frame.sec <= sec) {
        for (const key in frame.state) {
          startState[key] = frame.state[key];
          startSec[key] = frame.sec;
        }
      }
      // end
      else {
        for (const key in frame.state) {
          if (!(key in endState)) {
            endState[key] = frame.state[key];
            endSec[key] = frame.sec;
            endEasing[key] = frame.easing;
          }
        }
      }
    }

    // interpolate
    const result: State = startState;
    for (const key in result) {
      if (key in endState) {
        const ratio = endEasing[key].get(
          (sec - startSec[key]) / (endSec[key] - startSec[key])
        );
        if (Array.isArray(result[key])) {
          result[key] = (endState[key] as number[]).map(
            (value, index) =>
              (value - startState[key][index]) * ratio + startState[key][index]
          );
        } else {
          result[key] =
            ((endState[key] as number) - (startState[key] as number)) * ratio +
            (startState[key] as number);
        }
      }
    }
    return result as T;
  }

  subDevideFrames(no: number) {
    const frames: Frame<T>[] = [];
    for (let frame_i = 0; frame_i < this.frames.length - 1; frame_i++) {
      const [startSec, endSec] = [
        this.frames[frame_i].sec,
        this.frames[frame_i + 1].sec,
      ];
      for (let i = 0; i < no; i++) {
        const sec = ((endSec - startSec) / no) * i + startSec;
        frames.push({
          sec,
          state: this.calculate(sec),
          easing: easings.linear,
        });
      }
    }
    return frames;
  }
}
