// NoisyBloomPass.tsx
import React, { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, RenderPass, ShaderPass } from "three/examples/jsm/Addons.js";

// ---------------- Shader ----------------
const NoisyBloomShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    time: { value: 0 },
    noiseAmount: { value: 0.04 },
    bloomThreshold: { value: 0.7 },
    bloomIntensity: { value: 1.0 },
    bloomSpread: { value: 0.006 },
    samples: { value: 7.0 },
    chromaAmount: { value: 0.004 },
    gradientMap: { value: null as THREE.Texture | null },
    mixGradient: { value: 0.2 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform sampler2D gradientMap;
    uniform float time;
    uniform float noiseAmount;
    uniform float bloomThreshold;
    uniform float bloomIntensity;
    uniform float bloomSpread;
    uniform float samples;
    uniform float chromaAmount;
    uniform float mixGradient;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    float noise(in vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float lum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

    void main() {
      vec2 uv = vUv;
      vec4 base = texture2D(tDiffuse, uv);
      float L = lum(base.rgb);

      float mask = smoothstep(bloomThreshold, bloomThreshold + 0.08, L);

      vec3 glow = vec3(0.0);
      float twoPi = 6.28318530718;
      float nSamples = max(1.0, samples);
      for (float i = 0.0; i < 12.0; i += 1.0) {
        if (i >= nSamples) break;
        float a = (i / nSamples) * twoPi;
        vec2 offset = vec2(cos(a), sin(a)) * (bloomSpread * (1.0 + i * 0.15));
        vec4 s = texture2D(tDiffuse, uv + offset);
        float w = smoothstep(bloomThreshold * 0.5, 1.0, lum(s.rgb));
        glow += s.rgb * w;
      }
      glow /= nSamples;
      glow *= mask * bloomIntensity;

      vec2 chromaOff = vec2(chromaAmount, -chromaAmount);
      float r = texture2D(tDiffuse, uv + chromaOff).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv - chromaOff).b;
      vec3 chroma = vec3(r, g, b);

      vec3 colorWithChroma = mix(base.rgb, chroma, 0.15);

      vec3 graded = colorWithChroma;
      #ifdef USE_GRADIENT
      {
        float gL = clamp(lum(colorWithChroma), 0.0, 1.0);
        vec2 gmUV = vec2(gL, 0.5);
        vec3 gm = texture2D(gradientMap, gmUV).rgb;
        graded = mix(colorWithChroma, gm, mixGradient);
      }
      #endif

      float n = noise(uv * vec2(1024.0, 768.0) + time * 0.2);
      float grain = (n - 0.5) * noiseAmount;

      vec3 finalColor = graded + glow;
      finalColor = mix(colorWithChroma, finalColor, 0.85);
      finalColor += grain;

      gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), base.a);
    }
  `,
};

// ---------------- Props ----------------
export interface NoisyBloomPassProps {
  noiseAmount?: number;
  bloomThreshold?: number;
  bloomIntensity?: number;
  bloomSpread?: number;
  samples?: number;
  chromaAmount?: number;
  gradientTexture?: THREE.Texture | null;
  mixGradient?: number;
}

// ---------------- Component ----------------
export default function NoisyBloomPass({
  noiseAmount = 0.035,
  bloomThreshold = 0.72,
  bloomIntensity = 1.2,
  bloomSpread = 0.006,
  samples = 7,
  chromaAmount = 0.003,
  gradientTexture = null,
  mixGradient = 0.18,
}: NoisyBloomPassProps) {
  const { size, gl, scene, camera } = useThree();

  const composerRef = useRef<EffectComposer | null>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial | null>(null);

  // setup once
  useEffect(() => {
    const composer = new EffectComposer(gl);
    composer.setSize(size.width, size.height);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const shader = { ...NoisyBloomShader } as typeof NoisyBloomShader & {
      defines? : Record<string, number | string | boolean>
    };
    if (gradientTexture) {
      shader.defines = { USE_GRADIENT: 1 };
    }

    const material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(shader.uniforms),
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      defines: shader.defines || {},
    });

    // set initial uniform values
    material.uniforms.noiseAmount.value = noiseAmount;
    material.uniforms.bloomThreshold.value = bloomThreshold;
    material.uniforms.bloomIntensity.value = bloomIntensity;
    material.uniforms.bloomSpread.value = bloomSpread;
    material.uniforms.samples.value = samples;
    material.uniforms.chromaAmount.value = chromaAmount;
    material.uniforms.gradientMap.value = gradientTexture;
    material.uniforms.mixGradient.value = mixGradient;

    const shaderPass = new ShaderPass(material, "tDiffuse");
    shaderPass.renderToScreen = true;
    composer.addPass(shaderPass);

    composerRef.current = composer;
    shaderMatRef.current = material;

    return () => {
      composer.dispose();
      material.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update sizes
  useEffect(() => {
    composerRef.current?.setSize(size.width, size.height);
  }, [size.width, size.height]);

  // update uniforms if props change
  useEffect(() => {
    const m = shaderMatRef.current;
    if (!m) return;
    m.uniforms.noiseAmount.value = noiseAmount;
    m.uniforms.bloomThreshold.value = bloomThreshold;
    m.uniforms.bloomIntensity.value = bloomIntensity;
    m.uniforms.bloomSpread.value = bloomSpread;
    m.uniforms.samples.value = samples;
    m.uniforms.chromaAmount.value = chromaAmount;
    m.uniforms.gradientMap.value = gradientTexture;
    m.uniforms.mixGradient.value = mixGradient;
  }, [
    noiseAmount,
    bloomThreshold,
    bloomIntensity,
    bloomSpread,
    samples,
    chromaAmount,
    gradientTexture,
    mixGradient,
  ]);

  // render loop
  useFrame((_, delta) => {
    if (composerRef.current) {
      if (shaderMatRef.current) {
        shaderMatRef.current.uniforms.time.value += delta;
      }
      composerRef.current.render(delta);
    }
  }, 1);

  return null;
}
