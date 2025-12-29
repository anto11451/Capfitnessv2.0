# Cap's Fitness - Premium Fitness Dashboard

## Overview

Cap's Fitness is a comprehensive, premium fitness web application that combines a public-facing marketing website with a members-only dashboard. The platform features an interactive body map, workout repository, nutrition hub, streak tracking, and personalized fitness planning. It's designed with a dark neon theme (cyan/green primary with purple/pink accents) and follows a mobile-first, app-like approach.

The application is built as a full-stack TypeScript monorepo with React frontend, Express backend, and PostgreSQL database support via Drizzle ORM. The project merges two separate codebases: a public marketing site and a member dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, using functional components and hooks

**Routing**: Wouter for client-side routing, supporting both public marketing pages and authenticated dashboard routes

**State Management**: 
- React Context API for authentication state
- TanStack Query (React Query) for server state management
- Local state with useState/useEffect for component-level state

**UI Component System**:
- Shadcn/ui component library with Radix UI primitives
- Tailwind CSS with custom neon theme configuration
- Framer Motion for animations and transitions
- Custom components: NeonCard, PageWrapper, Navbar, Footer

**Styling Strategy**:
- Tailwind CSS with custom design tokens
- CSS variables for theming (defined in index.css)
- Custom fonts: Orbitron (display/headers), Outfit (body text), Rajdhani (monospace)
- Dark mode neon aesthetic with glow effects

**Key Frontend Features**:
- Interactive SVG-based body map for muscle group exploration
- Multi-step intake form with progress tracking
- Fitness calculators (BMI, TDEE, body fat, protein)
- Streak tracking with calendar visualization
- Workout and nutrition planning interfaces

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**Build System**:
- Vite for client bundling
- esbuild for server bundling
- Custom build script that bundles allowlisted dependencies to reduce cold start times

**Server Structure**:
- `server/index.ts`: Main Express server setup with middleware
- `server/routes.ts`: API route registration (placeholder for expansion)
- `server/storage.ts`: Storage abstraction layer with in-memory implementation
- `server/static.ts`: Static file serving for production builds
- `server/vite.ts`: Vite dev server integration for development

**Development vs Production**:
- Development: Vite middleware with HMR
- Production: Pre-built static files served from `dist/public`

### Data Storage Solutions

**Database ORM**: Drizzle ORM configured for PostgreSQL

**Schema Definition** (`shared/schema.ts`):
- Users table with username/password authentication
- Shared type definitions for type-safe data access

**Current Storage Implementation**:
- In-memory storage (MemStorage class) for development/testing
- Database configuration ready for PostgreSQL via DATABASE_URL environment variable
- Future migration path to Google Sheets for certain data (mentioned in requirements)

**Data Persistence Strategy**:
- Client-side: localStorage for streak data and user preferences
- Server-side: PostgreSQL database (configured but not fully connected)
- External: Google Sheets integration planned for admin workout uploads and user data

### Authentication and Authorization

**Authentication Method**:
- Mock authentication system using hardcoded user credentials
- Separate admin login with distinct credentials
- Context-based auth state management (AuthContext in App.tsx)

**User Roles**:
- Regular users: Access to dashboard, workouts, nutrition, progress tracking
- Admin users: Access to admin panel for data management

**Session Management**:
- Client-side auth state in React Context
- No persistent sessions in current implementation (stateless)
- Ready for express-session with connect-pg-simple (dependencies installed)

**Protected Routes**:
- Login gate for dashboard pages
- Admin-only routes with separate authentication
- Public marketing pages (/, /calculators, /knowledge, etc.)

### External Dependencies

**UI Libraries**:
- Radix UI: Complete set of accessible component primitives
- Lucide React: Icon library
- React Icons: Additional icon set (specifically for WhatsApp)
- Framer Motion: Animation library

**Form Handling**:
- React Hook Form with @hookform/resolvers
- Zod for schema validation
- drizzle-zod for database schema validation

**Data Visualization**:
- Recharts for progress charts and graphs
- date-fns for date manipulation and formatting

**Development Tools**:
- Vite plugins: @replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner
- Custom meta-images plugin for OpenGraph image handling
- TypeScript for type safety across the stack

**Database**:
- drizzle-orm: TypeScript ORM
- drizzle-kit: Database migration tool
- pg: PostgreSQL client (configured but not actively used in current implementation)
- connect-pg-simple: PostgreSQL session store

**Additional Services** (mentioned in requirements but not fully implemented):
- Google Sheets API: For admin data uploads and user management
- YouTube API: For exercise video links (currently using direct URLs)

**Build and Runtime**:
- tsx: TypeScript execution for development
- esbuild: Fast JavaScript bundler
- Tailwind CSS with @tailwindcss/vite plugin
- PostCSS with autoprefixer