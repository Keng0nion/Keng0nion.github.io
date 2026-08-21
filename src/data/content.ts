import type { Locale } from '../lib/site';

export const homeCopy = {
  en: {
    system: 'PERSONAL ARCHIVE // ONLINE',
    scroll: 'Scroll to explore',
    featuredEyebrow: 'Selected work',
    featuredTitle: 'Projects built from questions.',
    featuredBody: 'Two completed explorations across scientific modeling and interactive mathematics.',
    viewProject: 'View project',
    philosophyEyebrow: 'Operating principle',
    philosophy: 'Stay curious. Learn through failure. Refine toward perfection.',
    philosophyBody: 'Curiosity starts the process. Trial and error turns an idea into evidence. Careful iteration makes the result worth keeping.',
    allProjects: 'Explore all projects',
  },
  zh: {
    system: '个人档案 // 已上线',
    scroll: '向下探索',
    featuredEyebrow: '精选项目',
    featuredTitle: '从问题出发的作品。',
    featuredBody: '两个横跨科学建模与交互式数学的已完成探索。',
    viewProject: '查看项目',
    philosophyEyebrow: '我的理念',
    philosophy: '保持好奇。在失败中学习。在打磨中接近完美。',
    philosophyBody: '好奇让过程开始，试错让想法变成证据，持续打磨让结果值得被保留下来。',
    allProjects: '查看全部项目',
  },
} as const;

export const pageCopy = {
  projects: {
    en: {
      eyebrow: 'Project archive',
      title: 'Things I have built — and things still taking shape.',
      intro: 'A manually curated record of independent experiments across science, mathematics, security, games, and interactive interfaces.',
      open: 'Open project',
      count: 'public projects',
    },
    zh: {
      eyebrow: '项目档案',
      title: '已经完成的作品，以及仍在成形的想法。',
      intro: '一份手动维护的独立项目记录，涵盖科学、数学、安全、游戏与交互界面。',
      open: '打开项目',
      count: '个公开项目',
    },
  },
  about: {
    en: {
      eyebrow: 'About',
      title: 'Kengo Kubota',
      handle: 'Keng0nion',
      role: 'Amateur developer · Cross-disciplinary maker',
      intro: 'I am an amateur developer who enjoys using code to investigate questions that cross traditional boundaries. My projects move between scientific modeling, mathematical visualization, local security tools, game development, and experimental interfaces. I learn primarily by building: turning curiosity into a prototype, testing what fails, and refining what remains.',
      note: 'I do not see programming as a finished skill. It is a way to keep asking better questions—and to leave a visible record of how my thinking changes over time.',
      timelineEyebrow: 'Development journey',
      timelineTitle: 'A history of learning by making.',
    },
    zh: {
      eyebrow: '关于我',
      title: 'Kengo Kubota',
      handle: 'Keng0nion',
      role: '业余开发爱好者 · 跨学科创作者',
      intro: '我是一名业余开发爱好者，喜欢用代码探索跨越传统学科边界的问题。我的项目涉及科学建模、数学可视化、本地安全工具、游戏开发与实验性交互界面。我主要通过动手制作来学习：把好奇变成原型，检验失败的部分，再持续打磨留下来的结果。',
      note: '我不把编程看作一项已经学完的技能。它是一种持续提出更好问题的方式，也是一份记录自己思考如何随时间变化的可见档案。',
      timelineEyebrow: '开发历程',
      timelineTitle: '一段通过创造持续学习的记录。',
    },
  },
  contact: {
    en: {
      eyebrow: 'Contact',
      title: 'Start a conversation.',
      intro: 'For questions about my projects, university applications, or potential collaboration, the best ways to reach me are email and GitHub.',
      email: 'Email me',
      github: 'View GitHub',
      response: 'I read messages personally. Clear context and a descriptive subject line are always appreciated.',
    },
    zh: {
      eyebrow: '联系方式',
      title: '和我聊聊。',
      intro: '如果你想询问我的项目、大学申请相关内容，或讨论潜在合作，可以通过电子邮箱和 GitHub 联系我。',
      email: '发送邮件',
      github: '查看 GitHub',
      response: '所有消息都由我本人阅读。如果能提供清晰背景和明确主题，我会非常感谢。',
    },
  },
} as const;

export const timeline: Array<{
  year: string;
  title: Record<Locale, string>;
  body: Record<Locale, string>;
}> = [
  {
    year: '2015',
    title: { en: 'First contact with Scratch', zh: '初次接触 Scratch' },
    body: {
      en: 'Discovered programming through visual blocks and began experimenting with logic, sequence, and interaction.',
      zh: '通过图形化积木第一次接触编程，开始尝试逻辑、顺序与互动。',
    },
  },
  {
    year: '2019—2022',
    title: { en: 'Three years of self-directed EV3 learning', zh: '三年 EV3 自主学习' },
    body: {
      en: 'Used LEGO Mindstorms EV3 to connect software decisions with physical movement, sensors, and iterative problem-solving.',
      zh: '通过 LEGO Mindstorms EV3 将软件决策与物理运动、传感器和迭代式问题解决联系起来。',
    },
  },
  {
    year: '2021',
    title: { en: 'Moved into Python', zh: '开始学习 Python' },
    body: {
      en: 'Transitioned from visual programming toward text-based code and a wider range of computational ideas.',
      zh: '从图形化编程逐渐转向文本代码，并接触更广泛的计算思维。',
    },
  },
  {
    year: '2026',
    title: { en: 'Built an AI-assisted development workflow', zh: '建立 AI 辅助开发工作流' },
    body: {
      en: 'Combined Claude Code with earlier programming foundations and project experience to develop multiple independent projects during the summer.',
      zh: '将 Claude Code 与此前积累的编程基础和项目经验结合，在暑假开发多个独立项目。',
    },
  },
];
