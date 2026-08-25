import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type RefAttributes,
} from 'react';

import './HomeExperience.css';

export type HomeLocale = 'en' | 'zh';

export type LocalizedHomeText =
  | string
  | Readonly<Partial<Record<HomeLocale, string>>>;

export interface PhilosophyLine {
  start: string;
  highlight: string;
  end: string;
}

export interface HomeExperienceCopy {
  system: string;
  scroll: string;
  featuredEyebrow: string;
  featuredTitle: string;
  featuredBody: string;
  viewProject: string;
  philosophyEyebrow: string;
  philosophy: readonly PhilosophyLine[];
  philosophyBody: string;
  bioinformaticsNote?: string;
  allProjects: string;
  bootLines?: readonly string[];
  bootSkip?: string;
  heroNavigationLabel?: string;
  globeHint?: string;
  mobileGlobeHint?: string;
  reducedGlobeHint?: string;
  webglFallbackTitle?: string;
  webglFallbackBody?: string;
}

export interface HomeNavItem {
  id?: string;
  href: string;
  label: LocalizedHomeText;
  external?: boolean;
}

export interface HomeFeaturedProject {
  slug: string;
  name: string;
  href?: string;
  kicker: LocalizedHomeText;
  short: LocalizedHomeText;
  status?: string;
  statusLabel?: LocalizedHomeText;
  accent?: 'lime' | 'cyan' | 'violet' | 'amber' | 'rose' | string;
  index?: string;
}

export interface HomeExperienceProps {
  locale: HomeLocale;
  homeCopy: Readonly<HomeExperienceCopy>;
  featuredProjects: readonly HomeFeaturedProject[];
  nav: readonly HomeNavItem[];
  projectsHref?: string;
  sessionStorageKey?: string;
}

interface GlobeNode {
  id: string;
  label: string;
  lat: number;
  lng: number;
  altitude: number;
  radius: number;
  color: string;
  ringColor: string;
  ringRadius: number;
  ringSpeed: number;
  ringPeriod: number;
}

interface GlobeArc {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: readonly string[];
  altitude: number;
  stroke: number;
  dashLength: number;
  dashGap: number;
  dashInitialGap: number;
  dashAnimateTime: number;
}

