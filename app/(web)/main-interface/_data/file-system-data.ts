import type { FileNode } from "@/app/shared/types/file-system";

// ─── Icons ────────────────────────────────────────────────────────────────────
const ICONS = {
  folder: "/assets/images/folder.png",
  cdrive: "/assets/images/c-drive.png",
  recycle: "/assets/images/recycle-bin.png",
  txt: "/assets/images/file-txt.png",
  pdf: "/assets/images/file-pdf.png",
  ui: "/assets/images/file-ui.png",
  slide: "/assets/images/file-slide.png",
  link: "/assets/images/file-link.png",
  sysCmd: "/assets/images/system-command.png",
  prefs: "/assets/images/preferences.png",
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════════════════════════

function makeProject(
  prefix: string,
  opts: {
    name: string;
    type: string;
    description: string;
    highlights: string[];
    stack: string[];
    status: string;
    year: string;
    platform?: string;
    githubUrl: string;
  },
): FileNode {
  return {
    id: `${prefix}-folder`,
    name: opts.name,
    type: "folder",
    iconPath: ICONS.folder,
    data: {
      kind: "folder",
      children: [
        {
          id: `${prefix}-images`,
          name: "images.slide",
          type: "slide",
          iconPath: ICONS.slide,
          data: {
            kind: "slide",
            title: `${opts.name} — Screenshots`,
            images: [
              {
                src: `/assets/projects/${prefix}/screen1.png`,
                caption: "Screen 1",
              },
              {
                src: `/assets/projects/${prefix}/screen2.png`,
                caption: "Screen 2",
              },
            ],
          },
        },
        {
          id: `${prefix}-desc`,
          name: "description.ui",
          type: "ui",
          iconPath: ICONS.ui,
          data: {
            kind: "ui",
            component: "ProjectDescriptionUI",
            props: {
              name: opts.name,
              type: opts.type,
              description: opts.description,
              highlights: opts.highlights,
              stack: opts.stack,
              status: opts.status,
              year: opts.year,
              platform: opts.platform,
            },
          },
        },
        {
          id: `${prefix}-link`,
          name: "project.link",
          type: "link",
          iconPath: ICONS.link,
          data: { kind: "link", url: opts.githubUrl },
        },
      ],
    },
  };
}

const mobileWorkFolder: FileNode = {
  id: "mobile-work",
  name: "Work",
  type: "folder",
  iconPath: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      makeProject("proj-ecommerce", {
        name: "E-Commerce App",
        type: "Mobile · Work",
        description:
          "Production-grade shopping application with full cart, checkout, and payment flow. Built with Clean Architecture and BLoC state management.",
        highlights: [
          "Clean Architecture with 3-layer separation (data, domain, presentation)",
          "BLoC pattern for predictable state management",
          "Firebase Auth + Firestore integration",
          "In-app payment gateway integration",
          "Unit & widget test coverage > 80%",
        ],
        stack: ["Flutter", "Dart", "BLoC", "Firebase", "Clean Architecture"],
        status: "Completed",
        year: "2023",
        platform: "iOS & Android",
        githubUrl: "https://github.com/your-username/ecommerce-app",
      }),
      makeProject("proj-task-manager", {
        name: "Team Task Manager",
        type: "Mobile · Work",
        description:
          "Collaborative task management tool with real-time sync, project boards, member roles, and push notifications.",
        highlights: [
          "Real-time Firestore listeners for live task updates",
          "Role-based access control (Admin / Member / Viewer)",
          "Push notifications via Firebase Cloud Messaging",
          "Offline-first with local cache strategy",
          "CI/CD pipeline with Fastlane",
        ],
        stack: ["Flutter", "Dart", "Firebase", "FCM", "Fastlane", "MVVM"],
        status: "Completed",
        year: "2022",
        platform: "iOS & Android",
        githubUrl: "https://github.com/your-username/task-manager",
      }),
    ],
  },
};

