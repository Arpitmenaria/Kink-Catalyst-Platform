/* ══════════════════════════════════════════════════════════════
   Unified Education data — single source of truth for courses and
   library resources, shared by CoursesPage, ExplorePage, LibraryPage,
   BookmarkedResourcesPage, LearningActivityPage and CourseDetailPage.
   Replaces the previously-divergent per-page mock arrays.
   ══════════════════════════════════════════════════════════════ */

/* ── Canonical category taxonomy ── */
export const CATEGORIES = [
  { id: 'design',      label: 'Design',       color: '#3b82f6' },
  { id: 'development', label: 'Development',  color: '#10b981' },
  { id: 'business',    label: 'Business',     color: '#f59e0b' },
  { id: 'technology',  label: 'Technology',   color: '#8b5cf6' },
  { id: 'marketing',   label: 'Marketing',    color: '#ec4899' },
  { id: 'finance',     label: 'Finance',      color: '#06b6d4' },
  { id: 'soft-skills', label: 'Soft Skills',  color: '#f97316' },
];

export function categoryLabel(id) {
  return CATEGORIES.find(c => c.id === id)?.label ?? id;
}
export function categoryColor(id) {
  return CATEGORIES.find(c => c.id === id)?.color ?? '#6b7399';
}

/* ── Canonical resource-type taxonomy ── */
export const RESOURCE_TYPES = ['Article', 'Video', 'Guide', 'Document'];
export const RESOURCE_TYPE_COLOR = {
  Article: '#06b6d4', Video: '#8b5cf6', Guide: '#10b981', Document: '#64748b',
};

