import React, { useEffect, useRef } from 'react';

// Exact Vertex Shader (#version 300 es) from reference site
const VERTEX_SHADER_SOURCE = `#version 300 es
precision highp float;

layout(location = 0) in vec2 aHome;   // 0..1 inside the anchor rect
layout(location = 1) in vec3 aAir;    // x,y 0..1 over the canvas, z = depth (0 near, 1 far)
layout(location = 2) in vec4 aInfo;   // brightness, delay, duration, phase
layout(location = 3) in vec3 aCell;   // atlas window origin (uv), kind (0 tile, 1 dust)

uniform vec2 uRes;       // canvas, CSS px
uniform vec4 uRect;      // anchor x, y, w, h in canvas CSS px
uniform float uCell;     // tile pitch, CSS px
uniform float uDpr;
uniform float uTime;     // seconds, always running
uniform float uReveal;   // seconds since play
uniform float uScatter;  // 0 = face, 1 = blown back into the air
uniform vec2 uMouse;     // CSS px, far away when absent

out vec2 vCell;
out float vBright;
out float vLand;
out float vAlpha;
out float vPhase;

float inOut(float t) {
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

void main() {
  float bright = aInfo.x;
  float delay  = aInfo.y;
  float dur    = aInfo.z;
  float phase  = aInfo.w;
  float depth  = aAir.z;
  bool dust    = aCell.z > 0.5;

  // Air position: a slow float, nearer specks drift further.
  vec2 drift = vec2(sin(uTime * 0.31 + phase * 6.283), cos(uTime * 0.23 + phase * 9.1))
             * (6.0 + 22.0 * (1.0 - depth));
  vec2 air  = aAir.xy * uRes + drift;
  vec2 home = uRect.xy + aHome * uRect.zw;

  // Reveal: fade in as a speck (staggered), then fly home.
  float appear = smoothstep(0.0, 0.8, uReveal - delay * 0.35);
  float fly    = dust ? 0.0 : clamp((uReveal - delay) / dur, 0.0, 1.0);
  float e      = inOut(fly);

  // Scroll: tiles leave in a ragged order rather than all at once.
  float q = clamp(uScatter * 1.7 - phase * 0.7, 0.0, 1.0);
  q = q * q;

  float k = e * (1.0 - q);              // 1 = sitting in the face
  vec2 pos = mix(air, home, k);

  // A curved path reads as gathered, a straight one as tweened.
  vec2 d = home - air;
  pos += vec2(-d.y, d.x) * 0.18 * sin(3.14159 * k) * (phase - 0.5);

  // The pointer parts the tiles it passes over (110px radius).
  vec2 m = pos - uMouse;
  float ml = length(m);
  pos += (ml > 0.001 ? m / ml : vec2(0.0)) * smoothstep(110.0, 0.0, ml) * 16.0 * k;

  float land  = smoothstep(0.55, 1.0, k);
  float speck = mix(2.2, 0.9, depth);
  float tile  = uCell * (0.25 + 0.7 * bright);
  float size  = mix(speck, tile, land);

  float dustA = dust ? mix(0.55, 0.22, smoothstep(2.0, 4.0, uReveal)) : 1.0;
  vAlpha  = appear * mix(0.25 + 0.55 * (1.0 - depth), 1.0, land) * dustA;
  vBright = bright;
  vLand   = land;
  vCell   = aCell.xy;
  vPhase  = phase;

  vec2 clip = pos / uRes * 2.0 - 1.0;
  gl_Position  = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = max(size * uDpr, 1.0);
}
`;

// Exact Fragment Shader (#version 300 es) from reference site
const FRAGMENT_SHADER_SOURCE = `#version 300 es
precision highp float;

uniform sampler2D uAtlas;
uniform vec2 uWin;     // window size in atlas uv (56/1024, 56/640)
uniform float uTime;

in vec2 vCell;
in float vBright;
in float vLand;
in float vAlpha;
in float vPhase;
out vec4 outColor;

void main() {
  vec3 c = texture(uAtlas, vCell + gl_PointCoord * uWin).rgb;
  // Hue from the screenshot, value from the portrait: normalise the sample to
  // full brightness (a dark UI grey becomes white, a dim blue a vivid one),
  // keep some of its real detail, then let the face decide how bright it is.
  float peak = max(max(c.r, c.g), max(c.b, 0.06));
  vec3 hue = c / peak;
  vec3 tile = mix(hue, min(c * 1.8, 1.0), 0.35);
  tile = mix(tile, vec3(1.0), 0.15);
  float twinkle = 0.9 + 0.1 * sin(uTime * 1.6 + vPhase * 47.0);
  tile *= (0.1 + 0.95 * vBright) * twinkle;

  vec3 speck = vec3(0.9, 0.92, 1.0);
  vec3 rgb = mix(speck, tile, vLand);
  outColor = vec4(rgb * vAlpha, vAlpha);
}
`;