const mobilePersonalFolder: FileNode = {
  id: "mobile-personal",
  name: "Personal",
  type: "folder",
  iconPath: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      makeProject("proj-portfolio-os", {
        name: "Portfolio OS",
        type: "Mobile · Personal",
        description:
          "This portfolio itself — a Next.js web app styled as a desktop operating system with a window manager, file system, terminal, and theme switching.",
        highlights: [
          "Custom window manager with drag, minimize, maximize, z-index",
          "Virtual typed file system (folder, txt, ui, pdf, slide, link)",
          "Working terminal with command parsing",
          "Multi-theme support (Cyber Blue, Matrix, Light)",
          "Framer Motion animations throughout",
        ],
        stack: [
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "Framer Motion",
          "React",
        ],
        status: "In Development",
        year: "2024",
        platform: "Web",
        githubUrl: "https://github.com/your-username/portfolio-os",
      }),
    ],
  },
};

const mobileFolder: FileNode = {
  id: "mobile",
  name: "Mobile",
  type: "folder",
  iconPath: ICONS.folder,
  data: {
    kind: "folder",
    children: [mobileWorkFolder, mobilePersonalFolder],
  },
};

const webFolder: FileNode = {
  id: "web-projects",
  name: "Web",
  type: "folder",
  iconPath: ICONS.folder,
  data: { kind: "folder", children: [] },
};

const openSourceFolder: FileNode = {
  id: "open-source",
  name: "Open Source",
  type: "folder",
  iconPath: ICONS.folder,
  data: { kind: "folder", children: [] },
};

const projectsFolder: FileNode = {
  id: "projects",
  name: "Projects",
  type: "folder",
  iconPath: ICONS.folder,
  data: {
    kind: "folder",
    children: [mobileFolder, webFolder, openSourceFolder],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SKILLS
// ═══════════════════════════════════════════════════════════════════════════════

const technicalFolder: FileNode = {
  id: "skills-technical",
  name: "Technical",
  type: "folder",
  iconPath: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      {
        id: "skill-languages",
        name: "Languages.ui",
        type: "ui",
        iconPath: ICONS.ui,
        data: {
          kind: "ui",
          component: "SkillsUI",
          props: {
            title: "Programming Languages",
            layout: "bars",
            items: [
              { name: "Dart", level: 95 },
              { name: "TypeScript", level: 80 },
              { name: "JavaScript", level: 78 },
              { name: "Python", level: 55 },
              { name: "SQL", level: 65 },
            ],
          },
        },
      },
      {
        id: "skill-frameworks",
        name: "Frameworks.ui",
        type: "ui",
        iconPath: ICONS.ui,
        data: {
          kind: "ui",
          component: "SkillsUI",
          props: {
            title: "Frameworks & Libraries",
            layout: "bars",
            items: [
              { name: "Flutter", level: 95 },
              { name: "React", level: 82 },
              { name: "Next.js", level: 80 },
              { name: "Node.js", level: 65 },
              { name: "Tailwind", level: 88 },
            ],
          },
        },
      },
      {
        id: "skill-backend",
        name: "Backend_Service.ui",
        type: "ui",
        iconPath: ICONS.ui,
        data: {
          kind: "ui",
          component: "SkillsUI",
          props: {
            title: "Backend & Services",
            layout: "badges",
            items: [
              { name: "Firebase" },
              { name: "Firestore" },
              { name: "Firebase Auth" },
              { name: "Firebase FCM" },
              { name: "REST API" },
              { name: "Supabase" },
              { name: "GraphQL" },
            ],
          },
        },
      },
      {
        id: "skill-english",
        name: "English.txt",
        type: "txt",
        iconPath: ICONS.txt,
        data: {
          kind: "txt",
          content: `> ENGLISH_PROFICIENCY.TXT
> ─────────────────────────────────────────

  Level      :  Professional Working Proficiency
  Reading    :  ████████████  Advanced
  Writing    :  ████████████  Advanced
  Speaking   :  ██████████░░  Upper-Intermediate
  Listening  :  ████████████  Advanced

──────────────────────────────────────────────────────
  Can read and write technical documentation fluently.
  Comfortable with English-language code reviews,
  Slack communication, and async team collaboration.
──────────────────────────────────────────────────────

> EOF`,
        },
      },
      {
        id: "skill-design",
        name: "Design_Tools.ui",
        type: "ui",
        iconPath: ICONS.ui,
        data: {
          kind: "ui",
          component: "SkillsUI",
          props: {
            title: "Design Tools",
            layout: "badges",
            items: [
              { name: "Figma" },
              { name: "Adobe XD" },
              { name: "Zeplin" },
              { name: "InVision" },
            ],
          },
        },
      },
      {
        id: "skill-devops",
        name: "DevOps_Tools.ui",
        type: "ui",
        iconPath: ICONS.ui,
        data: {
          kind: "ui",
          component: "SkillsUI",
          props: {
            title: "DevOps & Tools",
            layout: "badges",
            items: [
              { name: "Git" },
              { name: "GitHub Actions" },
              { name: "Fastlane" },
              { name: "Docker" },
              { name: "Firebase App Distribution" },
              { name: "VS Code" },
              { name: "Android Studio" },
              { name: "Xcode" },
              { name: "Postman" },
            ],
          },
        },
      },
    ],
  },
};

