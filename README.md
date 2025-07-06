# Career Compass: Personalized Job Match Engine

A modern, responsive React web application that helps job seekers improve their resume-job match using AI-powered analysis.

## 🚀 Features

- **Landing Page**: Clean, professional interface with compelling call-to-action
- **File Upload**: Drag-and-drop interface for resumes and job descriptions (PDF/DOCX)
- **AI Analysis**: Score calculation with detailed breakdown by Skills, Experience, and Education
- **Detailed Feedback**: Actionable recommendations and keyword analysis
- **Progress Tracking**: History page with analytics and improvement tracking
- **Responsive Design**: Works beautifully on desktop and mobile devices

## 🎨 Design

- **Modern UI**: Clean, professional design with blues, greens, and purple accents
- **Gradient Backgrounds**: Subtle gradients for visual appeal
- **Component Library**: Built with shadcn/ui components
- **Design System**: Consistent theming with semantic tokens
- **Animations**: Smooth transitions and loading states

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui
- **Routing**: React Router
- **File Upload**: react-dropzone
- **Build Tool**: Vite
- **State Management**: React hooks + React Query

## 🔗 API Integration Points

The app is designed to easily connect to REST APIs. Key integration points:

### Upload & Analysis
```typescript
// src/pages/UploadPage.tsx - Line 23
const response = await fetch('/api/analyze', {
  method: 'POST',
  body: formData // Contains resume and job description files
});
```

### Results Retrieval
```typescript
// src/pages/ResultsPage.tsx - Can fetch results by ID
const response = await fetch(`/api/results/${analysisId}`);
```

### History Data
```typescript  
// src/pages/HistoryPage.tsx - Load user's analysis history
const response = await fetch('/api/history');
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── Navigation.tsx    # Top navigation bar
│   ├── Footer.tsx        # Footer component
│   ├── ScoreGauge.tsx    # Reusable score display
│   └── ui/file-upload.tsx # File upload component
├── pages/
│   ├── LandingPage.tsx   # Home page with hero section
│   ├── UploadPage.tsx    # Document upload interface
│   ├── ResultsPage.tsx   # Analysis results with scores
│   ├── HistoryPage.tsx   # User's analysis history
│   └── NotFound.tsx      # 404 error page
├── assets/
│   └── hero-image.jpg    # Generated hero image
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── index.css            # Design system & global styles
```

## 🎯 Key Components

### FileUpload Component
- Drag-and-drop interface
- File type validation (PDF, DOCX)
- Size limits and error handling
- Visual feedback for upload status

### ScoreGauge Component  
- Animated progress bars
- Color-coded scoring (red/yellow/blue/green)
- Flexible sizing options
- Accessible design

### Navigation Component
- Active route highlighting
- Responsive mobile menu
- Brand consistency

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Responsive Design

The app is fully responsive with:
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized typography scaling

## 🎨 Design System

Colors, gradients, and styling are defined in:
- `src/index.css` - CSS custom properties
- `tailwind.config.ts` - Tailwind configuration
- All components use semantic tokens (no hardcoded colors)

## 🚀 Deployment

Built with Vite for optimal performance:
- Tree-shaking for smaller bundles
- Fast development builds
- Modern browser targets
- Static asset optimization

## 🔮 Future Enhancements

- User authentication
- Real-time collaboration
- Advanced analytics
- Mobile app version
- API rate limiting
- File format expansion

---

**Ready for API integration** • **Developer-friendly** • **Production-ready**