interface GlobeControls {
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

interface GlobeApi {
  pointOfView(
    point: { lat?: number; lng?: number; altitude?: number },
    transitionMs?: number,
  ): unknown;
  pauseAnimation(): unknown;
  resumeAnimation(): unknown;
  controls(): GlobeControls;
  scene(): {
    add(object: unknown): void;
    remove(object: unknown): void;
  };
  renderer(): {
    domElement: HTMLCanvasElement;
    capabilities: { getMaxAnisotropy(): number };
    setPixelRatio(pixelRatio: number): void;
  };
  lights(lights: unknown[]): unknown;
  getGlobeRadius(): number;
}

interface GlobeVisualProps {
  width: number;
  height: number;
  backgroundColor: string;
  globeMaterial: unknown;
  showAtmosphere: boolean;
  atmosphereColor: string;
  atmosphereAltitude: number;
  globeCurvatureResolution: number;
  pointsData: GlobeNode[];
  pointLat: string;
  pointLng: string;
  pointColor: string;
  pointAltitude: string;
  pointRadius: string;
  pointResolution: number;
  pointLabel: string;
  pointsMerge: boolean;
  ringsData: GlobeNode[];
  ringLat: string;
  ringLng: string;
  ringColor: string;
  ringMaxRadius: string;
  ringPropagationSpeed: string;
  ringRepeatPeriod: string;
  ringResolution: number;
  arcsData: GlobeArc[];
  arcStartLat: string;
  arcStartLng: string;
  arcEndLat: string;
  arcEndLng: string;
  arcColor: string;
  arcAltitude: string;
  arcStroke: string;
  arcDashLength: string;
  arcDashGap: string;
  arcDashInitialGap: string;
  arcDashAnimateTime: string;
  arcsTransitionDuration: number;
  enablePointerInteraction: boolean;
  onGlobeReady: () => void;
}

type DynamicGlobe = ComponentType<
  GlobeVisualProps & RefAttributes<GlobeApi>
>;

type BootPhase = 'checking' | 'running' | 'exiting' | 'hidden';
type GlobeStatus = 'checking' | 'loading' | 'ready' | 'unavailable';
type VisualQuality = 'low' | 'balanced' | 'high' | 'ultra';
type EarthTextureResolution = '1k' | '2k' | '4k' | '8k';

interface EarthTextureSet {
  resolution: EarthTextureResolution;
  day: string;
  night: string;
  clouds: string;
  bump: string;
  specular: string;
}

type StaticGlobeStyle = CSSProperties & {
  '--earth-day-texture': string;
  '--earth-night-texture': string;
  '--earth-cloud-texture': string;
};

type GlyphStyle = CSSProperties & {
  '--glyph-x': string;
  '--glyph-y': string;
  '--glyph-r': string;
  '--glyph-delay': string;
};

type ProjectStyle = CSSProperties & {
  '--project-accent': string;
  '--project-accent-rgb': string;
  '--reveal-delay': string;
};

interface CanvasParticle {
  kind: 'burst' | 'converge';
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  life: number;
  maxLife: number;
  size: number;
  char: string;
  color: string;
}

const TITLE = "Keng0nion's Farm";
const DEFAULT_SESSION_KEY = 'keng0nion.home.boot.v1';
const MATRIX_GLYPHS =
  '01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+<>/{}[]';
const SCRAMBLE_GLYPHS = '01<>/{}[]#$%&*+-=アイウエオカキクケコ';

let bootRunState: 'idle' | 'running' | 'complete' = 'idle';

const copyDefaults = {
  en: {
    bootSkip: 'Skip boot',
    heroNavigationLabel: 'Home navigation',
    globeHint: 'Drag to rotate · click anywhere to emit signal',
    mobileGlobeHint: 'Optimized static globe · tap anywhere to emit signal',
    reducedGlobeHint: 'Static globe · motion effects paused',
    webglFallbackTitle: 'WebGL renderer unavailable',
    webglFallbackBody: 'A static Earth view is being used on this device.',
    bootLines: [
      '[OK] mounting personal archive',
      '[OK] verifying project index',
      '[OK] opening orbital data channel',
      '[OK] synchronizing interface',
      '[READY] welcome, operator',
    ],
  },
  zh: {
    bootSkip: '跳过启动',
    heroNavigationLabel: '首页导航',
    globeHint: '拖动旋转 · 点击任意位置发射字符信号',
    mobileGlobeHint: '优化静态地球 · 点击任意位置发射字符信号',
    reducedGlobeHint: '静态地球 · 动态效果已暂停',
    webglFallbackTitle: 'WebGL 渲染器不可用',
    webglFallbackBody: '当前设备将显示静态地球视图。',
    bootLines: [
      '[OK] 挂载个人档案',
      '[OK] 校验项目索引',
      '[OK] 打开轨道数据通道',
      '[OK] 同步交互界面',
      '[READY] 欢迎，操作员',
    ],
  },
} as const;

const accentMap: Record<string, readonly [string, string]> = {
  lime: ['#9cff00', '156, 255, 0'],
  cyan: ['#45e8ff', '69, 232, 255'],
  violet: ['#ae7bff', '174, 123, 255'],
  amber: ['#ffbf47', '255, 191, 71'],
  rose: ['#ff5c88', '255, 92, 136'],
};

const allNodes: GlobeNode[] = [
  { id: 'tokyo', label: 'Tokyo', lat: 35.68, lng: 139.76, altitude: 0.025, radius: 0.24, color: '#baff67', ringColor: '#9cff00', ringRadius: 3.4, ringSpeed: 1.25, ringPeriod: 1250 },
  { id: 'sf', label: 'San Francisco', lat: 37.77, lng: -122.42, altitude: 0.02, radius: 0.2, color: '#72ff42', ringColor: '#72ff42', ringRadius: 2.8, ringSpeed: 1.1, ringPeriod: 1650 },
  { id: 'london', label: 'London', lat: 51.51, lng: -0.13, altitude: 0.022, radius: 0.2, color: '#d0ff8a', ringColor: '#9cff00', ringRadius: 2.7, ringSpeed: 1.3, ringPeriod: 1450 },
  { id: 'singapore', label: 'Singapore', lat: 1.35, lng: 103.82, altitude: 0.02, radius: 0.19, color: '#78ff4d', ringColor: '#78ff4d', ringRadius: 2.6, ringSpeed: 1.15, ringPeriod: 1700 },
  { id: 'sydney', label: 'Sydney', lat: -33.87, lng: 151.21, altitude: 0.018, radius: 0.18, color: '#9cff00', ringColor: '#9cff00', ringRadius: 2.5, ringSpeed: 1.1, ringPeriod: 1850 },
  { id: 'berlin', label: 'Berlin', lat: 52.52, lng: 13.4, altitude: 0.018, radius: 0.18, color: '#9cff00', ringColor: '#77ff36', ringRadius: 2.5, ringSpeed: 1.2, ringPeriod: 1550 },
  { id: 'bengaluru', label: 'Bengaluru', lat: 12.97, lng: 77.59, altitude: 0.02, radius: 0.19, color: '#b9ff60', ringColor: '#9cff00', ringRadius: 2.7, ringSpeed: 1.2, ringPeriod: 1500 },
  { id: 'saopaulo', label: 'São Paulo', lat: -23.55, lng: -46.63, altitude: 0.018, radius: 0.18, color: '#7dff45', ringColor: '#7dff45', ringRadius: 2.5, ringSpeed: 1.05, ringPeriod: 1900 },
  { id: 'toronto', label: 'Toronto', lat: 43.65, lng: -79.38, altitude: 0.018, radius: 0.18, color: '#baff72', ringColor: '#9cff00', ringRadius: 2.4, ringSpeed: 1.15, ringPeriod: 1750 },
  { id: 'capetown', label: 'Cape Town', lat: -33.92, lng: 18.42, altitude: 0.018, radius: 0.18, color: '#8aff50', ringColor: '#8aff50', ringRadius: 2.5, ringSpeed: 1.1, ringPeriod: 1800 },
  { id: 'reykjavik', label: 'Reykjavík', lat: 64.15, lng: -21.94, altitude: 0.016, radius: 0.16, color: '#c5ff8a', ringColor: '#9cff00', ringRadius: 2.2, ringSpeed: 1, ringPeriod: 2100 },
  { id: 'dubai', label: 'Dubai', lat: 25.2, lng: 55.27, altitude: 0.017, radius: 0.17, color: '#9cff00', ringColor: '#9cff00', ringRadius: 2.3, ringSpeed: 1.15, ringPeriod: 1850 },
  { id: 'seoul', label: 'Seoul', lat: 37.57, lng: 126.98, altitude: 0.018, radius: 0.18, color: '#caff83', ringColor: '#9cff00', ringRadius: 2.4, ringSpeed: 1.25, ringPeriod: 1600 },
  { id: 'taipei', label: 'Taipei', lat: 25.03, lng: 121.57, altitude: 0.017, radius: 0.17, color: '#8dff50', ringColor: '#8dff50', ringRadius: 2.3, ringSpeed: 1.2, ringPeriod: 1750 },
];

const arcPairs: ReadonlyArray<readonly [number, number]> = [
  [0, 1], [0, 2], [0, 3], [0, 4], [1, 8], [1, 7], [2, 5], [2, 10],
  [3, 6], [3, 11], [4, 9], [5, 6], [6, 9], [7, 8], [11, 12], [12, 13],
];

const earthTextureResolutionOrder: readonly EarthTextureResolution[] = ['1k', '2k', '4k', '8k'];
const earthTextureResolutionByQuality: Record<VisualQuality, EarthTextureResolution> = {
  low: '1k',
  balanced: '2k',
  high: '4k',
  ultra: '8k',
};
const earthTexturePixelWidth: Record<EarthTextureResolution, number> = {
  '1k': 1024,
  '2k': 2048,
  '4k': 4096,
  '8k': 8192,
};

function textureResolutionForQuality(
  quality: VisualQuality,
  maxTextureSize = Number.POSITIVE_INFINITY,
): EarthTextureResolution {
  const desired = earthTextureResolutionByQuality[quality];
  const desiredIndex = earthTextureResolutionOrder.indexOf(desired);

  for (let index = desiredIndex; index >= 0; index -= 1) {
    const resolution = earthTextureResolutionOrder[index];
    if (earthTexturePixelWidth[resolution] <= maxTextureSize) return resolution;
  }

  return '1k';
}

function earthTextureSetForQuality(
  quality: VisualQuality,
  maxTextureSize = Number.POSITIVE_INFINITY,
): EarthTextureSet {
  const resolution = textureResolutionForQuality(quality, maxTextureSize);
  const detailResolution = resolution === '8k' ? '4k' : resolution;

  return {
    resolution,
    day: `/textures/earth-hd-day-${resolution}.webp`,
    night: `/textures/earth-hd-night-${resolution}.webp`,
    clouds: `/textures/earth-hd-clouds-${detailResolution}.webp`,
    bump: `/textures/earth-hd-bump-${detailResolution}.webp`,
    specular: `/textures/earth-hd-specular-${detailResolution}.webp`,
  };
}

function localize(value: LocalizedHomeText, locale: HomeLocale): string {
  if (typeof value === 'string') return value;
  return value[locale] ?? value.en ?? value.zh ?? '';
}

function useSiteVisualQuality(): VisualQuality {
  const readQuality = (): VisualQuality => {
    if (typeof document === 'undefined') return 'balanced';
    const value = document.documentElement.dataset.visualQuality;
    if (value === 'low' || value === 'balanced' || value === 'high' || value === 'ultra') return value;
    return 'balanced';
  };

  const [quality, setQuality] = useState<VisualQuality>(readQuality);

  useEffect(() => {
    const update = (event?: Event) => {
      const customEvent = event as CustomEvent<{ quality?: VisualQuality }> | undefined;
      const next = customEvent?.detail?.quality ?? readQuality();
      setQuality(next);
    };
    update();
    window.addEventListener('keng0nion:settings-change', update);
    return () => window.removeEventListener('keng0nion:settings-change', update);
  }, []);

  return quality;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 1, height: 1 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const rect = element.getBoundingClientRect();
      setSize({
        width: Math.max(1, Math.round(rect.width)),
        height: Math.max(1, Math.round(rect.height)),
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}

function getWebGLMaxTextureSize(): number {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });

    if (!gl) return 0;

    const maxTextureSize = Number(gl.getParameter(gl.MAX_TEXTURE_SIZE));
    gl.getExtension('WEBGL_lose_context')?.loseContext();

    return Number.isFinite(maxTextureSize) ? maxTextureSize : 0;
  } catch {
    return 0;
  }
}

