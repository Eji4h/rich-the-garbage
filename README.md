# Rich The Garbage 🗑️✨

🌐 **[Live Website](https://rich-the-garbage.com/)**

A beautiful, interactive photo and video gallery built with Phaser.js, React, and TypeScript. Features a fun game component, like functionality, and a stunning UI with smooth animations.

![Rich The Garbage](public/rich-profile.png)

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
- [Cloudflare account](https://dash.cloudflare.com) (for deployment)
- [Stripe account](https://stripe.com) (for donations feature)

## ⚙️ Configuration

### Stripe Donation Setup

To enable the donation feature, you need to configure Stripe and Cloudflare Workers:

1. **Create a Stripe account** and get your API keys:
   - Secret Key (starts with `sk_`)
   - Webhook Secret (starts with `whsec_`)

2. **Create a Cloudflare KV namespace** for donations:

   ```bash
   wrangler kv:namespace create "DONATIONS_KV"
   ```

   Update `wrangler.jsonc` with the returned namespace ID.

3. **Set Cloudflare Workers secrets**:

   ```bash
   wrangler secret put STRIPE_SECRET_KEY
   wrangler secret put STRIPE_WEBHOOK_SECRET
   ```

   Or set them in the Cloudflare Dashboard under Workers & Pages > Your Worker > Settings > Variables.

   **Note**: Success and cancel URLs are now handled internally using hash routing (`#/donate-success`, `#/donate-cancel`). No external URLs needed!

4. **Configure Stripe webhook**:
   - In Stripe Dashboard, go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

5. **Currency Support**:
   - Currency is **auto-detected** from the user's browser locale (e.g., `en-US` → USD, `th-TH` → THB)
   - Users can manually select a different currency in the donation modal
   - Supported currencies: USD, THB, EUR, GBP, JPY, CAD, AUD, SGD, and more
   - All amounts are displayed with the correct currency symbol

### Local Development

For local development with Wrangler:

```bash
# Set secrets in .dev.vars file (not committed to git)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Note**: Success and cancel pages are handled via hash routing (`#/donate-success`, `#/donate-cancel`), so no URL configuration is needed.

## 🚀 Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Eji4h/rich-the-garbage.git
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
│   ├── applications/        # Application layer (hexagonal architecture)
│   │   ├── components/      # React components
│   │   ├── game/            # Phaser game code
│   │   └── ports/            # Port interfaces (hexagonal architecture)
│   ├── adapters/            # Adapters layer (hexagonal architecture)
│   │   └── outbounds/       # Outbound adapters
│   │       └── repositories/ # Repository implementations
│   ├── utils/               # Utility functions
│   │   ├── images.ts        # Auto-generated image list
│   │   ├── videos.ts        # Auto-generated video list
│   │   ├── likeApi.ts       # Like API functions
│   │   └── clientId.ts       # Client ID management
│   ├── App.tsx              # Main React component
│   ├── PhaserGame.tsx       # Phaser game wrapper component
│   └── main.tsx             # React entry point
├── public/
│   ├── gallery/             # Image files
│   ├── videos/              # Video files
│   └── phaser/              # Phaser game assets
├── worker/                  # Cloudflare Workers API
├── scripts/
│   └── generate-assets.ts   # Asset generation script
└── vite/                    # Vite configuration files
```

## 🎮 Available Commands

| Command                | Description                     |
| ---------------------- | ------------------------------- |
| `pnpm install`         | Install project dependencies    |
| `pnpm dev`             | Launch development server       |
| `pnpm build`           | Create production build         |
| `pnpm preview`         | Preview production build        |
| `pnpm lint`            | Run ESLint                      |
| `pnpm lint:fix`        | Fix ESLint errors automatically |
| `pnpm format`          | Format code with Prettier       |
| `pnpm format:check`    | Check code formatting           |
| `pnpm generate:assets` | Generate asset TypeScript files |

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
   git clone https://github.com/<yourusername>/rich-the-garbage.git
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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Phaser](https://phaser.io) game framework
- UI powered by [React](https://react.dev) and [Tailwind CSS](https://tailwindcss.com)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Backend hosted on [Cloudflare Workers](https://workers.cloudflare.com)

## 🌐 Links

- **Live Demo**: https://rich-the-garbage.com/
- **GitHub Repository**: https://github.com/Eji4h/rich-the-garbage
- **Issues**: https://github.com/Eji4h/rich-the-garbage/issues

---

**Happy Coding! 🎉 Let's make Rich The Garbage even better together!**

Made with ❤️ by the open source community
