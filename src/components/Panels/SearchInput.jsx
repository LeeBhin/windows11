import { useRef, useEffect } from "react";

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

  // scale 줄였다가 복구 애니메이션
  useEffect(() => {
    if (!isFocused || !svgRef.current) return;
    const el = svgRef.current;
    const DUR = 220;
    const t0 = performance.now();
    let raf;
    function frame(now) {
      const p = Math.min((now - t0) / DUR, 1);
      const scale = p < 0.35
        ? 1 - 0.18 * (p / 0.35)
        : 0.82 + 0.18 * ((p - 0.35) / 0.65);
      el.style.transform = `scale(${scale.toFixed(4)})`;
      if (p < 1) raf = requestAnimationFrame(frame);
      else el.style.transform = "";
    }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      if (svgRef.current) svgRef.current.style.transform = "";
    };
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
        width={isFocused ? 15 : 14}
        height={isFocused ? 15 : 14}
        className="flex-shrink-0"
        style={{ overflow: "visible", transformBox: "fill-box", transformOrigin: "center" }}
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
