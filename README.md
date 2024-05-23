# Pedals

This README will guide you through setting up your development environment and getting started with developing Pedals.

## Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

## Recommended Code Editor

We recommend using [Visual Studio Code](https://code.visualstudio.com/) along with the following extensions for this project:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

`./vscode/settings.json` has been configured to ensure these extensions work seamlessly together. ESLint will catch and warn about all style errors, and Prettier will format your code on save.

## Getting Started

To install and start developing, follow these steps:

1. Clone the repository:

   ```sh
   git clone <repository-url>
   ```

2. Navigate to the client directory:

   ```sh
   cd ./client
   ```

3. Install the dependencies using npm or other package managers:
   ```sh
   npm ci
   ```

Now you are ready to start developing!

##

First, run the development server:

```bash
npm run dev
```

(Or the equivalent for other package managers)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