function projectHref(project: HomeFeaturedProject, baseHref: string): string {
  if (project.href) return project.href;
  const base = baseHref.endsWith('/') ? baseHref : `${baseHref}/`;
  return `${base}${encodeURIComponent(project.slug)}/`;
}

function projectStatusLabel(
  project: HomeFeaturedProject,
  locale: HomeLocale,
): string {
  if (project.statusLabel) return localize(project.statusLabel, locale);
  if (project.status === 'completed') return locale === 'zh' ? '已完成' : 'Completed';
  if (project.status === 'in-development') {
    return locale === 'zh' ? '开发中' : 'In development';
  }
  return project.status ?? (locale === 'zh' ? '精选项目' : 'Featured project');
}

function BootSequence({
  locale,
  copy,
  storageKey,
  phase,
  setPhase,
}: {
  locale: HomeLocale;
  copy: Readonly<HomeExperienceCopy>;
  storageKey: string;
  phase: BootPhase;
  setPhase: (phase: BootPhase) => void;
}) {
  const timers = useRef<number[]>([]);
  const defaults = copyDefaults[locale];
  const lines = copy.bootLines ?? defaults.bootLines;

  const finish = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    bootRunState = 'complete';
    setPhase('hidden');
  }, [setPhase]);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(storageKey) === '1';
    } catch {
      seen = false;
    }

    if (bootRunState === 'complete' || (seen && bootRunState === 'idle')) {
      setPhase('hidden');
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    bootRunState = 'running';
    try {
      sessionStorage.setItem(storageKey, '1');
    } catch {
      // Storage can be unavailable in privacy-restricted contexts.
    }

    if (reduced) {
      setPhase('running');
      timers.current.push(window.setTimeout(finish, 120));
      return () => timers.current.forEach(window.clearTimeout);
    }

    setPhase('running');
    timers.current.push(window.setTimeout(() => setPhase('exiting'), 3250));
    timers.current.push(window.setTimeout(finish, 3650));

    return () => timers.current.forEach(window.clearTimeout);
  }, [finish, setPhase, storageKey]);

  useEffect(() => {
    if (phase === 'hidden') return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [phase]);

  if (phase === 'hidden') return null;

  return (
    <div
      className={`hx-boot hx-boot--${phase}`}
      role="status"
      aria-live="polite"
      aria-label={locale === 'zh' ? '系统启动中' : 'System booting'}
    >
      <div className="hx-boot__noise" aria-hidden="true" />
      <div className="hx-boot__terminal">
        <div className="hx-boot__bar">
          <span>root@keng0nion:~/farm</span>
          <span className="hx-boot__lights" aria-hidden="true">● ● ●</span>
        </div>
        <div className="hx-boot__body">
          <p className="hx-boot__command">
            <span aria-hidden="true">$</span> ./initialize_home.sh
          </p>
          <ol className="hx-boot__lines">
            {lines.map((line, index) => (
              <li key={`${line}-${index}`} style={{ '--line': index } as CSSProperties}>
                {line}
              </li>
            ))}
          </ol>
          <div className="hx-boot__progress" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
      <button className="hx-boot__skip" type="button" onClick={finish}>
        {copy.bootSkip ?? defaults.bootSkip}
      </button>
    </div>
  );
}

function MatrixCanvas({
  active,
  mobile,
  reducedMotion,
}: {
  active: boolean;
  mobile: boolean;
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let fontSize = mobile ? 17 : 15;
    let drops: number[] = [];
    let animationFrame = 0;
    let running = false;
    let lastFrame = 0;

    const randomGlyph = () =>
      MATRIX_GLYPHS[Math.floor(Math.random() * MATRIX_GLYPHS.length)] ?? '0';

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      fontSize = mobile ? 17 : 15;
      const columnCount = Math.ceil(width / fontSize);
      drops = Array.from({ length: columnCount }, () => Math.random() * -45);
      context.clearRect(0, 0, width, height);
    };

    const draw = (time: number) => {
      if (!running) return;
      animationFrame = window.requestAnimationFrame(draw);
      if (time - lastFrame < (mobile ? 58 : 42)) return;
      lastFrame = time;

      context.fillStyle = mobile ? 'rgba(1, 7, 3, .17)' : 'rgba(1, 7, 3, .115)';
      context.fillRect(0, 0, width, height);
      context.font = `${fontSize}px var(--mono, monospace)`;
      context.textAlign = 'center';

      drops.forEach((drop, index) => {
        const x = index * fontSize + fontSize / 2;
        const y = drop * fontSize;
        const flare = Math.random() > 0.965;
        context.fillStyle = flare
          ? 'rgba(225, 255, 202, .82)'
          : `rgba(126, 255, 68, ${mobile ? 0.18 : 0.24})`;
        context.shadowBlur = flare ? 9 : 0;
        context.shadowColor = '#9cff00';
        context.fillText(randomGlyph(), x, y);
        context.shadowBlur = 0;
        drops[index] = drop + (mobile ? 0.62 : 0.78);
        if (y > height && Math.random() > 0.976) drops[index] = Math.random() * -18;
      });
    };

    const drawStatic = () => {
      context.clearRect(0, 0, width, height);
      context.font = `${fontSize}px var(--mono, monospace)`;
      context.fillStyle = 'rgba(126, 255, 68, .14)';
      for (let x = fontSize / 2; x < width; x += fontSize * 1.3) {
        for (let y = fontSize; y < height; y += fontSize * 2.4) {
          if (Math.random() > 0.38) context.fillText(randomGlyph(), x, y);
        }
      }
    };

    const start = () => {
      if (running || !active || document.hidden) return;
      if (reducedMotion) {
        drawStatic();
        return;
      }
      running = true;
      animationFrame = window.requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    resize();
    const observer = new ResizeObserver(() => {
      resize();
      if (reducedMotion) drawStatic();
    });
    observer.observe(canvas);
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [active, mobile, reducedMotion]);

  return <canvas ref={canvasRef} className="hx-matrix" aria-hidden="true" />;
}

