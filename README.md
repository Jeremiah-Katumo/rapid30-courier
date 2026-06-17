<div align="center">
<h1>rapid30-deliveries</h1>
</div>

A React + Vite application with an Express server used for local development and simple deployment. Includes admin, driver, customer and analytics components for a delivery/fulfillment dashboard.

**Key features**
- Real-time-ish UI built with React and Vite
- Express server for API routes and server-side build output
- Tailwind CSS + utility plugins
- Modular components for Admin, Driver, Customer dashboards

**Tech stack**
- React 19, Vite, TypeScript
- Express server (bundle with esbuild for production)
- TailwindCSS

## Prerequisites
- Node.js (recommended >= 18)
- npm or compatible package manager

## Quick Start
1. Install dependencies

```bash
npm install
```

2. Create an environment file at the project root (copy from `.env.example` if present) and add any required keys. Example:

```env
# .env.local
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

3. Run in development (starts the server with `tsx`):

```bash
npm run dev
```

4. Build for production and start:

```bash
npm run build
npm run start
```

## NPM Scripts
- `dev`: Runs the app in development using `tsx server.ts` (server + Vite)
- `build`: Builds the frontend with Vite then bundles `server.ts` to `dist/server.cjs` using `esbuild`
- `start`: Runs the bundled server at `dist/server.cjs`
- `clean`: Removes build artifacts
- `lint`: Runs TypeScript typecheck (`tsc --noEmit`)

## Important files
- Server entry: [server.ts](server.ts#L1)
- Vite config: [vite.config.ts](vite.config.ts#L1)
- App entry: [src/main.tsx](src/main.tsx#L1)
- Root App component: [src/App.tsx](src/App.tsx#L1)
- Key components: [src/components/AdminDashboard.tsx](src/components/AdminDashboard.tsx#L1), [src/components/CustomerDashboard.tsx](src/components/CustomerDashboard.tsx#L1), [src/components/DriverDashboard.tsx](src/components/DriverDashboard.tsx#L1)
- Types: [src/types.ts](src/types.ts#L1)

## Project structure (high level)

```text
.
├─ server.ts
├─ index.html
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  └─ components/
│     ├─ AdminDashboard.tsx
│     └─ ...
└─ package.json
```

## Contributing
- Open an issue or submit a PR. Please keep changes focused and include tests or manual verification steps for UI changes.

## License
This repository does not currently include a license file. Add a `LICENSE` at the project root if you wish to set an explicit license.

---

If you'd like, I can also add a `.env.example`, set up a basic `LICENSE`, or create a short contributing guide.
