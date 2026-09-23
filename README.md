# 🚀 Social App

A feature-rich, interactive social media web application built with **React** and **Tailwind CSS**. Designed with a clean, responsive UI that includes full authentication flow, post creation, custom reactions, nested comments, and stories.

---

## 📸 Key Features

* **🔐 Authentication & Security:**
  * Login & Registration flows (`Login` / `Register`).
  * Route protection for private pages (`ProtectedRoute`).
  * Global user state management via `AuthContext`.

* **📰 Posts & Feed Management:**
  * Interactive main feed (`Home`) with loading placeholders (`PostSkeleton`).
  * Post creation modal/form (`PostCreation`).
  * Detailed single-post views (`PostDetails`).
  * Custom reaction popovers (`ReactionsPopover`).

* **💬 Nested Comments & Replies:**
  * Create and manage comments on posts (`CreateComment`).
  * Deeply nested reply chains (`NestedReplies` / `PostComment`).

* **📖 Stories & Layout:**
  * Interactive stories bar (`StoriesBar`).
  * Navigation header (`Navbar`) paired with dual sidebars (`LeftSidebar` / `RightSidebar`).
  * Dark & Light theme switching via `ThemeContext`.
  * Global error handling and custom 404 pages (`ErrorBoundary` / `NotFound`).

---

## 🛠️ Tech Stack

* **Framework:** [React](https://react.dev/) (Vite)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **State Management:** React Context API (`AuthContext`, `ThemeContext`)
* **Icons & UI:** Custom SVG Components

---

## 📁 Project Structure

```text
src/
├── api/                   # API service configurations & requests
├── assets/                # Static assets & images
├── Components/            # UI Components
│   ├── CreateComment/     # Comment creation forms
│   ├── ErrorBoundary/     # Error handling fallback UI
│   ├── Home/              # Feed & Main page
│   ├── Layout/            # Base app layout wrapper
│   ├── Login/ & Register/ # Authentication pages
│   ├── Navbar/            # Top navigation bar
│   ├── Post/              # Post cards & reaction popovers
│   ├── PostComment/       # Comment list & nested replies
│   ├── PostCreation/      # New post form/modal
│   ├── PostDetails/       # Single post view
│   ├── Profile/           # User profile views
│   ├── Sidebar/           # Left and Right sidebars
│   └── Stories/           # Stories bar component
└── Context/               # Global state contexts (Auth & Theme)