function GlyphParticleCanvas({
  hostRef,
  titleRef,
  active,
  reducedMotion,
}: {
  hostRef: React.RefObject<HTMLElement | null>;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
  active: boolean;
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const mobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
    if (reducedMotion) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const particles: CanvasParticle[] = [];
    let width = 1;
    let height = 1;
    let dpr = 1;
    let animationFrame = 0;
    let lastTime = performance.now();
    let running = false;

    const randomGlyph = () =>
      MATRIX_GLYPHS[Math.floor(Math.random() * MATRIX_GLYPHS.length)] ?? '0';

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.4 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const startLoop = () => {
      if (running || document.hidden || particles.length === 0) return;
      running = true;
      lastTime = performance.now();
      animationFrame = window.requestAnimationFrame(draw);
    };

    const spawnBurst = (x: number, y: number) => {
      const count = mobile ? 16 : 30;
      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count + Math.random() * 0.45;
        const speed = 55 + Math.random() * (mobile ? 80 : 145);
        particles.push({
          kind: 'burst',
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 24,
          targetX: x,
          targetY: y,
          life: 0.75 + Math.random() * 0.8,
          maxLife: 1.55,
          size: 9 + Math.random() * 9,
          char: randomGlyph(),
          color: Math.random() > 0.82 ? '#efffdc' : '#9cff00',
        });
      }
      startLoop();
    };

    const spawnConvergence = () => {
      if (!active || !titleRef.current) return;
      const hostRect = host.getBoundingClientRect();
      const glyphs = titleRef.current.querySelectorAll<HTMLElement>('[data-title-glyph]');

      glyphs.forEach((glyph, glyphIndex) => {
        const targetChar = glyph.dataset.target;
        if (!targetChar || targetChar === ' ') return;
        const rect = glyph.getBoundingClientRect();
        const particleCount = mobile ? 2 : 4;

        for (let index = 0; index < particleCount; index += 1) {
          const fromHorizontalEdge = Math.random() > 0.45;
          const targetX = rect.left - hostRect.left + rect.width * Math.random();
          const targetY = rect.top - hostRect.top + rect.height * (0.2 + Math.random() * 0.62);
          particles.push({
            kind: 'converge',
            x: fromHorizontalEdge
              ? (Math.random() > 0.5 ? -30 : width + 30)
              : Math.random() * width,
            y: fromHorizontalEdge
              ? Math.random() * height
              : (Math.random() > 0.5 ? -30 : height + 30),
            vx: (Math.random() - 0.5) * 35,
            vy: (Math.random() - 0.5) * 35,
            targetX,
            targetY,
            life: 1.7 + glyphIndex * 0.025 + Math.random() * 0.45,
            maxLife: 2.6,
            size: Math.max(8, Math.min(17, rect.height * (0.12 + Math.random() * 0.09))),
            char: index === 0 ? targetChar : randomGlyph(),
            color: index === 0 ? '#efffdc' : '#9cff00',
          });
        }
      });

      startLoop();
    };

    function draw(time: number) {
      if (!running) return;
      const drawingContext = context as CanvasRenderingContext2D;
      const delta = Math.min(0.034, Math.max(0.001, (time - lastTime) / 1000));
      lastTime = time;
      drawingContext.clearRect(0, 0, width, height);
      drawingContext.textAlign = 'center';
      drawingContext.textBaseline = 'middle';

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.life -= delta;
        if (particle.life <= 0) {
          particles.splice(index, 1);
          continue;
        }

        if (particle.kind === 'converge') {
          particle.vx += (particle.targetX - particle.x) * 5.2 * delta;
          particle.vy += (particle.targetY - particle.y) * 5.2 * delta;
          const damping = Math.pow(0.055, delta);
          particle.vx *= damping;
          particle.vy *= damping;
        } else {
          particle.vy += 72 * delta;
          particle.vx *= Math.pow(0.72, delta);
        }

        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;

        const alpha = Math.min(1, particle.life / Math.min(0.48, particle.maxLife));
        drawingContext.globalAlpha = alpha;
        drawingContext.fillStyle = particle.color;
        drawingContext.shadowColor = '#9cff00';
        drawingContext.shadowBlur = particle.kind === 'converge' ? 12 : 8;
        drawingContext.font = `${particle.size}px var(--mono, monospace)`;
        drawingContext.fillText(particle.char, particle.x, particle.y);
      }

      drawingContext.globalAlpha = 1;
      drawingContext.shadowBlur = 0;

      if (particles.length > 0 && !document.hidden) {
        animationFrame = window.requestAnimationFrame(draw);
      } else {
        running = false;
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('a, button, summary')) return;
      const rect = host.getBoundingClientRect();
      spawnBurst(event.clientX - rect.left, event.clientY - rect.top);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(animationFrame);
      } else {
        startLoop();
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    host.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    let convergenceTimer = 0;
    if (active) {
      const schedule = () => {
        convergenceTimer = window.setTimeout(spawnConvergence, 100);
      };
      if (document.fonts) void document.fonts.ready.then(schedule);
      else schedule();
    }

    return () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(convergenceTimer);
      observer.disconnect();
      host.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [active, hostRef, reducedMotion, titleRef]);

  return <canvas ref={canvasRef} className="hx-particles" aria-hidden="true" />;
}

