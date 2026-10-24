# Ashmit Samanta — Portfolio Website

A modern, high-performance, interactive developer portfolio built with **React**, **Vite**, **Tailwind CSS**, **WebGL**, and **GSAP**. Features particle shaders, kinetic typography, dynamic sound synthesis, responsive design, and a Node.js contact endpoint.

---

## ⚡ Tech Stack

- **Frontend:** React 18, Vite 5, Tailwind CSS
- **Animations & Effects:** GSAP 3, WebGL 2 (interactive particle portrait), HTML5 Canvas
- **Icons:** Lucide React
- **Backend / API:** Node.js HTTP server (contact form endpoint + static asset serving)
- **Styling:** Custom CSS design system with typography (Inter, Playfair Display, JetBrains Mono)

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`, `pnpm`, or `yarn`

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ashmitsamanta/portfolio-website.git
cd portfolio-website
npm install
```

### Development Server

Start the Vite dev server with hot module replacement:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

### Production Build

Build optimized production assets:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Node Production Server

Run the standalone Node server to serve the build and handle `/api/contact`:

```bash
npm start
```

Runs by default on `http://localhost:3000` (or `process.env.PORT`).

---

## 📁 Project Structure

```text
portfolio-website/
├── public/                 # Static assets (images, icons, cutout textures)
│   ├── assets/             # Project thumbnails & portrait images
│   ├── favicon.svg         # SVG favicon
│   └── og.jpg              # Open Graph preview card
├── src/
│   ├── components/
│   │   ├── HeroWebGL.jsx         # WebGL2 interactive particle & mosaic shader
│   │   └── PreloaderWordmark.jsx # Kinetic preloader animation
│   ├── config/
│   │   └── portfolio.config.ts   # Centralized portfolio data & biography
│   ├── App.jsx             # Main application and interactive UI sections
│   └── main.jsx            # React root mount
├── index.html              # HTML entry with font preload & film grain filter
├── package.json            # Scripts & project dependencies
├── server.js               # Production Node.js server with contact handler
├── vite.config.js          # Vite configuration
└── .gitignore              # Git ignore rules for node_modules, build & env
```

---

## 📬 Contact & Connect

- **Portfolio Owner:** Ashmit Samanta
- **Email:** [ashmitsamanta2007@gmail.com](mailto:ashmitsamanta2007@gmail.com)
- **LinkedIn:** [linkedin.com/in/ashmit-samanta-14022b43b](https://www.linkedin.com/in/ashmit-samanta-14022b43b/)
- **GitHub:** [github.com/ashmitsamanta](https://github.com/ashmitsamanta)
