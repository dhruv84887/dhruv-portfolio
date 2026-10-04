/**
 * ============================================================
 * CENTRAL PERSONAL DATA FILE — EDIT YOUR PORTFOLIO HERE
 * ============================================================
 * Single source of truth for all personal content. Hero, About,
 * Skills, Projects, Journey, Contact and Footer read from here —
 * change a value once, everywhere updates.
 *
 * WHERE TO EDIT:
 * - Name ....... `profile.name`
 * - Role ....... `profile.role`
 * - Headline ... `profile.headline`
 * - Hero lines . `profile.heroSubline` + `profile.heroTagline`
 * - Status ..... `profile.availability`
 * - Bio ........ `profile.shortBio` + `about.paragraphs`
 * - Education .. `profile.education` + `journeyItems`
 * - Skills ..... `skillCategories`
 * - Projects ... `projects`
 * - Email ...... `profile.email`
 * - GitHub ..... `socialLinks.github`
 * - LinkedIn ... `socialLinks.linkedin`
 * - Instagram .. `socialLinks.instagram`
 * - Resume ..... `profile.resumeUrl` (see notes below)
 * - Proj images  `projects[].image` (see notes below)
 * ============================================================
 */

/* ------------------------------------------------------------
 * PROFILE — name, role, bio, education, email, resume
 * ---------------------------------------------------------- */
export const profile = {
  // ← EDIT: display name (Hero title, About text, Footer, page title)
  name: 'Dhruv',

  // ← EDIT: short professional role
  role: 'Computer Science Engineering Student',

  // ← EDIT: hero badge headline
  headline: 'Developer • AI/ML Enthusiast • Creative Technologist',

  // Badge shown in the Hero pill (rendered uppercase by the UI)
  badge: 'Computer Science Engineering • Developer • AI/ML',

  // ← EDIT: one-line bio (meta description + About fallback)
  shortBio:
    'Computer Science Engineering student passionate about programming, artificial intelligence, machine learning and modern web development.',

  // ← EDIT: education label
  education: 'Computer Science & Engineering',

  // ← EDIT: contact email (Contact + Footer + mailto: derive from this)
  email: 'hello@yourname.dev', // ← editable: your real email address

  // ← EDIT: hero second line (revealed word-by-word in the UI)
  heroSubline: 'Building Digital Experiences With Code & AI.',

  // ← EDIT: hero description paragraph
  heroTagline:
    "I'm a Computer Science Engineering student passionate about software development, artificial intelligence, machine learning and immersive web experiences.",

  // ← EDIT: hero availability indicator
  availability: 'Open to Learning • Building • Collaborating',

  /**
   * RESUME — editable resume path.
   * - Put the real file in `public/` (e.g. `public/resume.pdf`) and set
   *   this to '/resume.pdf'.
   * - While it is '#' (placeholder) the About button hides entirely and
   *   the Hero shows a muted "soon" state — never a broken download.
   * - Do NOT commit a fake resume — leave the placeholder until the
   *   genuine file exists.
   */
  resumeUrl: '#', // ← editable: '/resume.pdf' once the file exists
}

/** Two-letter monogram ("DH") from the name — navbar + footer brand. */
export const monogram = profile.name.replace(/\s+/g, '').slice(0, 2).toUpperCase()

/** Site config derived from the profile (kept for compatibility). */
export const siteConfig = {
  name: profile.name,
  role: `${profile.education} • ${profile.headline}`,
  email: profile.email,
  description:
    'A premium, futuristic 3D portfolio built with React, Vite and three.js.',
}

/* ------------------------------------------------------------
 * SOCIAL LINKS — '#' placeholders until real URLs are provided.
 * Replace '#' with real URLs, e.g. 'https://github.com/your-name'
 * ---------------------------------------------------------- */
export const socialLinks = {
  github: '#', // ← editable: GitHub profile URL
  linkedin: '#', // ← editable: LinkedIn profile URL
  instagram: '#', // ← editable: Instagram profile URL
  email: `mailto:${profile.email}`, // derived — no need to edit
}

/**
 * Contact-link list for the Contact + Footer sections.
 * Every entry is a real navigable link. Placeholders ('#') are filtered
 * out at render time, so no dead / non-functional buttons are ever shown.
 */
