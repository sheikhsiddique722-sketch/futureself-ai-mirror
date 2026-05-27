/* =============================================
   ANIMATED BACKGROUND — PARTICLE FIELD
   ============================================= */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], lines = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.18;
      this.vy = (Math.random() - 0.5) * 0.18;
      this.r = Math.random() * 1.5 + 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      const c = [
        `rgba(0,212,255,${this.alpha})`,
        `rgba(123,47,255,${this.alpha * 0.7})`,
        `rgba(200,216,232,${this.alpha * 0.4})`,
      ];
      this.color = c[Math.floor(Math.random() * c.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  class Orb {
    constructor(x, y, color) {
      this.x = x; this.y = y;
      this.color = color;
      this.t = Math.random() * Math.PI * 2;
      this.speed = 0.003 + Math.random() * 0.004;
      this.rx = 60 + Math.random() * 80;
      this.ry = 40 + Math.random() * 60;
      this.ox = x; this.oy = y;
      this.size = 120 + Math.random() * 200;
    }
    update() { this.t += this.speed; this.x = this.ox + Math.cos(this.t) * this.rx; this.y = this.oy + Math.sin(this.t) * this.ry; }
    draw() {
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      grad.addColorStop(0, this.color.replace('1)', '0.04)'));
      grad.addColorStop(0.5, this.color.replace('1)', '0.02)'));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  function init() {
    particles = Array.from({ length: 80 }, () => new Particle());
    lines = [
      new Orb(W * 0.2, H * 0.3, 'rgba(0,212,255,1)'),
      new Orb(W * 0.8, H * 0.6, 'rgba(123,47,255,1)'),
      new Orb(W * 0.5, H * 0.8, 'rgba(255,45,120,1)'),
    ];
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(0,212,255,0.025)';
    ctx.lineWidth = 1;
    const gw = 80;
    for (let x = 0; x < W; x += gw) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += gw) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function connectParticles() {
    const dist = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < dist) {
          ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - d / dist)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    lines.forEach(o => { o.update(); o.draw(); });
    connectParticles();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(frame);
  }

  resize();
  init();
  frame();
  window.addEventListener('resize', () => { resize(); init(); });
})();

/* =============================================
   CURSOR GLOW TRACKER
   ============================================= */
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

/* =============================================
   TYPING ANIMATION FOR HEADING
   ============================================= */
(function typeHeading() {
  const el = document.getElementById('typed-heading');
  const cursor = document.getElementById('type-cursor');
  const text1 = 'Selected ';
  const text2 = 'Projects';
  let i = 0;

  function typeChar() {
    if (i < text1.length) {
      el.textContent += text1[i++];
      setTimeout(typeChar, 55);
    } else if (i < text1.length + text2.length) {
      const k = i - text1.length;
      if (k === 0) {
        const span = document.createElement('span');
        span.className = 'gradient-word';
        span.id = 'gradient-span';
        el.appendChild(span);
      }
      document.getElementById('gradient-span').textContent += text2[k];
      i++;
      setTimeout(typeChar, 60);
    } else {
      cursor.style.display = 'inline-block';
    }
  }
  setTimeout(typeChar, 600);
})();

/* =============================================
   PROJECT DATA
   ============================================= */
const projects = [
  {
    id: 1,
    title: 'NeuralCanvas — AI Art Studio',
    tag: 'AI',
    tagClass: 'tag-ai',
    stripClass: 'strip-ai',
    description: 'Real-time generative art platform powered by diffusion models with a custom prompt engineering interface.',
    fullDescription: 'NeuralCanvas is a full-stack generative art studio that runs Stable Diffusion XL through a custom inference pipeline. Users compose multi-modal prompts using a drag-and-drop ingredient system, then watch their artwork materialize in real time. The platform includes a community gallery, style transfer, and an API for developers to integrate AI art into their own products.',
    image: 'https://images.pexels.com/photos/3585088/pexels-photo-3585088.jpeg?w=800',
    features: [
      'Real-time SDXL inference',
      'Multi-modal prompt composer',
      'Style transfer engine',
      'Community gallery & voting',
      'API with rate limiting',
      'Batch generation queue',
    ],
    tech: ['Python', 'FastAPI', 'SDXL', 'React', 'WebSocket', 'Redis', 'PostgreSQL'],
    liveLink: 'https://sheikhsiddique722-sketch.github.io/AI-Art-Studio/',
    github: '#',
    stars: 5,
  },
  {
    id: 2,
    title: 'SentimentOS — NLP Dashboard',
    tag: 'AI',
    tagClass: 'tag-ai',
    stripClass: 'strip-ai',
    description: 'Enterprise-grade sentiment analysis platform processing 10M+ social media signals per day with LLM-powered insights.',
    fullDescription: 'SentimentOS ingests data from 12 social platforms and runs a fine-tuned BERT ensemble to classify sentiment, emotion, and intent at scale. The dashboard surfaces trend alerts, brand health scores, competitor tracking, and auto-generated executive summaries via GPT-4.',
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?w=800',
    features: [
      '10M+ daily signal processing',
      'Multi-class emotion detection',
      'GPT-4 executive summaries',
      'Real-time trend alerts',
      'Competitor benchmarking',
      'Custom model fine-tuning UI',
    ],
    tech: ['Python', 'BERT', 'GPT-4', 'Apache Kafka', 'Next.js', 'D3.js', 'ClickHouse'],
    liveLink: 'https://sheikhsiddique722-sketch.github.io/SentimentOS-NLP-Dashboard/',
    github: '#',
    stars: 5,
  },
  {
    id: 3,
    title: 'ArchOS — AI Code Review System',
    tag: 'Tool',
    tagClass: 'tag-tool',
    stripClass: 'strip-tool',
    description: 'Autonomous code review agent that integrates with GitHub PRs and flags security issues, performance bottlenecks, and style violations.',
    fullDescription: 'ArchOS is a GitHub App that attaches an AI agent to every pull request. It performs AST-level analysis, runs security scans using custom rule sets, benchmarks against team style guides, and leaves contextual inline comments. The system learns from accepted/rejected reviews over time.',
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?w=800',
    features: [
      'AST-level code analysis',
      'CVE security scanning',
      'PR inline comments',
      'Custom rule configuration',
      'Team style guide enforcement',
      'Reinforcement learning loop',
    ],
    tech: ['Node.js', 'TypeScript', 'OpenAI', 'GitHub API', 'AST Parser', 'MongoDB', 'Docker'],
    liveLink: 'https://sheikhsiddique722-sketch.github.io/Archos-Code-Review/',
    github: '#',
    stars: 4,
  },
  {
    id: 4,
    title: 'VectorVault — RAG Infrastructure',
    tag: 'AI',
    tagClass: 'tag-ai',
    stripClass: 'strip-ai',
    description: 'Production-ready RAG pipeline with hybrid search, re-ranking, and a visual knowledge graph editor.',
    fullDescription: 'VectorVault is a fully self-hosted Retrieval-Augmented Generation platform. It handles document ingestion, chunking strategy selection, embedding with multiple models (OpenAI, Cohere, local), hybrid dense+sparse search, cross-encoder re-ranking, and a visual graph to browse connected knowledge clusters.',
    image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?w=800',
    features: [
      'Hybrid dense + sparse search',
      'Cross-encoder re-ranking',
      'Visual knowledge graph',
      'Multi-model embedding support',
      'Streaming response pipeline',
      'Usage analytics dashboard',
    ],
    tech: ['Python', 'LangChain', 'Qdrant', 'FastAPI', 'React Flow', 'Cohere', 'Svelte'],
    liveLink: 'https://sheikhsiddique722-sketch.github.io/fluxUL-Vectorvault/',
    github: '#',
    stars: 5,
  },
  {
    id: 5,
    title: 'FluxUI — Design System',
    tag: 'Design',
    tagClass: 'tag-design',
    stripClass: 'strip-design',
    description: 'A dark-mode-first component library with 80+ atomic components, built for AI-product design teams.',
    fullDescription: 'FluxUI is a design system built with a single constraint: everything looks great on dark, data-dense interfaces. It ships with 80+ primitives, a Figma kit in sync with code via token generation, Storybook docs, and an accessible-by-default interaction model following ARIA best practices.',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?w=800',
    features: [
      '80+ atomic components',
      'Figma ↔ code token sync',
      'Dark-mode-first design',
      'ARIA accessibility built-in',
      'Storybook documentation',
      'Theming engine with CSS vars',
    ],
    tech: ['TypeScript', 'Web Components', 'Figma API', 'Storybook', 'CSS Variables', 'Rollup'],
    liveLink: 'https://sheikhsiddique722-sketch.github.io/FluxUI-Advanced-Design/',
    github: '#',
    stars: 4,
  },
  {
    id: 6,
    title: 'Chrono — Smart Task Intelligence',
    tag: 'Web',
    tagClass: 'tag-web',
    stripClass: 'strip-web',
    description: 'AI-powered productivity app that learns your work patterns and auto-schedules deep work sessions.',
    fullDescription: 'Chrono combines a minimalist task manager with an AI scheduling engine that analyzes your calendar, energy rhythms (via optional wearable sync), and past completion rates to place tasks in optimal time blocks. The assistant can break down vague goals into concrete subtasks and estimate durations.',
    image: 'https://images.pexels.com/photos/1036842/pexels-photo-1036842.jpeg?w=800',
    features: [
      'AI-powered time block scheduling',
      'Energy rhythm detection',
      'Smart subtask decomposition',
      'Duration estimation engine',
      'Wearable device sync',
      'Focus session analytics',
    ],
    tech: ['React', 'Node.js', 'OpenAI', 'Google Calendar API', 'Prisma', 'tRPC', 'Postgres'],
    liveLink: 'https://sheikhsiddique722-sketch.github.io/Chrono-Smart-Task-Intelligence/',
    github: '#',
    stars: 4,
  },
  {
    id: 7,
    title: 'DataPulse — Analytics Platform',
    tag: 'Web',
    tagClass: 'tag-web',
    stripClass: 'strip-web',
    description: 'Real-time business intelligence dashboard with AI-generated insights and natural language query support.',
    fullDescription: 'DataPulse turns raw database connections into interactive dashboards in under 5 minutes. Users can ask questions in plain English ("Show me MRR trend vs churn last 6 months") and the system generates SQL, executes it, and builds the right chart type automatically. Alerts and anomaly detection run continuously.',
    image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?w=800',
    features: [
      'Natural language SQL generation',
      'Auto chart type selection',
      'Anomaly detection alerts',
      'Multi-source data connectors',
      'Shareable dashboard links',
      'Scheduled email digests',
    ],
    tech: ['Vue 3', 'Python', 'LLM SQL', 'ClickHouse', 'D3.js', 'Vega-Lite', 'FastAPI'],
    liveLink: 'https://sheikhsiddique722-sketch.github.io/DataPulse/',
    github: '#',
    stars: 5,
  },
  {
    id: 8,
    title: 'GhostWriter — Content AI',
    tag: 'AI',
    tagClass: 'tag-ai',
    stripClass: 'strip-ai',
    description: 'Long-form content generation system with voice cloning and brand style preservation trained on your own writing.',
    fullDescription: 'GhostWriter fine-tunes a language model on a writer\'s corpus to replicate their authentic voice. It handles multi-document outlines, auto-research (web search integrated), SEO optimization passes, and exports to CMS platforms. The voice cloning module can transform any text into audio matching the trained profile.',
    image: 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?w=800',
    features: [
      'Personal voice fine-tuning',
      'Auto-research & web search',
      'SEO optimization pass',
      'CMS export integrations',
      'Text-to-voice cloning',
      'Multi-document outline mode',
    ],
    tech: ['Python', 'LoRA Fine-tuning', 'ElevenLabs', 'Playwright', 'Next.js', 'Supabase'],
    liveLink: 'https://sheikhsiddique722-sketch.github.io/GhostWriter/',
    github: '#',
    stars: 4,
  },
  {
    id: 9,
    title: 'Prismatic — 3D Visualization',
    tag: 'Design',
    tagClass: 'tag-design',
    stripClass: 'strip-design',
    description: 'Browser-based 3D data visualization engine for rendering complex graph networks and geospatial datasets.',
    fullDescription: 'Prismatic uses WebGL and custom GLSL shaders to render millions of data points in real time. Built for genomics researchers and network security teams who need to navigate graph structures with 100K+ nodes. Includes force-directed layouts, temporal animation, and VR export.',
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?w=800',
    features: [
      '1M+ node rendering',
      'Custom GLSL shaders',
      'Force-directed graph layout',
      'Temporal animation playback',
      'WebXR / VR export',
      'CSV & API data import',
    ],
    tech: ['WebGL', 'Three.js', 'GLSL', 'Rust WASM', 'React', 'WebXR', 'D3-Force'],
    liveLink: 'https://sheikhsiddique722-sketch.github.io/Prismatic/',
    github: '#',
    stars: 5,
  },
];

/* =============================================
   RENDER STARS
   ============================================= */
function renderStars(n) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span style="opacity:${i < n ? 1 : 0.2}">★</span>`
  ).join('');
}

/* =============================================
   STRIP COLOR MAP
   ============================================= */
const stripGradients = {
  'strip-web':    'linear-gradient(to right, #00d4ff, #00aaff)',
  'strip-ai':     'linear-gradient(to right, #7b2fff, #a855f7)',
  'strip-design': 'linear-gradient(to right, #ff2d78, #7b2fff)',
  'strip-tool':   'linear-gradient(to right, #00ff88, #00d4ff)',
  'strip-all':    'linear-gradient(to right, #00d4ff, #7b2fff, #ff2d78)',
};

/* =============================================
   CARD HTML BUILDER
   ============================================= */
function buildCard(p, index) {
  const imgHTML = p.image
    ? `<img src="${p.image}" alt="${p.title}" loading="lazy"/>`
    : `<div class="card-img-placeholder">
         <span class="ph-icon">◈</span>
         <span class="ph-label">${p.tag} Project</span>
       </div>`;

  const techPills = p.tech.slice(0, 4).map(t =>
    `<span class="tech-pill">${t}</span>`
  ).join('') + (p.tech.length > 4 ? `<span class="tech-pill">+${p.tech.length - 4}</span>` : '');

  return `
    <div class="proj-card"
         data-id="${p.id}"
         data-tag="${p.tag}"
         data-index="${index}"
         style="transition-delay:${index * 0.06}s"
    >
      <div class="card-strip ${p.stripClass}"></div>
      <div class="card-img-wrap">
        ${imgHTML}
        <div class="card-img-overlay"></div>
        <span class="card-view-cta">View Project →</span>
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span class="card-tag ${p.tagClass}">${p.tag}</span>
          <div class="card-stars">${renderStars(p.stars || 4)}</div>
        </div>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-desc">${p.description}</p>
        <div class="card-tech">${techPills}</div>
      </div>
      <div class="card-footer">
        <div class="card-links">
          <a href="${p.liveLink}" class="card-link-btn" target="_blank" rel="noopener" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
            Live
          </a>
          <a href="${p.github}" class="card-link-btn" target="_blank" rel="noopener" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.61.07-.6.07-.6 1 .07 1.52 1.02 1.52 1.02.89 1.52 2.33 1.08 2.9.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.02-2.68-.1-.25-.44-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85 0 1.7.11 2.5.33 1.9-1.29 2.74-1.02 2.74-1.02.54 1.37.2 2.39.1 2.64.63.7 1.02 1.59 1.02 2.68 0 3.83-2.34 4.67-4.57 4.92.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z"/></svg>
            Code
          </a>
        </div>
        <span class="card-number">0${p.id}</span>
      </div>
    </div>`;
}

/* =============================================
   TILT EFFECT — 3D CARD ROTATION
   ============================================= */
function initTilt(card) {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(1000px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s, border-color 0.3s';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.15s ease, box-shadow 0.4s, border-color 0.3s';
  });
}

/* =============================================
   SCROLL REVEAL
   ============================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

/* =============================================
   RENDER PROJECTS
   ============================================= */
let activeFilter = 'all';
let searchQuery  = '';

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  const empty = document.getElementById('empty-state');
  const countEl = document.getElementById('count-num');

  grid.querySelectorAll('.proj-card').forEach(c => c.remove());

  const filtered = projects.filter(p => {
    const matchTag    = activeFilter === 'all' || p.tag.toLowerCase() === activeFilter.toLowerCase();
    const matchSearch = !searchQuery || (
      p.title.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      p.tech.some(t => t.toLowerCase().includes(searchQuery))
    );
    return matchTag && matchSearch;
  });

  countEl.textContent = filtered.length;

  if (!filtered.length) {
    empty.classList.add('show');
    return;
  }
  empty.classList.remove('show');

  const fragment = document.createDocumentFragment();
  filtered.forEach((p, i) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildCard(p, i);
    const card = wrapper.firstElementChild;

    card.addEventListener('click', () => openModal(p));
    initTilt(card);
    revealObserver.observe(card);

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

/* =============================================
   FILTER & SEARCH HANDLERS
   ============================================= */
document.getElementById('filter-tabs').addEventListener('click', e => {
  const btn = e.target.closest('.ftab');
  if (!btn) return;
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  renderProjects();
});

document.getElementById('search-input').addEventListener('input', e => {
  searchQuery = e.target.value.trim().toLowerCase();
  renderProjects();
});

/* =============================================
   MODAL OPEN
   ============================================= */
function openModal(p) {
  const overlay = document.getElementById('modal-overlay');

  const strip = document.getElementById('modal-strip');
  strip.style.background = stripGradients[p.stripClass] || stripGradients['strip-all'];

  const imgWrap = document.getElementById('modal-img-wrap');
  imgWrap.innerHTML = p.image
    ? `<img src="${p.image}" alt="${p.title}" loading="lazy"/><div class="modal-img-overlay"></div>`
    : `<div class="modal-img-placeholder">${p.tag === 'AI' ? '◈' : '◉'}</div>`;

  const tagEl = document.getElementById('modal-tag');
  tagEl.textContent = p.tag;
  tagEl.className = `card-tag ${p.tagClass}`;

  document.getElementById('modal-title').textContent = p.title;
  document.getElementById('modal-desc').textContent = p.fullDescription;

  const featList = document.getElementById('modal-features');
  featList.innerHTML = p.features.map(f => `<li>${f}</li>`).join('');

  const techEl = document.getElementById('modal-tech');
  techEl.innerHTML = p.tech.map(t => `<span class="modal-tech-badge">${t}</span>`).join('');

  const actEl = document.getElementById('modal-actions');
  actEl.innerHTML = `
    <a href="${p.liveLink}" target="_blank" rel="noopener" class="btn-primary btn-live">
      <span>↗ Live Preview</span>
    </a>
    <a href="${p.github}" target="_blank" rel="noopener" class="btn-primary btn-github">
      <span>◎ View on GitHub</span>
    </a>`;

  document.getElementById('modal-box').scrollTop = 0;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-close-btn').focus();
}

/* =============================================
   MODAL CLOSE
   ============================================= */
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modal-close-btn').addEventListener('click', closeModal);

document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* =============================================
   INITIAL RENDER
   ============================================= */
renderProjects();
