import { useRef, useEffect, useLayoutEffect } from "react";

const UNFOCUSED_S = 14 / 15;
const FOCUSED_S = 1.0;

const CX = 128, CY = 128;
const OUTER_R = 128, INNER_R = 92;
const ARC_DEG = 160;
const ARC_RAD = ARC_DEG * Math.PI / 180;
const ARC_FRAC = ARC_DEG / 360;

function drawArc(ctx, angle) {
  ctx.clearRect(0, 0, 292, 300);
  const grad = ctx.createConicGradient(angle, CX, CY);
  grad.addColorStop(0, "rgba(91,226,115,0)");
  grad.addColorStop(ARC_FRAC * 0.30, "rgba(91,226,115,1)");
  grad.addColorStop(ARC_FRAC * 0.70, "rgba(91,226,115,1)");
  grad.addColorStop(ARC_FRAC, "rgba(91,226,115,0)");
  grad.addColorStop(ARC_FRAC + 0.001, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(CX, CY, OUTER_R, angle, angle + ARC_RAD);
  ctx.arc(CX, CY, INNER_R, angle + ARC_RAD, angle, true);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
}

export default function SearchInput({
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  inputRef,
  isFocused,
  readOnly,
  autoFocus,
  rightEl,
}) {
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const scaleRef = useRef(UNFOCUSED_S);
  const rafRef = useRef(null);

  // 초록 arc 애니메이션
  useEffect(() => {
    if (!isFocused || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const FROM = 63 * Math.PI / 180;
    const TO = 243 * Math.PI / 180;
    const DUR = 200;
    const t0 = performance.now();
    let raf;
    function frame(now) {
      const p = Math.min((now - t0) / DUR, 1);
      const ease = 1 - (1 - p) * (1 - p);
      drawArc(ctx, FROM + (TO - FROM) * ease);
      if (p < 1) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [isFocused]);

  // 초기 scale 설정 (paint 전)
  useLayoutEffect(() => {
    if (!svgRef.current) return;
    svgRef.current.style.transform = `scale(${UNFOCUSED_S.toFixed(4)})`;
    scaleRef.current = UNFOCUSED_S;
  }, []);

  // scale 애니메이션 — focus/unfocus 모두 RAF로 제어 (레이아웃 영향 없음)
  useEffect(() => {
    if (!svgRef.current) return;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }

    const el = svgRef.current;
    const startScale = scaleRef.current;

    // unfocus인데 이미 목표 scale이면 스킵
    if (!isFocused && Math.abs(startScale - UNFOCUSED_S) < 0.001) return;

    const DUR = 220;
    const t0 = performance.now();

    function frame(now) {
      const p = Math.min((now - t0) / DUR, 1);
      let scale;
      if (isFocused) {
        // shrink 단계: startScale → startScale*0.82
        // grow 단계: startScale*0.82 → FOCUSED_S (1.0) — 여기서 size-up 발생
        if (p < 0.35) {
          scale = startScale + (startScale * 0.91 - startScale) * (p / 0.35);
        } else {
          const minScale = startScale * 0.91;
          scale = minScale + (FOCUSED_S - minScale) * ((p - 0.35) / 0.65);
        }
      } else {
        const eased = 1 - (1 - p) * (1 - p);
        scale = startScale + (UNFOCUSED_S - startScale) * eased;
      }
      scaleRef.current = scale;
      el.style.transform = `scale(${scale.toFixed(4)})`;
      if (p < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        const final = isFocused ? FOCUSED_S : UNFOCUSED_S;
        scaleRef.current = final;
        el.style.transform = `scale(${final.toFixed(4)})`;
        rafRef.current = null;
      }
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } };
  }, [isFocused]);

  const color = isFocused ? "#0071D1" : "rgba(0,0,0,0.65)";

  return (
    <div
      className="flex items-center gap-2.5 rounded-full px-3.5"
      style={{
        height: "34px",
        background: "rgba(255,255,255,0.9)",
        border: "1.5px solid #E0E4E5",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 292 300"
        width={15}
        height={15}
        className="flex-shrink-0"
        style={{ overflow: "visible", transformOrigin: "center" }}
      >
        <path
          fill={color}
          fillRule="evenodd"
          d="M254 128A126 126 0 1 1 2 128A126 126 0 1 1 254 128ZM222 128A94 94 0 1 0 34 128A94 94 0 1 0 222 128Z"
        />
        {isFocused && (
          <foreignObject x="0" y="0" width="292" height="300">
            <canvas
              ref={canvasRef}
              width={292}
              height={300}
              style={{ width: "100%", height: "100%" }}
            />
          </foreignObject>
        )}
        <g transform="rotate(45 206 206)">
          <rect x="198" y="207.5" width="118" height="37" rx="18.5" fill={color} />
        </g>
      </svg>
      <input
        ref={inputRef}
        className="bg-transparent text-[13px] outline-none flex-1 h-full placeholder-gray-400"
        style={{ color: "#1a1a1a", caretColor: "#1a1a1a" }}
        placeholder={placeholder}
        {...(value !== undefined ? { value, onChange } : {})}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        readOnly={readOnly}
        autoFocus={autoFocus}
        autoComplete="off"
      />
      {rightEl}
    </div>
  );
}
