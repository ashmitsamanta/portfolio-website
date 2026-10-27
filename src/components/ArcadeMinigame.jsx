import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.config';

// 5x5 bitmap font for the Canvas Brick Breaker ("HELLO WORLD")
const PIXEL_FONT = {
  A: ['01110', '10001', '11111', '10001', '10001'],
  B: ['11110', '10001', '11110', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '11110', '10000', '11111'],
  F: ['11111', '10000', '11110', '10000', '10000'],
  G: ['01111', '10000', '10011', '10001', '01111'],
  H: ['10001', '10001', '11111', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '10010', '01100'],
  K: ['10001', '10010', '11100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001'],
  O: ['01110', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '11110', '10000', '10000'],
  Q: ['01110', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '11110', '10010', '10001'],
  S: ['01111', '10000', '01110', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10101', '11011', '10001'],
  X: ['10001', '01010', '00100', '01010', '10001'],
  Y: ['10001', '01010', '00100', '00100', '00100'],
  Z: ['11111', '00010', '00100', '01000', '11111'],
  ' ': ['000', '000', '000', '000', '000']
};

export default function ArcadeMinigame({
  config = PORTFOLIO_CONFIG,
  activeProjectModal,
  showContactFormModal
}) {
  // Canvas Brick Breaker Game ("Break it if you can. It still ships.")
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('idle');
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [bricksLeft, setBricksLeft] = useState(0);
  const gameRef = useRef({
    status: 'idle',
    lives: 3,
    score: 0,
    bricksAlive: 0,
    paddleX: 260,
    paddleW: 116,
    paddleH: 9,
    ballX: 310,
    ballY: 260,
    vx: 4.2,
    vy: -4.2,
    ballR: 5,
    bricks: [],
    particles: [],
    keys: { left: false, right: false }
  });

  const buildWordBricks = useCallback(
    (width) => {
      const topWord = (config.personal.gameWordTop || 'HELLO').toUpperCase().slice(0, 8);
      const botWord = (config.personal.gameWordBottom || 'WORLD').toUpperCase().slice(0, 8);
      const words = [topWord, botWord];
      const bricks = [];

      const cellSize = Math.max(7, Math.min(13, Math.floor((width - 120) / 42)));
      const gap = 3;

      words.forEach((word, wordIdx) => {
        const chars = word.split('');
        const totalCols = chars.reduce(
          (acc, ch) => acc + (PIXEL_FONT[ch] || PIXEL_FONT[' '])[0].length + 1,
          -1
        );
        const rowWidth = totalCols * (cellSize + gap);
        const startX = Math.max(20, (width - rowWidth) / 2);
        const startY = 58 + wordIdx * (5 * (cellSize + gap) + 26);

        let colCursor = 0;
        chars.forEach((ch) => {
          const glyph = PIXEL_FONT[ch] || PIXEL_FONT[' '];
          const glyphCols = glyph[0].length;
          for (let r = 0; r < 5; r++) {
            for (let c = 0; c < glyphCols; c++) {
              if (glyph[r][c] === '1') {
                bricks.push({
                  x: startX + (colCursor + c) * (cellSize + gap),
                  y: startY + r * (cellSize + gap),
                  w: cellSize,
                  h: cellSize,
                  alive: true,
                  color: '#FFFFFF'
                });
              }
            }
          }
          colCursor += glyphCols + 1;
        });
      });

      return bricks;
    },
    [config.personal.gameWordTop, config.personal.gameWordBottom]
  );

  const drawGame = useCallback((ctx, w, h, g, dtScale = 1) => {
    const dpr = g.dpr || 1;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    g.bricks.forEach((b) => {
      if (!b.alive) return;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    for (let i = g.particles.length - 1; i >= 0; i--) {
      const pt = g.particles[i];
      if (g.status === 'playing') {
        pt.x += pt.vx * dtScale;
        pt.y += pt.vy * dtScale;
        pt.vy += 0.12 * dtScale;
        pt.life -= 0.04 * dtScale;
      }
      if (pt.life <= 0) {
        g.particles.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = Math.max(0, pt.life);
      ctx.fillStyle = pt.color;
      ctx.fillRect(pt.x, pt.y, 3, 3);
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = '#E5E5E5';
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(g.paddleX, h - 34, g.paddleW, g.paddleH, 5);
    } else {
      const r = 5;
      const px = g.paddleX;
      const py = h - 34;
      const pw = g.paddleW;
      const ph = g.paddleH;
      ctx.moveTo(px + r, py);
      ctx.arcTo(px + pw, py, px + pw, py + ph, r);
      ctx.arcTo(px + pw, py + ph, px, py + ph, r);
      ctx.arcTo(px, py + ph, px, py, r);
      ctx.arcTo(px, py, px + pw, py, r);
      ctx.closePath();
    }
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(g.ballX, g.ballY, g.ballR, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, []);

  const initGameCanvas = useCallback(
    (startImmediately = false) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const w = Math.max(320, Math.floor(rect.width));
      const h = 420;

      // HiDPI backing buffer: cap devicePixelRatio at 2
      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      const bricks = buildWordBricks(w);
      const cellSize = Math.max(7, Math.min(13, Math.floor((w - 120) / 42)));
      const initialStatus = startImmediately ? 'playing' : 'idle';
      const initialLives = 3;
      const initialScore = 0;

      gameRef.current = {
        status: initialStatus,
        lives: initialLives,
        score: initialScore,
        bricksAlive: bricks.length,
        w,
        h,
        dpr,
        minCellSize: cellSize,
        paddleX: (w - 116) / 2,
        paddleW: 116,
        paddleH: 9,
        ballX: w / 2,
        ballY: h - 78,
        vx: 4.1 * (Math.random() > 0.5 ? 1 : -1),
        vy: -4.3,
        ballR: 5,
        bricks,
        particles: [],
        keys: { left: false, right: false }
      };

      setLives(initialLives);
      setScore(initialScore);
      setBricksLeft(bricks.length);
      setGameState(initialStatus);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawGame(ctx, w, h, gameRef.current, 1);
      }
    },
    [buildWordBricks, drawGame]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let prevWidth = Math.floor(parent.getBoundingClientRect().width);
    initGameCanvas(false);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = Math.floor(entry.contentRect.width);
        if (newWidth > 0 && newWidth !== prevWidth) {
          prevWidth = newWidth;
          if (gameRef.current.status === 'idle') {
            initGameCanvas(false);
          }
        }
      }
    });

    ro.observe(parent);
    return () => {
      ro.disconnect();
    };
  }, [initGameCanvas]);

  useEffect(() => {
    const isFormOrEditable = (target) => {
      if (!target) return false;
      if (target.isContentEditable) return true;
      if (target.tagName) {
        const tag = target.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
      }
      return false;
    };

    const down = (e) => {
      if (activeProjectModal || showContactFormModal) return;
      if (isFormOrEditable(e.target)) return;

      const isLeft = e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A';
      const isRight = e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D';

      if (gameRef.current.status === 'playing' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
      }

      if (isLeft) gameRef.current.keys.left = true;
      if (isRight) gameRef.current.keys.right = true;
    };

    const up = (e) => {
      if (activeProjectModal || showContactFormModal) return;
      if (isFormOrEditable(e.target)) return;

      const isLeft = e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A';
      const isRight = e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D';

      if (isLeft) gameRef.current.keys.left = false;
      if (isRight) gameRef.current.keys.right = false;
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [activeProjectModal, showContactFormModal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const g = gameRef.current;
    if (gameState !== 'playing') {
      drawGame(ctx, g.w || canvas.width, g.h || 420, g, 1);
      return;
    }

    let rafId;
    let lastTime = performance.now();

    const renderFrame = (now) => {
      if (g.status !== 'playing') return;

      const w = g.w || 320;
      const h = g.h || 420;

      // Delta-time in 60Hz units: 16.6667ms is 1 frame
      const elapsed = now ? now - lastTime : 16.6667;
      lastTime = now || performance.now();
      // Clamp dt to at most 2 frames (~33.3ms) to prevent teleportation on tab switch
      const dtScale = Math.min(2.0, Math.max(0.1, elapsed / 16.6667));

      // Paddle keyboard move (7 px/frame at 60Hz, scaled by dtScale)
      const paddleSpeed = 7 * dtScale;
      if (g.keys.left) g.paddleX = Math.max(12, g.paddleX - paddleSpeed);
      if (g.keys.right) g.paddleX = Math.min(w - g.paddleW - 12, g.paddleX + paddleSpeed);

      // Substepping for anti-tunneling
      // Split each frame into up to 3 substeps when speed * dt exceeds half a brick
      const speed = Math.hypot(g.vx, g.vy);
      const totalDist = speed * dtScale;
      const maxStepDist = (g.minCellSize || 7) / 2;
      const substeps = Math.min(3, Math.max(1, Math.ceil(totalDist / maxStepDist)));
      const stepScale = dtScale / substeps;

      for (let s = 0; s < substeps; s++) {
        g.ballX += g.vx * stepScale;
        g.ballY += g.vy * stepScale;

        // Wall collisions
        if (g.ballX - g.ballR <= 4) {
          g.ballX = 4 + g.ballR;
          g.vx = Math.abs(g.vx);
        } else if (g.ballX + g.ballR >= w - 4) {
          g.ballX = w - 4 - g.ballR;
          g.vx = -Math.abs(g.vx);
        }
        if (g.ballY - g.ballR <= 4) {
          g.ballY = 4 + g.ballR;
          g.vy = Math.abs(g.vy);
        }

        // Paddle collision
        const paddleTop = h - 34;
        if (
          g.vy > 0 &&
          g.ballY + g.ballR >= paddleTop &&
          g.ballY - g.ballR <= paddleTop + g.paddleH &&
          g.ballX >= g.paddleX - 4 &&
          g.ballX <= g.paddleX + g.paddleW + 4
        ) {
          const hitOffset = (g.ballX - (g.paddleX + g.paddleW / 2)) / (g.paddleW / 2);
          g.vx = hitOffset * 5.4;
          g.vy = -Math.max(3.8, Math.abs(g.vy));
          g.ballY = paddleTop - g.ballR - 1;
        }

        // Brick collision: pick axis by penetration depth
        for (let i = 0; i < g.bricks.length; i++) {
          const b = g.bricks[i];
          if (!b.alive) continue;

          const bLeft = b.x;
          const bRight = b.x + b.w;
          const bTop = b.y;
          const bBottom = b.y + b.h;

          const ballLeft = g.ballX - g.ballR;
          const ballRight = g.ballX + g.ballR;
          const ballTop = g.ballY - g.ballR;
          const ballBottom = g.ballY + g.ballR;

          if (
            ballRight > bLeft &&
            ballLeft < bRight &&
            ballBottom > bTop &&
            ballTop < bBottom
          ) {
            b.alive = false;

            const overlapLeft = ballRight - bLeft;
            const overlapRight = bRight - ballLeft;
            const overlapTop = ballBottom - bTop;
            const overlapBottom = bBottom - ballTop;

            const penX = Math.min(overlapLeft, overlapRight);
            const penY = Math.min(overlapTop, overlapBottom);

            if (penX < penY) {
              // Lateral/side hit
              g.vx = -g.vx;
              if (overlapLeft < overlapRight) {
                g.ballX = bLeft - g.ballR;
              } else {
                g.ballX = bRight + g.ballR;
              }
            } else {
              // Top/bottom hit
              g.vy = -g.vy;
              if (overlapTop < overlapBottom) {
                g.ballY = bTop - g.ballR;
              } else {
                g.ballY = bBottom + g.ballR;
              }
            }

            for (let p = 0; p < 7; p++) {
              g.particles.push({
                x: b.x + b.w / 2,
                y: b.y + b.h / 2,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                life: 1,
                color: b.color
              });
            }

            g.bricksAlive -= 1;
            g.score += 10;
            setBricksLeft(g.bricksAlive);
            setScore(g.score);

            if (g.bricksAlive <= 0) {
              g.status = 'won';
              setGameState('won');
            }
            break; // Keep one brick destroyed per substep
          }
        }

        // Miss / life lost check
        if (g.ballY - g.ballR > h) {
          g.lives -= 1;
          const currentLives = g.lives;
          setLives(currentLives);
          if (currentLives <= 0) {
            g.status = 'gameover';
            setGameState('gameover');
          } else {
            g.ballX = g.paddleX + g.paddleW / 2;
            g.ballY = h - 78;
            g.vx = 4 * (Math.random() > 0.5 ? 1 : -1);
            g.vy = -4.2;
          }
          break; // Stop remaining substeps on miss
        }
      }

      drawGame(ctx, w, h, g, dtScale);

      if (g.status === 'playing') {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [gameState, drawGame]);

  const handleCanvasPointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    const g = gameRef.current;
    const cssWidth = g.w || rect.width;
    const scale = cssWidth / rect.width;
    const relX = (e.clientX - rect.left) * scale;
    g.paddleX = Math.max(12, Math.min(cssWidth - g.paddleW - 12, relX - g.paddleW / 2));
  };

  // Auto-pause (status 'paused', no reset) when #game is less than 20% visible or tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && gameRef.current.status === 'playing') {
        gameRef.current.status = 'paused';
        setGameState('paused');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const gameSection = document.getElementById('game');
    let observer;
    if (gameSection && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.intersectionRatio < 0.2 && gameRef.current.status === 'playing') {
              gameRef.current.status = 'paused';
              setGameState('paused');
            }
          }
        },
        { threshold: [0, 0.2] }
      );
      observer.observe(gameSection);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer) observer.disconnect();
    };
  }, []);

  // 6. "HELLO WORLD" CANVAS BRICK BREAKER GAME 
  return (
    <section id="game" className="max-w-7xl mx-auto px-4 sm:px-8 py-20 border-t border-white/[0.08]">
      <div className="relative bg-[#000000] py-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs sm:text-sm text-neutral-300 border-b border-neutral-500 pb-1">
            Break it if you can. It still ships.
          </span>
          <span className="font-mono text-xs text-neutral-500">
            SCORE: {score} • TILES: {bricksLeft}
          </span>
        </div>

        <div className="relative w-full overflow-hidden bg-[#000000]">
          <canvas
            ref={canvasRef}
            onPointerMove={handleCanvasPointerMove}
            onPointerDown={handleCanvasPointerMove}
            className="w-full h-[420px] block cursor-ew-resize touch-none"
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full bg-white ${
                  i < lives ? 'opacity-90' : 'opacity-20'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {gameState !== 'playing' ? (
              <button
                type="button"
                onClick={() => {
                  if (gameState === 'gameover' || gameState === 'won') {
                    initGameCanvas(true);
                  } else {
                    gameRef.current.status = 'playing';
                    setGameState('playing');
                  }
                }}
                className="px-6 py-2 rounded-lg border border-white/25 hover:border-white font-mono text-xs uppercase tracking-widest text-white transition-colors"
              >
                {gameState === 'idle' ? 'PLAY' : 'REPLAY'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  gameRef.current.status = 'paused';
                  setGameState('paused');
                }}
                className="px-6 py-2 rounded-lg border border-white/40 font-mono text-xs uppercase tracking-widest text-white"
              >
                PAUSE
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                initGameCanvas(false);
              }}
              aria-label="Reset Brick Breaker Game"
              className="p-2 rounded-lg border border-white/15 text-neutral-400 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