export const contactLinks = [
  { id: 'email', label: 'Email', glyph: '@', href: socialLinks.email },
  { id: 'github', label: 'GitHub', glyph: 'GH', href: socialLinks.github },
  { id: 'linkedin', label: 'LinkedIn', glyph: 'LI', href: socialLinks.linkedin },
  { id: 'instagram', label: 'Instagram', glyph: 'IG', href: socialLinks.instagram },
]

/**
 * Only the contact links that have a real URL. Sections render this so a
 * social button appears the moment its URL is filled in — and stays hidden
 * (rather than broken) while it is still the '#' placeholder.
 */
export const visibleContactLinks = contactLinks.filter((link) =>
  hasValidUrl(link.href),
)

/* ------------------------------------------------------------
 * NAVIGATION — labels only; hrefs must match section `id`s.
 * ---------------------------------------------------------- */
export const navigation = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'projects', label: 'Projects', href: '#work' },
  { id: 'journey', label: 'Journey', href: '#journey' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]
/* ------------------------------------------------------------
 * SKILLS — edit labels, add categories or append skills here.
 * Tabs, orbit positions and filtering adapt automatically.
 * Each category: { id, label, skills: [...] }
 * ---------------------------------------------------------- */
export const skillCategories = [
  {
    id: 'programming',
    label: 'Programming',
    skills: ['C', 'C++', 'Java', 'JavaScript', 'Python'], // ← EDIT
  },
  {
    id: 'web-development',
    label: 'Web Development',
    skills: ['HTML', 'CSS', 'React', 'Node.js'], // ← EDIT
  },
  {
    id: 'ai-ml',
    label: 'AI / ML',
    skills: [ // ← EDIT
      'Deep Learning',
      'Computer Vision',
      'OpenCV',
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    skills: ['Git', 'GitHub', 'VS Code', 'Canva', 'OBS Studio'], // ← EDIT
  },
  {
    id: 'design',
    label: 'Design',
    skills: ['UI/UX', 'Responsive Design', '3D Web Design'], // ← EDIT
  },
]

/** Flat skill list from the categories (handy for stats/SEO). */
export const allSkills = skillCategories.flatMap((category) => category.skills)

/* ------------------------------------------------------------
 * ABOUT — highlight cards, stats and paragraphs.
 * ---------------------------------------------------------- */
export const about = {
  // ← EDIT: highlight cards under the About text
  highlights: [
    'Computer Science Engineering',
    'AI & Machine Learning',
    'Web Development',
    'Creative Technology',
  ],

  // ← EDIT: animated stats (target: number, or null for "∞")
  stats: [
    { target: 2, label: 'Years Learning' },
    { target: 10, label: 'Technologies' },
    { target: 5, label: 'Projects' },
    { target: null, label: 'Ideas' },
  ],

  // ← EDIT: About paragraphs (rendered in order).
  // Each paragraph is a list of `segments`: plain text as strings,
  // or `{ term: 'text' }` for a dotted-underline highlight.
  // Paragraph 1 is generated from `profile.name` + `profile.shortBio`
  // so it can never drift from the central profile fields.
  paragraphs: [
    {
      segments: [
        `I'm ${profile.name}, a `,
        { term: profile.education },
        ' student passionate about programming, ',
        { term: 'artificial intelligence' },
        ', ',
        { term: 'machine learning' },
        ' and modern web development.',
      ],
    },
    {
      segments: [
        'I enjoy exploring new technologies and turning creative ideas into interactive digital experiences.',
      ],
    },
  ],
}

/* ------------------------------------------------------------
 * JOURNEY / EDUCATION TIMELINE
 * Add/edit entries freely; alternating sides, nodes and animations
 * adapt automatically. Each entry: { id, year, title, description }
 * ---------------------------------------------------------- */
export const journeyItems = [
  {
    id: 'cse',
    year: '2024 – Present', // ← EDIT
    title: 'Computer Science & Engineering', // ← EDIT
    description:
      'Currently pursuing Computer Science & Engineering and building a strong foundation in programming, databases, algorithms, artificial intelligence and modern software development.',
  },
  {
    id: 'programming',
    year: 'Learning',
    title: 'Programming & Development',
    description:
      'Exploring C, C++, Java, JavaScript, Python, web development and modern development tools through practical projects.',
  },
  {
    id: 'ai-ml',
    year: 'Exploring',
    title: 'AI & Machine Learning',
    description:
      'Learning artificial intelligence, machine learning, computer vision and deep learning while experimenting with real-world project ideas.',
  },
  {
    id: 'building',
    year: 'Building',
    title: 'Creative Technology Projects',
    description:
      'Creating interactive websites, AI concepts and immersive digital experiences while continuously experimenting with new technologies.',
  },
]

/* ------------------------------------------------------------
 * PROJECTS — single source of truth for the Projects section.
 * Add a new object and the card, layout, modal and preview art
 * adapt automatically.
 *
 * FIELDS:
 * - id ........... URL/JS friendly key (used for #project-<id> links)
 * - title ........ project title
 * - category ..... category label shown on the card
 * - description .. short description
 * - technologies . badge list
 * - image ........ ← EDIT: cover image. Path in `public/`
 *                  (e.g. '/projects/anomaly.jpg') or full https URL.
 *                  Leave '' until a real image exists — themed
 *                  abstract preview art renders instead.
 *                  Do NOT invent fake image URLs.
 * - githubUrl .... ← EDIT: repository URL, or '' when unknown.
 * - liveUrl ...... ← EDIT: live demo URL, or '' when unknown.
 *                  Buttons hide automatically when the URL is
 *                  missing, so there are never broken links.
 * - visual ....... abstract-art theme ('ai'|'social'|'creative')
 * - screenshots .. ← EDIT: modal gallery image URLs (or [])
 * ---------------------------------------------------------- */
export const projects = [
  {
    id: 'anomaly-detection',
    title: 'AI-Driven Anomaly Detection for Intelligent Surveillance Systems',
    category: 'AI / Machine Learning / Computer Vision',
    description:
      'An intelligent surveillance concept that uses computer vision and AI-based anomaly detection to identify unusual or suspicious activities from camera feeds.',
    technologies: [
      'Python',
      'OpenCV',
      'Computer Vision',
      'Machine Learning',
      'Deep Learning',
      'CNN',
    ],
    image: '', // ← editable: cover image path or URL ('' = abstract art)
    githubUrl: '', // ← editable: repository URL
    liveUrl: '', // ← editable: live demo URL
    visual: 'ai',
    screenshots: [], // ← editable: modal gallery image URLs
  },
  {
    id: 'social-ai-platform',
    title: 'Social + AI Platform',
    category: 'Web Development / AI',
    description:
      'A modern social platform concept combining social networking, messaging, content sharing and AI-powered features in one immersive experience.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'AI', 'API Integration'],
    image: '',
    githubUrl: '',
    liveUrl: '',
    visual: 'social',
    screenshots: [],
  },
  {
    id: 'creative-web-experience',
    title: 'Creative Web Experience',
    category: '3D Web / Frontend',
    description:
      'An experimental interactive web experience focused on immersive UI, animations, 3D interactions and modern frontend design.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Three.js', 'React'],
    image: '',
    githubUrl: '',
    liveUrl: '',
    visual: 'creative',
    screenshots: [],
  },
]

