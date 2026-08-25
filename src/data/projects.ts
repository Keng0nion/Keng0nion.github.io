import type { Locale } from '../lib/site';

export type ProjectStatus = 'completed' | 'in-development';

type Localized = Record<Locale, string>;

export interface Project {
  slug: string;
  name: string;
  kicker: Localized;
  short: Localized;
  description: Localized;
  skills: Localized;
  progress?: Localized;
  nextStep?: Localized;
  quickStartLabel?: Localized;
  quickStartCommand?: Localized;
  quickStartNote?: Localized;
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
      en: 'Ecolab is a bilingual, local-first workspace for learning and testing an E. coli population model. Users can run antibiotic-exposure simulations in Learn / Sandbox, then inspect a Research Workspace with OD600 data-quality checks, parameter fitting, uncertainty and sensitivity analysis, and locked held-out evaluation. Its key result is honest reproducible analysis: the bundled 528-observation case reaches L3 data calibration but preserves the negative validation result and clearly states that it is not clinical advice.',
      zh: 'Ecolab 是一个中英双语、本地优先的大肠杆菌种群模型学习与研究工作区。用户可以在 Learn / Sandbox 中模拟抗生素暴露，再在 Research Workspace 中查看 OD600 数据质量检查、参数拟合、不确定性与敏感性分析，以及锁定留出评价。它最重要的成果是诚实可复现的分析：内置 528 个观测的数据案例达到 L3 数据校准，但保留负面验证结果，并明确说明不能用于临床建议。',
    },
    skills: {
      en: 'Scientific model design, data-quality reasoning, reproducible analysis, uncertainty and sensitivity evaluation, and communicating limitations honestly.',
      zh: '科学模型设计、数据质量判断、可复现分析、不确定性与敏感性评估，以及如实表达模型局限。',
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
      en: 'Collatz Reverse Tree Visualizer starts from 1 and builds the reverse Collatz tree so users can see which numbers can flow back to 1. It removes the 1–4–2 root cycle, lets users choose depth, switch between integer and n = 6m + k labels, and click a node to see its forward path. The new website adds a simple explanation and interactive demo, while the project remains a tested computational visualization rather than a proof of the conjecture.',
      zh: 'Collatz 逆向树可视化器从 1 出发反向生成 Collatz 树，让用户看到哪些数字最终可以流回 1。它去掉 1–4–2 根部循环，支持调节深度、切换原始整数和 n = 6m + k 标签，并点击节点查看正向路径。新的网页版本加入了简单解释和交互 Demo；项目定位仍然是带测试的计算可视化，而不是对猜想的证明。',
    },
    skills: {
      en: 'Graph construction, algorithmic reasoning, coordinate representation, automated testing, and explaining the boundary between visualization and proof.',
      zh: '图结构构建、算法推理、坐标表示、自动化测试，以及清楚区分“计算可视化”和“数学证明”。',
    },
    status: 'completed',
    github: 'https://github.com/Keng0nion/Collatz-Conjecture-Reverse-Tree-Interactive-Visualizer',
    homepage: 'https://keng0nion.github.io/collatz-tree/',
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
      en: 'Velvet Ember is a Godot 4.7 psychological horror demo about a traumatized veteran whose apartment dissolves into battlefield memories. It combines a paranoia-driven reality / hallucination transition, post-processing distortion, tinnitus and BGM ducking, and a Markdown narrative system. Ending C is playable and smoke-tested, while final art, audio, exports, accessibility controls, and Endings A / B remain in progress.',
      zh: '《Velvet Ember》是一款 Godot 4.7 心理恐怖 Demo，讲述一名战争创伤老兵的公寓逐渐溶解成战场记忆。它结合了由偏执值驱动的现实 / 幻觉切换、后处理扭曲、耳鸣与 BGM ducking，以及 Markdown 叙事系统。Ending C 已经可玩并通过烟雾测试，最终美术、音频、导出、可访问性设置和 Ending A / B 仍在开发中。',
    },
    skills: {
      en: 'Narrative system design, state-driven interaction, game systems integration, and UX/atmosphere iteration.',
      zh: '叙事系统设计、状态驱动交互、游戏系统集成，以及用户体验与氛围迭代。',
    },
    progress: {
      en: 'The Ending C path—from the title screen through apartment exploration and narrative branching to the final bad ending—is implemented in Godot 4.7 with core narrative and state smoke tests; the project is now entering manual playthrough, performance, and export validation.',
      zh: 'Ending C 的标题—公寓探索—叙事分支—坏结局流程已在 Godot 4.7 中接入，并配有核心叙事与状态烟雾测试；当前进入人工通关、性能与导出验证阶段。',
    },
    nextStep: {
      en: 'Next, I will validate the full flow in a windowed build, benchmark Compatibility-renderer performance, and test Windows/macOS exports before completing Endings A/B and replacing the procedural art and audio placeholders.',
      zh: '下一步优先完成窗口模式全流程通关、Compatibility 渲染性能基准和 Windows/macOS 导出验证，再补全 Ending A/B 并替换程序化音画占位资源。',
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
      en: 'NETRUNNER is a macOS local security observation tool for networks and devices the user owns or is authorized to assess. It collects ARP / socket, LAN, Wi-Fi, Bluetooth, Nmap, Masscan, Nikto, and OSINT evidence, stores raw files plus normalized SQLite history, and compares runs for new assets, changed ports, and persistent exposure. It outputs explainable 0–10 risk-priority reports with data-quality warnings; it is not real-time intrusion detection or proof that a device is dangerous or safe.',
      zh: 'NETRUNNER 是一个面向 macOS 的本地安全观测工具，只用于用户拥有或已获授权评估的网络和设备。它收集 ARP / Socket、局域网、Wi-Fi、蓝牙、Nmap、Masscan、Nikto 和 OSINT 证据，保存原始文件与 SQLite 规范化历史，并通过历史比较发现新资产、端口变化和持续暴露。它输出带数据质量提示的 0–10 可解释风险优先级报告；这不是实时入侵检测，也不能证明设备一定危险或安全。',
    },
    skills: {
      en: 'Data modeling, security reasoning, explainable risk prioritization, and failure semantics / evidence integrity.',
      zh: '数据建模、安全推理、可解释风险优先级排序，以及失败语义与证据完整性。',
    },
    progress: {
      en: 'The core pipeline for local collection, normalized SQLite storage, historical baselines, and explainable threat prioritization is implemented with offline protocol and data-layer tests; the project is now moving into live macOS and dual-architecture packaging validation.',
      zh: '本地采集、SQLite 规范化、历史基线比较与可解释威胁评分的核心链路已实现，并配有离线协议与数据层测试；当前进入真实 macOS 环境和双架构打包验证阶段。',
    },
    nextStep: {
      en: 'Next, I will run at least two consecutive `home` collections on real macOS hardware to validate historical baselines and data coverage, then build and verify the `arm64` and `x86_64` collector artifacts.',
      zh: '下一步将在真实 macOS 环境连续运行至少两次 `home` 采集以验证历史基线和数据覆盖率，并构建、检查 `arm64` 与 `x86_64` 采集器产物。',
    },
    quickStartLabel: {
      en: 'One-command setup and local report',
      zh: '一键安装并生成本地报告',
    },
    quickStartCommand: {
      en: 'git clone https://github.com/Keng0nion/netrunner-security-monitor.git NETRUNNER && cd NETRUNNER && python3 source/netrunner.py collect --profile home && python3 source/netrunner.py report',
      zh: 'git clone https://github.com/Keng0nion/netrunner-security-monitor.git NETRUNNER && cd NETRUNNER && python3 source/netrunner.py collect --profile home && python3 source/netrunner.py report',
    },
    quickStartNote: {
      en: 'Run only on your own or explicitly authorized network. Requires Python 3 and Node.js 18+; Nmap, Masscan, Nikto, and TheHarvester remain optional extended collectors.',
      zh: '仅在自己拥有或明确获授权的网络中运行。需要 Python 3 和 Node.js 18+；Nmap、Masscan、Nikto 和 TheHarvester 仍是可选扩展采集器。',
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
      en: 'A published GitHub Pages web tool for filtering, ranking, and comparing handheld gaming devices across hardware, display, battery, value, and portability.',
      zh: '一个已发布到 GitHub Pages 的掌机挑选网站，可从硬件、屏幕、续航、性价比和便携性等维度筛选、推荐与对比设备。',
    },
    description: {
      en: 'Handheld Matrix is a published static web tool for choosing handheld gaming devices. It uses an eight-device sample dataset with search, category filters, price and weight limits, quick filters, preference profiles, fit-score ranking, and up to four-device comparison. The result is a GitHub Pages selector with a comparison table and six-axis radar chart; data-source and scoring documentation are the next UX improvements.',
      zh: 'Handheld Matrix 是一个已经发布的静态网页工具，用于挑选掌上游戏设备。它使用 8 台示例设备数据，支持搜索、设备类型筛选、价格与重量限制、快捷筛选、偏好画像、匹配分排序，以及最多 4 台设备对比。最终产物是一个带对比表和六维雷达图的 GitHub Pages 选择器；数据来源和评分说明是下一步体验优化重点。',
    },
    skills: {
      en: 'Information architecture, filtering/comparison UX, preference-based ranking, data visualization, static-site release engineering, and frontend state design.',
      zh: '信息架构、筛选与对比体验、基于偏好的推荐排序、数据可视化、静态网站发布工程，以及前端状态设计。',
    },
    progress: {
      en: 'A bilingual hosted web release is now integrated into the portfolio at `/handheld-matrix/` with local static data, preference profiles, ranked recommendations, filtering, comparison tables, and a six-axis radar view.',
      zh: '双语线上网页版本已接入官网 `/handheld-matrix/`，支持本地静态数据、偏好画像、推荐排序、筛选、对比表格和六维雷达图。',
    },
    nextStep: {
      en: 'Next, I will document data sources, scoring basis, and update dates, then add share/export behavior and browser smoke tests for the hosted page.',
      zh: '下一步将补充数据来源、评分依据和更新时间说明，并为线上页面加入分享/导出功能与浏览器烟雾测试。',
    },
    status: 'in-development',
    github: 'https://github.com/Keng0nion/HANDHELD-MATRIX-V3.0',
    homepage: 'https://keng0nion.github.io/handheld-matrix/',
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
