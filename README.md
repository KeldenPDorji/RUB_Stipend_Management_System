# RUB Student Stipend Management System

A modern frontend application for the Royal University of Bhutan Student Support Office to manage student stipend applications and approvals.

## 🏛️ About

This system provides a comprehensive platform for:
- **Students**: Apply for stipends, track application status, view payment history
- **SSO Staff**: Review applications, approve/deny requests, manage student records
- **Administrators**: System oversight, reporting, and user management

## 🎯 Features

### User Authentication Service (Epic 1)
- ✅ **Student Login Interface**: Secure login with username/password validation
- ✅ **Admin/SSO Staff Login**: Role-based access with admin portal
- ✅ **Multi-Factor Authentication (MFA)**: Email/SMS/Authenticator app support
- ✅ **Session Management**: Auto-logout, session warnings, secure JWT handling
- ✅ **Remember Me**: Persistent sessions with secure storage

### Technical Implementation
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Shadcn/ui components
- **Routing**: React Router with role-based guards
- **State Management**: React Context for authentication
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Vitest with React Testing Library
- **Build Tool**: Vite for fast development and builds

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rub-auth-forge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Testing

Run the test suite:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

### Building for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🔐 Demo Credentials

### Student Login
- **Username**: `student123`
- **Password**: `password123`

### Admin Login
- **Username**: `admin`
- **Password**: `admin123`

### MFA Verification
- **Code**: `123456`

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/                 # Authentication components
│   │   ├── LoginPage.tsx     # Student/Admin login interface
│   │   ├── MFASetup.tsx      # Multi-factor auth setup
│   │   ├── MFAVerify.tsx     # MFA verification
│   │   └── ProtectedRoute.tsx # Role-based route protection
│   └── ui/                   # Reusable UI components (Shadcn/ui)
├── contexts/
│   └── AuthContext.tsx       # Authentication state management
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions
├── pages/                    # Application pages
│   ├── student/              # Student dashboard and features
│   └── admin/                # Admin dashboard and features
└── test/                     # Test files
```

## 🛡️ Security Features

- **JWT Token Management**: Secure token storage and refresh
- **Role-Based Access Control**: Route-level permission enforcement
- **Session Timeout**: Configurable inactivity logout (30 minutes)
- **MFA Support**: Multiple verification methods available
- **CSRF Protection**: Secure form handling
- **Input Validation**: Client-side and server-side validation

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Dark/Light Mode**: Theme switching capability
- **Loading States**: Smooth user experience with proper feedback
- **Error Handling**: User-friendly error messages and recovery

## 📋 User Stories Implemented

### Story 1.1: Student Login Interface ✅
- Username/password validation with backend API
- Success → redirect to `/student/dashboard`
- Failure → clear error messages
- Responsive, accessible design

### Story 1.2: Admin/SSO Staff Login Interface ✅
- Role-based login differentiation
- Success → redirect to `/admin/dashboard`
- Secure session management
- Role-based access control

### Story 1.3: Multi-Factor Authentication ✅
- OTP via Email/SMS/Authenticator
- Trusted device options
- Clear setup instructions
- Fallback options (resend OTP)

### Story 1.4: Session Management ✅
- Auto logout after inactivity
- Session expiry warnings
- Cross-tab session persistence
- Secure JWT handling
- "Remember Me" functionality

## 🧪 Testing

The project includes comprehensive test coverage:
- **Unit Tests**: Component behavior and logic
- **Integration Tests**: Authentication flows
- **Accessibility Tests**: ARIA compliance
- **User Experience Tests**: Form validation and error handling

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI

### Contributing

1. Follow TypeScript and ESLint configurations
2. Write tests for new features
3. Use semantic commit messages
4. Ensure accessibility compliance

## 📄 License

This project is developed for the Royal University of Bhutan Student Support Office.

---

**Royal University of Bhutan** | Student Support Office | Stipend Management System
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/37fb90bf-3f32-4bad-a794-a05e643ff9e1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
# RUB_Stipend_Management_System
