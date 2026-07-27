# Frontend Documentation

The frontend of the AI Job Board is a Single Page Application (SPA) constructed with **React 19**, bundled and served via **Vite**.

---

## 🏗 Component Structure

The application adheres to an atomic design philosophy, breaking complex views down into smaller, composable units.

1. **Pages (`src/pages/`)**: These are top-level route components. They maintain local state, trigger side-effects (`useEffect`), and orchestrate UI components. Examples include `SeekerDashboard.jsx` and `Login.jsx`.
2. **Layouts (`src/components/layout/`)**: Provide consistent structural scaffolding. For example, `DashboardLayout.jsx` handles the rendering of the authenticated sidebar, conditionally outputting navigation links based on the user's role.
3. **UI Elements (`src/components/ui/`)**: Reusable, presentational components such as `Button.jsx`, `Input.jsx`, and `Card.jsx`. These components receive data via props and emit events via callbacks.

---

## 🚏 Routing

Navigation is controlled by **React Router v7**.
- **Code Splitting**: The `App.jsx` router utilizes `React.lazy()` and `Suspense` for all top-level page components. This ensures that the JavaScript bundle is split into smaller chunks, so a user visiting the Landing Page does not download the JavaScript required for the ATS Kanban Board.
- **Protected Routes**: Handled logically within `DashboardLayout.jsx`. If a user attempts to access `/dashboard` without a valid session, they are intercepted and redirected to `/login`.

---

## 🧠 State Management

### Global State (Context API)
Redux was deemed unnecessary for this project due to the localized nature of most state. The global state is managed via Context providers:
- **AuthContext**: Exposes `user` (object), `login(email, password)`, `register(data)`, and `logout()`.
- **SocketContext**: Initializes and maintains the Socket.io WebSocket connection, exposing the active `socket` instance and listening for real-time notification events across the entire application lifecycle.

### Local State
Everything else (form inputs, modal visibility, fetching status) is managed at the component level using `useState` and `useReducer`. 

---

## 🔌 Axios Integration

API communication is centralized in `src/services/api.js`.
- An Axios instance is created with a `baseURL` pointing to the Express server.
- **Request Interceptor**: Automatically pulls the JWT from `localStorage` and injects it into the `Authorization` header of every outgoing request. This eliminates the need to manually pass tokens from every component.

---

## 🎨 Theme System & Responsive Design

### Tailwind CSS
Styling is strictly utility-first using **Tailwind CSS v4**. 
- Design tokens (colors, border radiuses, typography) are defined in `index.css` via CSS variables and mapped in `tailwind.config.js`. This creates a unified "design system" that prevents magic values scattered throughout the JSX.

### Responsive Design
The application utilizes Tailwind's breakpoints (`sm:`, `md:`, `lg:`) to ensure fluid layouts. For example, the dashboard sidebar remains fixed on desktop but transforms into an off-canvas drawer toggled by a hamburger menu on mobile devices.

### Dark Mode
Dark mode is supported natively using Tailwind's `dark:` variant class. CSS variables in `:root` represent light mode colors, while variables scoped under the `.dark` class define the dark mode palette.

---

## 🎬 Animations

**Framer Motion** is utilized for micro-interactions and page transitions to make the application feel premium and dynamic.
- Modals fade and scale into view.
- Skeleton loaders pulse smoothly during data fetching.
- Toast notifications slide in and out of the viewport.
