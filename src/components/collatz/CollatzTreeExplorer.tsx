import { useMemo, useState } from 'react';
import type { Locale } from '../../lib/site';

interface Props {
  locale: Locale;
}

interface TreeNode {
  id: number;
  value: number;
  depth: number;
  x: number;
  y: number;
  label: string;
}

interface TreeEdge {
  from: number;
  to: number;
}

interface TreeData {
  nodes: TreeNode[];
  edges: TreeEdge[];
}

const copy = {
  en: {
    eyebrow: 'Interactive mathematics',
    title: 'Collatz Reverse Tree',
    subtitle: 'Start from 1 and explore which numbers can flow back to it.',
    simple:
      'The Collatz rule sends an even number to n/2 and an odd number to 3n+1. This page runs the question backwards: for a number n, which numbers could have arrived at n in one step? The 1→4→2→1 loop is pruned so the result stays a readable tree, not a proof of the conjecture.',
    depth: 'Tree depth',
    labels: 'Labels',
    zoom: 'Zoom',
    zoomOut: 'Zoom out',
    zoomIn: 'Zoom in',
    resetZoom: 'Reset',
    raw: 'Raw numbers',
    mod: 'n = 6m + k',
    nodes: 'nodes',
    edges: 'edges',
    selected: 'Selected number',
    trajectory: 'Forward trajectory back to 1',
    steps: 'steps',
    maxValue: 'max value',
    forkRule: 'Fork rule',
    forkRuleBody:
      'Every node has the even reverse predecessor 2n. A second odd predecessor exists only when n ≡ 4 mod 6, except that the 4→1 reverse edge is omitted to remove the root cycle.',
    hint: 'Click a node to inspect its forward path.',
    noProof: 'Visualization only: this does not prove the Collatz conjecture.',
  },
  zh: {
    eyebrow: '交互式数学',
    title: 'Collatz 逆向树',
    subtitle: '从 1 出发，反向探索哪些数字可以流回到 1。',
    simple:
      'Collatz 规则是：偶数变成 n/2，奇数变成 3n+1。这个页面反过来问：对一个数字 n，哪些数字经过一步会到达 n？为了让图保持成树，我去掉了 1→4→2→1 循环对应的反向边；这只是可视化探索，不是对猜想的证明。',
    depth: '树深度',
    labels: '标签',
    zoom: '缩放',
    zoomOut: '缩小',
    zoomIn: '放大',
    resetZoom: '重置',
    raw: '原始数字',
    mod: 'n = 6m + k',
    nodes: '节点',
    edges: '边',
    selected: '选中数字',
    trajectory: '正向回到 1 的轨迹',
    steps: '步数',
    maxValue: '最大值',
    forkRule: '分叉规则',
    forkRuleBody:
      '每个节点都有偶数逆向前驱 2n。只有当 n ≡ 4 mod 6 时才存在第二个奇数前驱；但 n=4 时会回到 1，所以显示时省略这条边以去掉根部循环。',
    hint: '点击节点可以查看它正向回到 1 的路径。',
    noProof: '仅用于可视化：这不是 Collatz 猜想的证明。',
  },
} as const;

function labelFor(value: number, mode: 'raw' | 'mod'): string {
  if (mode === 'raw') return String(value);
  return `(${Math.floor(value / 6)}, ${value % 6})`;
}

function reverseChildren(value: number): number[] {
  const children = [value * 2];
  if (value !== 4 && (value - 1) % 3 === 0) {
    const odd = (value - 1) / 3;
    if (odd > 0 && odd % 2 === 1) children.push(odd);
  }
  return children;
}

function buildTree(depth: number, labelMode: 'raw' | 'mod'): TreeData {
  const levels = new Map<number, number[]>();
  const edges: TreeEdge[] = [];
  const seen = new Set<number>([1]);
  levels.set(0, [1]);

  for (let currentDepth = 0; currentDepth < depth; currentDepth += 1) {
    const currentLevel = levels.get(currentDepth) ?? [];
    const nextLevel: number[] = [];
    for (const value of currentLevel) {
      for (const child of reverseChildren(value)) {
        if (seen.has(child)) continue;
        seen.add(child);
        nextLevel.push(child);
        edges.push({ from: value, to: child });
      }
    }
    levels.set(currentDepth + 1, nextLevel);
  }

  const nodes: TreeNode[] = [];
  const width = 1120;
  const levelGap = 112;
  const top = 40;
  for (let currentDepth = 0; currentDepth <= depth; currentDepth += 1) {
    const level = levels.get(currentDepth) ?? [];
    const gap = width / (level.length + 1);
    level.forEach((value, index) => {
      nodes.push({
        id: value,
        value,
        depth: currentDepth,
        x: gap * (index + 1),
        y: top + currentDepth * levelGap,
        label: labelFor(value, labelMode),
      });
    });
  }

  return { nodes, edges };
}

