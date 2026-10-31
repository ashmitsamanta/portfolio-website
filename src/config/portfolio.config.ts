export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
}

export interface PortfolioConfig {
  personal: {
    name: string;
    shortName: string;
    role: string;
    roleItalic: string;
    bio: string;
    location: string;
    timezone: string;
    availableForWork: boolean;
    portrait: string;
    gameWordTop: string;
    gameWordBottom: string;
  };
  accentColor: string;
  socials: {
    email: string;
    phone?: string;
    whatsapp?: string;
    playstore?: string;
    linkedin: string;
    github: string;
  };
  stackCategories: Array<{
    id: string;
    label: string;
    items: string[];
  }>;
  services: Array<{
    id: string;
    title: string;
    summary: string;
    details: string;
    tags: string[];
  }>;
  projects: Array<{
    id: string;
    num: string;
    titlePrefix: string;
    titleItalic: string;
    titleSuffix: string;
    category: string;
    badge: string;
    image: string;
    description: string;
    detailsDescription?: string;
    noTitleSpace?: boolean;
    highlights: string[];
    tags: string[];
    primaryLabel: string;
    primaryUrl: string;
    githubUrl: string;
  }>;
  education: EducationItem[];
}

export const PORTFOLIO_CONFIG: PortfolioConfig = {
  personal: {
    name: 'ASHMIT SAMANTA',
    shortName: 'ASHMIT',
    role: 'Full-Stack',
    roleItalic: 'Developer',
    bio: "Hey, I'm Ashmit. A CSE student building full-stack web applications with FastAPI, PostgreSQL, and React.js. I developed the backend and document-processing pipelines for Veribyte, a document verification system, and built the backend and graph-analysis layer for CyberScope, a fraud-detection dashboard designed to identify suspicious transactions. I work primarily with Python, using it to build data pipelines, backend services, and fraud-detection logic. I enjoy turning complex problems into practical, reliable software solutions.",
    location: 'New Town, West Bengal, India',
    timezone: 'Asia/Kolkata',
    availableForWork: true,
    portrait: '/assets/portrait_cutout.webp',
    gameWordTop: 'HELLO',
    gameWordBottom: 'WORLD'
  },
  accentColor: '#FF5C3D',
  socials: {
    email: 'ashmitsamanta2007@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ashmit-samanta-14022b43b/',
    github: 'https://github.com/ashmitsamanta'
  },
  stackCategories: [
    {
      id: 'backend',
      label: 'Backend & Data Pipelines',
      items: ['Python', 'FastAPI', 'PostgreSQL', 'Django', 'REST APIs', 'Node.js', 'Express.js', 'Graph Analysis', 'JWT / Auth']
    },
    {
      id: 'frontend',
      label: 'Frontend & UI Frameworks',
      items: ['React.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Vite', 'Next.js', 'HTML5 Canvas', 'Redux']
    },
    {
      id: 'mobile',
      label: 'Mobile & Cloud Storage',
      items: ['React Native', 'Expo', 'Supabase', 'Firebase', 'Firestore', 'SQLite', 'AsyncStorage']
    },
    {
      id: 'devops',
      label: 'DevOps, QA & Tooling',
      items: ['Docker', 'Git', 'GitHub Actions', 'CI/CD', 'Postman', 'VS Code', 'Linux', 'Playwright']
    }
  ],
  services: [
    {
      id: '01',
      title: 'FULL-STACK WEB DEVELOPMENT',
      summary: 'I build end-to-end web applications, connecting responsive React or JavaScript frontends with FastAPI backends to deliver functional, scalable, and user-focused experiences.',
      details: '',
      tags: ['React', 'JavaScript', 'Python', 'FastAPI']
    },
    {
      id: '02',
      title: 'BACKEND APIs & DATABASES',
      summary: 'I develop RESTful APIs, authentication workflows, database models, and automated tests to build reliable backend systems with structured data handling and maintainable architecture.',
      details: '',
      tags: ['FastAPI', 'REST APIs', 'SQL', 'Pytest']
    },
    {
      id: '03',
      title: 'DASHBOARDS & DATA VISUALIZATION',
      summary: 'I transform complex backend analysis into interactive dashboards, network graphs, heatmaps, and processing-status views that make technical insights easier to explore and understand.',
      details: '',
      tags: ['Interactive Dashboards', 'Network Graphs', 'Heatmaps', 'Processing Status Views']
    },
    {
      id: '04',
      title: 'DOCUMENT & FRAUD ANALYSIS SYSTEMS',
      summary: 'I build document-verification and fraud-analysis pipelines that combine rule-based validation with pretrained AI models for OCR, face matching, and deepfake detection to flag potentially suspicious results.',
      details: '',
      tags: ['OCR Pipelines', 'Face Matching', 'Deepfake Detection', 'Fraud Analysis']
    }
  ],
  projects: [
    {
      id: 'veri-byte',
      num: '01',
      titlePrefix: 'VERI-',
      titleItalic: 'byte',
      titleSuffix: 'IDENTITY & DOCUMENT VERIFICATION',
      category: 'Web & AI',
      badge: '',
      image: '/assets/veribyte.webp',
      description: 'An AI-assisted identity and document verification platform, built with React, Vite, and a FastAPI backend with Supabase. Features OCR extraction (Tesseract, PassportEye), Verhoeff, PAN, and MRZ validators, ELA-based tamper detection, InsightFace face matching, a SigLIP deepfake check, and live SSE streaming of verification results.',
      detailsDescription: "An AI-assisted identity and document verification platform, built with React and Vite on a FastAPI backend with Supabase. Runs uploaded documents through OCR extraction, checksum validation, tamper detection, face matching, and a deepfake check, and streams each stage's result to the UI as it completes.",
      highlights: [
        'Multi-stage verification pipeline: Tesseract/PassportEye OCR feeding Verhoeff, PAN, and MRZ validators',
        'ELA-based tamper detection, InsightFace face matching, and a SigLIP deepfake model',
        'FastAPI SSE streaming for live per-stage results, with a Supabase registry and local JSON fallback'
      ],
      tags: ['React', 'Vite', 'FastAPI', 'Supabase', 'Computer Vision'],
      primaryLabel: '',
      primaryUrl: '',
      githubUrl: 'https://github.com/ashmitsamanta/Veri-Byte-Web-Page.git'
    },
    {
      id: 'cyberscope',
      num: '02',
      titlePrefix: 'CYBER',
      titleItalic: 'scope',
      noTitleSpace: true,
      titleSuffix: 'CYBER-FRAUD INTELLIGENCE PLATFORM',
      category: 'Web & Security',
      badge: 'Full-Stack Platform',
      image: '/assets/cyberscope.webp',
      description: 'An explainable fraud intelligence platform that links messages, phone numbers, URLs, payment identifiers, and bank accounts into a single fraud graph. Built with FastAPI, SQLAlchemy, and NetworkX, with JWT authentication, rule-based risk scoring, recursive BFS fund tracing, and an LLM chat assistant. Ships with a 20-test pytest suite, a synthetic benchmark dataset, and Docker and Nginx deployment.',
      detailsDescription: 'An explainable fraud investigation platform that links scam messages, phone numbers, URLs, payment identifiers, and bank accounts into a single fraud graph. Built with a FastAPI backend, NetworkX graph engine, and a multi-page Vite frontend, with JWT authentication, transparent rule-based risk scoring, and recursive fund tracing across linked accounts.',
      highlights: [
        'NetworkX fraud graph connecting messages, numbers, URLs, payment IDs, and bank accounts into traceable entity clusters',
        'Rule-based risk scoring with explainable outputs, plus recursive BFS fund tracing across account chains',
        'JWT-secured FastAPI and SQLAlchemy API (SQLite or PostgreSQL), 20-test pytest suite, and Docker + Nginx deployment'
      ],
      tags: ['FastAPI', 'NetworkX', 'SQLAlchemy', 'Graph Analysis', 'Pytest', 'Docker'],
      primaryLabel: '',
      primaryUrl: '',
      githubUrl: 'https://github.com/ashmitsamanta/CyberScope.git'
    }
  ],
  education: [
    {
      institution: 'Techno International New Town',
      degree: 'B.Tech (Computer Science)',
      period: '2026-2030'
    }
  ],
};

export default PORTFOLIO_CONFIG;
