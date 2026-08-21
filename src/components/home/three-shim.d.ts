declare module 'three' {
  export const SRGBColorSpace: unknown;

  export interface Texture {
    colorSpace: unknown;
    anisotropy: number;
    needsUpdate: boolean;
    dispose(): void;
  }

  export class TextureLoader {
    loadAsync(url: string): Promise<Texture>;
  }

  export class Color {
    constructor(color?: string | number);
  }

  export class Vector2 {
    constructor(x?: number, y?: number);
  }

  export class Object3D {
    rotation: { x: number; y: number; z: number };
  }

  export class Material {
    dispose(): void;
  }

  export class MeshPhongMaterial extends Material {
    constructor(parameters?: Record<string, unknown>);
  }

  export class SphereGeometry {
    constructor(radius?: number, widthSegments?: number, heightSegments?: number);
    dispose(): void;
  }

  export class Mesh<
    Geometry extends SphereGeometry = SphereGeometry,
    MeshMaterial extends MeshPhongMaterial = MeshPhongMaterial,
  > extends Object3D {
    constructor(geometry?: Geometry, material?: MeshMaterial);
    onBeforeRender?: () => void;
  }

  export class Light extends Object3D {}

  export class AmbientLight extends Light {
    constructor(color?: string | number, intensity?: number);
  }

  export class DirectionalLight extends Light {
    constructor(color?: string | number, intensity?: number);
    position: { set(x: number, y: number, z: number): void };
  }

  export class Scene extends Object3D {
    add(object: Object3D): void;
    remove(object: Object3D): void;
  }

  export class Camera extends Object3D {}

  export interface WebGLRendererParameters {
    alpha?: boolean;
    antialias?: boolean;
    powerPreference?: string;
    preserveDrawingBuffer?: boolean;
  }

  export class WebGLRenderer {
    domElement: HTMLCanvasElement;
    capabilities: { getMaxAnisotropy(): number };
  }

  export class Renderer {}
  export class Intersection {}
}

declare module 'three/examples/jsm/controls/OrbitControls.js' {
  export class OrbitControls {
    enableZoom: boolean;
    enablePan: boolean;
    enableRotate: boolean;
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableDamping: boolean;
    dampingFactor: number;
    minDistance?: number;
    maxDistance?: number;
  }
}

declare module 'three/examples/jsm/postprocessing/EffectComposer.js' {
  export class EffectComposer {}
}