/* ── Unified resources (merges LibraryPage.ALL_RESOURCES + BookmarkedResourcesPage.ALL_BOOKMARKS + CoursesPage.RESOURCES, deduped, real tags added) ── */
export const RESOURCES = [
  { id: 'res-1',  type: 'Article',  category: 'design',      title: 'Brand Identity Blueprint',    desc: 'A comprehensive guide to building resilient brand systems and visual languages.', img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&fit=crop', tags: ['branding', 'identity', 'design-systems'],
    content: [
      'A brand identity is more than a logo — it is the complete visual and verbal language a company uses to express who it is. A resilient identity system holds together across every surface: packaging, product UI, marketing, and social media, even as the team producing that work changes over time.',
      'The foundation of any identity system is a clear set of principles, not just assets. Before choosing colors or typefaces, define the personality traits the brand should express, and the traits it should actively avoid. This becomes the filter every future design decision passes through.',
      'Once principles are set, build out the toolkit: a primary and secondary color palette with accessible contrast ratios, a type system with clear hierarchy, a logo lockup with defined clear-space rules, and a photography or illustration style. Document all of it in a living brand guide, not a static PDF that goes stale.',
    ] },
  { id: 'res-2',  type: 'Video',    category: 'business',    title: 'Growth Analytics Mastery',    desc: 'Master the core metrics that drive business growth and product success.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&fit=crop', tags: ['analytics', 'growth', 'metrics'], videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    content: [
      'This session walks through the metrics that actually move the needle for a growing product: activation rate, retention curves, and the north star metric that ties day-to-day decisions back to long-term company goals.',
      'You will see how to build a simple funnel model in a spreadsheet before reaching for expensive analytics tooling, and how to spot the difference between a vanity metric and one that predicts revenue.',
      'The session closes with a framework for running weekly growth reviews: what to measure, who should be in the room, and how to turn a metric dip into a prioritized experiment instead of a panic.',
    ] },
  { id: 'res-3',  type: 'Guide',    category: 'business',    title: 'Agile Product Management',    desc: 'The complete handbook for agile product teams and sprint planning.', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80&fit=crop', tags: ['agile', 'product-management', 'sprint-planning'],
    content: [
      'Agile product management is not about ceremonies for their own sake — it is about creating a tight feedback loop between what the team builds and what customers actually need. This guide covers backlog grooming, sprint planning, and the art of writing a user story that survives contact with engineering.',
      'A well-run sprint starts before the planning meeting: the backlog should already be prioritized and estimated, with the top items refined enough that the team can commit to them with confidence.',
      'Retrospectives are where the real improvement happens. This guide includes a rotating set of retro formats so teams do not burn out on the same "what went well / what didn\'t" format every two weeks.',
    ] },
  { id: 'res-4',  type: 'Document', category: 'business',    title: 'Founder Agreement Template',  desc: 'Standardized founder vesting and intellectual property agreements.', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80&fit=crop', tags: ['legal', 'startup', 'equity'],
    content: [
      'This template covers the two documents every founding team should sign before writing a single line of production code: a founder vesting agreement and an IP assignment agreement.',
      'Vesting protects the company (and the other founders) if someone leaves early — typically a four-year schedule with a one-year cliff, so equity is earned over time rather than granted all at once.',
      'The IP assignment agreement ensures that anything a founder builds for the company actually belongs to the company, not to the individual personally — a detail that becomes critical during fundraising due diligence.',
    ] },
  { id: 'res-5',  type: 'Article',  category: 'design',      title: 'Deep Work for Designers',     desc: 'Strategies for maintaining creative focus in distracted environments.', img: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=600&q=80&fit=crop', tags: ['focus', 'productivity', 'design'],
    content: [
      'Design work requires long, uninterrupted stretches of concentration that most modern workplaces are actively hostile to. This piece looks at how to protect that time without becoming unreachable to your team.',
      'A simple starting point: block two- to three-hour focus windows on your calendar before the day fills up with meetings, and treat them with the same seriousness as a client call.',
      'Equally important is designing your environment for re-entry — leaving a note to yourself at the end of a focus session about exactly where you left off makes it far easier to get back into flow the next day.',
    ] },
  { id: 'res-6',  type: 'Guide',    category: 'development', title: 'AI Implementation Guide',     desc: 'Practical steps for integrating large language models into products.', img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80&fit=crop', tags: ['ai', 'llm', 'integration'],
    content: [
      'Integrating an LLM into a product is less about the model call itself and more about the surrounding system: prompt design, context retrieval, guardrails, and fallback behavior when the model gets it wrong.',
      'Start with the narrowest possible use case — a single well-defined task with a clear success criterion — before expanding scope. This makes it far easier to evaluate whether the feature is actually working.',
      'Budget real engineering time for evaluation. A held-out set of test cases that you run against every prompt change is the difference between shipping improvements confidently and shipping regressions blindly.',
    ] },
  { id: 'res-7',  type: 'Video',    category: 'development', title: 'React Performance Patterns',  desc: 'Advanced techniques for optimizing React applications at scale.', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80&fit=crop', tags: ['react', 'performance', 'javascript'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: [
      'This session covers the most common causes of React performance problems at scale: unnecessary re-renders, unstable prop references, and expensive computations running on every render.',
      'You will see how to use the React DevTools Profiler to isolate exactly which component is responsible for a slow interaction, rather than guessing and optimizing the wrong thing.',
      'The session wraps up with a practical checklist: memoize expensive derived values, stabilize callback references passed to children, and virtualize long lists before reaching for more exotic optimizations.',
    ] },
  { id: 'res-8',  type: 'Article',  category: 'soft-skills', title: 'Leadership in Remote Teams',  desc: 'Building trust, alignment, and momentum across distributed teams.', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&fit=crop', tags: ['leadership', 'remote-work', 'management'],
    content: [
      'Remote leadership fails most often not because of technology, but because trust and context that used to travel through hallway conversations now have to be built deliberately.',
      'Over-communicate decisions and the reasoning behind them in writing, even when it feels redundant — asynchronous teammates in other time zones only get one shot at understanding a decision the first time they read it.',
      'Protect regular 1:1 time above almost everything else. It is the one venue where a remote manager can catch problems — a disengaged teammate, a misaligned expectation — before they show up in the work.',
    ] },
  { id: 'res-9',  type: 'Document', category: 'development', title: 'System Design Cheat Sheet',   desc: 'Reference guide covering scalability, reliability, and architecture patterns.', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80&fit=crop', tags: ['system-design', 'architecture', 'scalability'],
    content: [
      'A quick-reference guide for the patterns that come up in almost every system design discussion: horizontal vs vertical scaling, caching layers, load balancing strategies, and database replication.',
      'Includes a decision framework for choosing between SQL and NoSQL based on access patterns, and a short section on the CAP theorem trade-offs that actually matter in practice rather than in theory.',
      'The final section covers observability: what to log, what to alert on, and how to design a system so that when it fails, it fails in a way that is easy to diagnose at 3am.',
    ] },
  { id: 'res-10', type: 'Video',    category: 'development', title: 'Advanced React Patterns',     desc: 'Master complex component structures, custom hooks, and state management strategies for scalable applications.', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80&fit=crop', tags: ['react', 'javascript', 'development'], author: 'Mark Kovich', authorColor: '#3b82f6', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    content: [
      'This session walks through the compound component pattern, render props, and custom hooks — three ways to share behavior between components without prop drilling or tangled inheritance.',
      'You will build a small design-system component from scratch using compound components, then refactor the same behavior into a custom hook to compare the trade-offs of each approach.',
      'The final segment covers when NOT to reach for these patterns — for a lot of components, a simple prop-based API is still the right call, and over-engineering a component API is its own kind of technical debt.',
    ] },
  { id: 'res-11', type: 'Document', category: 'technology',  title: 'Future of AI in Education 2024', desc: 'An in-depth whitepaper exploring the latest trends and future impact of artificial intelligence on learning.', img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80&fit=crop', tags: ['ai', 'report', 'education'], author: 'Robert Fisher', authorColor: '#10b981',
    content: [
      'This whitepaper surveys how AI is already reshaping education: adaptive learning paths that adjust to a student\'s pace, automated feedback on writing and code, and tutoring systems available around the clock.',
      'It also addresses the open questions institutions are wrestling with — how to assess original work in a world of generative writing tools, and how to make sure AI tutoring augments rather than replaces human instructors.',
      'The report closes with a set of predictions for the next three years, including a shift toward AI-assisted curriculum design and much more granular, real-time progress tracking for students.',
    ] },
  { id: 'res-12', type: 'Article',  category: 'design',      title: 'Principles of Web Accessibility', desc: 'Learn the fundamental guidelines for creating digital experiences that are inclusive for all users, from WCAG basics to advanced patterns.', img: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=600&q=80&fit=crop', tags: ['design', 'accessibility', 'wcag'], author: 'Sarah Jenkins', authorColor: '#f59e0b',
    content: [
      'Accessibility is not a checklist you run at the end of a project — it is a set of constraints that, when applied from the start, tend to produce better interfaces for everyone, not just users with disabilities.',
      'This article walks through the WCAG POUR principles (Perceivable, Operable, Understandable, Robust) with concrete examples: sufficient color contrast, full keyboard navigability, and meaningful alt text rather than filler.',
      'It closes with a practical testing routine any team can run before shipping: tab through the interface without a mouse, run an automated audit tool, and test with a screen reader for at least the core user flows.',
    ] },
  { id: 'res-13', type: 'Guide',    category: 'design',      title: 'Effective User Interviewing', desc: 'A comprehensive guide on how to ask the right questions and extract valuable insights from your target audience.', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80&fit=crop', tags: ['ux-research', 'strategy', 'user-interviews'], author: 'Elena Lu', authorColor: '#8b5cf6',
    content: [
      'The single most common mistake in user interviews is asking leading questions that confirm what the team already believes. This guide teaches the difference between "Would you use a feature like X?" and "Tell me about the last time you tried to do X."',
      'A good interview script front-loads open-ended questions about behavior and context, and saves any mention of your specific solution for the very end, if at all.',
      'The guide also covers synthesis: how to turn a stack of interview transcripts into a small number of clear, actionable themes the whole team can rally around, instead of a pile of disconnected quotes.',
    ] },
  { id: 'res-14', type: 'Guide',    category: 'design',      title: 'UI Design Handbook 2024',     desc: 'Essential principles and case studies for modern design systems.', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80&fit=crop', tags: ['ui', 'design-systems', 'handbook'],
    content: [
      'A field guide to building modern interfaces, covering layout systems, spacing scales, and the component libraries that hold a product together as it grows past its first few screens.',
      'Includes real case studies from teams that scaled a design system from a single product to dozens of surfaces, and the governance model they used to keep it from fragmenting.',
      'The closing chapter focuses on motion and micro-interactions — when they add clarity to an interface, and when they are just decoration that slows the product down.',
    ] },
  { id: 'res-15', type: 'Video',    category: 'technology',  title: 'Tech Trends Webinar',         desc: 'Recorded session with industry experts on the future of AI technology.', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80&fit=crop', tags: ['ai', 'trends', 'webinar'], videoUrl: 'https://samplelib.com/preview/mp4/sample-5s.mp4',
    content: [
      'A panel of industry practitioners discuss where AI tooling is heading over the next few years, from agentic workflows to on-device inference.',
      'The conversation covers practical adoption advice for teams that are still deciding where AI actually fits into their product roadmap versus where it is just hype.',
      'The session closes with an audience Q&A covering data privacy, cost management for AI features at scale, and how to hire for AI-adjacent roles right now.',
    ] },
];