function forwardTrajectory(start: number): number[] {
  const path = [start];
  let value = start;
  let guard = 0;
  while (value !== 1 && guard < 1000) {
    value = value % 2 === 0 ? value / 2 : value * 3 + 1;
    path.push(value);
    guard += 1;
  }
  return path;
}

function CollatzTreeExplorer({ locale }: Props) {
  const labels = copy[locale];
  const [depth, setDepth] = useState(10);
  const [labelMode, setLabelMode] = useState<'raw' | 'mod'>('raw');
  const [zoom, setZoom] = useState(0.75);
  const tree = useMemo(() => buildTree(depth, labelMode), [depth, labelMode]);
  const [selectedValue, setSelectedValue] = useState(1);
  const trajectory = useMemo(() => forwardTrajectory(selectedValue), [selectedValue]);
  const trajectorySet = useMemo(() => new Set(trajectory), [trajectory]);
  const selectedNode = tree.nodes.find((node) => node.value === selectedValue) ?? tree.nodes[0];
  const svgHeight = 90 + depth * 112;
  const renderedWidth = Math.round(1120 * zoom);
  const renderedHeight = Math.round(svgHeight * zoom);
  const maxTrajectoryValue = Math.max(...trajectory);

  return (
    <section className="ct-shell" aria-labelledby="collatz-title">
      <style>{`
        .ct-shell {
          --ct-bg: #020709;
          --ct-panel: rgba(8, 16, 22, .8);
          --ct-panel-strong: rgba(12, 24, 32, .96);
          --ct-line: rgba(69, 232, 255, .18);
          --ct-line-strong: rgba(69, 232, 255, .44);
          --ct-text: #f5f8f1;
          --ct-muted: #9ba896;
          --ct-dim: #657060;
          --ct-cyan: #45e8ff;
          --ct-lime: #9cff00;
          --ct-amber: #ffbf47;
          --ct-rose: #ff5c88;
          position: relative;
          overflow: hidden;
          padding: clamp(3rem, 7vw, 6rem) 0 clamp(5rem, 10vw, 8rem);
        }
        .ct-shell::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 12% 4%, rgba(69, 232, 255, .12), transparent 26rem),
            radial-gradient(circle at 86% 15%, rgba(156, 255, 0, .10), transparent 28rem),
            repeating-linear-gradient(0deg, rgba(69, 232, 255, .025) 0 1px, transparent 1px 54px);
          pointer-events: none;
        }
        .ct-shell > * { position: relative; z-index: 1; }
        .ct-hero { display: grid; gap: 2rem; align-items: end; margin-bottom: 2rem; }
        .ct-title { margin: 0; max-width: 13ch; font-family: var(--display); font-size: clamp(3rem, 8vw, 7rem); line-height: .9; letter-spacing: -.07em; }
        .ct-title span { color: var(--ct-cyan); text-shadow: 0 0 30px rgba(69, 232, 255, .22); }
        .ct-subtitle { margin: 1rem 0 0; color: var(--ct-muted); font-family: var(--mono); font-size: .82rem; letter-spacing: .08em; text-transform: uppercase; }
        .ct-card { border: 1px solid var(--ct-line); background: var(--ct-panel); padding: clamp(1.1rem, 3vw, 1.6rem); backdrop-filter: blur(18px); box-shadow: inset 0 0 38px rgba(69, 232, 255, .03); }
        .ct-card p { margin: 0; color: #c6cec2; }
        .ct-controls { display: grid; gap: 1rem; margin: 1.4rem 0 1rem; }
        .ct-field label, .ct-label { display: block; margin-bottom: .45rem; color: var(--ct-dim); font-family: var(--mono); font-size: .68rem; letter-spacing: .13em; text-transform: uppercase; }
        .ct-field input[type='range'] { width: 100%; accent-color: var(--ct-cyan); }
        .ct-value { color: var(--ct-cyan); font-family: var(--mono); }
        .ct-buttons { display: flex; flex-wrap: wrap; gap: .55rem; }
        .ct-zoom-controls { display: flex; flex-wrap: wrap; align-items: center; gap: .65rem; min-width: min(100%, 24rem); }
        .ct-zoom-controls input { flex: 1 1 10rem; accent-color: var(--ct-cyan); }
        .ct-zoom-chip { color: var(--ct-cyan); font-family: var(--mono); font-size: .74rem; min-width: 3.5rem; text-align: right; }
        .ct-button { min-height: 2.6rem; border: 1px solid var(--ct-line); background: rgba(3, 5, 3, .65); color: var(--ct-muted); padding: 0 .85rem; font-family: var(--mono); font-size: .7rem; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; }
        .ct-button:hover, .ct-button.is-active { color: var(--ct-text); border-color: var(--ct-cyan); background: rgba(69, 232, 255, .08); }
        .ct-meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; background: var(--ct-line); border: 1px solid var(--ct-line); margin-top: 1rem; }
        .ct-meta div { background: rgba(3, 5, 3, .72); padding: .9rem; }
        .ct-meta strong { display: block; color: var(--ct-cyan); font-family: var(--mono); font-size: .7rem; text-transform: uppercase; letter-spacing: .1em; }
        .ct-meta span { display: block; color: var(--ct-muted); margin-top: .25rem; }
        .ct-layout { display: grid; gap: 1rem; }
        .ct-graph-panel, .ct-side-panel { border: 1px solid var(--ct-line); background: var(--ct-panel); min-width: 0; }
        .ct-graph-head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--ct-line); color: var(--ct-muted); font-family: var(--mono); font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; }
        .ct-graph-scroll { overflow: auto; max-height: min(72vh, 58rem); scroll-behavior: smooth; }
        .ct-graph { display: block; background: radial-gradient(circle at center, rgba(69, 232, 255, .04), transparent 60%); }
        .ct-edge { stroke: rgba(69, 232, 255, .2); stroke-width: 1.4; }
        .ct-edge.is-path { stroke: var(--ct-lime); stroke-width: 2.6; filter: drop-shadow(0 0 5px rgba(156, 255, 0, .55)); }
        .ct-node circle { fill: #071013; stroke: rgba(69, 232, 255, .55); stroke-width: 1.5; transition: fill .15s ease, stroke .15s ease; }
        .ct-node:hover circle { fill: rgba(69, 232, 255, .16); stroke: var(--ct-cyan); }
        .ct-node.is-path circle { stroke: var(--ct-lime); fill: rgba(156, 255, 0, .13); }
        .ct-node.is-selected circle { stroke: var(--ct-rose); fill: rgba(255, 92, 136, .18); stroke-width: 2.4; }
        .ct-node text { fill: var(--ct-text); font-family: var(--mono); font-size: 11px; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
        .ct-side-panel { padding: 1rem; display: grid; gap: 1rem; align-content: start; }
        .ct-side-panel h2 { margin: 0; font-family: var(--display); font-size: clamp(1.7rem, 4vw, 3rem); letter-spacing: -.04em; }
        .ct-stat-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; background: var(--ct-line); border: 1px solid var(--ct-line); }
        .ct-stat { background: rgba(3, 5, 3, .72); padding: .85rem; }
        .ct-stat span { display: block; color: var(--ct-dim); font-family: var(--mono); font-size: .62rem; text-transform: uppercase; letter-spacing: .09em; }
        .ct-stat strong { display: block; margin-top: .2rem; color: var(--ct-cyan); font-size: 1.35rem; line-height: 1.1; }
        .ct-path { display: flex; flex-wrap: wrap; gap: .45rem; }
        .ct-path span { border: 1px solid var(--ct-line); background: rgba(3, 5, 3, .72); color: var(--ct-muted); padding: .25rem .48rem; font-family: var(--mono); font-size: .72rem; }
        .ct-note { border-left: 1px solid var(--ct-lime); padding-left: .9rem; color: #c6cec2; }
        .ct-warning { color: var(--ct-amber) !important; font-family: var(--mono); font-size: .78rem; }
        @media (min-width: 820px) {
          .ct-hero { grid-template-columns: minmax(0, 1fr) minmax(20rem, .82fr); }
          .ct-controls { grid-template-columns: minmax(12rem, .9fr) minmax(12rem, 1.1fr); align-items: end; }
          .ct-layout { grid-template-columns: minmax(0, 1.35fr) minmax(20rem, .65fr); }
        }
      `}</style>

      <div className="container">
        <div className="ct-hero">
          <div>
            <p className="eyebrow">{labels.eyebrow}</p>
            <h1 className="ct-title" id="collatz-title">Collatz <span>Tree</span></h1>
            <p className="ct-subtitle">{labels.subtitle}</p>
          </div>
          <div className="ct-card">
            <p>{labels.simple}</p>
            <div className="ct-meta">
              <div><strong>{labels.forkRule}</strong><span>{labels.forkRuleBody}</span></div>
              <div><strong>{labels.noProof}</strong><span>{labels.hint}</span></div>
            </div>
          </div>
        </div>

        <div className="ct-card ct-controls">
          <div className="ct-field">
            <label htmlFor="ct-depth">{labels.depth}: <span className="ct-value">{depth}</span></label>
            <input id="ct-depth" type="range" min="1" max="18" step="1" value={depth} onChange={(event) => setDepth(Number(event.currentTarget.value))} />
          </div>
          <div>
            <span className="ct-label">{labels.labels}</span>
            <div className="ct-buttons">
              <button type="button" className={`ct-button ${labelMode === 'raw' ? 'is-active' : ''}`} onClick={() => setLabelMode('raw')}>{labels.raw}</button>
              <button type="button" className={`ct-button ${labelMode === 'mod' ? 'is-active' : ''}`} onClick={() => setLabelMode('mod')}>{labels.mod}</button>
            </div>
          </div>
        </div>

        <div className="ct-layout">
          <div className="ct-graph-panel">
            <div className="ct-graph-head">
              <span>{tree.nodes.length} {labels.nodes} · {tree.edges.length} {labels.edges}</span>
              <div className="ct-zoom-controls" aria-label={labels.zoom}>
                <button type="button" className="ct-button" onClick={() => setZoom((value) => Math.max(0.35, Number((value - 0.1).toFixed(2))))}>{labels.zoomOut}</button>
                <input
                  aria-label={labels.zoom}
                  type="range"
                  min="0.35"
                  max="1.4"
                  step="0.05"
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.currentTarget.value))}
                />
                <span className="ct-zoom-chip">{Math.round(zoom * 100)}%</span>
                <button type="button" className="ct-button" onClick={() => setZoom((value) => Math.min(1.4, Number((value + 0.1).toFixed(2))))}>{labels.zoomIn}</button>
                <button type="button" className="ct-button" onClick={() => setZoom(0.75)}>{labels.resetZoom}</button>
              </div>
            </div>
            <div className="ct-graph-scroll">
              <svg
                className="ct-graph"
                viewBox={`0 0 1120 ${svgHeight}`}
                width={renderedWidth}
                height={renderedHeight}
                style={{ width: `${renderedWidth}px`, height: `${renderedHeight}px` }}
                role="img"
                aria-label="Cycle-pruned reverse Collatz tree"
              >
                {tree.edges.map((edge) => {
                  const from = tree.nodes.find((node) => node.value === edge.from);
                  const to = tree.nodes.find((node) => node.value === edge.to);
                  if (!from || !to) return null;
                  const isPath = trajectorySet.has(from.value) && trajectorySet.has(to.value);
                  return <line key={`${edge.from}-${edge.to}`} className={`ct-edge ${isPath ? 'is-path' : ''}`} x1={from.x} y1={from.y + 16} x2={to.x} y2={to.y - 16} />;
                })}
                {tree.nodes.map((node) => {
                  const selected = selectedNode?.value === node.value;
                  const inPath = trajectorySet.has(node.value);
                  const radius = Math.max(18, Math.min(34, 14 + node.label.length * 3.2));
                  return (
                    <g
                      className={`ct-node ${selected ? 'is-selected' : ''} ${inPath ? 'is-path' : ''}`}
                      key={node.value}
                      role="button"
                      tabIndex={0}
                      transform={`translate(${node.x} ${node.y})`}
                      onClick={() => setSelectedValue(node.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') setSelectedValue(node.value);
                      }}
                    >
                      <circle r={radius} />
                      <text>{node.label}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <aside className="ct-side-panel" aria-label={labels.selected}>
            <div>
              <p className="eyebrow">{labels.selected}</p>
              <h2>{selectedValue}</h2>
            </div>
            <div className="ct-stat-grid">
              <div className="ct-stat"><span>{labels.steps}</span><strong>{trajectory.length - 1}</strong></div>
              <div className="ct-stat"><span>{labels.maxValue}</span><strong>{maxTrajectoryValue}</strong></div>
            </div>
            <div>
              <span className="ct-label">{labels.trajectory}</span>
              <div className="ct-path">
                {trajectory.map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}
              </div>
            </div>
            <p className="ct-note">{labels.forkRuleBody}</p>
            <p className="ct-warning">{labels.noProof}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default CollatzTreeExplorer;