// Reference Atlas Dimensions
const ATLAS_W = 1024;
const ATLAS_H = 640;
const TILE_WINDOW = 56;
const DUST_RATIO = 0.07; // 7% dust specks

const ATLAS_CROPS = [
  [0.26, 0.17, 0.48, 0.37],
  [0.53, 0.08, 0.15, 0.55],
  [0.40, 0.14, 0.16, 0.72],
  [0.20, 0.22, 0.40, 0.40]
];

const DEFAULT_PROJECT_IMAGES = [
  '/assets/veribyte.png',
  '/assets/cyberscope.png'
];

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('Shader compilation failed: ' + info);
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(prog);
    gl.deleteProgram(prog);
    throw new Error('Shader program linking failed: ' + info);
  }
  return prog;
}

function smoothStep(minVal, maxVal, val) {
  const r = Math.min(1.0, Math.max(0.0, (val - minVal) / (maxVal - minVal)));
  return r * r * (3.0 - 2.0 * r);
}

// Reference cell pitch calculation based on portrait anchor width
const getCellPitch = (w) => Math.min(6.0, Math.max(3.5, w / 200.0));

// Exact reference portrait luminance and cell sampling function ($i)
function samplePortrait(img, anchorWidth, cropFraction) {
  const cellPitch = getCellPitch(anchorWidth);
  const cols = Math.max(20, Math.round(anchorWidth / cellPitch));
  const rows = Math.round((cols * img.naturalHeight) / img.naturalWidth);

  const off = document.createElement('canvas');
  off.width = cols;
  off.height = rows;
  const s = off.getContext('2d', { willReadFrequently: true });
  s.imageSmoothingQuality = 'high';
  s.drawImage(img, 0, 0, cols, rows);
  const c = s.getImageData(0, 0, cols, rows).data;

  const home = [];
  const air = [];
  const info = [];
  const cellAttr = [];
  const uWinP = TILE_WINDOW / ATLAS_W;
  const uWinM = TILE_WINDOW / ATLAS_H;
  let maxSettleTime = 0;

  const addParticle = (homeX, homeY, brightness, isDust) => {
    home.push(homeX, homeY);
    air.push(Math.random() * 1.2 - 0.1, Math.random() * 1.2 - 0.1, Math.random());
    const delay = 0.35 + Math.random() * 1.0 + homeY * 0.45;
    const duration = 1.35 + Math.random() * 0.55;
    if (!isDust) {
      maxSettleTime = Math.max(maxSettleTime, delay + duration);
    }
    info.push(brightness, delay, duration, Math.random());
    cellAttr.push(
      Math.random() * (1.0 - uWinP),
      Math.random() * (1.0 - uWinM),
      isDust ? 1.0 : 0.0
    );
  };

  const lums = new Float32Array(cols * rows);
  for (let e = 0; e < cols * rows; e++) {
    const t = e * 4;
    // Luminance multiplied by alpha channel
    lums[e] =
      ((0.2126 * c[t] + 0.7152 * c[t + 1] + 0.0722 * c[t + 2]) / 255.0) *
      (c[t + 3] / 255.0);
  }

  // 2nd percentile to 97th percentile normalization for crisp facial dynamic range
  const validLums = Array.from(lums).filter((e) => e >= 0.035).sort((a, b) => a - b);
  const p02 = validLums[Math.floor(validLums.length * 0.02)] ?? 0;
  const p97 = validLums[Math.floor(validLums.length * 0.97)] ?? 1;

  // Crop below the hero fold to concentrate resolution on head, face, and chest
  const cropRows = Math.min(rows, Math.ceil(rows * cropFraction));

  for (let y = 0; y < cropRows; y++) {
    for (let x = 0; x < cols; x++) {
      const n = lums[y * cols + x];
      // Skip background, and stipple threshold with 45% random dropout for dark shadows
      if (n < 0.035 || (n < 0.08 && Math.random() < 0.45)) continue;

      const norm = Math.min(1.0, Math.max(0.0, (n - p02) / (p97 - p02)));
      // Photographic contrast S-curve
      const bright = 0.2 * norm + 0.8 * smoothStep(0.1, 0.55, norm);
      addParticle((x + 0.5) / cols, (y + 0.5) / rows, bright, false);
    }
  }

  // Ambient starfield dust particles (7% of portrait tile count)
  const portraitCount = home.length / 2;
  const dustCount = Math.round(portraitCount * DUST_RATIO);
  for (let e = 0; e < dustCount; e++) {
    addParticle(0.5, 0.5, 0.3, true);
  }

  return {
    settle: maxSettleTime,
    cell: cellPitch,
    count: home.length / 2,
    home: new Float32Array(home),
    air: new Float32Array(air),
    info: new Float32Array(info),
    cellAttr: new Float32Array(cellAttr)
  };
}

