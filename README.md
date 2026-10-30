# ⚡ Ashmit Samanta — Interactive Portfolio

A modern, interactive developer portfolio built with **React**, **Vite**, **Tailwind CSS**, **WebGL2**, and **GSAP**. Features GPU-accelerated particle shaders, kinetic typography, an interactive arcade minigame, and project deep-dives.

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Live:** https://ashmitsamanta-portfolio.vercel.app/

---

## ✨ Key Features

- **🎨 WebGL2 Particle & Mosaic Portrait:** Interactive GPU shader that dissolves and animates particles based on cursor physics and scroll state.
- **⚡ Kinetic Preloader & Wordmark Animations:** Fluid GSAP timelines with animated letter transitions.
- **🎮 Built-In Arcade Minigame:** Interactive retro brick-breaker canvas game embedded directly into the layout.
- **💼 Selected Works & Architecture Modals:** Deep dive into featured systems (*Veribyte* document verification & *CyberScope* fraud-detection engine) with architectural highlights.
- **📬 Contact & Quick Brief Form:** Interactive contact brief modal with email copy trigger and form submission handler.
- **📱 Fully Responsive Design:** Sleek dark-mode aesthetic, customized typography (Inter, Playfair Display, JetBrains Mono), and subtle film-grain overlay.

---

## ⚡ Tech Stack

- **Core & Framework:** React 18, Vite 5
- **Styling:** Tailwind CSS, PostCSS
- **Animations & Graphics:** GSAP 3 + ScrollTrigger, WebGL 2, HTML5 Canvas
- **Icons:** Lucide React

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ashmitsamanta/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## 💻 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local Vite development server with Hot Module Replacement (HMR) at `http://localhost:5173`. |
| `npm run build` | Compiles and optimizes assets into the `dist/` directory for production. |
| `npm run preview` | Locally previews the production build generated in `dist/`. |

---

## 🌐 Deployment

This project deploys as a static site (e.g., on Vercel):

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

---

## 📁 Project Structure

```text
portfolio-website/
├── public/                 # Static assets
│   ├── assets/             # Project screenshots & cutout textures
│   │   ├── cyberscope.webp
│   │   ├── portrait_cutout.webp
│   │   └── veribyte.webp
│   └── favicon.svg         # SVG favicon
├── src/
│   ├── animations/
│   │   └── scrollAnimations.js   # GSAP ScrollTrigger scroll-driven animations
│   ├── components/
│   │   ├── AboutSection.jsx      # Bio card, intro typography, and stack marquee container
│   │   ├── ArcadeMinigame.jsx    # Interactive retro canvas brick-breaker minigame
│   │   ├── ContactSection.jsx    # Contact section with modal form and email copy trigger
│   │   ├── HeroWebGL.jsx         # WebGL2 interactive particle & mosaic shader
│   │   ├── Navbar.jsx            # Navigation bar with section links and mobile menu drawer
│   │   ├── PreloaderWordmark.jsx # Kinetic preloader and hero wordmark animation
│   │   ├── ProjectModal.jsx      # Modal dialog for project deep-dives and architecture details
│   │   ├── ProjectsSection.jsx   # Selected works showcase with category filtering and case studies
│   │   ├── ScrubText.jsx         # Memoized word-by-word scroll scrub text
│   │   ├── ServicesSection.jsx   # Interactive services list with expandable details and hover fills
│   │   └── StackMarquee.jsx      # Multi-row infinite scrolling tech stack marquee and layer filter
│   ├── config/
│   │   └── portfolio.config.ts   # Centralized portfolio data & copy
│   ├── App.jsx             # App shell: layout, hero section, preloader coordination, and shared state
│   ├── index.css           # Tailwind base directives & root styles
│   └── main.jsx            # React root mount
├── .gitignore              # Git ignore rules
├── index.html              # HTML entry with Google Fonts links and film-grain SVG filter
├── package.json            # Scripts & project dependencies
├── postcss.config.cjs      # PostCSS configuration
├── tailwind.config.cjs     # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```

---

## 🏗️ Architecture

- **App Shell (`src/App.jsx`):** Coordinates global layout, hero parallax/WebGL (`HeroWebGL.jsx`), kinetic preloader sequence (`PreloaderWordmark.jsx`), and shared state (active navigation, toast messages, project modal selection, and contact modal visibility).
- **Component Sections (`src/components/`):** Self-contained section components (`Navbar`, `AboutSection`, `StackMarquee`, `ServicesSection`, `ProjectsSection`, `ProjectModal`, `ArcadeMinigame`, `ContactSection`, `ScrubText`).
- **Configuration & Content (`src/config/portfolio.config.ts`):** Central data store for bio, social links, project case studies, services, and stack categories.
- **Scroll Animations (`src/animations/scrollAnimations.js`):** Scoped GSAP ScrollTrigger timelines and scrub effects initialized by the app shell.

---

## ⚙️ Customization

Profile details, project case studies, service offerings, categorized skills, and social links are configured in:

```text
src/config/portfolio.config.ts
```

Text and configuration hardcoded within specific components:
- **Marquee tech items (`MARQUEE_ROWS`):** Defined in `src/components/StackMarquee.jsx`.
- **Preloader letters (`INITIAL_LETTERS`, `TARGET_LETTERS`):** Defined in `src/components/PreloaderWordmark.jsx`.
- **Navigation links (`NAV_ITEMS`, `MOBILE_NAV_ITEMS`):** Defined in `src/components/Navbar.jsx`.
- **Contact form endpoint (`CONTACT_ENDPOINT`):** Configured in `src/components/ContactSection.jsx`.

---

## 📬 Contact & Connect

- **Author:** Ashmit Samanta
- **Email:** [ashmitsamanta2007@gmail.com](mailto:ashmitsamanta2007@gmail.com)
- **LinkedIn:** [linkedin.com/in/ashmit-samanta-14022b43b](https://www.linkedin.com/in/ashmit-samanta-14022b43b/)
- **GitHub:** [github.com/ashmitsamanta](https://github.com/ashmitsamanta)
