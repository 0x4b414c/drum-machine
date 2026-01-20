"use strict";

const keys = document.getElementById("keys");

const audioCtx = new AudioContext();

const sampleNames = [
  "kick1",
  "kick2",
  "snare1",
  "snare2",
  "tom1",
  "tom2",
  "ftom",
  "ride1",
  "ride2",
  "hihat1",
  "hihat2",
  "crash1",
  "crash2",
  "rim",
];

const noteSampleMap = {
  // 0: "kick1",
  0: "kick2",

  1: "rim",
  2: "snare2",
  4: "snare1",

  5: "tom1",
  7: "tom2",
  9: "ftom",

  6: "hihat1",
  8: "hihat2",

  10: "crash1",
  11: "crash2",

  12: "ride1",
  13: "ride2",
};

const keyMap = {
  z: 0,
  s: 1,
  x: 2,
  d: 3,
  c: 4,
  v: 5,
  g: 6,
  b: 7,
  h: 8,
  n: 9,
  j: 10,
  m: 11,
  ",": 12,
  q: 12,
  l: 13,
  2: 13,
  ".": 14,
  w: 14,
  ";": 15,
  3: 15,
  "/": 16,
  e: 16,
  r: 17,
  5: 18,
  t: 19,
  6: 20,
  y: 21,
  7: 22,
  u: 23,
  i: 24,
  9: 25,
  o: 26,
  0: 27,
  p: 28,
};

const samples = {};

async function loadSample(name) {
  try {
    const res = await fetch(`/samples/${name}.wav`);
    if (!res.ok) {
      throw new Error(`Unable to fetch audio sample: ${name} - ${res.status} `);
    }

    const arrayBuffer = await res.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    samples[name] = audioBuffer;
  } catch (error) {
    console.error(error.message, name);
  } finally {
  }
}

Promise.all(sampleNames.map(loadSample));

function styleNote(el, status) {
  if (status) {
    el.classList.add("hit");
  } else {
    el.classList.remove("hit");
  }
}

function playNote(note) {
  const sample = noteSampleMap[note];
  if (!sample) return;
  const src = audioCtx.createBufferSource();
  src.buffer = samples[sample];
  src.connect(audioCtx.destination);
  src.start(audioCtx.currentTime);
}

function hitHandler(e) {
  let note, el;
  const eventType = e.type;
  const status = eventType.endsWith("down");

  if (eventType.startsWith("pointer")) {
    el = e.target;
    note = el.dataset.note;
  }

  if (eventType.startsWith("key")) {
    const key = e.key;
    note = keyMap[key];
    el = document.getElementById(`key-${note}`);
  }
  if (note == undefined || !el) return;

  styleNote(el, status);
  status && playNote(note);
}

document.addEventListener("pointerup", hitHandler);
document.addEventListener("pointerdown", hitHandler);
document.addEventListener("keyup", hitHandler);
document.addEventListener("keydown", hitHandler);