const skillsFolder: FileNode = {
  id: "skills",
  name: "Skills",
  type: "folder",
  iconPath: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      technicalFolder,
      {
        id: "skill-soft",
        name: "Soft_Skills.ui",
        type: "ui",
        iconPath: ICONS.ui,
        data: {
          kind: "ui",
          component: "SoftSkillsUI",
          props: {
            skills: [
              {
                name: "Leadership",
                description:
                  "Led teams of 3–6 developers, ran daily standups, code reviews, and sprint planning.",
              },
              {
                name: "Problem Solving",
                description:
                  "Methodical debugger and root-cause analyst — comfortable with both logic and architecture problems.",
              },
              {
                name: "Fast Learner",
                description:
                  "Picked up React / Next.js independently while working full-time. Learn by doing, then by teaching.",
              },
              {
                name: "Communication",
                description:
                  "Clear async writer. Can translate technical constraints into plain language for stakeholders.",
              },
              {
                name: "Ownership",
                description:
                  "Ships features end-to-end — from requirements to deployment, monitoring, and post-release support.",
              },
              {
                name: "Adaptability",
                description:
                  "Comfortable switching between tight deadlines and exploratory side projects without losing quality.",
              },
            ],
          },
        },
      },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPERIENCE
// ═══════════════════════════════════════════════════════════════════════════════

function makeCompanyFolder(
  id: string,
  name: string,
  descProps: object,
  stackProps: object,
  link: string,
): FileNode {
  return {
    id,
    name,
    type: "folder",
    iconPath: ICONS.folder,
    data: {
      kind: "folder",
      children: [
        {
          id: `${id}-desc`,
          name: "description.ui",
          type: "ui",
          iconPath: ICONS.ui,
          data: {
            kind: "ui",
            component: "ExperienceDescriptionUI",
            props: descProps,
          },
        },
        {
          id: `${id}-stack`,
          name: "tech_stack.ui",
          type: "ui",
          iconPath: ICONS.ui,
          data: { kind: "ui", component: "TechStackUI", props: stackProps },
        },
        {
          id: `${id}-link`,
          name: "company.link",
          type: "link",
          iconPath: ICONS.link,
          data: { kind: "link", url: link },
        },
      ],
    },
  };
}

const experienceFolder: FileNode = {
  id: "experience",
  name: "Experience",
  type: "folder",
  iconPath: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      makeCompanyFolder(
        "exp-company-a",
        "2022-Present — Company A",
        {
          role: "Senior Flutter Developer",
          company: "Company A",
          period: "2022 – Present",
          duration: "3+ Years",
          description:
            "Lead developer responsible for architecture decisions, feature delivery, and team mentoring across multiple Flutter applications serving thousands of daily active users.",
          highlights: [
            "Architected Clean Architecture foundation adopted across all mobile products",
            "Led team of 4 developers — code reviews, sprint planning, and 1-on-1 mentoring",
            "Reduced app crash rate by 60% through structured error handling and monitoring",
            "Shipped 12 major releases with zero critical production incidents",
            "Introduced BLoC pattern, cutting state-related bug reports by 40%",
            "Integrated CI/CD with GitHub Actions + Fastlane for automated delivery",
          ],
        },
        {
          title: "Tech Stack — Company A",
          techs: [
            "Flutter",
            "Dart",
            "BLoC",
            "Clean Architecture",
            "Firebase",
            "REST API",
            "GitHub Actions",
            "Fastlane",
            "GetIt",
            "Dio",
            "Hive",
          ],
        },
        "https://company-a.com",
      ),
      makeCompanyFolder(
        "exp-company-b",
        "2021-2022 — Company B",
        {
          role: "Junior Flutter Developer",
          company: "Company B",
          period: "2021 – 2022",
          duration: "1 Year",
          description:
            "First professional role — contributed to feature development, API integrations, and bug fixing across two live mobile products.",
          highlights: [
            "Developed 8 new feature screens from Figma designs to production",
            "Integrated REST APIs with error handling and retry logic",
            "Participated in 2-week agile sprints with daily standups",
            "Wrote unit tests achieving 60% coverage on new features",
            "Improved app startup time by 30% through lazy initialization",
          ],
        },
        {
          title: "Tech Stack — Company B",
          techs: [
            "Flutter",
            "Dart",
            "Provider",
            "REST API",
            "Firebase",
            "Git",
            "Figma",
          ],
        },
        "https://company-b.com",
      ),
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EDUCATION
// ═══════════════════════════════════════════════════════════════════════════════

const educationFolder: FileNode = {
  id: "education",
  name: "Education",
  type: "folder",
  iconPath: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      {
        id: "edu-high-school",
        name: "High_School.ui",
        type: "ui",
        iconPath: ICONS.ui,
        data: {
          kind: "ui",
          component: "EducationUI",
          props: {
            type: "High School Diploma",
            institution: "School Name, Thailand",
            field: "Science & Mathematics",
            period: "2014 – 2017",
            description:
              "Focused on mathematics, physics, and computer fundamentals.",
            subjects: [
              "Mathematics",
              "Physics",
              "Chemistry",
              "Computer Science",
              "English",
            ],
          },
        },
      },
      {
        id: "edu-bachelor",
        name: "Bachelor_Degree.ui",
        type: "ui",
        iconPath: ICONS.ui,
        data: {
          kind: "ui",
          component: "EducationUI",
          props: {
            type: "Bachelor of Science",
            institution: "University Name, Thailand",
            field: "Computer Science / Information Technology",
            period: "2018 – 2022",
            description:
              "4-year program covering software engineering fundamentals, data structures, algorithms, database systems, and software architecture.",
            subjects: [
              "Data Structures & Algorithms",
              "OOP Design",
              "Database Systems",
              "Software Engineering",
              "Computer Networks",
              "Operating Systems",
              "Mobile Development",
            ],
          },
        },
      },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ABOUT
// ═══════════════════════════════════════════════════════════════════════════════

const connectivityFolder: FileNode = {
  id: "about-connectivity",
  name: "Connectivity",
  type: "folder",
  iconPath: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      {
        id: "about-resume-pdf",
        name: "resume.pdf",
        type: "pdf",
        iconPath: ICONS.pdf,
        data: {
          kind: "pdf",
          url: "/assets/resume.pdf",
          filename: "Khwanchai_Resume.pdf",
        },
      },
      {
        id: "about-contact",
        name: "contact.ui",
        type: "ui",
        iconPath: ICONS.ui,
        data: {
          kind: "ui",
          component: "ContactUI",
          props: {
            links: [
              {
                label: "Email",
                value: "your.email@example.com",
                href: "mailto:your.email@example.com",
              },
              {
                label: "GitHub",
                value: "github.com/your-username",
                href: "https://github.com/your-username",
              },
              {
                label: "LinkedIn",
                value: "linkedin.com/in/your-profile",
                href: "https://linkedin.com/in/your-profile",
              },
              {
                label: "Line",
                value: "@your-line-id",
                href: "https://line.me/ti/p/~your-line-id",
              },
            ],
          },
        },
      },
      {
        id: "about-line-link",
        name: "line.link",
        type: "link",
        iconPath: ICONS.link,
        data: { kind: "link", url: "https://line.me/ti/p/~your-line-id" },
      },
      {
        id: "about-git-link",
        name: "git.link",
        type: "link",
        iconPath: ICONS.link,
        data: { kind: "link", url: "https://github.com/your-username" },
      },
    ],
  },
};

const aboutFolder: FileNode = {
  id: "about",
  name: "About",
  type: "folder",
  iconPath: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      {
        id: "about-me",
        name: "me.ui",
        type: "ui",
        iconPath: ICONS.ui,
        data: {
          kind: "ui",
          component: "PersonalBioUI",
          props: {
            bio: "Hello! I'm Khwanchai Nontawichit (Khwan) — a 26-year-old Mobile Developer from Thailand with 3+ years of professional Flutter experience. I specialize in Clean Architecture and love building apps that are fast, maintainable, and a joy to use. I lead teams, mentor juniors, and care deeply about code quality and shipping reliable products.",
            facts: [
              { label: "Name", value: "Khwanchai Nontawichit" },
              { label: "Alias", value: "Khwan" },
              { label: "Age", value: "26" },
              { label: "Location", value: "Thailand" },
              { label: "Role", value: "Mobile Developer" },
              { label: "Experience", value: "3+ Years" },
              { label: "Main Stack", value: "Flutter · Dart" },
              { label: "Status", value: "Open to Opportunities" },
            ],
          },
        },
      },
      {
        id: "about-hobbies",
        name: "hobbies.ui",
        type: "ui",
        iconPath: ICONS.ui,
        data: {
          kind: "ui",
          component: "HobbiesUI",
          props: {
            items: [
              {
                name: "Coding",
                emoji: "💻",
                description:
                  "Side projects, exploring new frameworks, contributing to open source.",
              },
              {
                name: "Gaming",
                emoji: "🎮",
                description:
                  "Strategy and RPG games. Appreciates good UX even in games.",
              },
              {
                name: "Coffee",
                emoji: "☕",
                description:
                  "Serious about coffee. Prefers coding with a good pour-over.",
              },
              {
                name: "Reading",
                emoji: "📖",
                description:
                  "Tech blogs, architecture books, and the occasional manga.",
              },
              {
                name: "Music",
                emoji: "🎵",
                description:
                  "Lo-fi and jazz while coding. Silence for debugging.",
              },
              {
                name: "Traveling",
                emoji: "✈️",
                description: "Exploring new cities and cultures when offline.",
              },
            ],
          },
        },
      },
      {
        id: "about-setup",
        name: "setup.txt",
        type: "txt",
        iconPath: ICONS.txt,
        data: {
          kind: "txt",
          content: `> WORKSTATION_SETUP.TXT
> ─────────────────────────────────────────

  HARDWARE
  ──────────────────────────────────────────────────────
  Machine    :  MacBook Pro / Windows PC (dual setup)
  Display    :  27" Monitor + Laptop screen
  Input      :  Mechanical keyboard · Mouse
  Audio      :  Headphones for focus sessions

  EDITOR & TOOLS
  ──────────────────────────────────────────────────────
  Editor     :  VS Code + Android Studio
  Theme      :  One Dark Pro / Cyberpunk
  Font       :  JetBrains Mono
  Terminal   :  Zsh + Oh My Zsh
  Browser    :  Chrome (dev) + Arc

  DAILY WORKFLOW
  ──────────────────────────────────────────────────────
  Version Control  :  Git + GitHub
  Tasks            :  Notion / Linear
  Design Handoff   :  Figma
  Communication    :  Slack + Line

> EOF`,
        },
      },
      connectivityFolder,
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DOWNLOAD
// ═══════════════════════════════════════════════════════════════════════════════

const downloadFolder: FileNode = {
  id: "download",
  name: "Download",
  type: "folder",
  iconPath: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      {
        id: "download-resume",
        name: "resume.pdf",
        type: "pdf",
        iconPath: ICONS.pdf,
        data: {
          kind: "pdf",
          url: "/assets/resume.pdf",
          filename: "Khwanchai_Resume.pdf",
        },
      },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// C-DRIVE (root)
// ═══════════════════════════════════════════════════════════════════════════════

const cDrive: FileNode = {
  id: "c-drive",
  name: "C-DRIVE",
  type: "folder",
  iconPath: ICONS.cdrive,
  data: {
    kind: "folder",
    children: [
      projectsFolder,
      skillsFolder,
      experienceFolder,
      educationFolder,
      aboutFolder,
      downloadFolder,
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// RECYCLE BIN
// ═══════════════════════════════════════════════════════════════════════════════

const recycleBin: FileNode = {
  id: "recycle-bin",
  name: "Recycle Bin",
  type: "folder",
  iconPath: ICONS.recycle,
  data: {
    kind: "folder",
    children: [
      {
        id: "deleted-dreams",
        name: "deleted-dreams.txt",
        type: "txt",
        iconPath: ICONS.txt,
        data: {
          kind: "txt",
          content: `> RECYCLE BIN — SYSTEM DUMP LOG
> ─────────────────────────────────────────

  File: deleted-dreams.txt
  Status: Permanently deleted (or is it?)
  Date: 10/24/2024 03:14:59

> Contents recovered by deep-scan:

  - That one side project I swore I'd finish "this weekend"
  - "Temporary" CSS hacks that became permanent architecture
  - 47 drafts of a README that never shipped
  - Every "just 5 more minutes" that became 3am
  - The perfectly working code I refactored into bugs
  - npm packages installed "just to try it"
  - Stack Overflow answers I never went back to upvote

> SYSTEM NOTE:
  The recycle bin is never truly empty.
  Neither is the ambition of a developer.

  [ RESTORE ] [ DELETE PERMANENTLY ] [ Contemplate Existence ]

──────────────────────────────────────────────────────
EOF`,
        },
      },
      {
        id: "old-bugs",
        name: "old-bugs.log",
        type: "txt",
        iconPath: ICONS.txt,
        data: {
          kind: "txt",
          content: `> BUG ARCHIVE — GRAVEYARD OF ISSUES
> ─────────────────────────────────────────

  [CLOSED] #0001 — "It works on my machine"
  Resolution: Shipped anyway. Became production.

  [CLOSED] #0042 — Undefined is not a function
  Resolution: Added || {} . Problem solved. Problem stayed solved.

  [CLOSED] #0099 — Why is this async?
  Resolution: It was always async. I just wasn't ready.

  [CLOSED] #0137 — CSS layout broken on Safari
  Resolution: Declared war on Safari. Settled for a -webkit- prefix.

  [CLOSED] #0201 — "Cannot read properties of null"
  Resolution: Added optional chaining everywhere.
               Added it in places that didn't need it too. Felt good.

  [CLOSED] #0404 — Feature not found
  Resolution: Feature was never specified. Invented it anyway.
              Users liked the invented version better.

──────────────────────────────────────────────────────
  Total bugs closed: ∞
  Total bugs remaining: also ∞
──────────────────────────────────────────────────────
EOF`,
        },
      },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT DESKTOP
// ═══════════════════════════════════════════════════════════════════════════════

export const desktopFileSystem: FileNode[] = [
  cDrive,
  recycleBin,
  {
    id: "profile-txt",
    name: "Profile.txt",
    type: "txt",
    iconPath: ICONS.txt,
    data: {
      kind: "txt",
      content: `> PROFILE.TXT — SYSTEM USER DATA
> ─────────────────────────────────────────

  Hello, my name is Khwan, a 26-year-old Mobile Developer
  with over 3 years of experience in Flutter development.

  I have a strong background in leading development teams,
  structuring applications with Clean Architecture, and
  managing environments efficiently.

  I am passionate about mobile development and always eager
  to take on new challenges. Additionally, I can contribute
  to front-end development in various languages and frameworks,
  even those I haven't previously worked with, as I quickly
  adapt and learn due to shared concepts across technologies.

──────────────────────────────────────────────────────
  Developer   :  Khwanchai Nontawichit
  Alias       :  Khwan
  Role        :  Mobile Developer (Flutter)
  Experience  :  3+ Years
  Location    :  Thailand
  Stack       :  Flutter · Dart · React · Next.js · TypeScript
──────────────────────────────────────────────────────

> END OF FILE`,
    },
  },
  {
    id: "system-command",
    name: "System Command",
    type: "program",
    iconPath: ICONS.sysCmd,
    data: { kind: "program", component: "SystemCommand" },
  },
  {
    id: "preferences",
    name: "Preferences",
    type: "program",
    iconPath: ICONS.prefs,
    data: { kind: "program", component: "Preferences" },
  },
];

// ─── Desktop sections layout ──────────────────────────────────────────────────
export const desktopSections = [
  {
    title: "Directories",
    variant: "default" as const,
    ids: ["c-drive", "recycle-bin"],
  },
  { title: "Assets", variant: "default" as const, ids: ["profile-txt"] },
  {
    title: "Executables",
    variant: "active" as const,
    ids: ["system-command", "preferences"],
  },
];
