# Example Layout
## Use as reference

pedals-app/
│
├── public/                     # Static files like images, fonts, etc.
│
├── src/
│   ├── components/             # Reusable components across the project
│   │   ├── layout/             # Layout components like Header, Footer, etc.
│   │   ├── ui/                 # UI components like buttons, cards, etc.
│   │   └── forms/              # Form components
│   │
│   ├── app/                  
|   |   └── auth/
|   |   |   ├── login.tsx            # Login page
|   |   |   ├── login.test.tsx       # Tests for login page
|   |   |   ├── register.tsx         # Registration page
|   |   |   └── register.test.tsx    # Tests for registration page
|   |   |   ├── api/ # Routing user for auth only
|   |   |   │   ├── onboard/
|   |   |   │   │   ├── login.ts         # Handles login logic
|   |   |   │   │   ├── login.test.ts    # Tests for login logic
|   |   |   │   │   ├── register.ts      # Handles user registration
|   |   |   │   │   └── register.test.ts # Tests for registration logic
|   |   |   │   └── logout.ts            # Handles user logout
|   |   |   │   └── logout.test.ts       # Tests for logout logic
|   |   |   │
│   └── index.tsx           # Landing page
│   │
│   ├── styles/                 # Styles directory
│   │   ├── globals.css         # Global styles
│   │   └── tailwind.css        # Tailwind entry point
│   │
│   ├── lib/                    # Library code (utilities, data-fetching functions, etc.)
│   ├── hooks/                  # React hooks
│   └── types/                  # TypeScript types and interfaces
│
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
├── .eslintrc.js                # ESLint configuration
├── .gitignore                  # Specifies intentionally untracked files to ignore
└── package.json                # Node.js dependencies and scripts
