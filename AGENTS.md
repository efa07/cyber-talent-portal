<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Context: Cyber Talent Room

Welcome to the **Cyber Talent Room** codebase. This is a learning platform and dashboard designed for cybersecurity students and instructors (managing a cyber range).

## Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS v4
- **UI Components:** `shadcn/ui` (located in `components/ui/`), `@base-ui/react`
- **Icons:** `lucide-react`
- **Future Backend/Auth:** Supabase (Data is currently mocked)

## Architecture & Layout
- **Routing:** Built exclusively on the Next.js App Router (`app/` directory). 
- **Core Layout:** The main application lives under `/dashboard`. It uses a persistent `AppSidebar` and a top breadcrumb header (`app/dashboard/layout.tsx`).
- **Role-Based Access (Mocked):** The application serves two primary roles: **Admin** (Instructor) and **Student**. 
  - The `AppSidebar` (`components/app-sidebar.tsx`) currently holds a mocked state toggle at the bottom to switch between the Admin and Student views. 
  - Admin views have access to everything, including managing students and creating assignments.
  - Student views are restricted to their own dashboard, assignments, quizzes, and the leaderboard. Quick action buttons are hidden.

## Design System & Styling
- The design heavily relies on a **Dark Theme** aesthetic.
- The global background is a deep dark color (`#0B0C10`).
- The primary accent color is **Violet/Purple** (e.g., `violet-500`, `violet-600`).
- Interactive elements (like active sidebar links) use pill-shaped rounded borders (`rounded-xl`), dark contrast backgrounds (e.g., `#1A1625`), and precise highlight bars absolute-positioned to the left edge.
- Always use `shadcn/ui` components for consistency when building new features before rolling custom UI.

## Existing Features (Mock Data Phase)
The front-end has been substantially built out using mock data. When adding features or wiring up the backend, check these existing routes:
- `/dashboard/admin`: Admin overview dashboard.
- `/dashboard` (or `/dashboard/student`): Student overview dashboard.
- `/dashboard/assignments`: Lists assignments (admin view has management features).
- `/dashboard/students`: Admin-only view to see a table of all students.
- `/dashboard/students/[id]`: Detailed profile view for a specific student, featuring a skill matrix, activity log, and quick stats.
- `/dashboard/settings`: Comprehensive settings page with tabs for Profile, Password, Theme (Dark/Light/System switch), and Notifications.

## Development Workflow
- When building new views, use the existing mock data patterns.
- Ensure that you account for role-based rendering (Admin vs. Student).
- **Backend Migration:** The next major phase is replacing the hardcoded mock arrays with Supabase database queries and actual authentication. Ensure any new components are built cleanly so their data props can be easily swapped for real async fetches.
