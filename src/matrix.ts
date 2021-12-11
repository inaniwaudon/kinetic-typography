const multiplyMatrix = (a: number[][], b: number[][]): number[][] => {
  const result = [];
  for (var y = 0; y < a.length; y++) {
    result.push([]);
    for (var x = 0; x < b[0].length; x++) {
      result[y][x] = 0;
      for (var i = 0; i < b.length; i++) {
        result[y][x] += a[y][i] * b[i][x];
      }
    }
  }
  return result;
};

type matrix3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

export default class Matrix {
  private matrix: matrix3x3 = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];

  translate(x: number, y: number) {
    this.matrix = multiplyMatrix(
      [
        [1, 0, x],
        [0, 1, y],
        [0, 0, 1],
      ],
      this.matrix
    ) as matrix3x3;
    return this;
  }

  rotate(theta: number) {
    this.matrix = multiplyMatrix(
      [
        [Math.cos(theta), -Math.sin(theta), 0],
        [Math.sin(theta), Math.cos(theta), 0],
        [0, 0, 1],
      ],
      this.matrix
    ) as matrix3x3;
    return this;
  }

  zoom(scale: number) {
    this.matrix = multiplyMatrix(
      [
        [scale, 0, 0],
        [0, scale, 0],
        [0, 0, 1],
      ],
      this.matrix
    ) as matrix3x3;
    return this;
  }

  get forTransform(): [number, number, number, number, number, number] {
    return [
      this.matrix[0][0],
      this.matrix[1][0],
      this.matrix[0][1],
      this.matrix[1][1],
      this.matrix[0][2],
      this.matrix[1][2],
    ];
  }
}
