/**
 * A layer is exactly one designed slice, repeated around the origin.
 * Slice coordinates point upward (-Y). Keep geometry within ±π/repeats;
 * neighbouring slices meet at the circular rails, never at a clipped edge.
 */
export type Repetitions = 4 | 6 | 12 | 24;
type Context = CanvasRenderingContext2D;
export type OrnamentLayer = {
  id: string;
  label: string;
  repeats: Repetitions;
  phase: number;
  radius: number;
  innerRadius: number;
  bloom: number;
  drawSlice: (ctx: Context) => void;
};

const GOLD = "#e9ac52";
const PALE = "#ffe5a0";
const COPPER = "#a96932";
const SHADE = "#e9ac5214";
const TAU = Math.PI * 2;

function path(ctx: Context, d: string, width = 2, color = GOLD) {
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke(new Path2D(d));
}

function shape(ctx: Context, d: string, width = 2, color = GOLD) {
  ctx.fillStyle = SHADE;
  ctx.fill(new Path2D(d));
  path(ctx, d, width, color);
}

/** A chased gold rib: a broad gold edge with a fine ivory highlight. */
function rib(ctx: Context, d: string, width = 6) {
  path(ctx, d, width, GOLD);
  path(ctx, d, 1.25, PALE);
}

function arc(
  ctx: Context,
  radius: number,
  repeats: Repetitions,
  width = 1.5,
  color = GOLD,
) {
  ctx.beginPath();
  ctx.arc(
    0,
    0,
    radius,
    -Math.PI / 2 - Math.PI / repeats,
    -Math.PI / 2 + Math.PI / repeats,
  );
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function jewel(ctx: Context, x: number, y: number, r: number) {
  shape(
    ctx,
    `M ${x} ${y - r * 1.8} Q ${x + r * 1.6} ${y} ${x} ${y + r * 1.8} Q ${x - r * 1.6} ${y} ${x} ${y - r * 1.8} Z`,
    1.7,
    PALE,
  );
  ctx.beginPath();
  ctx.arc(x, y, r * 0.3, 0, TAU);
  ctx.fillStyle = PALE;
  ctx.fill();
}

function mirrored(ctx: Context, draw: () => void) {
  for (const sign of [-1, 1]) {
    ctx.save();
    ctx.scale(sign, 1);
    draw();
    ctx.restore();
  }
}

/** A tapered acanthus leaf, with a continuous midrib and paired veinlets. */
function leaf(
  ctx: Context,
  x: number,
  y: number,
  length: number,
  width: number,
  angle = 0,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  shape(
    ctx,
    `M 0 0 C ${-width} ${-length * 0.25} ${-width * 0.72} ${-length * 0.68} 0 ${-length}
    C ${width * 0.72} ${-length * 0.68} ${width} ${-length * 0.25} 0 0 Z`,
    1.65,
  );
  path(
    ctx,
    `M 0 0 Q ${width * 0.12} ${-length * 0.45} 0 ${-length * 0.9}`,
    1,
    PALE,
  );
  for (let i = 1; i <= 3; i++) {
    const t = i / 5;
    const w = width * Math.sin(t * Math.PI) * 0.56;
    path(
      ctx,
      `M 0 ${-length * t} Q ${-w * 0.5} ${-length * (t + 0.08)} ${-w} ${-length * (t + 0.15)}
      M 0 ${-length * t} Q ${w * 0.5} ${-length * (t + 0.08)} ${w} ${-length * (t + 0.15)}`,
      0.85,
      COPPER,
    );
  }
  ctx.restore();
}

/** A true contracting spiral: continuous curvature rather than stacked circles. */
function volute(
  ctx: Context,
  x: number,
  y: number,
  radius: number,
  rotation = 0,
  hand = 1,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(hand, 1);
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const angle = t * Math.PI * 3.25;
    const r = radius * (1 - t) ** 1.25 + 0.5;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2.6;
  ctx.stroke();
  ctx.restore();
}

function drawHeartSlice(ctx: Context) {
  arc(ctx, 35, 12, 2, PALE);
  arc(ctx, 174, 12, 1, COPPER);
  shape(
    ctx,
    `M 0 -39 C -14 -62 -7 -84 -21 -105
    C -42 -137 -24 -159 0 -178 C 24 -159 42 -137 21 -105
    C 7 -84 14 -62 0 -39 Z`,
    2.8,
    PALE,
  );
  shape(
    ctx,
    `M 0 -68 C -2 -96 -17 -109 -16 -128
    Q -12 -149 0 -159 Q 12 -149 16 -128 C 17 -109 2 -96 0 -68 Z`,
    1.5,
  );
  leaf(ctx, 0, -100, 43, 9);
  mirrored(ctx, () => {
    path(ctx, "M 0 -62 C 20 -82 29 -96 26 -117", 1.2, COPPER);
    volute(ctx, 13, -130, 7, -0.2);
  });
  jewel(ctx, 0, -53, 3);
}

function drawSpiralSlice(ctx: Context) {
  arc(ctx, 190, 12, 2.2);
  arc(ctx, 198, 12, 0.9, COPPER);
  // A long serpentine spine folds back on itself around an open teardrop.
  rib(
    ctx,
    `M -30 -198 C -3 -236 44 -246 38 -286
    C 29 -335 -54 -343 -65 -395 C -76 -453 -9 -478 41 -450
    C 78 -430 61 -385 31 -389 C 8 -392 6 -418 23 -427`,
    6,
  );
  path(
    ctx,
    `M -21 -207 C 13 -237 58 -257 47 -292
    C 34 -337 -35 -352 -43 -394 C -52 -436 -15 -460 23 -447
    C 52 -437 54 -413 37 -405`,
    1.8,
    PALE,
  );
  rib(
    ctx,
    `M 12 -211 C 73 -256 92 -303 69 -340
    C 44 -381 75 -408 84 -439 C 90 -461 86 -480 73 -496`,
    3.8,
  );
  shape(
    ctx,
    `M -18 -265 C -58 -292 -62 -327 -38 -352
    C -43 -313 -10 -308 -18 -265 Z`,
    2.4,
  );
  path(ctx, "M -18 -279 Q -42 -313 -38 -336", 1.1, PALE);
  shape(
    ctx,
    `M 57 -344 C 100 -365 119 -414 97 -459
    C 102 -413 68 -403 57 -344 Z`,
    2.2,
  );
  leaf(ctx, 13, -242, 48, 12, -0.4);
  leaf(ctx, 62, -301, 41, 10, 0.55);
  leaf(ctx, -64, -417, 53, 13, -0.42);
  volute(ctx, -18, -396, 22, -Math.PI / 2, -1);
  volute(ctx, 67, -363, 13, Math.PI / 2);
  path(ctx, "M -44 -475 Q 1 -504 47 -478 M -34 -480 Q 0 -493 29 -483", 1.6);
  jewel(ctx, 3, -471, 5);
  jewel(ctx, 31, -319, 3);
}

function drawBraidSlice(ctx: Context) {
  for (const [r, w, c] of [
    [509, 3, PALE],
    [517, 1, COPPER],
    [574, 1, COPPER],
    [584, 4, GOLD],
    [594, 1, PALE],
  ] as const)
    arc(ctx, r, 24, w, c);
  // Two interlaced ribbons resolve into a pointed quatrefoil in every cell.
  path(
    ctx,
    `M -69 -522 C -48 -519 -46 -565 -18 -565
    C 2 -565 2 -530 21 -530 C 43 -530 48 -574 74 -570`,
    3.1,
  );
  path(
    ctx,
    `M -69 -554 C -45 -562 -44 -528 -20 -528
    C 2 -528 0 -565 21 -565 C 44 -565 49 -537 73 -539`,
    1.8,
    PALE,
  );
  shape(
    ctx,
    "M 0 -522 Q 12 -536 25 -547 Q 12 -559 0 -575 Q -12 -559 -25 -547 Q -12 -536 0 -522 Z",
    1.6,
  );
  leaf(ctx, 0, -535, 24, 7);
  mirrored(ctx, () => {
    volute(ctx, 43, -548, 8, 0.6);
    jewel(ctx, 59, -548, 2.5);
  });
}

function drawCrestSlice(ctx: Context) {
  arc(ctx, 618, 6, 1.6, COPPER);
  mirrored(ctx, () => {
    // Broad, open palmette silhouette with nested, independently flowing ribs.
    rib(
      ctx,
      `M 0 -965 C 30 -877 54 -858 117 -842
      C 202 -821 230 -765 194 -720 C 165 -683 119 -703 128 -737
      C 133 -758 155 -763 168 -750`,
      5,
    );
    path(
      ctx,
      `M 0 -936 C 23 -868 61 -838 112 -825
      C 177 -809 210 -769 180 -735 C 168 -722 151 -724 148 -735`,
      2,
    );
    path(
      ctx,
      `M 0 -909 C 11 -853 32 -823 84 -794
      C 135 -766 113 -702 69 -676 C 43 -660 16 -657 0 -632`,
      2.1,
      PALE,
    );
    rib(
      ctx,
      `M 0 -630 C 75 -686 91 -640 162 -665
      C 207 -681 227 -718 248 -745 C 273 -776 309 -769 328 -737
      C 293 -752 272 -730 286 -708 C 300 -685 330 -697 330 -719`,
      4,
    );
    path(
      ctx,
      `M 25 -631 C 96 -658 111 -628 177 -651
      C 237 -673 249 -717 270 -730`,
      1.6,
    );
    path(
      ctx,
      `M 22 -879 C 84 -864 93 -923 113 -938
      C 107 -883 136 -870 167 -859 C 205 -846 234 -837 247 -811`,
      2.8,
    );
    leaf(ctx, 86, -831, 72, 18, 0.46);
    leaf(ctx, 170, -799, 62, 16, 0.88);
    leaf(ctx, 82, -681, 87, 22, -0.24);
    leaf(ctx, 229, -692, 64, 17, 0.68);
    leaf(ctx, 43, -754, 57, 16, -0.38);
    volute(ctx, 49, -842, 20, -0.4, -1);
    volute(ctx, 90, -746, 25, 0.5);
    volute(ctx, 220, -778, 19, -0.2, -1);
    volute(ctx, 181, -697, 15, 1.1);
    shape(ctx, "M 16 -704 Q 40 -739 17 -777 Q 2 -744 16 -704 Z", 1.5);
    jewel(ctx, 123, -793, 8);
    jewel(ctx, 266, -692, 5);
    jewel(ctx, 55, -879, 4);
    // These tangent stems meet the next slice on the 30-degree seam.
    rib(ctx, "M 162 -665 C 225 -619 291 -654 350 -606", 3);
    shape(
      ctx,
      "M 258 -641 C 277 -605 318 -579 350 -606 C 324 -641 291 -662 258 -641 Z",
      1.8,
    );
    path(ctx, "M 264 -638 Q 306 -617 342 -609", 1.1, PALE);
    volute(ctx, 287, -672, 17, -0.5);
    leaf(ctx, 229, -654, 54, 13, -0.85);
  });
  shape(
    ctx,
    "M 0 -939 C -10 -891 -27 -870 0 -837 C 27 -870 10 -891 0 -939 Z",
    2.5,
    PALE,
  );
  leaf(ctx, 0, -843, 57, 9);
  jewel(ctx, 0, -814, 8);
  shape(
    ctx,
    "M 0 -790 C -43 -755 -46 -701 0 -674 C 46 -701 43 -755 0 -790 Z",
    3,
  );
  shape(
    ctx,
    "M 0 -774 C -25 -746 -26 -713 0 -693 C 26 -713 25 -746 0 -774 Z",
    1.2,
    PALE,
  );
  jewel(ctx, 0, -734, 11);
}

function drawLaceSlice(ctx: Context) {
  for (const [r, w] of [
    [987, 1.5],
    [998, 3],
    [1086, 3],
    [1097, 1.3],
  ] as const)
    arc(ctx, r, 24, w);
  mirrored(ctx, () => {
    rib(
      ctx,
      "M 0 -1000 C 17 -1034 53 -1025 60 -1053 C 67 -1084 112 -1089 136 -1074",
      3,
    );
    path(
      ctx,
      "M 0 -1083 C 23 -1051 46 -1066 62 -1037 C 77 -1009 106 -1001 130 -1015",
      1.6,
      PALE,
    );
    volute(ctx, 37, -1048, 14, -0.2, -1);
    leaf(ctx, 89, -1020, 39, 11, 0.7);
    jewel(ctx, 103, -1050, 4);
  });
  shape(
    ctx,
    "M 0 -1008 Q 21 -1025 24 -1043 Q 20 -1060 0 -1077 Q -20 -1060 -24 -1043 Q -21 -1025 0 -1008 Z",
    2,
  );
  jewel(ctx, 0, -1043, 8);
}

function drawCardinalSlice(ctx: Context) {
  arc(ctx, 1121, 4, 2, COPPER);
  arc(ctx, 1131, 4, 1.2);
  mirrored(ctx, () => {
    // One 90-degree arabesque: a pointed ogee canopy, scrollwork and leaf fans.
    rib(
      ctx,
      `M 0 -1460 C 66 -1339 154 -1431 237 -1321
      C 326 -1202 445 -1328 547 -1217 C 664 -1090 831 -1104 969 -969`,
      5.3,
    );
    path(
      ctx,
      `M 0 -1433 C 65 -1327 154 -1401 223 -1306
      C 322 -1178 448 -1302 535 -1201 C 650 -1067 823 -1080 957 -957`,
      1.7,
      PALE,
    );
    path(
      ctx,
      `M 0 -1150 C 80 -1215 149 -1115 221 -1172
      C 298 -1232 246 -1306 203 -1280 C 166 -1255 207 -1217 223 -1246`,
      4,
    );
    path(
      ctx,
      `M 18 -1151 C 87 -1193 153 -1099 230 -1151
      C 322 -1213 283 -1303 240 -1316`,
      1.4,
      PALE,
    );
    rib(
      ctx,
      `M 34 -1306 C 115 -1321 132 -1196 214 -1204
      C 300 -1211 365 -1135 330 -1089 C 317 -1067 287 -1078 301 -1096`,
      3.5,
    );
    path(
      ctx,
      `M 286 -1090 C 368 -1122 430 -1110 489 -1171
      C 537 -1220 590 -1189 584 -1151 C 580 -1124 543 -1128 551 -1149`,
      3.4,
    );
    path(
      ctx,
      `M 340 -1093 C 431 -1076 452 -1141 506 -1134
      C 555 -1129 574 -1085 638 -1054 C 706 -1022 727 -972 699 -951`,
      2.8,
    );
    path(
      ctx,
      `M 459 -1044 C 545 -1083 562 -991 653 -1002
      C 725 -1011 760 -937 828 -924`,
      2.3,
      PALE,
    );
    leaf(ctx, 47, -1329, 78, 20, 0.15);
    leaf(ctx, 129, -1277, 90, 24, 0.65);
    leaf(ctx, 359, -1157, 101, 27, 0.88);
    leaf(ctx, 447, -1162, 67, 18, 0.5);
    leaf(ctx, 657, -1038, 109, 26, 0.88);
    leaf(ctx, 791, -967, 83, 23, 1.18);
    volute(ctx, 92, -1234, 31, -0.7, -1);
    volute(ctx, 378, -1190, 29, 0.1, -1);
    volute(ctx, 616, -1089, 31, -0.25);
    volute(ctx, 779, -1011, 23, -0.3);
    jewel(ctx, 258, -1197, 8);
    jewel(ctx, 472, -1096, 7);
    jewel(ctx, 725, -988, 5);
  });
  shape(
    ctx,
    "M 0 -1425 C -31 -1379 -45 -1344 0 -1313 C 45 -1344 31 -1379 0 -1425 Z",
    2.7,
  );
  shape(
    ctx,
    "M 0 -1389 C -16 -1364 -23 -1347 0 -1330 C 23 -1347 16 -1364 0 -1389 Z",
    1.2,
    PALE,
  );
  shape(
    ctx,
    "M 0 -1304 C -72 -1254 -68 -1200 0 -1170 C 68 -1200 72 -1254 0 -1304 Z",
    3.3,
  );
  shape(
    ctx,
    "M 0 -1285 C -49 -1249 -42 -1211 0 -1188 C 42 -1211 49 -1249 0 -1285 Z",
    1.2,
    PALE,
  );
  leaf(ctx, 0, -1211, 52, 17);
  jewel(ctx, 0, -1150, 6);
}

function drawOuterSlice(ctx: Context) {
  arc(ctx, 1500, 4, 1.3, COPPER);
  arc(ctx, 1510, 4, 2.4);
  arc(ctx, 1688, 4, 1.5);
  arc(ctx, 1698, 4, 0.8, COPPER);
  // Seven sub-motifs belong to this single quadrant, each with a distinct scale.
  // The complete quadrant (not its sub-motif) is the repeated unit.
  for (let i = -3; i <= 3; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 16);
    const reach = i === 0 ? 1718 : 1628 + (3 - Math.abs(i)) * 17;
    mirrored(ctx, () => {
      path(
        ctx,
        `M 0 -1516 C 45 -1541 23 ${-reach + 26} 0 ${-reach}
        C 50 ${-reach + 40} 87 -1548 147 -1513`,
        i === 0 ? 3.6 : 2.3,
      );
      path(
        ctx,
        `M 8 -1525 C 32 -1562 18 ${-reach + 38} 0 ${-reach + 22}`,
        1,
        PALE,
      );
      volute(ctx, 51, -1559, 20, -0.5, -1);
      leaf(ctx, 79, -1542, 52, 12, 0.72);
    });
    leaf(ctx, 0, -1537, reach - 1572, 17);
    jewel(ctx, 0, -1525, 4);
    ctx.restore();
  }
  jewel(ctx, 0, -1692, 5);
}