function DecodedTitle({
  active,
  reducedMotion,
  titleRef,
}: {
  active: boolean;
  reducedMotion: boolean;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const [display, setDisplay] = useState(TITLE);
  const [decoding, setDecoding] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!active || reducedMotion) {
      setDisplay(TITLE);
      setDecoding(false);
      setEntered(active);
      return;
    }

    let animationFrame = 0;
    const startedAt = performance.now();
    const duration = 1950;
    setDecoding(true);
    setEntered(true);

    const update = (time: number) => {
      const progress = Math.min(1, (time - startedAt) / duration);
      const lockedCharacters = Math.floor(
        TITLE.length * Math.max(0, (progress - 0.12) / 0.78),
      );
      const frame = Math.floor((time - startedAt) / 48);

      setDisplay(
        [...TITLE]
          .map((character, index) => {
            if (character === ' ' || index < lockedCharacters || progress === 1) {
              return character;
            }
            return SCRAMBLE_GLYPHS[(frame * 5 + index * 11) % SCRAMBLE_GLYPHS.length];
          })
          .join(''),
      );

      if (progress < 1) animationFrame = window.requestAnimationFrame(update);
      else {
        setDisplay(TITLE);
        setDecoding(false);
      }
    };

    animationFrame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [active, reducedMotion]);

  return (
    <h1
      ref={titleRef}
      className={`hx-title${decoding ? ' is-decoding' : ''}${entered ? ' is-entered' : ''}`}
      aria-label={TITLE}
    >
      {[...TITLE].map((targetCharacter, index) => {
        const displayedCharacter = display[index] ?? targetCharacter;
        const direction = index % 2 === 0 ? 1 : -1;
        const style: GlyphStyle = {
          '--glyph-x': `${direction * (56 + ((index * 29) % 170))}px`,
          '--glyph-y': `${((index * 47) % 210) - 105}px`,
          '--glyph-r': `${direction * (8 + ((index * 13) % 28))}deg`,
          '--glyph-delay': `${index * 24}ms`,
        };

        return (
          <span
            className={targetCharacter === ' ' ? 'hx-title-space' : 'hx-title-glyph'}
            data-title-glyph={targetCharacter === ' ' ? undefined : ''}
            data-target={targetCharacter}
            style={style}
            aria-hidden="true"
            key={`${targetCharacter}-${index}`}
          >
            {displayedCharacter === ' ' ? '\u00a0' : displayedCharacter}
          </span>
        );
      })}
    </h1>
  );
}

function StaticEarthFallback({
  locale,
  copy,
  failed,
  quality,
}: {
  locale: HomeLocale;
  copy: Readonly<HomeExperienceCopy>;
  failed: boolean;
  quality: VisualQuality;
}) {
  const defaults = copyDefaults[locale];
  const textureSet = earthTextureSetForQuality(quality);
  const style: StaticGlobeStyle = {
    '--earth-day-texture': `url('${textureSet.day}')`,
    '--earth-night-texture': `url('${textureSet.night}')`,
    '--earth-cloud-texture': `url('${textureSet.clouds}')`,
  };

  return (
    <div className={`hx-static-globe${failed ? ' is-fallback' : ''}`} style={style}>
      <div className="hx-static-globe__sphere" aria-hidden="true">
        <span className="hx-static-globe__clouds" />
      </div>
      {failed && (
        <p className="hx-static-globe__message" role="status">
          <strong>{copy.webglFallbackTitle ?? defaults.webglFallbackTitle}</strong>
          <span>{copy.webglFallbackBody ?? defaults.webglFallbackBody}</span>
        </p>
      )}
    </div>
  );
}

