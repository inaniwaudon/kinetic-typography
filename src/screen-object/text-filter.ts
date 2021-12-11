import { KeyFrames, State } from "../keyframe";
import { ScreenObjectFilter } from "./screen-object";
import Text, { TextState } from "./text";

export class TextTrackingFilter extends ScreenObjectFilter<
  TextTrackingFilterState,
  TextState,
  Text
> {
  toKeyFrame(text: Text) {
    const newKeyFrame = new KeyFrames();
    for (const frame of this.keyFrames.filledFrames) {
      const state: Partial<TextState> = {};
      state.charX = [...Array(text.text.length)].fill(frame.state.tracking);
      newKeyFrame.addKeyFrame(frame.sec, state, frame.easing);
    }
    return newKeyFrame;
  }
}

interface TextTrackingFilterState extends State {
  tracking: number;
}

export class TextRoundFilter extends ScreenObjectFilter<
  TextRoundFilterState,
  TextState,
  Text
> {
  toKeyFrame(text: Text) {
    const newKeyFrame = new KeyFrames();
    for (const frame of this.keyFrames.subDevideFrames(10)) {
      const state: Partial<TextState> = {};
      state.charX = [];
      state.charY = [];
      state.charRotate = [];
      for (let i = 0; i < text.text.length; i++) {
        const rad =
          ((frame.state.endRad - frame.state.startRad) / text.text.length) *
            -i -
          frame.state.startRad +
          90;
        const radian = 2 * Math.PI * (rad / 360);
        state.charX.push(Math.cos(-radian) * frame.state.radius);
        state.charY.push(Math.sin(-radian) * frame.state.radius);
        state.charRotate.push(-rad + 90);
      }
      newKeyFrame.addKeyFrame(frame.sec, state, frame.easing);
    }
    return newKeyFrame;
  }
}

interface TextRoundFilterState extends State {
  startRad: number;
  endRad: number;
  radius: number;
}

export class TextRandomFilter extends ScreenObjectFilter<
  TextRandomFilterState,
  TextState,
  Text
> {
  toKeyFrame(text: Text) {
    const newKeyFrame = new KeyFrames();
    for (const frame of this.keyFrames.filledFrames) {
      const state: Partial<TextState> = {};
      state.charDeltaX = [];
      state.charDeltaY = [];
      state.charRotate = [];
      for (let i = 0; i < text.text.length; i++) {
        state.charDeltaX.push(
          -frame.state.x + Math.random() * frame.state.x * 2
        );
        state.charDeltaY.push(
          -frame.state.y + Math.random() * frame.state.y * 2
        );
        state.charRotate.push(
          -frame.state.rotate + Math.random() * frame.state.rotate * 2
        );
      }
      newKeyFrame.addKeyFrame(frame.sec, state, frame.easing);
    }
    console.log(newKeyFrame);
    return newKeyFrame;
  }
}

interface TextRandomFilterState extends State {
  x: number;
  y: number;
  rotate: number;
}
