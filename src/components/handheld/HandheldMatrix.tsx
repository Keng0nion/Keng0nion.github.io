import { useMemo, useState, type CSSProperties } from 'react';
import { scoreLabels, type HandheldCategory, type HandheldDevice, type ScoreKey } from '../../data/handheldDevices';
import type { Locale } from '../../lib/site';

type CategoryFilter = 'all' | HandheldCategory;
type QuickFilter = 'all' | 'performance' | 'battery' | 'oled' | 'refresh' | 'portable' | 'budget';
type PreferenceProfile = 'balanced' | 'power' | 'travel' | 'budget' | 'screen';

interface Props {
  locale: Locale;
  devices: HandheldDevice[];
}

interface DeviceWithFit {
  device: HandheldDevice;
  fit: number;
}

const profileWeights: Record<PreferenceProfile, Record<ScoreKey, number>> = {
  balanced: {
    performance: 0.2,
    battery: 0.18,
    screen: 0.17,
    portability: 0.15,
    value: 0.18,
    cooling: 0.12,
  },
  power: {
    performance: 0.4,
    battery: 0.08,
    screen: 0.18,
    portability: 0.05,
    value: 0.12,
    cooling: 0.17,
  },
  travel: {
    performance: 0.1,
    battery: 0.3,
    screen: 0.12,
    portability: 0.28,
    value: 0.12,
    cooling: 0.08,
  },
  budget: {
    performance: 0.12,
    battery: 0.16,
    screen: 0.1,
    portability: 0.17,
    value: 0.35,
    cooling: 0.1,
  },
  screen: {
    performance: 0.16,
    battery: 0.12,
    screen: 0.38,
    portability: 0.08,
    value: 0.1,
    cooling: 0.16,
  },
};

const copy = {
  en: {
    eyebrow: 'Published web tool',
    title: 'Handheld Matrix',
    subtitle: 'A GitHub Pages-ready handheld gaming device selector.',
    intro:
      'Filter a curated sample of handheld gaming devices, choose a preference profile, and compare up to four candidates across hardware, display, battery, portability, value, and cooling.',
    dataset: 'Dataset',
    datasetValue: '8 sample devices · static local data · no backend required',
    search: 'Search',
    searchPlaceholder: 'name / brand / alias / cpu',
    category: 'Category',
    priceLimit: 'Max price',
    weightLimit: 'Max weight',
    quickFilter: 'Quick filter',
    profile: 'Preference profile',
    results: 'Recommended devices',
    selected: 'Comparison matrix',
    selectedHint: 'Select 2–4 devices to unlock the comparison table and radar view.',
    clear: 'Clear',
    diffOnly: 'Show differences only',
    allRows: 'Show all rows',
    add: 'Add to compare',
    remove: 'Remove',
    limit: 'Maximum 4 devices can be compared at once.',
    noResults: 'No devices match the current filters.',
    bestMatch: 'Best match',
    fitScore: 'Fit score',
    sourceNote:
      'Scores are project-defined comparison scores for exploration. Prices and specifications should be rechecked before purchasing.',
    categories: {
      all: 'All',
      pc: 'PC handhelds',
      console: 'Console',
      retro: 'Retro',
    },
    quickFilters: {
      all: 'All devices',
      performance: 'Performance > 85',
      battery: 'Battery > 80',
      oled: 'OLED only',
      refresh: '120Hz+',
      portable: 'Under 500g',
      budget: 'Under ¥1500',
    },
    profiles: {
      balanced: { label: 'Balanced', description: 'No single metric dominates.' },
      power: { label: 'Power', description: 'Performance and cooling first.' },
      travel: { label: 'Travel', description: 'Battery and portability first.' },
      budget: { label: 'Budget', description: 'Value and low-cost options first.' },
      screen: { label: 'Screen', description: 'Display quality and refresh rate first.' },
    },
    scoreNames: {
      performance: 'Performance',
      battery: 'Battery',
      screen: 'Screen',
      portability: 'Portability',
      value: 'Value',
      cooling: 'Cooling',
    },
    specs: {
      price: 'Price',
      weight: 'Weight',
      batteryWh: 'Battery Wh',
      batteryH: 'Estimated battery',
      screen: 'Screen',
      refresh: 'Refresh',
      resolution: 'Resolution',
      cpu: 'CPU',
      gpu: 'GPU',
      ram: 'RAM',
      storage: 'Storage',
      tdp: 'TDP',
      arch: 'Architecture',
      category: 'Category',
    },
  },
  zh: {
    eyebrow: '已发布网页工具',
    title: 'Handheld Matrix',
    subtitle: '可直接通过 GitHub Pages 发布的掌机设备挑选工具。',
    intro:
      '你可以筛选掌上游戏设备样本，选择偏好画像，并从硬件、屏幕、续航、便携性、性价比和散热等维度同时对比最多四台设备。',
    dataset: '数据集',
    datasetValue: '8 台示例设备 · 静态本地数据 · 无需后端',
    search: '搜索',
    searchPlaceholder: '名称 / 品牌 / 别名 / CPU',
    category: '设备类型',
    priceLimit: '最高价格',
    weightLimit: '最高重量',
    quickFilter: '快速筛选',
    profile: '偏好画像',
    results: '推荐设备',
    selected: '对比矩阵',
    selectedHint: '选择 2–4 台设备后，可以查看规格对比表和六维雷达图。',
    clear: '清空',
    diffOnly: '只看差异',
    allRows: '显示全部',
    add: '加入对比',
    remove: '移除',
    limit: '最多只能同时对比 4 台设备。',
    noResults: '当前筛选条件下没有匹配设备。',
    bestMatch: '最佳匹配',
    fitScore: '匹配分',
    sourceNote:
      '评分是本项目自定义的探索性对比分数。购买前仍应重新核对价格、规格和数据来源。',
    categories: {
      all: '全部',
      pc: 'PC 掌机',
      console: '主机',
      retro: '复古掌机',
    },
    quickFilters: {
      all: '全部设备',
      performance: '性能 > 85',
      battery: '续航 > 80',
      oled: '只看 OLED',
      refresh: '120Hz+',
      portable: '低于 500g',
      budget: '低于 ¥1500',
    },
    profiles: {
      balanced: { label: '均衡', description: '各维度都不极端偏科。' },
      power: { label: '性能', description: '优先考虑性能和散热。' },
      travel: { label: '外出', description: '优先考虑续航和便携性。' },
      budget: { label: '预算', description: '优先考虑性价比和低价格。' },
      screen: { label: '屏幕', description: '优先考虑屏幕素质和刷新率。' },
    },
    scoreNames: {
      performance: '性能',
      battery: '续航',
      screen: '屏幕',
      portability: '便携',
      value: '性价比',
      cooling: '散热',
    },
    specs: {
      price: '价格',
      weight: '重量',
      batteryWh: '电池容量',
      batteryH: '预估续航',
      screen: '屏幕',
      refresh: '刷新率',
      resolution: '分辨率',
      cpu: 'CPU',
      gpu: 'GPU',
      ram: '内存',
      storage: '存储',
      tdp: 'TDP',
      arch: '架构',
      category: '类型',
    },
  },
} as const;