function EarthGlobe({
  locale,
  copy,
  active,
  mobile,
  reducedMotion,
  quality,
}: {
  locale: HomeLocale;
  copy: Readonly<HomeExperienceCopy>;
  active: boolean;
  mobile: boolean;
  reducedMotion: boolean;
  quality: VisualQuality;
}) {
  const { ref: hostRef, size } = useElementSize<HTMLDivElement>();
  const globeRef = useRef<GlobeApi>(null);
  const contextLostCleanup = useRef<(() => void) | null>(null);
  const cloudResource = useRef<{
    mesh: { onBeforeRender?: () => void };
    geometry: { dispose(): void };
    material: { dispose(): void };
  } | null>(null);
  const runtimeRef = useRef<Awaited<typeof import('three')> | null>(null);
  const textureRef = useRef<Array<{ anisotropy: number; needsUpdate: boolean; dispose(): void }>>([]);
  const materialRef = useRef<{ dispose(): void } | null>(null);
  const activeRef = useRef(active);
  const mobileRef = useRef(mobile);
  const reducedRef = useRef(reducedMotion);
  const [GlobeComponent, setGlobeComponent] = useState<DynamicGlobe | null>(null);
  const [material, setMaterial] = useState<unknown>(null);
  const [status, setStatus] = useState<GlobeStatus>('checking');
  const [arcOffset, setArcOffset] = useState(0);
  const [inView, setInView] = useState(false);
  const [loadRequested, setLoadRequested] = useState(false);

  activeRef.current = active;
  mobileRef.current = mobile;
  reducedRef.current = reducedMotion;

  const qualityProfile = useMemo(() => {
    const profiles: Record<VisualQuality, {
      arcCount: number;
      globeResolution: number;
      pointResolution: number;
      ringResolution: number;
      cloudSegments: number;
      anisotropy: number;
      pixelRatio: number;
      autoRotateSpeed: number;
      loadWebGlOnMobile: boolean;
    }> = {
      low: { arcCount: 4, globeResolution: 8, pointResolution: 4, ringResolution: 24, cloudSegments: 32, anisotropy: 2, pixelRatio: 1.15, autoRotateSpeed: 0.12, loadWebGlOnMobile: false },
      balanced: { arcCount: 11, globeResolution: 5, pointResolution: 8, ringResolution: 64, cloudSegments: 80, anisotropy: 8, pixelRatio: 1.5, autoRotateSpeed: 0.24, loadWebGlOnMobile: false },
      high: { arcCount: 14, globeResolution: 3.5, pointResolution: 12, ringResolution: 96, cloudSegments: 112, anisotropy: 12, pixelRatio: 1.75, autoRotateSpeed: 0.36, loadWebGlOnMobile: false },
      ultra: { arcCount: 16, globeResolution: 2.5, pointResolution: 16, ringResolution: 128, cloudSegments: 160, anisotropy: 16, pixelRatio: 2, autoRotateSpeed: 0.52, loadWebGlOnMobile: true },
    };
    return profiles[quality];
  }, [quality]);

  const useWebGlOnDevice = !reducedMotion && (!mobile || qualityProfile.loadWebGlOnMobile);

  const nodes = useMemo(
    () => (mobile && quality !== 'ultra' ? allNodes.slice(0, quality === 'low' ? 5 : 7) : allNodes),
    [mobile, quality],
  );

  const allArcs = useMemo<GlobeArc[]>(
    () =>
      arcPairs.map(([startIndex, endIndex], index) => {
        const start = allNodes[startIndex];
        const end = allNodes[endIndex];
        return {
          id: `${start.id}-${end.id}`,
          startLat: start.lat,
          startLng: start.lng,
          endLat: end.lat,
          endLng: end.lng,
          color: ['rgba(156, 255, 0, .03)', 'rgba(156, 255, 0, .95)', 'rgba(220, 255, 190, .08)'],
          altitude: 0.12 + (index % 5) * 0.035,
          stroke: mobile ? 0.22 : 0.3,
          dashLength: 0.24 + (index % 3) * 0.05,
          dashGap: 0.85,
          dashInitialGap: (index * 0.17) % 1,
          dashAnimateTime: reducedMotion ? 0 : 1800 + (index % 5) * 310,
        };
      }),
    [mobile, reducedMotion],
  );

  const arcs = useMemo(() => {
    const count = mobile && quality !== 'ultra' ? Math.min(qualityProfile.arcCount, 6) : qualityProfile.arcCount;
    return Array.from(
      { length: count },
      (_, index) => allArcs[(index + arcOffset) % allArcs.length],
    );
  }, [allArcs, arcOffset, mobile, quality, qualityProfile.arcCount]);

  useEffect(() => {
    if (reducedMotion || !useWebGlOnDevice || !active) return;
    const interval = window.setInterval(() => {
      if (!document.hidden) setArcOffset((offset) => (offset + 1) % allArcs.length);
    }, quality === 'ultra' ? 2600 : quality === 'high' ? 3200 : 3900);
    return () => window.clearInterval(interval);
  }, [active, allArcs.length, quality, reducedMotion, useWebGlOnDevice]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setInView(Boolean(entry?.isIntersecting));
    }, { threshold: 0.01 });
    observer.observe(host);
    return () => observer.disconnect();
  }, [hostRef]);

  useEffect(() => {
    if (loadRequested || !active || !inView || !useWebGlOnDevice) return;

    const timer = window.setTimeout(() => {
      if (!qualityProfile.loadWebGlOnMobile && window.matchMedia('(max-width: 767px), (pointer: coarse)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      setLoadRequested(true);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [active, inView, loadRequested, qualityProfile.loadWebGlOnMobile, useWebGlOnDevice]);

  useEffect(() => {
    if (!loadRequested) return;

    const maxTextureSize = getWebGLMaxTextureSize();
    if (!maxTextureSize) {
      setStatus('unavailable');
      return;
    }

    const textureSet = earthTextureSetForQuality(quality, maxTextureSize);
    let cancelled = false;
    setStatus('loading');
    setMaterial(null);

    void Promise.all([import('react-globe.gl'), import('three')])
      .then(async ([globeModule, THREE]) => {
        const loader = new THREE.TextureLoader();
        const [dayTexture, nightTexture, cloudTexture, bumpTexture, specularTexture] =
          await Promise.all([
            loader.loadAsync(textureSet.day),
            loader.loadAsync(textureSet.night),
            loader.loadAsync(textureSet.clouds),
            loader.loadAsync(textureSet.bump),
            loader.loadAsync(textureSet.specular),
          ]);

        dayTexture.colorSpace = THREE.SRGBColorSpace;
        nightTexture.colorSpace = THREE.SRGBColorSpace;
        cloudTexture.colorSpace = THREE.SRGBColorSpace;

        const globeMaterial = new THREE.MeshPhongMaterial({
          map: dayTexture,
          bumpMap: bumpTexture,
          bumpScale: textureSet.resolution === '8k' ? 0.045 : 0.035,
          emissiveMap: nightTexture,
          emissive: new THREE.Color('#8dff70'),
          emissiveIntensity: 0.36,
          specularMap: specularTexture,
          shininess: textureSet.resolution === '8k' ? 28 : 22,
          specular: new THREE.Color('#8aa092'),
        });

        if (cancelled) {
          globeMaterial.dispose();
          dayTexture.dispose();
          nightTexture.dispose();
          cloudTexture.dispose();
          bumpTexture.dispose();
          specularTexture.dispose();
          return;
        }

        runtimeRef.current = THREE;
        textureRef.current = [dayTexture, nightTexture, cloudTexture, bumpTexture, specularTexture];
        materialRef.current = globeMaterial;
        setMaterial(globeMaterial);
        setGlobeComponent(() => globeModule.default as DynamicGlobe);
      })
      .catch(() => {
        if (!cancelled) setStatus('unavailable');
      });

    return () => {
      cancelled = true;
      contextLostCleanup.current?.();
      contextLostCleanup.current = null;
      if (cloudResource.current && globeRef.current) {
        globeRef.current.scene().remove(cloudResource.current.mesh);
      }
      cloudResource.current?.geometry.dispose();
      cloudResource.current?.material.dispose();
      cloudResource.current = null;
      materialRef.current?.dispose();
      materialRef.current = null;
      textureRef.current.forEach((texture) => texture.dispose());
      textureRef.current = [];
    };
  }, [loadRequested, quality]);

  const configureGlobe = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;
    const controls = globe.controls();
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = useWebGlOnDevice;
    controls.autoRotate = active && useWebGlOnDevice;
    controls.autoRotateSpeed = mobile ? qualityProfile.autoRotateSpeed * 1.35 : qualityProfile.autoRotateSpeed;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    globe.pointOfView(
      { lat: 20, lng: mobile ? 128 : 142, altitude: mobile ? 1.92 : 1.66 },
      reducedMotion ? 0 : 700,
    );
  }, [active, mobile, qualityProfile.autoRotateSpeed, reducedMotion, useWebGlOnDevice]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    configureGlobe();
    if (active && useWebGlOnDevice && !document.hidden) globe.resumeAnimation();
    else globe.pauseAnimation();
  }, [active, configureGlobe, useWebGlOnDevice]);

  useEffect(() => {
    const onVisibility = () => {
      const globe = globeRef.current;
      if (!globe) return;
      if (
        document.hidden ||
        !activeRef.current ||
        reducedRef.current
      ) globe.pauseAnimation();
      else globe.resumeAnimation();
      const controls = globe.controls();
      controls.autoRotate =
        !document.hidden &&
        activeRef.current &&
        !reducedRef.current;
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const handleGlobeReady = useCallback(() => {
    const globe = globeRef.current;
    const THREE = runtimeRef.current;
    if (!globe || !THREE) return;

    configureGlobe();
    const renderer = globe.renderer();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, qualityProfile.pixelRatio));
    const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), qualityProfile.anisotropy);
    textureRef.current.forEach((texture) => {
      texture.anisotropy = maxAnisotropy;
      texture.needsUpdate = true;
    });

    const ambient = new THREE.AmbientLight('#5b765f', 1.35);
    const sunlight = new THREE.DirectionalLight('#ffffff', 2.25);
    sunlight.position.set(-140, 65, 170);
    const rim = new THREE.DirectionalLight('#8dff55', 0.72);
    rim.position.set(150, -40, -110);
    globe.lights([ambient, sunlight, rim]);

    if (!cloudResource.current) {
      const geometry = new THREE.SphereGeometry(
        globe.getGlobeRadius() * 1.008,
        qualityProfile.cloudSegments,
        qualityProfile.cloudSegments,
      );
      const cloudTexture = textureRef.current[2];
      const cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudTexture,
        alphaMap: cloudTexture,
        color: new THREE.Color('#f1fff1'),
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
        shininess: 2,
      });
      const cloudMesh = new THREE.Mesh(geometry, cloudMaterial);
      let previousTime = performance.now();
      cloudMesh.onBeforeRender = () => {
        const now = performance.now();
        const delta = Math.min(0.05, (now - previousTime) / 1000);
        previousTime = now;
        if (
          !document.hidden &&
          activeRef.current &&
          !reducedRef.current
        ) {
          cloudMesh.rotation.y += delta * 0.012;
        }
      };
      globe.scene().add(cloudMesh);
      cloudResource.current = { mesh: cloudMesh, geometry, material: cloudMaterial };
    }

    const onContextLost = (event: Event) => {
      event.preventDefault();
      setStatus('unavailable');
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    contextLostCleanup.current = () =>
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);

    if (active && useWebGlOnDevice && !document.hidden) globe.resumeAnimation();
    else globe.pauseAnimation();
    setStatus('ready');
  }, [active, configureGlobe, qualityProfile.anisotropy, qualityProfile.cloudSegments, qualityProfile.pixelRatio, reducedMotion, useWebGlOnDevice]);

  const failed = status === 'unavailable';
  const showWebGL = status === 'ready' && useWebGlOnDevice;
  const defaults = copyDefaults[locale];

  return (
    <div ref={hostRef} className={`hx-globe${showWebGL ? ' is-ready' : ''}`}>
      <StaticEarthFallback
        locale={locale}
        copy={copy}
        failed={failed && useWebGlOnDevice}
        quality={quality}
      />
      {GlobeComponent !== null && material !== null && !failed && useWebGlOnDevice && (
        <div className="hx-globe__renderer" aria-hidden="true">
          <GlobeComponent
            ref={globeRef}
            width={size.width}
            height={size.height}
            backgroundColor="rgba(0,0,0,0)"
            globeMaterial={material}
            showAtmosphere
            atmosphereColor="#9cff76"
            atmosphereAltitude={0.18}
            globeCurvatureResolution={qualityProfile.globeResolution}
            pointsData={nodes}
            pointLat="lat"
            pointLng="lng"
            pointColor="color"
            pointAltitude="altitude"
            pointRadius="radius"
            pointResolution={qualityProfile.pointResolution}
            pointLabel="label"
            pointsMerge={false}
            ringsData={nodes}
            ringLat="lat"
            ringLng="lng"
            ringColor="ringColor"
            ringMaxRadius="ringRadius"
            ringPropagationSpeed="ringSpeed"
            ringRepeatPeriod="ringPeriod"
            ringResolution={qualityProfile.ringResolution}
            arcsData={arcs}
            arcStartLat="startLat"
            arcStartLng="startLng"
            arcEndLat="endLat"
            arcEndLng="endLng"
            arcColor="color"
            arcAltitude="altitude"
            arcStroke="stroke"
            arcDashLength="dashLength"
            arcDashGap="dashGap"
            arcDashInitialGap="dashInitialGap"
            arcDashAnimateTime="dashAnimateTime"
            arcsTransitionDuration={reducedMotion ? 0 : 900}
            enablePointerInteraction
            onGlobeReady={handleGlobeReady}
          />
        </div>
      )}
      <p className="hx-globe__hint">
        <span aria-hidden="true">[ orbit.control ]</span>
        {reducedMotion
          ? copy.reducedGlobeHint ?? defaults.reducedGlobeHint
          : mobile
            ? copy.mobileGlobeHint ?? defaults.mobileGlobeHint
            : copy.globeHint ?? defaults.globeHint}
      </p>
    </div>
  );
}

