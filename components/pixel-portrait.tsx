"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const HALFTONE_PORTRAIT = "/images/hadi-halftone-hero.webp";

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageSize;
  uniform vec2 uPointer;
  uniform float uWarp;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    float screenRatio = uResolution.x / uResolution.y;
    float imageRatio = uImageSize.x / uImageSize.y;
    vec2 crop = vec2(1.0);

    if (screenRatio > imageRatio) {
      crop.y = imageRatio / screenRatio;
    } else {
      crop.x = screenRatio / imageRatio;
    }

    return (uv - 0.5) * crop + 0.5;
  }

  void main() {
    vec2 point = vUv - uPointer;
    float aspect = uResolution.x / uResolution.y;
    point.x *= aspect;

    float distanceToPointer = length(point);
    float field = smoothstep(0.30, 0.015, distanceToPointer) * uWarp;
    float rotation = field * 1.72;
    float cosine = cos(rotation);
    float sine = sin(rotation);
    point = mat2(cosine, -sine, sine, cosine) * point;
    point *= mix(1.0, 0.48, field);
    point.x /= aspect;

    vec2 displacedUv = coverUv(uPointer + point);
    vec4 color = texture2D(uTexture, displacedUv);
    float voidMask = mix(1.0, smoothstep(0.018, 0.092, distanceToPointer), field);
    color.rgb *= voidMask;

    if (displacedUv.x < 0.0 || displacedUv.x > 1.0 || displacedUv.y < 0.0 || displacedUv.y > 1.0) {
      color = vec4(0.0, 0.0, 0.0, 1.0);
    }

    gl_FragColor = color;
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function PixelPortrait() {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reducedMotion || coarsePointer || saveData) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "uResolution");
    const imageSizeLocation = gl.getUniformLocation(program, "uImageSize");
    const pointerLocation = gl.getUniformLocation(program, "uPointer");
    const warpLocation = gl.getUniformLocation(program, "uWarp");
    const textureLocation = gl.getUniformLocation(program, "uTexture");

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(textureLocation, 0);

    const image = new window.Image();
    image.decoding = "async";
    image.src = HALFTONE_PORTRAIT;

    let disposed = false;
    let imageReady = false;
    let animationFrame = 0;
    let isVisible = true;
    const current = { x: 0.22, y: 0.48, warp: 0.62 };
    const target = { x: 0.22, y: 0.48, warp: 0.62 };

    const resize = () => {
      const bounds = frame.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    };

    const render = () => {
      animationFrame = 0;
      if (disposed || !imageReady || !isVisible) return;

      current.x += (target.x - current.x) * 0.13;
      current.y += (target.y - current.y) * 0.13;
      current.warp += (target.warp - current.warp) * 0.1;
      gl.uniform2f(pointerLocation, current.x, current.y);
      gl.uniform1f(warpLocation, current.warp);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      const moving = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) + Math.abs(target.warp - current.warp) > 0.001;
      if (moving) animationFrame = window.requestAnimationFrame(render);
    };

    const wake = () => {
      if (!animationFrame && isVisible && imageReady && !disposed) animationFrame = window.requestAnimationFrame(render);
    };

    const pointAtEvent = (event: PointerEvent) => {
      const bounds = frame.getBoundingClientRect();
      target.x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      target.y = 1 - Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
      target.warp = event.buttons ? 1.12 : 0.88;
      wake();
    };

    const resetField = () => {
      target.x = 0.22;
      target.y = 0.48;
      target.warp = 0.62;
      wake();
    };

    const onImageReady = () => {
      if (disposed) return;
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform2f(imageSizeLocation, image.naturalWidth, image.naturalHeight);
      imageReady = true;
      resize();
      frame.classList.add("has-webgl");
      wake();
    };

    const resizeObserver = new ResizeObserver(() => { resize(); wake(); });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) wake();
    }, { threshold: 0.02 });

    image.addEventListener("load", onImageReady);
    frame.addEventListener("pointermove", pointAtEvent);
    frame.addEventListener("pointerdown", pointAtEvent);
    frame.addEventListener("pointerleave", resetField);
    resizeObserver.observe(frame);
    visibilityObserver.observe(frame);
    if (image.complete) onImageReady();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      image.removeEventListener("load", onImageReady);
      frame.removeEventListener("pointermove", pointAtEvent);
      frame.removeEventListener("pointerdown", pointAtEvent);
      frame.removeEventListener("pointerleave", resetField);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      frame.classList.remove("has-webgl");
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div className="pixel-portrait" ref={frameRef} role="img" aria-label="Interactive halftone portrait of Hadi Hassan">
      <Image
        className="pixel-portrait-base"
        src={HALFTONE_PORTRAIT}
        width={2048}
        height={1190}
        alt=""
        priority
        unoptimized
        sizes="100vw"
      />
      <canvas className="pixel-portrait-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="pixel-portrait-label" aria-hidden="true">
        <span>Halftone field / 6 px sampling</span>
        <span>Move pointer to bend the field</span>
      </div>
    </div>
  );
}
