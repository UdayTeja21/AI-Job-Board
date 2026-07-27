# Accessibility Documentation

Building an inclusive platform ensures that all job seekers and recruiters, regardless of ability, can navigate and utilize the AI Job Board effectively.

---

## ⌨️ Keyboard Navigation
- All interactive elements (buttons, links, form inputs, dropdowns) are reachable via the `Tab` key.
- Focus states are clearly defined using Tailwind's `focus:ring` utilities, ensuring users can visually track their position on the page without relying on default browser outlines.
- Modals trap focus when opened, preventing the user from tabbing into the background content, and can be closed using the `Escape` key.

## 🏷 ARIA Attributes
- Screen readers are supported through the strategic use of ARIA (Accessible Rich Internet Applications) attributes.
- `aria-label` is applied to icon-only buttons (like the hamburger menu or close icons) where visual text is absent.
- `aria-live="polite"` or `role="alert"` regions are used for toast notifications (via `react-hot-toast`), ensuring screen readers announce success or error messages immediately upon display.
- Custom dropdowns and the Kanban ATS board use `aria-expanded` and `aria-grabbed` where appropriate.

## 🎨 Color Contrast
- The color palette defined in `tailwind.config.js` and `index.css` was selected with WCAG (Web Content Accessibility Guidelines) AA compliance in mind.
- Text colors (`text-text`, `text-text-muted`) provide sufficient contrast against background surfaces (`bg-background`, `bg-surface`) in both Light and Dark modes.

## 📱 Responsive & Zoom Support
- The application layout uses relative units (`rem`, `%`) instead of fixed pixels where possible, ensuring that if a user increases their browser's default font size or zooms in up to 200%, the layout does not break or obscure content.
- Touch targets on mobile devices (buttons, navigation links) are given a minimum height/width of `44px` to accommodate easier tapping.

## 📝 Semantic HTML
- The application structure leverages semantic HTML5 tags (`<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`, `<article>`) rather than relying solely on `<div>` elements. This provides structural context to assistive technologies.