export const ORNAMENT_LAYERS = [
  {
    id: "heart",
    innerRadius: 32,
    radius: 190,
    label: "Lotus heart",
    repeats: 12,
    phase: 0,
    bloom: 0.32,
    drawSlice: drawHeartSlice,
  },
  {
    id: "wheel",
    innerRadius: 185,
    radius: 505,
    label: "Serpentine spiral",
    repeats: 12,
    phase: 0,
    bloom: 0.38,
    drawSlice: drawSpiralSlice,
  },
  {
    id: "braid",
    innerRadius: 507,
    radius: 604,
    label: "Interwoven band",
    repeats: 24,
    phase: 0,
    bloom: 0.45,
    drawSlice: drawBraidSlice,
  },
  {
    id: "crown",
    innerRadius: 609,
    radius: 976,
    label: "Flame palmettes",
    repeats: 6,
    phase: 0,
    bloom: 0.3,
    drawSlice: drawCrestSlice,
  },
  {
    id: "lace",
    innerRadius: 980,
    radius: 1105,
    label: "Orbital lace",
    repeats: 24,
    phase: Math.PI / 24,
    bloom: 0.33,
    drawSlice: drawLaceSlice,
  },
  {
    id: "cardinal",
    innerRadius: 1110,
    radius: 1480,
    label: "Cardinal arabesques",
    repeats: 4,
    phase: 0,
    bloom: 0.35,
    drawSlice: drawCardinalSlice,
  },
  {
    id: "outer",
    innerRadius: 1490,
    radius: 1740,
    label: "Celestial crown",
    repeats: 4,
    phase: Math.PI / 4,
    bloom: 0.3,
    drawSlice: drawOuterSlice,
  },
] as const satisfies readonly OrnamentLayer[];

export type OrnamentId = (typeof ORNAMENT_LAYERS)[number]["id"];

export function drawRepeatedSlice(ctx: Context, layer: OrnamentLayer) {
  for (let i = 0; i < layer.repeats; i++) {
    ctx.save();
    ctx.rotate(layer.phase + (i * TAU) / layer.repeats);
    layer.drawSlice(ctx);
    ctx.restore();
  }
}