/* ── Course base data (merges ExplorePage.ALL_COURSES with 2 title corrections + 1 new course, so the 3 CourseReaderPage-rich titles exist verbatim) ── */
const COURSE_BASE = [
  { id: 'advanced-ui-design-systems',        title: 'Advanced UI Design Systems',                       difficulty: 'ADVANCED',     instructor: 'Alex Rivera',       instructorImg: null, duration: '12h 30m', rating: 4.9, reviews: '1.2k', category: 'design',      img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80&fit=crop', isFree: false, price: '$89.99' },
  { id: 'full-stack-web-architecture',       title: 'Full-Stack Web Architecture with Modern Frameworks', difficulty: 'INTERMEDIATE', instructor: 'Sarah Linden',      instructorImg: null, duration: '24h 45m', rating: 4.8, reviews: '850',  category: 'development', img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80&fit=crop', isFree: false, price: '$129.00' },
  { id: 'data-science-for-business',         title: 'Data Science for Business & Analytics Professionals', difficulty: 'BEGINNER',    instructor: 'Marcus Kane',       instructorImg: null, duration: '8h 15m',  rating: 4.7, reviews: '2.4k', category: 'technology',  img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&fit=crop', isFree: true, price: null },
  { id: 'modern-branding-strategies',        title: 'Modern Branding Strategies for Digital Products',    difficulty: 'INTERMEDIATE', instructor: 'Elena Wong',        instructorImg: null, duration: '15h 20m', rating: 4.9, reviews: '540',  category: 'marketing',   img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80&fit=crop', isFree: false, price: '$59.99' },
  { id: 'growth-marketing-mastery',          title: 'Growth Marketing Mastery & Funnel Optimization',     difficulty: 'ADVANCED',     instructor: 'James Doe',         instructorImg: null, duration: '18h 00m', rating: 5.0, reviews: '105',  category: 'marketing',   img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&fit=crop', isFree: false, price: '$99.00' },
  { id: 'python-for-machine-learning',       title: 'Python for Machine Learning & AI Development',       difficulty: 'INTERMEDIATE', instructor: 'Aria Chen',         instructorImg: null, duration: '20h 10m', rating: 4.8, reviews: '970',  category: 'technology',  img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80&fit=crop', isFree: false, price: '$149.00' },
  { id: 'financial-modeling-for-leaders',    title: 'Financial Modeling for Business Leaders',            difficulty: 'BEGINNER',     instructor: 'Marcus Thorne',     instructorImg: null, duration: '6h 45m',  rating: 4.6, reviews: '320',  category: 'finance',     img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80&fit=crop', isFree: true, price: null },
  { id: 'ux-research-methods',               title: 'UX Research Methods & Usability Testing',            difficulty: 'BEGINNER',     instructor: 'Sophie Moreau',     instructorImg: null, duration: '10h 30m', rating: 4.7, reviews: '610',  category: 'design',      img: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=600&q=80&fit=crop', isFree: true, price: null },
  { id: 'blockchain-decentralized-finance',  title: 'Blockchain & Decentralized Finance Fundamentals',    difficulty: 'ADVANCED',     instructor: 'Dr. Kai Vance',     instructorImg: null, duration: '14h 00m', rating: 4.9, reviews: '430',  category: 'technology',  img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80&fit=crop', isFree: false, price: '$119.00' },
  { id: 'leadership-team-management',        title: 'Leadership & Team Management for Tech Leads',        difficulty: 'INTERMEDIATE', instructor: 'Dr. Sarah Jenkins', instructorImg: null, duration: '9h 20m',  rating: 4.8, reviews: '760',  category: 'business',    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&fit=crop', isFree: false, price: '$79.00' },
  { id: 'react-performance-patterns',        title: 'React Performance Patterns',                         difficulty: 'ADVANCED',     instructor: 'Leo Zhang',         instructorImg: null, duration: '11h 15m', rating: 4.9, reviews: '1.1k', category: 'development', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80&fit=crop', isFree: false, price: '$94.99' },
  { id: 'product-management-ideation',       title: 'Product Management: From Ideation to Launch',        difficulty: 'INTERMEDIATE', instructor: 'Sophia Bloom',      instructorImg: null, duration: '16h 50m', rating: 4.7, reviews: '890',  category: 'business',    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80&fit=crop', isFree: false, price: '$109.00' },
  { id: 'product-management-fundamentals',   title: 'Product Management Fundamentals',                    difficulty: 'INTERMEDIATE', instructor: 'Sophia Bloom',      instructorImg: null, duration: '8h 40m',  rating: 4.8, reviews: '640',  category: 'business',    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&fit=crop', isFree: true, price: null },
];

/* ── Sample lesson videos, cycled across chapters so every chapter is playable ── */
const SAMPLE_VIDEOS = [
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
  'https://www.w3schools.com/html/movie.mp4',
  'https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4',
  'https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4',
  'https://samplelib.com/preview/mp4/sample-5s.mp4',
];
let videoCursor = 0;
function nextSampleVideo() {
  const url = SAMPLE_VIDEOS[videoCursor % SAMPLE_VIDEOS.length];
  videoCursor += 1;
  return url;
}

/* ── Rich chapter content for the 3 courses with real CourseReaderPage spreads (1:1 mapped: spread -> chapter, grouped into one module each) ── */
const RICH_MODULES = {
  'advanced-ui-design-systems': [
    {
      id: 'mod-1', title: 'Module 1: Design Systems Foundations',
      chapters: [
        {
          id: 'ch-1', title: 'Typography Systems', label: 'CHAPTER 6',
          videoUrl: nextSampleVideo(),
          img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=80&fit=crop',
          figureCaption: 'FIGURE 6.1: TYPE SCALE DIAGRAM',
          leftBody: [
            'Typography is more than the selection of a typeface — it is the architecture of communication itself. A robust typographic system defines harmony, hierarchy, and rhythm across an entire product.',
            'The foundation of any type system begins with scale. A modular scale, derived from a single ratio, ensures that every font size relates meaningfully to every other, creating visual cohesion without explicit coordination.',
            'Consistent line-height, letter-spacing, and weight pairings complete the system, allowing designers and engineers to communicate fluidly across disciplines.',
          ],
          rightSections: [
            { heading: 'Establishing a Type Scale', body: 'A type scale defines the set of font sizes available within a system. Rather than choosing sizes arbitrarily, a modular scale — such as the Major Third (1.25) or Perfect Fourth (1.333) — ensures each step in the scale bears a harmonic relationship to the next.' },
            { heading: 'Weight & Hierarchy', body: 'Font weight is one of the most powerful tools for establishing visual hierarchy. A system that uses weight strategically can guide the reader\'s eye through a layout, surfacing the most important information first and allowing supporting content to recede.' },
          ],
          callout: { type: 'KEY CONCEPT', text: '"A type system is not a set of rules — it is a vocabulary. The richer the vocabulary, the more precisely you can express design intent."' },
        },
        {
          id: 'ch-2', title: 'Component Architecture', label: 'CHAPTER 7',
          videoUrl: nextSampleVideo(),
          img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=700&q=80&fit=crop',
          figureCaption: 'FIGURE 7.1: ATOMIC MAPPING',
          leftBody: [
            'Component architecture is the bedrock of any scalable design system. It dictates how individual elements interact, inherit properties, and maintain consistency across vast digital landscapes.',
            'As systems grow in complexity, the need for a rigid yet flexible structure becomes paramount. This chapter explores the methodologies behind creating high performance components that serve both designers and developers with equal efficiency.',
            'By defining clear hierarchies — from the smallest atoms to complex organisms — we create a shared language that accelerates production while reducing technical and design debt.',
          ],
          rightSections: [
            { heading: 'Design Tokens & Atomic Elements', body: 'At the most granular level, we find design tokens — the sub-atomic particles of our UI. These are the values for colors, spacing, and typography that ensure every component speaks the same visual language. By abstracting these values, we create a single source of truth that simplifies maintenance and enables multi-platform theming with ease.' },
            { heading: 'Atomic Components', body: 'Atomic components are the smallest functional units of our interface, such as buttons, inputs, and icons. They are designed to be context-agnostic, meaning they can function reliably regardless of where they are placed. This modularity is what allows for the rapid assembly of complex views while maintaining a high degree of UI integrity.' },
          ],
          callout: { type: 'PRO TIP', text: '"Always document the \'Why\' behind a component, not just the \'What\'. Usage guidelines are as critical as the code itself."' },
        },
        {
          id: 'ch-3', title: 'Component Architecture', label: 'CHAPTER 7',
          videoUrl: nextSampleVideo(),
          img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=700&q=80&fit=crop',
          figureCaption: 'FIGURE 7.2: MOLECULE COMPOSITION',
          leftBody: [
            'Molecules emerge when atomic components combine to form distinct functional units. A search field — composed of an input atom, a button atom, and an icon atom — is a molecule. Each molecule fulfills one well-defined purpose.',
            'The power of molecules lies in their reusability. Once defined, a search molecule can appear in navbars, modals, and sidebars without duplication of logic or style. This is the foundation of scalable front-end engineering.',
            'Defining molecule boundaries requires deliberate choices. The guiding question is always: does this grouping represent a singular responsibility, or is it attempting to fulfill multiple unrelated roles?',
          ],
          rightSections: [
            { heading: 'Organism Composition', body: 'Organisms are complex UI components assembled from groups of molecules and atoms. A navigation bar, a product card, or a data table are organisms. They represent distinct sections of an interface that can be placed into page templates.' },
            { heading: 'Template & Page Patterns', body: 'Templates place organisms into a layout, defining the skeletal structure of a page. Pages are specific instances of templates, populated with real representative content. The transition from template to page is where the quality of the design system is fully tested.' },
          ],
          callout: { type: 'NOTE', text: '"In practice, the atomic hierarchy is a mental model, not a strict taxonomy. What matters most is that your team shares a consistent vocabulary for describing complexity."' },
        },
      ],
    },
  ],
  'product-management-fundamentals': [
    {
      id: 'mod-1', title: 'Module 1: Research & Stakeholders',
      chapters: [
        {
          id: 'ch-1', title: 'Stakeholder Mapping', label: 'CHAPTER 3',
          videoUrl: nextSampleVideo(),
          img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&q=80&fit=crop',
          figureCaption: 'FIGURE 3.1: STAKEHOLDER INFLUENCE MATRIX',
          leftBody: [
            'Understanding who holds power and interest in your product is fundamental to successful product management. Stakeholder mapping transforms a vague network of relationships into a clear, actionable model.',
            'The influence-interest matrix categorizes stakeholders across two axes: the degree of influence they hold over decisions, and the degree of interest they hold in the product outcomes.',
            'This model prevents common PM failures — over-indexing on vocal but low-influence voices, or neglecting quiet but high-impact decision makers.',
          ],
          rightSections: [
            { heading: 'Managing High-Influence Stakeholders', body: 'Stakeholders with high influence and high interest — your core partners — require proactive, frequent communication. They should be involved in major decisions, previewed on roadmap changes, and engaged in discovery when possible.' },
            { heading: 'Communicating with Executives', body: 'Executives typically fall in the high-influence, lower-day-to-day-interest quadrant. Your communication with this group should be concise, outcome-focused, and tied to business metrics. Lead with impact, not activity.' },
          ],
          callout: { type: 'PRO TIP', text: '"Never let your stakeholder map become static. Influence and interest shift as organizations evolve. Revisit it quarterly."' },
        },
        {
          id: 'ch-2', title: 'User Research Ethics', label: 'CHAPTER 4',
          videoUrl: nextSampleVideo(),
          img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80&fit=crop',
          figureCaption: 'FIGURE 4.1: RESEARCH ETHICS FRAMEWORK',
          leftBody: [
            'User research is not merely a methodological discipline — it is an ethical practice. Every participant who shares their time, behaviors, and experiences trusts that their contribution will be handled with respect and integrity.',
            'Ethical research begins before the first participant is recruited. It starts in the framing of the research question, the design of consent processes, and the planning of data handling and storage.',
            'The product manager\'s role in research ethics is to ensure the entire team — researchers, designers, and engineers alike — understands and upholds these responsibilities.',
          ],
          rightSections: [
            { heading: 'Informed Consent', body: 'Participants must clearly understand what they are agreeing to before a session begins. This means plain-language explanations of how data will be used, who will see it, how long it will be retained, and the participant\'s right to withdraw at any time without consequence.' },
            { heading: 'Handling Sensitive Data', body: 'When research surfaces sensitive information — financial stress, health concerns, workplace conflict — the researcher has a heightened duty of care. Data should be anonymized as soon as practically possible, stored securely, and shared only on a strict need-to-know basis.' },
          ],
          callout: { type: 'KEY CONCEPT', text: '"The goal of ethical research is not just to protect the organization from liability — it is to honor the humanity of every participant who trusted you."' },
        },
      ],
    },
  ],
  'react-performance-patterns': [
    {
      id: 'mod-1', title: 'Module 1: Profiling & Rendering',
      chapters: [
        {
          id: 'ch-1', title: 'React DevTools', label: 'CHAPTER 2',
          videoUrl: nextSampleVideo(),
          img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=700&q=80&fit=crop',
          figureCaption: 'FIGURE 2.1: REACT PROFILER FLAMEGRAPH',
          leftBody: [
            'React DevTools is the primary instrument for diagnosing performance issues in React applications. Mastery of this tool transforms performance optimization from guesswork into a data-driven discipline.',
            'The Profiler tab records component render timings across an interaction. Each recorded session produces a flamegraph — a visual representation of which components rendered, in what order, and for how long.',
            'The commitment phase, the stage at which React applies changes to the DOM, is often where performance budgets are exceeded. The DevTools profiler isolates exactly which renders contributed to a slow commit.',
          ],
          rightSections: [
            { heading: 'Reading the Flamegraph', body: 'Each bar in the flamegraph represents a component that rendered during the recorded interaction. Width corresponds to render time. A wide bar is not inherently problematic — it may simply be a complex component that renders quickly. The colors indicate relative render time within the commit: gray means the component did not render in that commit.' },
            { heading: 'Why Did This Render?', body: 'The "Why did this render?" feature, available when the "Record why each component rendered while profiling" setting is enabled, is one of the most valuable tools in the performance engineer\'s arsenal. It surfaces the exact prop or state change that triggered a render, eliminating hours of manual debugging.' },
          ],
          callout: { type: 'PRO TIP', text: '"Always profile in production mode. React development mode intentionally adds overhead that can misrepresent real-world performance characteristics."' },
        },
      ],
    },
  ],
};

/* ── Skeleton chapter generator for courses without hand-written content ── */
function buildSkeletonModules(course) {
  return [
    {
      id: 'mod-1', title: 'Module 1: Getting Started',
      chapters: [
        {
          id: 'ch-1', title: 'Course Introduction', label: 'CHAPTER 1', img: course.img, figureCaption: null,
          videoUrl: nextSampleVideo(),
          leftBody: [`Welcome to ${course.title}. This chapter introduces the core concepts and goals you'll work toward throughout the course.`],
          rightSections: [{ heading: 'What You Will Learn', body: `An overview of the skills and topics ${course.title} covers, taught by ${course.instructor}.` }],
          callout: null,
        },
        {
          id: 'ch-2', title: 'Core Concepts', label: 'CHAPTER 2', img: course.img, figureCaption: null,
          videoUrl: nextSampleVideo(),
          leftBody: [`This chapter walks through the foundational concepts behind ${course.title}, building the vocabulary and mental models you'll rely on for the rest of the course.`],
          rightSections: [{ heading: 'Key Terminology', body: 'A grounding in the core terms and frameworks used throughout the remaining modules.' }],
          callout: null,
        },
      ],
    },
    {
      id: 'mod-2', title: 'Module 2: Applying What You Learned',
      chapters: [
        {
          id: 'ch-3', title: 'Practical Application', label: 'CHAPTER 3', img: course.img, figureCaption: null,
          videoUrl: nextSampleVideo(),
          leftBody: [`With the fundamentals in place, this chapter moves into hands-on application of ${course.title}'s core techniques.`],
          rightSections: [{ heading: 'Case Study', body: 'A worked example showing these concepts applied to a realistic scenario.' }],
          callout: null,
        },
        {
          id: 'ch-4', title: 'Wrap-Up & Next Steps', label: 'CHAPTER 4', img: course.img, figureCaption: null,
          videoUrl: nextSampleVideo(),
          leftBody: ['A recap of everything covered, along with recommended next steps to keep building on what you\'ve learned.'],
          rightSections: [{ heading: 'Where to Go From Here', body: 'Suggested follow-up resources and advanced topics to explore next.' }],
          callout: null,
        },
      ],
    },
  ];
}

export const COURSES = COURSE_BASE.map(course => ({
  ...course,
  description: `Learn ${course.title.split(':')[0].split('&')[0].trim()} with ${course.instructor}, covering everything from foundational concepts to practical application.`,
  modules: RICH_MODULES[course.id] ?? buildSkeletonModules(course),
}));

export function getCourseById(courseId) {
  return COURSES.find(c => c.id === courseId);
}

export function getResourceById(resourceId) {
  return RESOURCES.find(r => r.id === resourceId);
}

export function priceLabel(course) {
  return course?.isFree ? 'Free' : (course?.price ?? '');
}

export function flattenChapters(course) {
  return (course?.modules ?? []).flatMap(m => m.chapters.map(ch => ({ ...ch, moduleId: m.id, moduleTitle: m.title })));
}

export function totalChapterCount(course) {
  return (course?.modules ?? []).reduce((sum, m) => sum + m.chapters.length, 0);
}