const rankColors = ['var(--hm-cyan)', 'var(--hm-pink)', 'var(--hm-violet)', 'var(--hm-lime)'];

function roundUp(value: number, unit: number): number {
  return Math.ceil(value / unit) * unit;
}

function formatCny(value: number): string {
  return `¥${value.toLocaleString()}`;
}

function formatNumber(value: number, suffix: string): string {
  return `${value.toLocaleString()}${suffix}`;
}

function fitScore(device: HandheldDevice, profile: PreferenceProfile): number {
  const weights = profileWeights[profile];
  const total = scoreLabels.reduce((sum, key) => sum + device.scores[key] * weights[key], 0);
  return Math.round(total);
}

function scoreClass(score: number): string {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'ok';
  return 'low';
}

function normalizedSearchText(device: HandheldDevice): string {
  return [
    device.name,
    device.brand,
    device.category,
    ...device.aliases,
    device.hardware.cpu,
    device.hardware.gpu,
    device.hardware.architecture,
    device.screen.type,
    device.screen.resolution,
  ]
    .join(' ')
    .toLowerCase();
}

function RadarChart({ devices, locale }: { devices: HandheldDevice[]; locale: Locale }) {
  const labels = copy[locale].scoreNames;
  const size = 260;
  const center = size / 2;
  const radius = 92;
  const angleStep = (Math.PI * 2) / scoreLabels.length;

  const pointFor = (index: number, value: number) => {
    const angle = -Math.PI / 2 + index * angleStep;
    const r = radius * value;
    return {
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r,
    };
  };

  const polygon = (scale: number) => scoreLabels
    .map((_, index) => {
      const point = pointFor(index, scale);
      return `${point.x},${point.y}`;
    })
    .join(' ');

  return (
    <svg className="hm-radar" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Device score radar chart">
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon key={scale} points={polygon(scale)} className="hm-radar-grid" />
      ))}
      {scoreLabels.map((key, index) => {
        const end = pointFor(index, 1.08);
        const lineEnd = pointFor(index, 1);
        return (
          <g key={key}>
            <line x1={center} y1={center} x2={lineEnd.x} y2={lineEnd.y} className="hm-radar-axis" />
            <text x={end.x} y={end.y} textAnchor="middle" dominantBaseline="middle" className="hm-radar-label">
              {labels[key]}
            </text>
          </g>
        );
      })}
      {devices.map((device, deviceIndex) => {
        const points = scoreLabels
          .map((key, index) => {
            const point = pointFor(index, device.scores[key] / 100);
            return `${point.x},${point.y}`;
          })
          .join(' ');
        const color = rankColors[deviceIndex % rankColors.length];
        return (
          <polygon
            key={device.id}
            points={points}
            className="hm-radar-shape"
            style={{ '--hm-radar-color': color } as CSSProperties}
          />
        );
      })}
    </svg>
  );
}

