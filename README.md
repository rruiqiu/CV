# My Personal Website

Welcome to the source code for my personal website, built with [Next.js](https://nextjs.org/) and CSS Modules. This site serves as my digital CV and portfolio, highlighting my projects, technical skills, and professional experiences.

🔗 **Live Site**: [www.richardqiu.me](https://www.richardqiu.me)

------

## 🧰 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: CSS Modules and global CSS
- **Type Checking**: [TypeScript](https://www.typescriptlang.org/)
- **Package Management**: [npm](https://www.npmjs.com/)
- **Deployment**: [Vercel](https://vercel.com/)
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

------

## 🛠️ Features

- **Responsive Design**: Optimized for desktops, tablets, and mobile devices.
- **Dynamic Content**: Easily update your projects, experiences, and skills.
- **SEO Friendly**: Structured metadata for better search engine visibility.
- **Fast Performance**: Leveraging Next.js features for optimal loading times.

## 📄 License

This project is open-source and available under the [MIT License](https://github.com/rruiqiu/CV?tab=MIT-1-ov-file). This can be a great template to build your CV!
