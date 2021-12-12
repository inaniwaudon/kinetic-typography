import ScreenObject, { ScreenObjectState } from "./screen-object";

export default class Rect extends ScreenObject<RectState> {
  constructor(state: RectState, fill: string) {
    super(state, fill);
  }

  draw(context: CanvasRenderingContext2D, state: RectState) {
    context.fillStyle = this.fill;
    context.beginPath();
    context.ellipse(
      state.x,
      state.y,
      state.width / 2,
      state.height / 2,
      0,
      0,
      2 * Math.PI
    );
    context.closePath();
    context.fill();
  }
}

interface RectState extends ScreenObjectState {
  width: number;
  height: number;
}
