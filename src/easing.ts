export default class Easing {
  constructor(private func: (t: number) => number) {}

  get(t: number): number {
    return this.func(t);
  }
}

export const easings = {
  floor: new Easing((t) => Math.floor(t)),
  ceil: new Easing((t) => Math.ceil(t)),
  random: new Easing((t) => Math.random()),
  randomNotOrAll: new Easing((t) => Math.round(Math.random())),
  linear: new Easing((t) => t),
  easeInOutQuart: new Easing((t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
  ),
  easeInCubic: new Easing((t) => t * t * t),
  easeOutCubic: new Easing((t) => 1 - Math.pow(1 - t, 3)),
};