function ProjectPanel({
  project,
  locale,
  copy,
  href,
  position,
  revealed,
  elementRef,
}: {
  project: HomeFeaturedProject;
  locale: HomeLocale;
  copy: Readonly<HomeExperienceCopy>;
  href: string;
  position: number;
  revealed: boolean;
  elementRef: (node: HTMLElement | null) => void;
}) {
  const [accent, accentRgb] = accentMap[project.accent ?? 'lime'] ?? accentMap.lime;
  const style: ProjectStyle = {
    '--project-accent': accent,
    '--project-accent-rgb': accentRgb,
    '--reveal-delay': '0ms',
  };

  const indexLabel = project.index ?? String(position + 1).padStart(2, '0');

  return (
    <article
      ref={elementRef}
      className={`hx-project hx-reveal-card${revealed ? ' is-revealed' : ''}`}
      style={style}
      data-index={indexLabel}
      data-reveal-position={position}
    >
      <div className="hx-project__grid" aria-hidden="true" />
      <div className="hx-project__signal" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="hx-project__inner">
        <div className="hx-project__meta">
          <span className="hx-project__index">{indexLabel}</span>
          <span className="hx-project__status">{projectStatusLabel(project, locale)}</span>
        </div>
        <div className="hx-project__copy">
          <p className="hx-project__kicker">{localize(project.kicker, locale)}</p>
          <h3>{project.name}</h3>
          <p className="hx-project__description">{localize(project.short, locale)}</p>
          <a className="hx-project__link" href={href}>
            <span>{copy.viewProject}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="hx-project__telemetry" aria-hidden="true">
          <span>NODE::{project.slug.toUpperCase()}</span>
          <span>STATE::{project.status?.toUpperCase() ?? 'FEATURED'}</span>
          <span>LATENCY::{37 + position * 11}MS</span>
        </div>
      </div>
    </article>
  );
}

