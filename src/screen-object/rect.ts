import ScreenObject, { ScreenObjectState } from "./screen-object";

export default class Rect extends ScreenObject<RectState> {
  constructor(state: RectState, fill: string) {
    super(state, fill);
  }

  draw(context: CanvasRenderingContext2D, state: RectState) {
    context.fillStyle = this.fill;
    context.fillRect(state.x, state.y, state.width, state.height);
  }
}

interface RectState extends ScreenObjectState {
  width: number;
  height: number;
}
