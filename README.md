# Rich The Garbage 🗑️✨

A beautiful, interactive photo and video gallery built with Phaser.js, React, and TypeScript. Features a fun game component, like functionality, and a stunning UI with smooth animations.

![Rich The Garbage](screenshot.png)

## 🌟 Features

- 📸 **Photo Gallery**: Browse through a collection of beautiful images
- 🎥 **Video Carousel**: Watch videos in an elegant carousel interface
- 🎮 **Interactive Game**: Play a Phaser.js game integrated into the gallery
- ❤️ **Like Functionality**: Like your favorite photos and videos
- 🎨 **Beautiful UI**: Modern design with Tailwind CSS and Framer Motion animations
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development and builds
- ☁️ **Cloudflare Workers**: Backend API powered by Cloudflare Workers

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.0.0
- **Game Engine**: Phaser 3.90.0
- **Language**: TypeScript 5.7.2
- **Build Tool**: Vite 6.3.1
- **Styling**: Tailwind CSS 4.1.18
- **Animations**: Framer Motion
- **Backend**: Cloudflare Workers
- **Package Manager**: pnpm

## 📋 Requirements

- [Node.js](https://nodejs.org) (v18 or higher recommended)
- [pnpm](https://pnpm.io) package manager

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rich-the-garbage.git
cd rich-the-garbage
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:8080` (or the port shown in your terminal).

### Building for Production

```bash
pnpm build
```

This will:
- Generate asset lists automatically (via `prebuild` hook)
- Create an optimized production build in the `dist` folder

### Preview Production Build

```bash
pnpm preview
```

## 📁 Project Structure

```
rich-the-garbage/
├── src/
│   ├── components/          # React components
│   │   ├── FloatingGarbage.tsx
│   │   ├── HeroCarousel.tsx
│   │   ├── GameSection.tsx
│   │   ├── GalleryHeader.tsx
│   │   ├── GalleryTabs.tsx
│   │   ├── Hacktoberfest.tsx
│   │   └── Footer.tsx
│   ├── game/                # Phaser game code
│   │   ├── main.ts          # Game entry point
│   │   ├── scenes/          # Phaser scenes
│   │   └── EventBus.ts      # React-Phaser communication
│   ├── utils/               # Utility functions
│   │   ├── images.ts        # Auto-generated image list
│   │   ├── videos.ts        # Auto-generated video list
│   │   ├── likeApi.ts       # Like API functions
│   │   └── clientId.ts      # Client ID management
│   ├── App.tsx              # Main React component
│   └── main.tsx             # React entry point
├── public/
│   ├── gallery/             # Image files
│   └── videos/              # Video files
├── worker/                  # Cloudflare Workers API
├── scripts/
│   └── generate-assets.ts   # Asset generation script
└── vite/                    # Vite configuration files
```

## 🎮 Available Commands

| Command               | Description                                    |
| --------------------- | ---------------------------------------------- |
| `pnpm install`        | Install project dependencies                    |
| `pnpm dev`            | Launch development server                      |
| `pnpm build`          | Create production build                        |
| `pnpm preview`        | Preview production build                       |
| `pnpm lint`           | Run ESLint                                     |
| `pnpm lint:fix`       | Fix ESLint errors automatically                |
| `pnpm format`         | Format code with Prettier                      |
| `pnpm format:check`   | Check code formatting                          |
| `pnpm generate:assets`| Generate asset TypeScript files                |

## 🎨 Adding Assets

### Images

1. Add your image files to `public/gallery/`
2. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
3. Run `pnpm generate:assets` to update the asset list

### Videos

1. Add your video files to `public/videos/`
2. Supported formats: `.mp4`, `.webm`, `.ogg`
3. Run `pnpm generate:assets` to update the asset list

**Note**: The asset generation script runs automatically before `pnpm build`, but you can run it manually after adding new assets.

## 🤝 Contributing to Hacktoberfest

We welcome contributions during Hacktoberfest and throughout the year! Here's how you can help:

### 🎯 How to Contribute

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then:
   git clone https://github.com/yourusername/rich-the-garbage.git
   cd rich-the-garbage
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Follow the code style guidelines (see below)
   - Write clean, readable code
   - Add comments for complex logic
   - Test your changes locally

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   # Use conventional commit messages:
   # feat: for new features
   # fix: for bug fixes
   # docs: for documentation
   # style: for formatting
   # refactor: for code refactoring
   # test: for tests
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a Pull Request on GitHub with a clear description of your changes.

### 🎁 Good First Issues

Look for issues labeled with:
- `good first issue` - Perfect for beginners
- `hacktoberfest` - Hacktoberfest-specific contributions
- `help wanted` - Areas where we need help

### 💡 Contribution Ideas

- 🐛 **Bug Fixes**: Fix any issues you find
- ✨ **New Features**: Add new functionality to the gallery or game
- 🎨 **UI/UX Improvements**: Enhance the design and user experience
- 📝 **Documentation**: Improve README, add code comments, write guides
- 🧪 **Tests**: Add unit tests or integration tests
- 🌐 **Internationalization**: Add support for multiple languages
- ♿ **Accessibility**: Improve accessibility features
- 🎮 **Game Features**: Enhance the Phaser game with new mechanics
- 🖼️ **Asset Management**: Improve asset loading and organization
- ⚡ **Performance**: Optimize rendering, loading, or API calls

### 📝 Code Style Guidelines

- **TypeScript**: Use proper type annotations, avoid `any`
- **Formatting**: Run `pnpm format` before committing
- **Linting**: Ensure `pnpm lint` passes
- **React**: Use functional components with hooks
- **Phaser**: Follow Phaser 3.90.0 API patterns
- **File Organization**: Follow the existing project structure
- **Comments**: Add comments for complex logic, especially game mechanics

### ✅ Pull Request Checklist

Before submitting your PR, make sure:

- [ ] Code follows the project's style guidelines
- [ ] All tests pass (if applicable)
- [ ] ESLint passes (`pnpm lint`)
- [ ] Code is formatted (`pnpm format:check`)
- [ ] Your changes work in development mode
- [ ] You've tested your changes thoroughly
- [ ] PR description clearly explains what was changed and why
- [ ] You've updated documentation if needed

### 🏷️ Hacktoberfest Labels

We use these labels to help contributors:
- `hacktoberfest` - Valid for Hacktoberfest
- `good first issue` - Great for first-time contributors
- `help wanted` - We'd love help with this
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements

### 🎉 Recognition

All valid contributions will be:
- Reviewed promptly
- Merged if they meet our standards
- Counted toward Hacktoberfest (if submitted during October)
- Credited in our contributors list

### ❓ Need Help?

- Open an issue for questions or discussions
- Check existing issues and PRs for similar problems
- Review the codebase to understand patterns
- Ask in your PR comments - we're happy to help!

## 🔧 Development

### React-Phaser Bridge

The project uses an EventBus to communicate between React and Phaser:

```typescript
// In React
import { EventBus } from './game/EventBus';

EventBus.emit('event-name', data);

// In Phaser
EventBus.on('event-name', (data) => {
  // Handle the event
});
```

### Phaser Scene Setup

When creating a new Phaser Scene, emit the `current-scene-ready` event:

```typescript
class MyScene extends Phaser.Scene {
  create() {
    // Your game logic here
    
    // Expose scene to React
    EventBus.emit('current-scene-ready', this);
  }
}
```

### Asset Loading

Assets can be loaded in two ways:

1. **Imported assets** (bundled):
```typescript
import logoImg from './assets/logo.png';
this.load.image('logo', logoImg);
```

2. **Static assets** (from `public/`):
```typescript
this.load.image('background', 'assets/bg.png');
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Phaser](https://phaser.io) game framework
- UI powered by [React](https://react.dev) and [Tailwind CSS](https://tailwindcss.com)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Backend hosted on [Cloudflare Workers](https://workers.cloudflare.com)

## 🌐 Links

- **Live Demo**: [Add your live demo URL here]
- **GitHub Repository**: [Add your GitHub repo URL here]
- **Issues**: [Add your issues URL here]

---

**Happy Coding! 🎉 Let's make Rich The Garbage even better together!**

Made with ❤️ by the open source community