export default function HomeExperience({
  locale,
  homeCopy,
  featuredProjects,
  nav,
  projectsHref,
  sessionStorageKey = DEFAULT_SESSION_KEY,
}: HomeExperienceProps) {
  const [bootPhase, setBootPhase] = useState<BootPhase>('checking');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const mobile = useMediaQuery('(max-width: 767px), (pointer: coarse)');
  const visualQuality = useSiteVisualQuality();
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const projectRefs = useRef<Array<HTMLElement | null>>([]);
  const philosophyRef = useRef<HTMLElement>(null);
  const [revealedProjects, setRevealedProjects] = useState<ReadonlySet<number>>(() => new Set());
  const [cardRevealReady, setCardRevealReady] = useState(false);
  const [philosophyArmed, setPhilosophyArmed] = useState(false);
  const [philosophyRevealed, setPhilosophyRevealed] = useState(false);
  const [revealCycle, setRevealCycle] = useState(0);
  const active = bootPhase === 'hidden';
  const projectsNav = nav.find((item) => item.id === 'projects') ?? nav[1];
  const resolvedProjectsHref = projectsHref ?? projectsNav?.href ?? '/projects/';
  const projects = featuredProjects.slice(0, 2);
  const defaults = copyDefaults[locale];

  useEffect(() => {
    const replayOnRestore = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      setRevealedProjects(new Set());
      setCardRevealReady(false);
      setPhilosophyArmed(false);
      setPhilosophyRevealed(false);
      setRevealCycle((cycle) => cycle + 1);
    };

    window.addEventListener('pageshow', replayOnRestore);
    return () => window.removeEventListener('pageshow', replayOnRestore);
  }, []);

  useEffect(() => {
    if (mobile || reducedMotion || !('IntersectionObserver' in window)) {
      setCardRevealReady(false);
      setRevealedProjects(new Set(projects.map((_, index) => index)));
      return;
    }

    setCardRevealReady(true);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => {
          const verticalOrder = a.boundingClientRect.top - b.boundingClientRect.top;
          if (Math.abs(verticalOrder) > 1) return verticalOrder;
          return Number((a.target as HTMLElement).dataset.revealPosition ?? 0)
            - Number((b.target as HTMLElement).dataset.revealPosition ?? 0);
        });

      if (!visible.length) return;

      const positions = visible.map((entry, stagger) => {
        const element = entry.target as HTMLElement;
        element.style.setProperty('--reveal-delay', `${stagger * 40}ms`);
        observer.unobserve(element);
        return Number(element.dataset.revealPosition);
      });

      setRevealedProjects((current) => {
        const next = new Set(current);
        positions.forEach((position) => next.add(position));
        return next;
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    projectRefs.current.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [mobile, projects.length, reducedMotion, revealCycle]);

  useEffect(() => {
    if (reducedMotion) {
      setPhilosophyRevealed(true);
      return;
    }

    const element = philosophyRef.current;
    if (!element) return;

    setPhilosophyArmed(true);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setPhilosophyRevealed(true);
      observer.disconnect();
    }, { threshold: 0.28, rootMargin: '0px 0px -10% 0px' });

    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion, revealCycle]);

  return (
    <div className={`hx-home${active ? ' is-experience-active' : ''}${cardRevealReady ? ' is-card-reveal-ready' : ''}`}>
      <BootSequence
        locale={locale}
        copy={homeCopy}
        storageKey={sessionStorageKey}
        phase={bootPhase}
        setPhase={setBootPhase}
      />

      <section ref={heroRef} className="hx-hero" aria-labelledby="home-title">
        <MatrixCanvas
          active={active}
          mobile={mobile}
          reducedMotion={reducedMotion}
        />
        <EarthGlobe
          locale={locale}
          copy={homeCopy}
          active={active}
          mobile={mobile}
          reducedMotion={reducedMotion}
          quality={visualQuality}
        />
        <GlyphParticleCanvas
          hostRef={heroRef}
          titleRef={titleRef}
          active={active}
          reducedMotion={reducedMotion}
        />

        <div className="hx-hero__reticle" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="hx-hero__content">
          <p className="hx-hero__system">
            <span aria-hidden="true" />
            {homeCopy.system}
          </p>
          <span id="home-title" className="hx-sr-only">{TITLE}</span>
          <DecodedTitle
            active={active}
            reducedMotion={reducedMotion}
            titleRef={titleRef}
          />
          <nav
            className="hx-hero__nav"
            aria-label={homeCopy.heroNavigationLabel ?? defaults.heroNavigationLabel}
          >
            {nav.map((item, index) => (
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                key={`${item.href}-${index}`}
              >
                <span aria-hidden="true">0{index + 1}</span>
                {localize(item.label, locale)}
              </a>
            ))}
          </nav>
        </div>

        <a className="hx-scroll" href="#featured-work">
          <span>{homeCopy.scroll}</span>
          <span className="hx-scroll__track" aria-hidden="true"><i /></span>
        </a>
      </section>

      <section className="hx-featured" id="featured-work" aria-labelledby="featured-title">
        <header className="hx-section-head">
          <p>{homeCopy.featuredEyebrow}</p>
          <div>
            <h2 id="featured-title">{homeCopy.featuredTitle}</h2>
            <span>{homeCopy.featuredBody}</span>
          </div>
        </header>

        <div className="hx-projects">
          {projects.map((project, index) => (
            <ProjectPanel
              project={project}
              locale={locale}
              copy={homeCopy}
              href={projectHref(project, resolvedProjectsHref)}
              position={index}
              revealed={revealedProjects.has(index)}
              elementRef={(node) => { projectRefs.current[index] = node; }}
              key={project.slug}
            />
          ))}
        </div>
      </section>

      <section
        ref={philosophyRef}
        className={`hx-philosophy${philosophyArmed ? ' is-armed' : ''}${philosophyRevealed ? ' is-revealed' : ''}`}
        aria-labelledby="philosophy-title"
      >
        <div className="hx-philosophy__matrix" aria-hidden="true">
          <span>CURIOUS</span><span>FAIL</span><span>LEARN</span><span>REFINE</span>
        </div>
        <div className="hx-philosophy__inner">
          <p className="hx-philosophy__eyebrow">{homeCopy.philosophyEyebrow}</p>
          <blockquote id="philosophy-title">
            {homeCopy.philosophy.map((line) => (
              <span className="hx-philosophy__line" key={line.highlight}>
                {line.start}<strong>{line.highlight}</strong>{line.end}
              </span>
            ))}
          </blockquote>
          <p className="hx-philosophy__body">{homeCopy.philosophyBody}</p>
          {homeCopy.bioinformaticsNote && (
            <p className="hx-philosophy__bio">{homeCopy.bioinformaticsNote}</p>
          )}
          <a className="hx-philosophy__link" href={resolvedProjectsHref}>
            {homeCopy.allProjects}<span aria-hidden="true"> →</span>
          </a>
        </div>
      </section>
    </div>
  );
}
