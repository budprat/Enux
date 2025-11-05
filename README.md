# Enux - AI-Powered Business Intelligence Platform

Enux is a modern, full-stack business intelligence platform that combines powerful analytics, real-time collaboration, and AI-driven insights to help businesses make data-driven decisions.

## 🚀 Features

### Core Capabilities
- **AI-Powered Analytics** - Advanced AI assistant for data analysis and business insights
- **Real-time Collaboration** - Team workspace with live updates and collaborative tools
- **Interactive Dashboard** - Comprehensive metrics and KPIs visualization
- **Smart Insights** - Automated trend detection and predictive analytics
- **Team Management** - Role-based access control and team collaboration features
- **Dark Mode Support** - Fully responsive UI with dark/light theme toggle

### Key Components
- **Dashboard**: Real-time business metrics, revenue tracking, and performance indicators
- **AI Assistant**: Natural language queries for business intelligence
- **Team Collaboration**: Shared workspaces, real-time updates, and team chat
- **Analytics Engine**: Advanced data visualization with interactive charts
- **Settings Management**: User preferences, notifications, and system configuration

## 🛠️ Technology Stack

This project is built with modern web technologies:

### Frontend
- **React 18.3** - Modern UI framework with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible and customizable component library

### UI Components & Libraries
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon set
- **Recharts** - Composable charting library
- **React Hook Form** - Performant form validation
- **TanStack Query** - Powerful data synchronization
- **next-themes** - Theme management
- **Sonner** - Toast notifications
- **Zod** - Schema validation

### Development Tools
- **ESLint** - Code linting and quality
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Autoprefixer** - PostCSS plugin for vendor prefixes

## 📦 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd Enux
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
# API Configuration (optional)
VITE_API_BASE_URL=http://localhost:3000/api

# N8n Webhook (optional)
VITE_N8N_WEBHOOK_URL=

# Feature Flags
VITE_ENABLE_WEBHOOK_CONFIG=true
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Build for development environment
npm run build:dev

# Run ESLint for code quality
npm run lint

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
Enux/
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── AIAssistant.tsx
│   │   ├── Collaboration.tsx
│   │   ├── Dashboard.tsx
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Main landing page
│   │   └── ...
│   ├── App.tsx            # App root component
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── .env.example           # Environment variables template
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🎨 UI Components

The project uses **shadcn/ui** components which are:
- Fully accessible (ARIA compliant)
- Customizable with Tailwind CSS
- Built on Radix UI primitives
- Type-safe with TypeScript

### Available Components
- Navigation: Menubar, Navigation Menu, Tabs
- Forms: Input, Select, Checkbox, Radio Group, Switch
- Data Display: Table, Card, Badge, Avatar
- Feedback: Toast, Dialog, Alert Dialog, Popover
- Layout: Separator, Scroll Area, Resizable Panels
- And many more...

## 🔒 Security

### Best Practices Implemented
- Environment variables for sensitive configuration
- No hardcoded API keys or secrets in source code
- Type-safe validation with Zod
- Secure HTTP-only requests
- CSP-ready architecture

### Environment Variables
Never commit `.env.local` or files containing secrets. Use `.env.example` as a template.

## 🌐 Deployment

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deployment Platforms

This project can be deployed to:
- **Vercel** - Zero-config deployment for Vite apps
- **Netlify** - Continuous deployment with Git integration
- **AWS Amplify** - Full-stack deployment with backend
- **GitHub Pages** - Static site hosting
- **Docker** - Containerized deployment

### Deployment Steps (Example: Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Set environment variables in Vercel dashboard

## 🤝 Development Workflow

### Using Git

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes and commit**
```bash
git add .
git commit -m "feat: add your feature description"
```

3. **Push to remote**
```bash
git push origin feature/your-feature-name
```

4. **Create a Pull Request** on GitHub

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain component modularity
- Write self-documenting code
- Add comments for complex logic

## 🔍 Features in Detail

### AI Assistant
The AI Assistant component provides:
- Natural language processing for business queries
- Integration with N8n workflows (configurable via webhook)
- Context-aware responses
- Message history and conversation tracking

### Dashboard
- Real-time metrics visualization
- Revenue and growth tracking
- User activity monitoring
- Performance indicators
- Customizable widgets

### Collaboration Tools
- Team member management
- Real-time status updates
- Shared workspaces
- Activity feeds
- Role-based permissions

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 5173
npx kill-port 5173
```

**Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

Built with:
- React team for the amazing framework
- Vercel for Vite and deployment tools
- shadcn for the beautiful UI components
- Radix UI for accessible primitives
- Tailwind Labs for the CSS framework

---

**Need Help?** Open an issue on GitHub or contact the development team.
