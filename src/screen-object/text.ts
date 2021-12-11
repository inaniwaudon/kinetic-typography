import Matrix from "../matrix";
import ScreenObject, { ScreenObjectState } from "./screen-object";

const defaultFont = "FOT-筑紫Aオールド明朝 Pr6 ";
const descender = 200;

export type textAlign = "left" | "center" | "right";

export default class Text extends ScreenObject<TextState> {
  constructor(
    state: TextState,
    fill: string,
    private _text: string,
    private size: number,
    private align: textAlign
  ) {
    super(state, fill);
  }

  get text() {
    return this._text;
  }

  draw(context: CanvasRenderingContext2D, state: TextState) {
    context.fillStyle = this.fill;
    context.font = `normal ${this.size}px ${defaultFont}`;
    context.textAlign = this.align;

    const totalX = (index: number) => {
      return (
        this.size * index +
        (state.charX
          ? state.charX
              .slice(0, Math.min(index + 1, state.charX.length))
              .reduce((previous, current) => previous + current, 0)
          : 0)
      );
    };

    let baseX = state.x;
    let baseY = state.y;
    this.text.split("").forEach((char, index) => {
      const x =
        baseX +
        (state.charX && index < state.charX.length
          ? state.charX[index]
          : this.size * index +
            (state.charDeltaX && index < state.charDeltaX.length
              ? state.charDeltaX[index]
              : 0));
      const y =
        baseY +
        (state.charY && index < state.charY.length
          ? state.charY[index]
          : state.charDeltaY && index < state.charDeltaY.length
          ? state.charDeltaY[index]
          : 0) +
        this.size * (descender / 1000);
      context.save();
      if (state.charRotate && index < state.charRotate.length) {
        const matrix = new Matrix()
          .translate(-x, -y)
          .rotate(2 * Math.PI * (state.charRotate[index] / 360))
          .translate(x, y).forTransform;
        context.transform(...matrix);
      }
      context.fillText(char, x, y);
      context.restore();
    });
  }
}

export interface TextState extends ScreenObjectState {
  x: number;
  y: number;
  charX?: number[];
  charY?: number[];
  charDeltaX?: number[];
  charDeltaY?: number[];
  charRotate?: number[];
}
