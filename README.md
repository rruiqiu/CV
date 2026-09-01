# My Personal Website

Welcome to the source code for my personal website, built with [Next.js](https://nextjs.org/) and CSS Modules. This site serves as my digital CV and portfolio, highlighting my projects, technical skills, and professional experiences.

🔗 **Live Site**: [www.richardqiu.me](https://www.richardqiu.me)

------

## 🧰 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: CSS Modules and global CSS
- **Type Checking**: [TypeScript](https://www.typescriptlang.org/)
- **Package Management**: [npm](https://www.npmjs.com/)
- **Deployment**: GitHub Pages with its global CDN
- **Version Control**: [Git](https://git-scm.com/) & [GitHub](https://github.com/)

------

## 📁 Project Structure

```
.
├── app/
│   ├── about/
│   │   ├── layout.tsx            # Layout wrapper for the About page
│   │   └── page.tsx              # Main About page composed of multiple components
│   ├── api/
│   │   └── route.tsx             # API route (for backend logic)
│   └── components/		
│       └── ...             	  # render components for /about folder
|   ├── data/                     	# Static content and JSON data for easy updates
|   ├── utils/                    	# Utility/helper functions
|   ├── error.tsx                 	# Error boundary or fallback UI
|   ├── layout.tsx                	# Global layout (optional)
|   ├── page.tsx                  	# Welcom page and entry point
├── public/              # Static assets (images, favicon, etc.)
├── content/             # Portfolio introduction and project content used at build time
├── admin/               # Local-only content manager interface
├── tools/               # Local admin server, validation, and tests
├── styles/              # Global and component-specific styles
├── tsconfig.json        # TypeScript configuration
├── package.json         # Project metadata and dependencies
└── ...
```

------

## 🚀 Getting Started

Requires Node.js 24 or newer.

To run this project locally:

1. **Clone the repository**:

   ```
   git clone https://github.com/rruiqiu/CV.git
   cd CV
   ```

2. **Install dependencies**:

   ```
   npm install
   ```

3. **Start the development server**:

   ```
   npm run dev
   ```

4. Open http://localhost:3000 in your browser to view the site.

To preview the production static export:

```
npm run build
npm start
```

## Local project manager

The project manager runs only on your computer. It is not included in the GitHub Pages export and does not require a deployed backend.

1. Start the local manager:

   ```
   npm run admin
   ```

2. Open http://127.0.0.1:4173.
3. Edit the bilingual introduction, or add, edit, reorder, and hide projects and upload project media.
4. Choose **Save locally** to validate and write `content/projects.json`.
5. Choose **Publish** to review the Git plan, commit only portfolio content/media, and push to `main`. The existing GitHub Action then rebuilds the static site and deploys it to GitHub Pages.

The manager accepts AVIF, JPEG, PNG, GIF, and WebP images up to 10 MB, plus MP4, WebM, and MOV videos up to 100 MB. It binds to `127.0.0.1`, uses a per-process session token, and never stores GitHub credentials.

Publish only stages local media that is referenced by `content/projects.json`. Its confirmation dialog also lists existing unpushed commits and files, because those commits will be included in the same push. The `main` branch must track `origin/main`.

The **View site** shortcut expects `npm run dev` to be running in a second terminal. The built-in card preview works without it.

Run all local checks with:

```
npm test
npm run lint
npm run typecheck
npm run build
```

------

## 🛠️ Features

- **Responsive Design**: Optimized for desktops, tablets, and mobile devices.
- **Dynamic Content**: Easily update your projects, experiences, and skills.
- **SEO Friendly**: Structured metadata for better search engine visibility.
- **Fast Performance**: Leveraging Next.js features for optimal loading times.

## 📄 License

This project is open-source and available under the [MIT License](https://github.com/rruiqiu/CV?tab=MIT-1-ov-file). This can be a great template to build your CV!
