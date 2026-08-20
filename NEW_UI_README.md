# Smart Waste Management System - New UI

This frontend has been refreshed to match the Smart Waste mockup with a modern green environmental design.

## What was redesigned
- Responsive landing page
- Modern login page with Citizen / Driver / Admin demo access
- Role-based Admin dashboard
- Role-based Citizen dashboard
- Role-based Driver dashboard
- Dark-green sidebar and clean top navigation
- KPI cards, charts, status badges and map-style collection views
- Citizen quick actions, Green Impact and recent requests
- Driver assignments, route map, status controls and performance
- Admin analytics, reports, live map and community cleanliness ranking
- Mobile bottom navigation on small screens

## Run the project

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

## Demo access

The login page includes demo buttons. They work without a backend by creating a local demo session:

- Citizen
- Driver
- Admin

If the backend is available, the normal email/password login continues to use the existing API.

## Backend

The existing API service files were preserved. Dashboard pages attempt to load real API data and fall back to demo data when the API is unavailable, so the UI can still be demonstrated during development.

## Important

`node_modules` is intentionally not included in this ZIP. Run `npm install` on your computer before `npm run dev`.