export default function HeroWebGL({
  runId = 0,
  src = '/assets/portrait_cutout.webp',
  thumbs = DEFAULT_PROJECT_IMAGES,
  anchorRef,
  play = false,
  label = 'Portrait of Ashmit made of tiles from his projects',
  className = ''
}) {
  const canvasRef = useRef(null);
  const startTimeRef = useRef(null);
  const playRef = useRef(play);
  playRef.current = play;

  // Reset clock on replay
  useEffect(() => {
    startTimeRef.current = null;
  }, [runId]);

  // When play becomes true, begin assembly timeline
  useEffect(() => {
    if (play && startTimeRef.current === null) {
      startTimeRef.current = performance.now() / 1000;
    }
  }, [play]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const anchor = anchorRef?.current;
    if (!canvas || !anchor) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false
    });

    if (!gl) {
      console.warn('WebGL2 not supported');
      return;
    }

    let program;
    try {
      program = createProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);
    } catch (e) {
      console.error(e);
      return;
    }

    gl.useProgram(program);

    // Uniform locations
    const loc = {
      res: gl.getUniformLocation(program, 'uRes'),
      rect: gl.getUniformLocation(program, 'uRect'),
      cell: gl.getUniformLocation(program, 'uCell'),
      dpr: gl.getUniformLocation(program, 'uDpr'),
      time: gl.getUniformLocation(program, 'uTime'),
      reveal: gl.getUniformLocation(program, 'uReveal'),
      scatter: gl.getUniformLocation(program, 'uScatter'),
      mouse: gl.getUniformLocation(program, 'uMouse'),
      atlas: gl.getUniformLocation(program, 'uAtlas'),
      win: gl.getUniformLocation(program, 'uWin')
    };

    // VAO & Buffers
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const buffers = ['aHome', 'aAir', 'aInfo', 'aCell'].map((name, i) => {
      const buf = gl.createBuffer();
      const attrib = gl.getAttribLocation(program, name);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(attrib);
      gl.vertexAttribPointer(attrib, [2, 3, 4, 3][i], gl.FLOAT, false, 0, 0);
      return buf;
    });

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(loc.win, TILE_WINDOW / ATLAS_W, TILE_WINDOW / ATLAS_H);

    // Build 1024x640 Texture Atlas from project thumbnails
    // Build 1024x640 Texture Atlas from project thumbnails with vibrant fallback base
    const atlasCanvas = document.createElement('canvas');
    atlasCanvas.width = ATLAS_W;
    atlasCanvas.height = ATLAS_H;
    const actx = atlasCanvas.getContext('2d');
    
    // Rich tech gradient base so particles never fade out to pitch black
    const grad = actx.createLinearGradient(0, 0, ATLAS_W, ATLAS_H);
    grad.addColorStop(0, '#00e5ff');   // electric cyan
    grad.addColorStop(0.35, '#818cf8'); // vibrant indigo
    grad.addColorStop(0.65, '#f59e0b'); // warm amber
    grad.addColorStop(1, '#3b82f6');   // deep cobalt blue
    actx.fillStyle = grad;
    actx.fillRect(0, 0, ATLAS_W, ATLAS_H);

    const quadW = ATLAS_W / 2; // 512
    const quadH = ATLAS_H / 2; // 320

    const atlasTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlasCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(loc.atlas, 0);

    const updateAtlas = (loadedImgs) => {
      const valid = loadedImgs.filter(Boolean);
      if (valid.length === 0) return;

      // Always populate all 4 quadrants by cycling available images
      for (let quad = 0; quad < 4; quad++) {
        const img = valid[quad % valid.length];
        let [cx, cy, cw, ch] = [0.22, 0.16, 0.54, 0.56];
        if (img.src && img.src.includes('veribyte')) {
          cx = quad % 2 === 0 ? 0.23 : 0.27;
          cy = quad < 2 ? 0.14 : 0.30;
          cw = 0.52;
          ch = 0.48;
        } else if (img.src && img.src.includes('cyberscope')) {
          cx = quad % 2 === 0 ? 0.23 : 0.25;
          cy = quad < 2 ? 0.18 : 0.26;
          cw = 0.45;
          ch = 0.48;
        }

        const nw = img.naturalWidth || img.width;
        const nh = img.naturalHeight || img.height;
        actx.drawImage(
          img,
          cx * nw,
          cy * nh,
          cw * nw,
          ch * nh,
          (quad % 2) * quadW,
          Math.floor(quad / 2) * quadH,
          quadW,
          quadH
        );
      }

      gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlasCanvas);
      gl.generateMipmap(gl.TEXTURE_2D);
    };

    const loadedImgs = [];
    let imgLoadCount = 0;
    const activeThumbs = (thumbs && thumbs.length > 0) ? thumbs : DEFAULT_PROJECT_IMAGES;
    activeThumbs.forEach((url, idx) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        loadedImgs[idx] = img;
        imgLoadCount++;
        if (imgLoadCount === activeThumbs.length) {
          updateAtlas(loadedImgs);
        }
      };
      img.onerror = () => {
        imgLoadCount++;
        if (imgLoadCount === activeThumbs.length) {
          updateAtlas(loadedImgs);
        }
      };
      img.src = url;
    });

    let particleCount = 0;
    let cellPitch = 4.0;
    let maxSettleTime = 3.2;
    let lastSampledW = -1;
    let portraitImg = null;

    // Direct dynamic sampling matching reference site
    const sampleAndUpload = () => {
      if (!portraitImg) return;
      const anchorBox = anchor.getBoundingClientRect();
      const anchorW = anchorBox.width;
      if (anchorW < 10 || Math.abs(anchorW - lastSampledW) < 1) return;
      lastSampledW = anchorW;

      const canvasBox = canvas.getBoundingClientRect();
      const cropFraction = Math.max(0, Math.min(1, (canvasBox.bottom - anchorBox.top) / anchorBox.height));
      const res = samplePortrait(portraitImg, anchorW, cropFraction);

      particleCount = res.count;
      cellPitch = res.cell;
      maxSettleTime = res.settle;

      [res.home, res.air, res.info, res.cellAttr].forEach((arr, i) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i]);
        gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
      });
    };

    const pImg = new Image();
    pImg.crossOrigin = 'anonymous';
    pImg.onload = () => {
      portraitImg = pImg;
      sampleAndUpload();
    };
    pImg.src = src;

    // Pointer uniform tracking (110px repulsion radius)
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
      if (mouse.x < -999) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
    };
    const onPointerLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    let isRunning = true;
    let animId;
    const globalStartTime = performance.now() / 1000;

    const render = () => {
      if (!isRunning) return;

      if (!particleCount || startTimeRef.current === null) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        animId = requestAnimationFrame(render);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const canvasBox = canvas.getBoundingClientRect();
      const targetW = Math.round(canvasBox.width * dpr);
      const targetH = Math.round(canvasBox.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      // Check if viewport changed width to resample dynamically
      sampleAndUpload();

      const anchorBox = anchor.getBoundingClientRect();
      const now = performance.now() / 1000;

      // Authentic reference scroll scatter formula: -canvasBox.top / (canvasBox.height * 0.7)
      const scrollScatter = Math.min(1.0, Math.max(0.0, -canvasBox.top / (canvasBox.height * 0.70)));

      // Smooth pointer lerp
      mouse.x += (mouse.tx - mouse.x) * 0.18;
      mouse.y += (mouse.ty - mouse.y) * 0.18;

      gl.viewport(0, 0, targetW, targetH);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.bindVertexArray(vao);

      gl.uniform2f(loc.res, canvasBox.width, canvasBox.height);
      gl.uniform4f(
        loc.rect,
        anchorBox.left - canvasBox.left,
        anchorBox.top - canvasBox.top,
        anchorBox.width,
        anchorBox.height
      );
      gl.uniform1f(loc.cell, cellPitch);
      gl.uniform1f(loc.dpr, dpr);
      gl.uniform1f(loc.time, now - globalStartTime);
      gl.uniform1f(loc.reveal, now - startTimeRef.current);
      gl.uniform1f(loc.scatter, scrollScatter);
      gl.uniform2f(loc.mouse, mouse.x, mouse.y);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
      gl.uniform1i(loc.atlas, 0);

      gl.drawArrays(gl.POINTS, 0, particleCount);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      gl.deleteProgram(program);
      gl.deleteTexture(atlasTexture);
      buffers.forEach((buf) => gl.deleteBuffer(buf));
      gl.deleteVertexArray(vao);
    };
  }, [src, JSON.stringify(thumbs)]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
