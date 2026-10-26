export interface SourceMeta {
  id: string;
  label: string;
  category: "Major Boards" | "Remote Tech" | "Direct ATS" | "Regional / Specialized";
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentColor: string;
  iconLetter: string;
  tagline: string;
}

export const KNOWN_SOURCES: SourceMeta[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    category: "Major Boards",
    badgeBg: "bg-[#0077B5]/10",
    badgeText: "text-[#0077B5]",
    badgeBorder: "border-[#0077B5]/25",
    accentColor: "#0077B5",
    iconLetter: "IN",
    tagline: "Corporate postings & direct company career pages",
  },
  {
    id: "indeed",
    label: "Indeed",
    category: "Major Boards",
    badgeBg: "bg-[#2164f3]/10",
    badgeText: "text-[#2164f3]",
    badgeBorder: "border-[#2164f3]/25",
    accentColor: "#2164f3",
    iconLetter: "IND",
    tagline: "Global multi-tier job aggregator & direct employer posts",
  },
  {
    id: "glassdoor",
    label: "Glassdoor",
    category: "Major Boards",
    badgeBg: "bg-[#0CAA41]/10",
    badgeText: "text-[#0CAA41]",
    badgeBorder: "border-[#0CAA41]/25",
    accentColor: "#0CAA41",
    iconLetter: "GD",
    tagline: "Company insights, verified salaries, and employer jobs",
  },
  {
    id: "ziprecruiter",
    label: "ZipRecruiter",
    category: "Major Boards",
    badgeBg: "bg-[#6C5CE7]/10",
    badgeText: "text-[#6C5CE7]",
    badgeBorder: "border-[#6C5CE7]/25",
    accentColor: "#6C5CE7",
    iconLetter: "ZR",
    tagline: "AI-powered employer job distribution network",
  },
  {
    id: "google",
    label: "Google Jobs",
    category: "Major Boards",
    badgeBg: "bg-[#4285F4]/10",
    badgeText: "text-[#4285F4]",
    badgeBorder: "border-[#4285F4]/25",
    accentColor: "#4285F4",
    iconLetter: "GO",
    tagline: "Indexed direct employer feeds & career search engine",
  },
  {
    id: "remotive",
    label: "Remotive",
    category: "Remote Tech",
    badgeBg: "bg-[#4C9A78]/10",
    badgeText: "text-[#4C9A78]",
    badgeBorder: "border-[#4C9A78]/25",
    accentColor: "#4C9A78",
    iconLetter: "REM",
    tagline: "Hand-curated distributed engineering and tech roles",
  },
  {
    id: "dice",
    label: "Dice",
    category: "Remote Tech",
    badgeBg: "bg-[#E67E22]/10",
    badgeText: "text-[#E67E22]",
    badgeBorder: "border-[#E67E22]/25",
    accentColor: "#E67E22",
    iconLetter: "DIC",
    tagline: "Specialized tech infrastructure, cloud, and engineering roles",
  },
  {
    id: "adzuna",
    label: "Adzuna",
    category: "Regional / Specialized",
    badgeBg: "bg-[#E8B894]/20",
    badgeText: "text-[#A86D2C]",
    badgeBorder: "border-[#E8B894]/40",
    accentColor: "#A86D2C",
    iconLetter: "ADZ",
    tagline: "Salary-benchmarked regional Moroccan tech positions",
  },
  {
    id: "simplyhired",
    label: "SimplyHired",
    category: "Regional / Specialized",
    badgeBg: "bg-[#2D98DA]/10",
    badgeText: "text-[#2D98DA]",
    badgeBorder: "border-[#2D98DA]/25",
    accentColor: "#2D98DA",
    iconLetter: "SH",
    tagline: "Regional technology vacancies and job feeds",
  },
  {
    id: "greenhouse",
    label: "Greenhouse Direct",
    category: "Direct ATS",
    badgeBg: "bg-[#00B894]/10",
    badgeText: "text-[#00B894]",
    badgeBorder: "border-[#00B894]/25",
    accentColor: "#00B894",
    iconLetter: "GH",
    tagline: "Direct enterprise company applicant tracking system",
  },
  {
    id: "lever",
    label: "Lever Direct",
    category: "Direct ATS",
    badgeBg: "bg-[#3F5D9E]/10",
    badgeText: "text-[#3F5D9E]",
    badgeBorder: "border-[#3F5D9E]/25",
    accentColor: "#3F5D9E",
    iconLetter: "LEV",
    tagline: "Venture-backed startup ATS & direct career portals",
  },
  {
    id: "upwork",
    label: "Upwork Enterprise",
    category: "Remote Tech",
    badgeBg: "bg-[#14A800]/10",
    badgeText: "text-[#14A800]",
    badgeBorder: "border-[#14A800]/25",
    accentColor: "#14A800",
    iconLetter: "UP",
    tagline: "Long-term dedicated backend contracts & enterprise roles",
  },
];
export const getSourceMeta = (sourceId: string): SourceMeta => {
  const normalized = sourceId.toLowerCase().trim();
  const found = KNOWN_SOURCES.find(
    (s) => s.id === normalized || s.label.toLowerCase() === normalized
  );
  if (found) return found;

  return {
    id: normalized,
    label: sourceId.charAt(0).toUpperCase() + sourceId.slice(1),
    category: "Regional / Specialized",
    badgeBg: "bg-[#FAF9F6]",
    badgeText: "text-[#2A2B2F]",
    badgeBorder: "border-[#E5E1D8]",
    accentColor: "#3F5D9E",
    iconLetter: sourceId.slice(0, 3).toUpperCase(),
    tagline: "JSearch aggregated partner feed",
  };
};

