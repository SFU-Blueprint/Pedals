# PEDALS Application Directory Structure

To be used only as reference for good repo sturture. This document outlines the structure of the PEDALS application, focusing on organizing the codebase for clarity and maintainability.

## Overview

The PEDALS app is structured to support easy navigation and scalability, using Next.js for its powerful routing and server-side capabilities combined with React for UI development.

### Directory Breakdown

```plaintext
pedals-app/
├── public/                     # Static files like images, fonts, etc.
│
├── src/
│   ├── components/             # Reusable components across the project
│   │   ├── layout/             # Layout components like Header, Footer, etc.
│   │   ├── ui/                 # UI components like buttons, cards, etc.
│   │   └── forms/              # Form components
│   │
│   ├── app/
│   │   └── auth/
            ├── page.tsx            # Login page
│   │       ├── login.tsx            # Login page
│   │       ├── login.test.tsx       # Tests for login page
│   │       ├── register.tsx         # Registration page
│   │       └── register.test.tsx    # Tests for registration page
│   │       ├── api/                 # Routing user for auth only
│   │       │   ├── onboard/
│   │       │   │   ├── login.ts         # Handles login logic
│   │       │   │   ├── login.test.ts    # Tests for login logic
│   │       │   │   ├── register.ts      # Handles user registration
│   │       │   │   └── register.test.ts # Tests for registration logic
│   │       │   └── logout.ts            # Handles user logout
│   │       │   └── logout.test.ts       # Tests for logout logic
│   |   └── api/
            ├── connect.tsx            # Login page
│   │       ├── connect.test.tsx       # Tests for valid connection
│   |   └── page.tsx               # Landing page
│           layout.tsx #import footer , header
│   ├── styles/                 # Styles directory
│   │   ├── globals.css         # Global styles
│   │   └── tailwind.css        # Tailwind entry point
│   │
│   ├── lib/                    # Library code (utilities, data-fetching functions, etc.)
│   ├── hooks/                  # React hooks
│   └── types/                  # TypeScript types and interfaces
│
├── tailwind.config.mjs         # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── .eslintrc                   # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── .gitignore                  # Specifies intentionally untracked files to ignore
└── package.json                # Node.js dependencies and scripts
```
