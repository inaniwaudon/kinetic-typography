import { easings } from "./easing";
import Layer from "./layer";
import {
  LayerAfterImageFilter,
  LayerColorShiftFilter,
  LayerScanLineFilter,
} from "./layer-filter";
import { setup, loop, width, height } from "./main";
import Rect from "./screen-object/rect";
import Text from "./screen-object/text";
import {
  TextRandomFilter,
  TextRoundFilter,
  TextTrackingFilter,
} from "./screen-object/text-filter";

// scene 1
const layers: Layer[] = [];
const bgLayer = new Layer({ x: 0, y: 0, rotate: 0, scale: 1 });
const textLayer = new Layer({ x: 0, y: 0, rotate: 0, scale: 1 });

textLayer.keyFrames.addKeyFrame(1, { rotate: 0, scale: 1 }, easings.floor);
/*textLayer.keyFrames.addKeyFrame(
  1.5,
  { x: 200, y: -300, rotate: -10, scale: 4 },
  easings.easeInOutQuart
);*/

// scan line
const scanFilter = new LayerScanLineFilter({ lineHeight: 0, clipHeight: 0 });
scanFilter.keyFrames.addKeyFrame(
  3,
  { lineHeight: 4, clipHeight: 4 },
  easings.randomNotOrAll
);

// color shift
const shiftFilter = new LayerColorShiftFilter({ width: 0 });
shiftFilter.keyFrames.addKeyFrame(1.2, { width: 4 }, easings.floor);
shiftFilter.keyFrames.addKeyFrame(3, { width: 10 }, easings.random);

// after image
const afterFilter = new LayerAfterImageFilter({ frames: 4 });

//textLayer.addFilter(scanFilter);
//textLayer.addFilter(shiftFilter);
//textLayer.addFilter(afterFilter);

layers.push(bgLayer);
layers.push(textLayer);

const text = new Text(
  { x: width / 2 - 500, y: height / 2 },
  "#fff",
  "筑波大学は核実験をやめろ",
  100,
  "center"
);

// tracking filter
//const filter = new TextTrackingFilter({ tracking: 0 });
//filter.keyFrames.addKeyFrame(2.5, { tracking: 100 }, easings.easeOutCubic);

// round filter
const roundFilter = new TextRoundFilter({
  startRad: -40,
  endRad: 40,
  radius: 300,
});
roundFilter.keyFrames.addKeyFrame(
  2,
  { startRad: 0, endRad: 240 },
  easings.easeOutCubic
);

// random filter
const randomFilter = new TextRandomFilter({
  x: 40,
  y: 60,
  rotate: 5,
});
randomFilter.keyFrames.addKeyFrame(
  0.5,
  { x: 0, y: 0, rotate: 0 },
  easings.easeOutCubic
);

//text.addFilter(roundFilter);
text.addFilter(randomFilter);

bgLayer.objects = [
  new Rect({ x: 0, y: 0, width: width, height: height }, "#000"),
];
textLayer.objects = [text];

// implement
setup(layers);
loop(layers);