export interface JobItem {
  id: string;
  title: string;
  company: string;
  companyLogoText: string;
  location: string;
  workMode: "Remote" | "Onsite" | "Hybrid";
  source: string;
  salary: string;
  postedAge: string;
  matchScore: number;
  matchLevel: "high" | "mid";
  matchedSkills: string[];
  summary: string;
  description: string[];
  requirements: string[];
  applyUrl: string;
}

export const SAMPLE_MATCHES: JobItem[] = [
  {
    id: "match-1",
    title: "Senior Backend Engineer (Node.js & Distributed Systems)",
    company: "Vercel",
    companyLogoText: "V",
    location: "Remote, Worldwide",
    workMode: "Remote",
    source: "remotive",
    salary: "16,000 - 22,000 MAD / mo",
    postedAge: "2h ago",
    matchScore: 96,
    matchLevel: "high",
    matchedSkills: ["Node.js", "TypeScript", "PostgreSQL", "Docker", "Redis"],
    summary:
      "Design and scale serverless infrastructure, APIs, and edge functions servicing millions of requests per second.",
    description: [
      "Architect and scale resilient backend services handling mission-critical workloads.",
      "Collaborate with product and infrastructure teams to design high-throughput REST and gRPC endpoints.",
      "Optimize PostgreSQL queries, implement caching layers with Redis, and monitor telemetry.",
    ],
    requirements: [
      "4+ years of professional backend development with Node.js and TypeScript.",
      "Solid foundation in distributed database architecture, indexing, and connection pooling.",
      "Experience deploying containerized services with Docker & Kubernetes.",
    ],
    applyUrl: "https://remotive.com",
  },
  {
    id: "match-2",
    title: "Lead API & Cloud Architect",
    company: "Stripe",
    companyLogoText: "S",
    location: "Casablanca, Morocco",
    workMode: "Onsite",
    source: "linkedin",
    salary: "18,000 - 25,000 MAD / mo",
    postedAge: "4h ago",
    matchScore: 94,
    matchLevel: "high",
    matchedSkills: ["Backend Architecture", "Node.js", "PostgreSQL", "REST APIs", "AWS"],
    summary:
      "Drive payment platform integrations across EMEA. Lead architecture reviews, security auditing, and core transaction flows.",
    description: [
      "Own core banking gateway connections and high-volume billing pipelines.",
      "Ensure 99.999% uptime for transaction processing endpoints.",
      "Mentor mid-level engineers and drive internal documentation standards.",
    ],
    requirements: [
      "5+ years building and scaling enterprise backend applications.",
      "Hands-on experience with SQL optimization, ACID compliance, and secure auth flows.",
      "Based in or willing to work onsite in Casablanca.",
    ],
    applyUrl: "https://linkedin.com",
  },
  {
    id: "match-3",
    title: "Staff Backend Infrastructure Engineer",
    company: "Linear",
    companyLogoText: "L",
    location: "Remote, Worldwide",
    workMode: "Remote",
    source: "greenhouse",
    salary: "19,000 - 24,000 MAD / mo",
    postedAge: "5h ago",
    matchScore: 95,
    matchLevel: "high",
    matchedSkills: ["TypeScript", "Node.js", "PostgreSQL", "WebSockets", "GraphQL"],
    summary:
      "Direct Greenhouse applicant pipeline. Build real-time synchronization primitives and data replication layers with sub-50ms latency.",
    description: [
      "Develop real-time synchronization primitives and data replication layers.",
      "Build robust client sync protocols using WebSockets and background task queues.",
      "Scale database read replicas and write pipelines.",
    ],
    requirements: [
      "Strong background in reactive data systems and schema design.",
      "Deep understanding of event loops, asynchronous programming, and web standards.",
    ],
    applyUrl: "https://boards.greenhouse.io",
  },
  {
    id: "match-4",
    title: "Full Stack / Backend Developer",
    company: "Shopify",
    companyLogoText: "S",
    location: "Rabat, Morocco (Hybrid)",
    workMode: "Hybrid",
    source: "indeed",
    salary: "12,000 - 16,000 MAD / mo",
    postedAge: "7h ago",
    matchScore: 88,
    matchLevel: "high",
    matchedSkills: ["Node.js", "Docker", "REST APIs", "Git", "Microservices"],
    summary:
      "Develop commerce APIs and merchant automation features for millions of global online businesses.",
    description: [
      "Build resilient merchant microservices powering real-time checkout and inventory tracking.",
      "Integrate automated CI/CD pipelines and end-to-end integration tests.",
    ],
    requirements: [
      "3+ years building production web applications.",
      "Comfortable with containerization, API contracts, and team code reviews.",
    ],
    applyUrl: "https://indeed.com",
  },
  {
    id: "match-5",
    title: "Cloud Database Engineer",
    company: "MongoDB",
    companyLogoText: "M",
    location: "Remote, EMEA",
    workMode: "Remote",
    source: "glassdoor",
    salary: "17,000 - 23,000 MAD / mo",
    postedAge: "8h ago",
    matchScore: 92,
    matchLevel: "high",
    matchedSkills: ["Database Design", "Node.js", "Go", "Docker", "Linux"],
    summary:
      "Verified Glassdoor publisher posting. Scale multi-region automated database clusters and cross-region sharding layers.",
    description: [
      "Improve replication throughput and high-availability failover automation.",
      "Build internal diagnostic tools and performance profiling instrumentation.",
    ],
    requirements: [
      "Solid understanding of distributed storage, consensus protocols, and Linux kernel fundamentals.",
    ],
    applyUrl: "https://glassdoor.com",
  },
  {
    id: "match-6",
    title: "Backend Cloud Infrastructure Engineer",
    company: "Datadog",
    companyLogoText: "D",
    location: "Casablanca, Morocco",
    workMode: "Onsite",
    source: "adzuna",
    salary: "14,000 - 18,000 MAD / mo",
    postedAge: "10h ago",
    matchScore: 85,
    matchLevel: "high",
    matchedSkills: ["Node.js", "Cloud Services", "PostgreSQL", "Linux", "Docker"],
    summary:
      "Maintain telemetry pipelines and log collectors across regional data centers.",
    description: [
      "Build log parsing and metrics aggregation services.",
      "Configure automated alerting thresholds and diagnostic runbooks.",
    ],
    requirements: [
      "Experience with high-throughput streaming architectures.",
      "Strong Linux systems administration and bash scripting skills.",
    ],
    applyUrl: "https://adzuna.com",
  },
  {
    id: "match-7",
    title: "Platform Systems Architect",
    company: "Square / Block",
    companyLogoText: "B",
    location: "Remote, Worldwide",
    workMode: "Remote",
    source: "ziprecruiter",
    salary: "18,000 - 25,000 MAD / mo",
    postedAge: "11h ago",
    matchScore: 93,
    matchLevel: "high",
    matchedSkills: ["Node.js", "PostgreSQL", "Microservices", "REST APIs", "Redis"],
    summary:
      "ZipRecruiter network distribution. Architect zero-downtime card processing services and distributed ledger integrations.",
    description: [
      "Design fault-tolerant APIs processing billions in transactional volume annually.",
      "Coordinate security reviews and cryptographic key rotation workflows.",
    ],
    requirements: [
      "Strong background in financial transaction flows, ACID guarantees, and idempotency keys.",
    ],
    applyUrl: "https://ziprecruiter.com",
  },
  {
    id: "match-8",
    title: "Senior Node.js Cloud Developer",
    company: "Canonical / Ubuntu",
    companyLogoText: "C",
    location: "Remote, EMEA",
    workMode: "Remote",
    source: "dice",
    salary: "15,000 - 21,000 MAD / mo",
    postedAge: "13h ago",
    matchScore: 89,
    matchLevel: "high",
    matchedSkills: ["Node.js", "Linux", "Docker", "Python", "REST APIs"],
    summary:
      "Specialized Dice tech board posting. Build cloud orchestration tooling and developer image distribution pipelines.",
    description: [
      "Develop orchestration backend for automated image builds and snap packages.",
      "Maintain high-throughput public repository download mirrors.",
    ],
    requirements: [
      "Proficient with Linux system calls, package management, and Node.js asynchronous architecture.",
    ],
    applyUrl: "https://dice.com",
  },
  {
    id: "match-9",
    title: "Enterprise Backend Software Engineer",
    company: "Google Cloud Partners",
    companyLogoText: "G",
    location: "Casablanca, Morocco",
    workMode: "Hybrid",
    source: "google",
    salary: "16,000 - 22,000 MAD / mo",
    postedAge: "15h ago",
    matchScore: 91,
    matchLevel: "high",
    matchedSkills: ["Node.js", "GCP", "PostgreSQL", "Kubernetes", "TypeScript"],
    summary:
      "Indexed directly via Google Jobs feed. Implement cloud migration pipelines and customer analytics microservices.",
    description: [
      "Build BigQuery integration queues and pub/sub streaming listeners.",
      "Implement identity federation and automated audit logging.",
    ],
    requirements: [
      "3+ years experience with cloud native architectures and container management.",
    ],
    applyUrl: "https://google.com/search?ibp=htl;jobs",
  },
  {
    id: "match-10",
    title: "Backend API Developer",
    company: "Glovo",
    companyLogoText: "G",
    location: "Casablanca, Morocco",
    workMode: "Onsite",
    source: "simplyhired",
    salary: "11,000 - 15,000 MAD / mo",
    postedAge: "1d ago",
    matchScore: 82,
    matchLevel: "mid",
    matchedSkills: ["Node.js", "REST APIs", "PostgreSQL", "Git"],
    summary:
      "SimplyHired regional aggregator feed. Work on courier dispatch algorithms and local restaurant partner portals.",
    description: [
      "Optimize real-time location indexing and dispatch routing queues.",
      "Integrate automated partner SMS and webhook notification endpoints.",
    ],
    requirements: [
      "Good knowledge of relational databases, geospatial queries, and HTTP REST best practices.",
    ],
    applyUrl: "https://simplyhired.com",
  },
  {
    id: "match-11",
    title: "Staff Microservices Engineer",
    company: "Notion",
    companyLogoText: "N",
    location: "Remote, Worldwide",
    workMode: "Remote",
    source: "lever",
    salary: "19,000 - 26,000 MAD / mo",
    postedAge: "1d ago",
    matchScore: 94,
    matchLevel: "high",
    matchedSkills: ["TypeScript", "Node.js", "PostgreSQL", "Redis", "Distributed Systems"],
    summary:
      "Direct Lever employer posting. Work on real-time collaborative doc editing sync pipelines and workspace permissions.",
    description: [
      "Scale operational transform and CRDT synchronization services.",
      "Optimize database connection pools servicing millions of active workspace sessions.",
    ],
    requirements: [
      "Expertise in concurrency models, distributed state machines, and high-performance TypeScript.",
    ],
    applyUrl: "https://jobs.lever.co",
  },
  {
    id: "match-12",
    title: "Senior Node.js & TypeScript Architect",
    company: "Oracle",
    companyLogoText: "O",
    location: "Casablanca, Morocco",
    workMode: "Onsite",
    source: "indeed",
    salary: "15,000 - 20,000 MAD / mo",
    postedAge: "2d ago",
    matchScore: 92,
    matchLevel: "high",
    matchedSkills: ["Node.js", "TypeScript", "PostgreSQL", "Microservices", "Docker"],
    summary:
      "Lead enterprise cloud migration services and high-volume transaction microservices for enterprise banking clients.",
    description: [
      "Refactor legacy backend systems into containerized TypeScript microservices.",
      "Optimize SQL query plans and automated replication across distributed availability zones.",
    ],
    requirements: [
      "4+ years building production-grade services in Node.js/TypeScript.",
      "Expert knowledge of relational database indexes, transactions, and concurrency.",
    ],
    applyUrl: "https://indeed.com",
  },
];