function HandheldMatrix({ locale, devices }: Props) {
  const labels = copy[locale];
  const priceCeiling = useMemo(() => roundUp(Math.max(...devices.map((device) => device.priceCny)), 500), [devices]);
  const weightCeiling = useMemo(() => roundUp(Math.max(...devices.map((device) => device.weightG)), 50), [devices]);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [profile, setProfile] = useState<PreferenceProfile>('balanced');
  const [priceLimit, setPriceLimit] = useState(priceCeiling);
  const [weightLimit, setWeightLimit] = useState(weightCeiling);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [diffOnly, setDiffOnly] = useState(false);
  const [limitNotice, setLimitNotice] = useState(false);

  const rankedDevices = useMemo<DeviceWithFit[]>(() => {
    const needle = query.trim().toLowerCase();
    return devices
      .filter((device) => !needle || normalizedSearchText(device).includes(needle))
      .filter((device) => category === 'all' || device.category === category)
      .filter((device) => device.priceCny <= priceLimit && device.weightG <= weightLimit)
      .filter((device) => {
        if (quickFilter === 'performance') return device.scores.performance > 85;
        if (quickFilter === 'battery') return device.scores.battery > 80;
        if (quickFilter === 'oled') return device.screen.type === 'OLED';
        if (quickFilter === 'refresh') return device.screen.refreshHz >= 120;
        if (quickFilter === 'portable') return device.weightG < 500;
        if (quickFilter === 'budget') return device.priceCny < 1500;
        return true;
      })
      .map((device) => ({ device, fit: fitScore(device, profile) }))
      .sort((a, b) => b.fit - a.fit || a.device.priceCny - b.device.priceCny);
  }, [category, devices, priceLimit, profile, query, quickFilter, weightLimit]);

  const selectedDevices = useMemo(
    () => selectedIds.map((id) => devices.find((device) => device.id === id)).filter((device): device is HandheldDevice => Boolean(device)),
    [devices, selectedIds],
  );

  const bestDeviceId = rankedDevices[0]?.device.id;

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        setLimitNotice(false);
        return current.filter((selectedId) => selectedId !== id);
      }
      if (current.length >= 4) {
        setLimitNotice(true);
        window.setTimeout(() => setLimitNotice(false), 2200);
        return current;
      }
      setLimitNotice(false);
      return [...current, id];
    });
  };

  const resetFilters = () => {
    setQuery('');
    setCategory('all');
    setQuickFilter('all');
    setProfile('balanced');
    setPriceLimit(priceCeiling);
    setWeightLimit(weightCeiling);
  };

  const compareRows = useMemo(() => {
    const rows: Array<{
      key: string;
      label: string;
      better?: 'min' | 'max';
      value: (device: HandheldDevice) => string | number;
      display?: (value: string | number) => string;
    }> = [
      { key: 'price', label: labels.specs.price, better: 'min', value: (device) => device.priceCny, display: (value) => formatCny(Number(value)) },
      { key: 'weight', label: labels.specs.weight, better: 'min', value: (device) => device.weightG, display: (value) => formatNumber(Number(value), 'g') },
      { key: 'batteryWh', label: labels.specs.batteryWh, better: 'max', value: (device) => device.batteryWh, display: (value) => formatNumber(Number(value), 'Wh') },
      { key: 'batteryH', label: labels.specs.batteryH, better: 'max', value: (device) => device.estimatedBatteryH, display: (value) => formatNumber(Number(value), 'h') },
      { key: 'screen', label: labels.specs.screen, value: (device) => `${device.screen.sizeInch}\" ${device.screen.type}` },
      { key: 'refresh', label: labels.specs.refresh, better: 'max', value: (device) => device.screen.refreshHz, display: (value) => formatNumber(Number(value), 'Hz') },
      { key: 'resolution', label: labels.specs.resolution, value: (device) => device.screen.resolution },
      { key: 'cpu', label: labels.specs.cpu, value: (device) => device.hardware.cpu },
      { key: 'gpu', label: labels.specs.gpu, value: (device) => device.hardware.gpu },
      { key: 'ram', label: labels.specs.ram, better: 'max', value: (device) => device.hardware.ramGb, display: (value) => formatNumber(Number(value), 'GB') },
      { key: 'storage', label: labels.specs.storage, better: 'max', value: (device) => device.hardware.storageGb, display: (value) => formatNumber(Number(value), 'GB') },
      { key: 'tdp', label: labels.specs.tdp, value: (device) => `${device.hardware.tdpMinW}-${device.hardware.tdpMaxW}W` },
      { key: 'arch', label: labels.specs.arch, value: (device) => device.hardware.architecture },
      { key: 'category', label: labels.specs.category, value: (device) => labels.categories[device.category] },
      ...scoreLabels.map((key) => ({
        key,
        label: labels.scoreNames[key],
        better: 'max' as const,
        value: (device: HandheldDevice) => device.scores[key],
      })),
    ];
    return rows;
  }, [labels]);

  return (
    <section className="hm-shell" aria-labelledby="handheld-matrix-heading">
      <style>{`
        .hm-shell {
          --hm-bg: #05060d;
          --hm-panel: rgba(9, 14, 30, .78);
          --hm-panel-strong: rgba(14, 22, 46, .96);
          --hm-line: rgba(69, 232, 255, .18);
          --hm-line-strong: rgba(69, 232, 255, .44);
          --hm-text: #f5f8f1;
          --hm-muted: #9ba896;
          --hm-dim: #657060;
          --hm-cyan: #45e8ff;
          --hm-lime: #9cff00;
          --hm-amber: #ffbf47;
          --hm-violet: #ae7bff;
          --hm-pink: #ff5c88;
          position: relative;
          overflow: hidden;
          padding: clamp(3rem, 7vw, 6rem) 0 clamp(5rem, 10vw, 8rem);
        }
        .hm-shell::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 0%, rgba(69, 232, 255, .11), transparent 28rem),
            radial-gradient(circle at 88% 14%, rgba(174, 123, 255, .14), transparent 30rem),
            repeating-linear-gradient(90deg, rgba(69, 232, 255, .035) 0 1px, transparent 1px 74px);
          pointer-events: none;
        }
        .hm-shell > * { position: relative; z-index: 1; }
        .hm-hero {
          display: grid;
          gap: 2rem;
          align-items: end;
          margin-bottom: clamp(2.5rem, 6vw, 4rem);
        }
        .hm-title {
          margin: 0;
          max-width: 12ch;
          font-family: var(--display);
          font-size: clamp(3rem, 8vw, 7rem);
          line-height: .9;
          letter-spacing: -.07em;
        }
        .hm-title span { color: var(--hm-cyan); text-shadow: 0 0 30px rgba(69, 232, 255, .25); }
        .hm-subtitle {
          margin: 1rem 0 0;
          color: var(--hm-muted);
          font-family: var(--mono);
          font-size: .82rem;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .hm-intro-card {
          border: 1px solid var(--hm-line);
          background: var(--hm-panel);
          padding: clamp(1.2rem, 3vw, 1.8rem);
          box-shadow: 0 0 44px rgba(69, 232, 255, .08), inset 0 0 40px rgba(69, 232, 255, .03);
          backdrop-filter: blur(18px);
        }
        .hm-intro-card p { margin: 0; color: #c6cec2; }
        .hm-meta-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1px;
          margin-top: 1.4rem;
          background: var(--hm-line);
          border: 1px solid var(--hm-line);
        }
        .hm-meta-cell { background: rgba(3, 5, 3, .78); padding: 1rem; }
        .hm-meta-cell strong { display: block; color: var(--hm-cyan); font-family: var(--mono); font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; }
        .hm-meta-cell span { display: block; margin-top: .4rem; color: var(--hm-muted); font-size: .88rem; }
        .hm-panel {
          border: 1px solid var(--hm-line);
          background: var(--hm-panel);
          box-shadow: 0 0 34px rgba(0,0,0,.22), inset 0 0 38px rgba(69, 232, 255, .025);
          backdrop-filter: blur(18px);
        }
        .hm-controls { padding: clamp(1rem, 3vw, 1.5rem); margin-bottom: 1.5rem; }
        .hm-controls-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
          align-items: end;
        }
        .hm-field label, .hm-control-label {
          display: block;
          margin-bottom: .45rem;
          color: var(--hm-dim);
          font-family: var(--mono);
          font-size: .68rem;
          letter-spacing: .13em;
          text-transform: uppercase;
        }
        .hm-field input[type='search'], .hm-field select {
          width: 100%;
          min-height: 3rem;
          border: 1px solid var(--hm-line);
          border-radius: 0;
          background: rgba(3, 5, 3, .8);
          color: var(--hm-text);
          padding: 0 .95rem;
          outline: none;
          transition: border-color .2s ease, box-shadow .2s ease;
        }
        .hm-field input[type='search']:focus, .hm-field select:focus {
          border-color: var(--hm-cyan);
          box-shadow: 0 0 22px rgba(69, 232, 255, .12);
        }
        .hm-range-value { color: var(--hm-cyan); font-family: var(--mono); font-size: .8rem; }
        .hm-field input[type='range'] { width: 100%; accent-color: var(--hm-cyan); }
        .hm-chips { display: flex; flex-wrap: wrap; gap: .55rem; margin-top: .8rem; }
        .hm-chip {
          min-height: 2.45rem;
          border: 1px solid var(--hm-line);
          background: rgba(3, 5, 3, .65);
          color: var(--hm-muted);
          padding: 0 .8rem;
          font-family: var(--mono);
          font-size: .68rem;
          letter-spacing: .08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color .2s ease, border-color .2s ease, background .2s ease, transform .2s ease;
        }
        .hm-chip:hover, .hm-chip.is-active {
          border-color: var(--hm-cyan);
          color: var(--hm-text);
          background: rgba(69, 232, 255, .08);
          transform: translateY(-1px);
        }
        .hm-chip.is-active { box-shadow: inset 0 0 22px rgba(69, 232, 255, .06); }
        .hm-profile-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: .75rem; margin-top: 1rem; }
        .hm-profile {
          min-height: 5.5rem;
          text-align: left;
          border: 1px solid var(--hm-line);
          background: rgba(3, 5, 3, .62);
          color: var(--hm-muted);
          padding: .9rem;
          cursor: pointer;
          transition: border-color .2s ease, background .2s ease, transform .2s ease;
        }
        .hm-profile strong { display: block; color: var(--hm-text); font-family: var(--display); font-size: 1rem; }
        .hm-profile span { display: block; margin-top: .35rem; font-size: .82rem; line-height: 1.45; }
        .hm-profile:hover, .hm-profile.is-active { border-color: var(--hm-pink); background: rgba(255, 92, 136, .08); transform: translateY(-1px); }
        .hm-section-head {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 1rem;
          margin: 2.2rem 0 1rem;
        }
        .hm-section-head h2 { margin: 0; font-family: var(--display); font-size: clamp(1.8rem, 4vw, 3.4rem); letter-spacing: -.045em; }
        .hm-count { color: var(--hm-cyan); font-family: var(--mono); font-size: .78rem; letter-spacing: .08em; }
        .hm-device-grid { display: grid; gap: 1px; background: var(--hm-line); border: 1px solid var(--hm-line); }
        .hm-card {
          position: relative;
          min-height: 28rem;
          display: flex;
          flex-direction: column;
          background: rgba(8, 12, 20, .96);
          padding: clamp(1.25rem, 3vw, 1.6rem);
          overflow: hidden;
        }
        .hm-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 92% 0%, rgba(69, 232, 255, .16), transparent 34%), radial-gradient(circle at 8% 100%, rgba(255, 92, 136, .10), transparent 30%);
          opacity: .58;
          transition: opacity .25s ease, transform .35s ease;
          pointer-events: none;
        }
        .hm-card:hover::before { opacity: 1; transform: scale(1.04); }
        .hm-card > * { position: relative; z-index: 1; }
        .hm-card.is-best { border-top: 1px solid var(--hm-lime); }
        .hm-card-top { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-start; }
        .hm-brand { color: var(--hm-dim); font-family: var(--mono); font-size: .68rem; letter-spacing: .13em; text-transform: uppercase; }
        .hm-card h3 { margin: .5rem 0 0; font-family: var(--display); font-size: clamp(1.45rem, 3vw, 2.2rem); line-height: 1; letter-spacing: -.04em; }
        .hm-badges { display: flex; flex-wrap: wrap; gap: .45rem; justify-content: flex-end; }
        .hm-badge {
          display: inline-flex;
          align-items: center;
          min-height: 1.65rem;
          border: 1px solid var(--hm-line);
          color: var(--hm-muted);
          padding: 0 .55rem;
          font-family: var(--mono);
          font-size: .62rem;
          letter-spacing: .08em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .hm-badge.accent { border-color: var(--hm-lime); color: var(--hm-lime); box-shadow: 0 0 16px rgba(156, 255, 0, .12); }
        .hm-fitscore { margin: 1.2rem 0; display: grid; gap: .4rem; }
        .hm-fitscore-row { display: flex; justify-content: space-between; gap: 1rem; color: var(--hm-muted); font-family: var(--mono); font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; }
        .hm-score-track { height: .48rem; background: rgba(255,255,255,.08); overflow: hidden; }
        .hm-score-fill { width: var(--hm-score); height: 100%; background: linear-gradient(90deg, var(--hm-pink), var(--hm-violet), var(--hm-cyan)); box-shadow: 0 0 18px rgba(69, 232, 255, .3); }
        .hm-metric-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .6rem; margin: .2rem 0 1rem; }
        .hm-metric { background: rgba(3, 5, 3, .62); border: 1px solid rgba(69, 232, 255, .1); padding: .75rem .6rem; }
        .hm-metric span { display: block; color: var(--hm-dim); font-family: var(--mono); font-size: .6rem; letter-spacing: .1em; text-transform: uppercase; }
        .hm-metric strong { display: block; margin-top: .25rem; color: var(--hm-text); font-size: 1.15rem; line-height: 1.1; }
        .hm-spec-list { display: grid; gap: .5rem; margin: 0 0 1rem; color: #c6cec2; font-size: .88rem; }
        .hm-spec-line { display: grid; grid-template-columns: 4rem minmax(0, 1fr); gap: .65rem; }
        .hm-spec-line span:first-child { color: var(--hm-dim); font-family: var(--mono); font-size: .66rem; letter-spacing: .08em; text-transform: uppercase; }
        .hm-score-list { display: grid; gap: .5rem; margin-top: auto; }
        .hm-mini-score { display: grid; grid-template-columns: 5.8rem minmax(0, 1fr) 2rem; gap: .65rem; align-items: center; }
        .hm-mini-score span:first-child { color: var(--hm-dim); font-family: var(--mono); font-size: .64rem; letter-spacing: .08em; text-transform: uppercase; }
        .hm-mini-score strong { color: var(--hm-muted); font-family: var(--mono); font-size: .72rem; text-align: right; }
        .hm-mini-score strong.excellent { color: var(--hm-lime); }
        .hm-mini-score strong.good { color: var(--hm-cyan); }
        .hm-mini-score strong.ok { color: var(--hm-amber); }
        .hm-mini-score strong.low { color: var(--hm-pink); }
        .hm-card-action {
          width: 100%;
          min-height: 3rem;
          margin-top: 1rem;
          border: 1px solid var(--hm-line-strong);
          background: rgba(69, 232, 255, .05);
          color: var(--hm-text);
          font-family: var(--mono);
          font-size: .72rem;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background .2s ease, color .2s ease, transform .2s ease, border-color .2s ease;
        }
        .hm-card-action:hover { background: var(--hm-cyan); color: #071000; transform: translateY(-1px); }
        .hm-card-action.is-selected { border-color: var(--hm-pink); background: rgba(255, 92, 136, .12); color: var(--hm-pink); }
        .hm-card-action.is-selected:hover { background: var(--hm-pink); color: #071000; }
        .hm-empty { padding: 2rem; color: var(--hm-muted); font-family: var(--mono); text-align: center; }
        .hm-notice { margin: .8rem 0 0; color: var(--hm-pink); font-family: var(--mono); font-size: .75rem; }
        .hm-compare { padding: clamp(1rem, 3vw, 1.5rem); }
        .hm-selected-chips { display: flex; flex-wrap: wrap; gap: .55rem; margin: 1rem 0 0; }
        .hm-selected-chip {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          min-height: 2.45rem;
          border: 1px solid var(--hm-line);
          background: rgba(3, 5, 3, .62);
          color: var(--hm-muted);
          padding: 0 .75rem;
          font-family: var(--mono);
          font-size: .7rem;
        }
        .hm-selected-chip button { border: 0; background: transparent; color: var(--hm-pink); cursor: pointer; }
        .hm-compare-top { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; align-items: center; }
        .hm-compare-actions { display: flex; flex-wrap: wrap; gap: .55rem; }
        .hm-compare-grid { display: grid; gap: 1rem; margin-top: 1rem; }
        .hm-radar-panel, .hm-table-wrap { border: 1px solid var(--hm-line); background: rgba(3, 5, 3, .56); padding: 1rem; min-width: 0; }
        .hm-radar { width: min(100%, 24rem); margin: 0 auto; overflow: visible; }
        .hm-radar-grid { fill: none; stroke: rgba(69, 232, 255, .18); stroke-width: 1; }
        .hm-radar-axis { stroke: rgba(69, 232, 255, .12); stroke-width: 1; }
        .hm-radar-label { fill: var(--hm-muted); font-family: var(--mono); font-size: .55rem; letter-spacing: .04em; }
        .hm-radar-shape { fill: color-mix(in srgb, var(--hm-radar-color) 18%, transparent); stroke: var(--hm-radar-color); stroke-width: 2; opacity: .9; }
        .hm-radar-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: .7rem; margin-top: .8rem; }
        .hm-radar-legend span { display: inline-flex; align-items: center; gap: .4rem; color: var(--hm-muted); font-family: var(--mono); font-size: .68rem; }
        .hm-radar-dot { width: .65rem; height: .65rem; background: var(--hm-dot); box-shadow: 0 0 12px var(--hm-dot); }
        .hm-table-scroll { overflow-x: auto; }
        .hm-table { width: 100%; min-width: 44rem; border-collapse: collapse; font-family: var(--mono); font-size: .72rem; }
        .hm-table th, .hm-table td { padding: .75rem .8rem; border-bottom: 1px solid rgba(69, 232, 255, .1); text-align: left; vertical-align: top; }
        .hm-table th { color: var(--hm-cyan); font-weight: 600; }
        .hm-table td:first-child { color: var(--hm-dim); text-transform: uppercase; letter-spacing: .06em; width: 9rem; }
        .hm-table .is-best { color: var(--hm-lime); text-shadow: 0 0 12px rgba(156, 255, 0, .18); }
        .hm-reset { margin-top: 1rem; }
        @media (min-width: 720px) {
          .hm-hero { grid-template-columns: minmax(0, 1.05fr) minmax(18rem, .95fr); }
          .hm-device-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (min-width: 1080px) {
          .hm-device-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .hm-compare-grid { grid-template-columns: minmax(18rem, .7fr) minmax(0, 1.3fr); }
        }
        @supports not (color: color-mix(in srgb, white, transparent)) {
          .hm-radar-shape { fill: transparent; }
        }
      `}</style>

      <div className="container">
        <div className="hm-hero">
          <div>
            <p className="eyebrow">{labels.eyebrow}</p>
            <h1 className="hm-title" id="handheld-matrix-heading">
              Handheld <span>Matrix</span>
            </h1>
            <p className="hm-subtitle">{labels.subtitle}</p>
          </div>
          <div className="hm-intro-card">
            <p>{labels.intro}</p>
            <div className="hm-meta-grid" aria-label={labels.dataset}>
              <div className="hm-meta-cell">
                <strong>{labels.dataset}</strong>
                <span>{labels.datasetValue}</span>
              </div>
              <div className="hm-meta-cell">
                <strong>GitHub Pages</strong>
                <span>{locale === 'en' ? 'Static website release' : '静态网站发布版'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hm-panel hm-controls" aria-label={locale === 'en' ? 'Device filters' : '设备筛选'}>
          <div className="hm-controls-grid">
            <div className="hm-field">
              <label htmlFor="hm-search">{labels.search}</label>
              <input
                id="hm-search"
                type="search"
                value={query}
                placeholder={labels.searchPlaceholder}
                onChange={(event) => setQuery(event.currentTarget.value)}
              />
            </div>
            <div className="hm-field">
              <label htmlFor="hm-category">{labels.category}</label>
              <select id="hm-category" value={category} onChange={(event) => setCategory(event.currentTarget.value as CategoryFilter)}>
                {(Object.keys(labels.categories) as CategoryFilter[]).map((key) => (
                  <option key={key} value={key}>{labels.categories[key]}</option>
                ))}
              </select>
            </div>
            <div className="hm-field">
              <label htmlFor="hm-price">{labels.priceLimit}: <span className="hm-range-value">{formatCny(priceLimit)}</span></label>
              <input
                id="hm-price"
                type="range"
                min={Math.min(...devices.map((device) => device.priceCny))}
                max={priceCeiling}
                step="100"
                value={priceLimit}
                onChange={(event) => setPriceLimit(Number(event.currentTarget.value))}
              />
            </div>
            <div className="hm-field">
              <label htmlFor="hm-weight">{labels.weightLimit}: <span className="hm-range-value">{formatNumber(weightLimit, 'g')}</span></label>
              <input
                id="hm-weight"
                type="range"
                min={Math.min(...devices.map((device) => device.weightG))}
                max={weightCeiling}
                step="10"
                value={weightLimit}
                onChange={(event) => setWeightLimit(Number(event.currentTarget.value))}
              />
            </div>
          </div>

          <div className="hm-control-label hm-reset">{labels.quickFilter}</div>
          <div className="hm-chips">
            {(Object.keys(labels.quickFilters) as QuickFilter[]).map((key) => (
              <button
                className={`hm-chip ${quickFilter === key ? 'is-active' : ''}`}
                key={key}
                type="button"
                onClick={() => setQuickFilter(key)}
              >
                {labels.quickFilters[key]}
              </button>
            ))}
            <button className="hm-chip" type="button" onClick={resetFilters}>RESET</button>
          </div>

          <div className="hm-control-label hm-reset">{labels.profile}</div>
          <div className="hm-profile-grid">
            {(Object.keys(labels.profiles) as PreferenceProfile[]).map((key) => (
              <button
                key={key}
                type="button"
                className={`hm-profile ${profile === key ? 'is-active' : ''}`}
                onClick={() => setProfile(key)}
              >
                <strong>{labels.profiles[key].label}</strong>
                <span>{labels.profiles[key].description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="hm-section-head">
          <h2>{labels.results}</h2>
          <span className="hm-count">{rankedDevices.length} / {devices.length}</span>
        </div>

        <div className="hm-device-grid">
          {rankedDevices.length === 0 && <div className="hm-empty">{labels.noResults}</div>}
          {rankedDevices.map(({ device, fit }, index) => {
            const isSelected = selectedIds.includes(device.id);
            const isBest = device.id === bestDeviceId;
            return (
              <article className={`hm-card ${isBest ? 'is-best' : ''}`} key={device.id}>
                <div className="hm-card-top">
                  <div>
                    <div className="hm-brand">{device.brand} // {device.year}</div>
                    <h3>{device.name}</h3>
                  </div>
                  <div className="hm-badges">
                    <span className="hm-badge">#{String(index + 1).padStart(2, '0')}</span>
                    {isBest && <span className="hm-badge accent">{labels.bestMatch}</span>}
                    <span className="hm-badge">{labels.categories[device.category]}</span>
                  </div>
                </div>

                <div className="hm-fitscore">
                  <div className="hm-fitscore-row">
                    <span>{labels.fitScore}</span>
                    <strong>{fit}</strong>
                  </div>
                  <div className="hm-score-track" aria-hidden="true">
                    <div className="hm-score-fill" style={{ '--hm-score': `${fit}%` } as CSSProperties} />
                  </div>
                </div>

                <div className="hm-metric-grid">
                  <div className="hm-metric"><span>{labels.specs.price}</span><strong>{formatCny(device.priceCny)}</strong></div>
                  <div className="hm-metric"><span>{labels.specs.weight}</span><strong>{formatNumber(device.weightG, 'g')}</strong></div>
                  <div className="hm-metric"><span>{labels.specs.batteryH}</span><strong>{formatNumber(device.estimatedBatteryH, 'h')}</strong></div>
                </div>

                <div className="hm-spec-list">
                  <div className="hm-spec-line"><span>CPU</span><span>{device.hardware.cpu}</span></div>
                  <div className="hm-spec-line"><span>GPU</span><span>{device.hardware.gpu}</span></div>
                  <div className="hm-spec-line"><span>DISPLAY</span><span>{device.screen.sizeInch}\" {device.screen.type} · {device.screen.refreshHz}Hz · {device.screen.resolution}</span></div>
                  <div className="hm-spec-line"><span>RAM</span><span>{device.hardware.ramGb}GB · {device.hardware.storageGb}GB · {device.hardware.architecture}</span></div>
                </div>

                <div className="hm-score-list">
                  {scoreLabels.map((key) => (
                    <div className="hm-mini-score" key={key}>
                      <span>{labels.scoreNames[key]}</span>
                      <div className="hm-score-track" aria-hidden="true">
                        <div className="hm-score-fill" style={{ '--hm-score': `${device.scores[key]}%` } as CSSProperties} />
                      </div>
                      <strong className={scoreClass(device.scores[key])}>{device.scores[key]}</strong>
                    </div>
                  ))}
                </div>

                <button
                  className={`hm-card-action ${isSelected ? 'is-selected' : ''}`}
                  type="button"
                  onClick={() => toggleSelected(device.id)}
                >
                  {isSelected ? labels.remove : labels.add}
                </button>
              </article>
            );
          })}
        </div>

        <div className="hm-section-head">
          <h2>{labels.selected}</h2>
          <span className="hm-count">{selectedDevices.length} / 4</span>
        </div>

        <div className="hm-panel hm-compare">
          <div className="hm-compare-top">
            <p className="lede" style={{ margin: 0 }}>{labels.selectedHint}</p>
            <div className="hm-compare-actions">
              <button className="hm-chip" type="button" onClick={() => setDiffOnly((value) => !value)}>
                {diffOnly ? labels.allRows : labels.diffOnly}
              </button>
              <button className="hm-chip" type="button" onClick={() => setSelectedIds([])}>{labels.clear}</button>
            </div>
          </div>

          {limitNotice && <p className="hm-notice">{labels.limit}</p>}

          <div className="hm-selected-chips">
            {selectedDevices.map((device, index) => (
              <span className="hm-selected-chip" key={device.id}>
                <span className="hm-radar-dot" style={{ '--hm-dot': rankColors[index % rankColors.length] } as CSSProperties} />
                {device.name}
                <button type="button" onClick={() => toggleSelected(device.id)} aria-label={`${labels.remove} ${device.name}`}>×</button>
              </span>
            ))}
          </div>

          {selectedDevices.length >= 2 && (
            <div className="hm-compare-grid">
              <div className="hm-radar-panel">
                <RadarChart devices={selectedDevices} locale={locale} />
                <div className="hm-radar-legend">
                  {selectedDevices.map((device, index) => (
                    <span key={device.id}>
                      <span className="hm-radar-dot" style={{ '--hm-dot': rankColors[index % rankColors.length] } as CSSProperties} />
                      {device.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="hm-table-wrap">
                <div className="hm-table-scroll">
                  <table className="hm-table">
                    <thead>
                      <tr>
                        <th>PARAM</th>
                        {selectedDevices.map((device) => <th key={device.id}>{device.name}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {compareRows.map((row) => {
                        const rawValues = selectedDevices.map((device) => row.value(device));
                        const allSame = rawValues.every((value) => value === rawValues[0]);
                        if (diffOnly && allSame) return null;
                        const numericValues = rawValues.filter((value): value is number => typeof value === 'number');
                        const bestValue = row.better === 'min'
                          ? Math.min(...numericValues)
                          : row.better === 'max'
                            ? Math.max(...numericValues)
                            : undefined;
                        return (
                          <tr key={row.key}>
                            <td>{row.label}</td>
                            {rawValues.map((value, index) => {
                              const isBest = typeof value === 'number' && bestValue !== undefined && value === bestValue && !allSame;
                              return (
                                <td className={isBest ? 'is-best' : ''} key={`${row.key}-${selectedDevices[index].id}`}>
                                  {row.display ? row.display(value) : value}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <p className="hm-notice">{labels.sourceNote}</p>
        </div>
      </div>
    </section>
  );
}

export default HandheldMatrix;
