import type { Locale } from '../lib/site';

export type ProjectStatus = 'completed' | 'in-development';

type Localized = Record<Locale, string>;

export interface Project {
  slug: string;
  name: string;
  kicker: Localized;
  short: Localized;
  description: Localized;
  status: ProjectStatus;
  github: string;
  homepage?: string;
  featured: boolean;
  accent: 'lime' | 'cyan' | 'violet' | 'amber' | 'rose';
  index: string;
}

export const projects: Project[] = [
  {
    slug: 'ecolab-antibiotic-modeling',
    name: 'Ecolab',
    kicker: { en: 'Scientific modeling workspace', zh: '科学建模工作区' },
    short: {
      en: 'A bilingual, local-first platform for exploring E. coli–antibiotic population dynamics through auditable and reproducible modeling workflows.',
      zh: '一个中英双语、本地优先的平台，通过可审计、可复现的建模流程探索大肠杆菌—抗生素种群动力学。',
    },
    description: {
      en: 'Ecolab is a bilingual, local-first scientific modeling application that brings an interactive learning sandbox and a real-data research workspace together on a versioned E. coli population-modeling core. Its learning modes explore untreated growth, zMIC, pharmacodynamic response, and piecewise-constant exposure to ampicillin, tetracycline, and ciprofloxacin. The research workspace adds data-quality checks, parameter scans and fitting, uncertainty propagation, sensitivity analysis, locked held-out evaluation, and auditable exports. The project is designed for teaching, model exploration, and research-oriented analysis rather than clinical decision-making, and it preserves limitations and negative validation results instead of hiding them.',
      zh: 'Ecolab 是一个中英双语、本地优先的科学建模应用，在同一套版本化的大肠杆菌种群模型核心上整合了交互式学习沙盒和真实数据研究工作区。学习模式可用于探索无药生长、zMIC、药效响应，以及氨苄西林、四环素和环丙沙星的分段恒定暴露；研究工作区则进一步提供数据质量检查、参数扫描与拟合、不确定性传播、敏感性分析、锁定留出评价和可审计导出。项目服务于教学、模型探索和研究型分析，而非临床决策，并选择如实保留模型限制与负面验证结果。',
    },
    status: 'completed',
    github: 'https://github.com/Keng0nion/ecolab-antibiotic-modeling',
    homepage: 'https://keng0nion.github.io/ecolab-antibiotic-modeling/',
    featured: true,
    accent: 'lime',
    index: '01',
  },
  {
    slug: 'collatz-reverse-tree',
    name: 'Collatz Reverse Tree Visualizer',
    kicker: { en: 'Interactive mathematics', zh: '交互式数学可视化' },
    short: {
      en: 'An interactive visualizer for exploring the cycle-pruned reverse Collatz tree with adjustable depth, trajectory highlighting, and dual coordinate views.',
      zh: '一个用于探索循环裁剪逆向 Collatz 树的交互式可视化工具，支持深度调节、轨迹高亮和双坐标视图。',
    },
    description: {
      en: 'Collatz Reverse Tree Visualizer is a client-side exploration tool for the cycle-pruned reverse Collatz tree rooted at 1. It constructs the graph breadth-first using the ordinary Collatz map while intentionally omitting the reverse edge from 4 to 1 to remove the 1–4–2 cycle and preserve a rooted-tree structure. Users can generate trees up to depth 30, switch labels between raw integers and coordinates defined by n = 6m + k, navigate the graph, click a node to inspect its forward trajectory back to 1, and export the fitted view as a PNG. The mathematical core is shared with automated Node.js tests and the project is presented as a computational visualization—not as a proof of the Collatz conjecture.',
      zh: 'Collatz 逆向树交互可视化器是一个完全运行在浏览器端的数学探索工具，用于展示以 1 为根的循环裁剪逆向 Collatz 树。它依据普通 Collatz 映射以广度优先方式生成图结构，并特意省略从 4 返回 1 的逆向边，以消除 1–4–2 循环并保持有根树结构。用户可以生成最高深度为 30 的树，在原始整数与由 n = 6m + k 定义的坐标之间切换，浏览图结构，点击节点查看其返回 1 的正向轨迹，并将适配后的视图导出为 PNG。核心数学逻辑配有 Node.js 自动测试；项目定位是计算可视化，而不是对 Collatz 猜想的证明。',
    },
    status: 'completed',
    github: 'https://github.com/Keng0nion/Collatz-Conjecture-Reverse-Tree-Interactive-Visualizer',
    featured: true,
    accent: 'cyan',
    index: '02',
  },
  {
    slug: 'velvet-ember',
    name: 'Velvet Ember',
    kicker: { en: 'Psychological horror prototype', zh: '心理恐怖游戏原型' },
    short: {
      en: 'A Godot 4 psychological horror prototype where a veteran’s apartment dissolves into a trench-like nightmare.',
      zh: '一款 Godot 4 心理恐怖原型：一名老兵的公寓逐渐溶解为战壕般的噩梦。',
    },
    description: {
      en: 'Velvet Ember is a work-in-progress 2D psychological horror demo built with Godot 4.7. It follows a war-traumatized veteran whose apartment is gradually invaded by fragmented battlefield memories. A continuous paranoia system drives cross-fades between reality and hallucination while chromatic aberration, distortion, color grading, tinnitus, camera breathing, and procedural audio reinforce the shifting perception. Dialogue and choices are authored through a custom Markdown narrative system. The current source contains one complete bad-ending route, while additional endings, final art, audio, exports, accessibility controls, and broader testing remain in development.',
      zh: '《Velvet Ember》是一款使用 Godot 4.7 制作、仍在开发中的二维心理恐怖 Demo。故事围绕一名饱受战争创伤的老兵展开：他的公寓逐渐被碎片化的战场记忆侵入。连续变化的偏执系统驱动现实与幻觉之间的交叉淡入淡出，色差、屏幕扭曲、调色、耳鸣、相机呼吸和程序化音频共同强化不断变化的感知。对话与选择通过自定义 Markdown 叙事系统编写。当前源码包含一条完整的坏结局路线，其余结局、最终美术与音频、平台导出、可访问性设置和更全面的测试仍在开发中。',
    },
    status: 'in-development',
    github: 'https://github.com/Keng0nion/velvet-ember-demo',
    featured: false,
    accent: 'rose',
    index: '03',
  },
  {
    slug: 'netrunner-security-monitor',
    name: 'NETRUNNER',
    kicker: { en: 'Local security observation', zh: '本地安全观测系统' },
    short: {
      en: 'A macOS-focused local security observation tool with historical comparison, evidence storage, and explainable risk prioritization.',
      zh: '一个面向 macOS 的本地安全观测工具，支持历史比较、证据存储和可解释风险排序。',
    },
    description: {
      en: 'NETRUNNER is a macOS-focused, local, batch-oriented security data collection and history-analysis project for networks, domains, and devices the user owns or is explicitly authorized to assess. It combines LAN, Wi-Fi and Bluetooth observations with optional Nmap, Masscan, Nikto, and selected OSINT collection, stores raw evidence and normalized history locally, and compares equivalent runs to identify new assets, changed ports, and persistent exposure. Its rule-based analyzer produces explainable 0–10 risk-priority scores while reporting collection coverage and blind spots. It is an experimental observation tool—not a real-time intrusion detection system or a guarantee of safety.',
      zh: 'NETRUNNER 是一个面向 macOS 的本地、批次式安全数据采集与历史分析项目，仅用于用户拥有或明确获准评估的网络、域名和设备。它将局域网、Wi-Fi 与蓝牙观测同可选的 Nmap、Masscan、Nikto 和特定 OSINT 采集结合，在本机保存原始证据与规范化历史，并通过比较同范围批次识别新资产、端口变化和持续暴露。其规则分析器生成可解释的 0–10 风险优先级，同时报告采集覆盖率与数据盲区。它是一项实验性安全观测工具，而非实时入侵检测系统或安全保证。',
    },
    status: 'in-development',
    github: 'https://github.com/Keng0nion/netrunner-security-monitor',
    featured: false,
    accent: 'amber',
    index: '04',
  },
  {
    slug: 'handheld-matrix',
    name: 'Handheld Matrix',
    kicker: { en: 'Device comparison dashboard', zh: '设备筛选与对比仪表盘' },
    short: {
      en: 'A cyberpunk browser dashboard for filtering and comparing handheld gaming devices across hardware, display, battery, and portability.',
      zh: '一个赛博朋克风浏览器仪表盘，可从硬件、屏幕、电池和便携性等维度筛选与对比掌机。',
    },
    description: {
      en: 'Handheld Matrix is a static single-page dashboard for exploring, filtering, and comparing handheld gaming devices. It presents a curated dataset through responsive cards, search, price and weight ranges, quick filters, and a comparison matrix for up to four devices. The comparison view includes specification rows, differences-only display, best-value highlighting, and a six-axis radar chart. Built with HTML, CSS, and vanilla JavaScript, the project also experiments with Matrix rain, glass surfaces, theme persistence, and 3D card interactions. Personalized ranking, export behavior, data sourcing, and release engineering remain in development.',
      zh: 'Handheld Matrix 是一个用于浏览、筛选和对比掌上游戏设备的静态单页仪表盘。它通过响应式卡片、搜索、价格与重量区间、快捷筛选，以及最多四台设备的对比矩阵来呈现精选数据。对比视图包含规格行、仅显示差异、最佳值高亮和六维雷达图。项目使用 HTML、CSS 与原生 JavaScript 构建，并尝试了 Matrix 数字雨、毛玻璃表面、主题记忆和 3D 卡片交互。个性化排名、导出功能、数据来源说明和正式发布工程仍在开发中。',
    },
    status: 'in-development',
    github: 'https://github.com/Keng0nion/HANDHELD-MATRIX-V3.0',
    featured: false,
    accent: 'violet',
    index: '05',
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export const statusLabels: Record<Locale, Record<ProjectStatus, string>> = {
  en: { completed: 'Completed', 'in-development': 'In development' },
  zh: { completed: '已完成', 'in-development': '开发中' },
};

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
