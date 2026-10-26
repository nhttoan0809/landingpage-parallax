import * as THREE from "three";

/** A bounded HDR bright-pass and separable blur, sourced from the actual sculpture. */
export function makeBloom(renderer: THREE.WebGLRenderer, low: boolean) {
  const source = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.HalfFloatType,
    depthBuffer: true,
  });
  const horizontal = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.HalfFloatType,
    depthBuffer: false,
  });
  const vertical = horizontal.clone();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const scene = new THREE.Scene();
  const geometry = new THREE.PlaneGeometry(2, 2);
  const vertexShader = `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
  const blur = new THREE.ShaderMaterial({
    uniforms: {
      uImage: { value: source.texture },
      uStep: { value: new THREE.Vector2() },
      uExtract: { value: 1 },
    },
    vertexShader,
    fragmentShader: `varying vec2 vUv;uniform sampler2D uImage;uniform vec2 uStep;uniform float uExtract;
      vec3 sampleLight(vec2 uv){vec3 c=texture2D(uImage,uv).rgb;return mix(c,max(c-vec3(1.05),vec3(0.)),uExtract);}
      void main(){vec3 c=sampleLight(vUv)*.227027;
        c+=(sampleLight(vUv+uStep)+sampleLight(vUv-uStep))*.1945946;
        c+=(sampleLight(vUv+uStep*2.)+sampleLight(vUv-uStep*2.))*.1216216;
        c+=(sampleLight(vUv+uStep*3.)+sampleLight(vUv-uStep*3.))*.054054;
        c+=(sampleLight(vUv+uStep*4.)+sampleLight(vUv-uStep*4.))*.016216;
        gl_FragColor=vec4(c,1.);}`,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  const composite = new THREE.ShaderMaterial({
    uniforms: { uImage: { value: vertical.texture }, uStrength: { value: 1 } },
    vertexShader,
    fragmentShader: `varying vec2 vUv;uniform sampler2D uImage;uniform float uStrength;
      void main(){vec3 b=max(texture2D(uImage,vUv).rgb,vec3(0.));float hot=max(b.r,max(b.g,b.b));
        vec3 colour=mix(b/max(hot,.0001),vec3(1.),.38);
        float alpha=min(.72,1.-exp(-hot*uStrength*.8));gl_FragColor=vec4(colour,alpha);
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  const quad = new THREE.Mesh(geometry, blur);
  scene.add(quad);
  let bufferBytes = 0;
  return {
    resize(width: number, height: number) {
      const cap = low ? 192 : 384;
      const scale = Math.min(1, cap / Math.max(width, height));
      const w = Math.max(1, Math.round(width * scale)),
        h = Math.max(1, Math.round(height * scale));
      for (const target of [source, horizontal, vertical]) target.setSize(w, h);
      bufferBytes = w * h * 28; // RGBA16F × 3, plus a conservative 32-bit source depth allowance.
    },
    prepare(
      sculpture: THREE.Scene,
      sculptureCamera: THREE.Camera,
      iridescence: number,
      glow: number,
    ) {
      renderer.setScissorTest(false);
      const toneMapping = renderer.toneMapping;
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.setRenderTarget(source);
      renderer.setClearColor(0, 0);
      renderer.clear();
      renderer.render(sculpture, sculptureCamera);
      quad.material = blur;
      blur.uniforms.uImage.value = source.texture;
      blur.uniforms.uExtract.value = 1;
      blur.uniforms.uStep.value.set(1.3 / source.width, 0);
      renderer.setRenderTarget(horizontal);
      renderer.clear();
      renderer.render(scene, camera);
      blur.uniforms.uImage.value = horizontal.texture;
      blur.uniforms.uExtract.value = 0;
      blur.uniforms.uStep.value.set(0, 1.3 / source.height);
      renderer.setRenderTarget(vertical);
      renderer.clear();
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.toneMapping = toneMapping;
      composite.uniforms.uStrength.value =
        0.12 + iridescence * 1.8 + glow * 0.9;
    },
    render() {
      quad.material = composite;
      renderer.render(scene, camera);
    },
    get bytes() {
      return bufferBytes;
    },
    dispose() {
      source.dispose();
      horizontal.dispose();
      vertical.dispose();
      geometry.dispose();
      blur.dispose();
      composite.dispose();
      scene.clear();
    },
  };
}