/* ------------------------------------------------------------
 * CONTACT FORM
 * Set `endpoint` to a real service (Formspree, Formspark, your own
 * API route, …), e.g. endpoint: 'https://formspree.io/f/xxxxxxxx'
 * While `endpoint` is null, submissions are simulated (demo mode)
 * and nothing is sent anywhere. No credentials live in this repo.
 * ---------------------------------------------------------- */
export const formConfig = {
  endpoint: null, // ← editable: form service URL or null for demo mode
}

export async function submitContact(data) {
  if (!formConfig.endpoint) {
    await new Promise((resolve) => setTimeout(resolve, 1400))
    return { ok: true, demo: true }
  }

  const response = await fetch(formConfig.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error('Submission failed')
  return { ok: true, demo: false }
}

/* ------------------------------------------------------------
 * HELPERS
 * ---------------------------------------------------------- */

/**
 * True when a URL is a real, navigable link. Empty strings,
 * whitespace and the '#' placeholder count as missing, so buttons
 * bound to them stay hidden instead of rendering broken links.
 */
export function hasValidUrl(url) {
  if (typeof url !== 'string') return false
  const value = url.trim()
  if (!value || value === '#') return false
  return true
}

/** External repo URL (supports both new + legacy field names). */
export function projectGithubUrl(project) {
  return project.githubUrl ?? project.sourceUrl ?? ''
}

/** External live-demo URL (supports both new + legacy field names). */
export function projectLiveUrl(project) {
  return project.liveUrl ?? project.viewUrl ?? ''
}

