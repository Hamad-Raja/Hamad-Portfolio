# Hammad Zahoor — MERN Portfolio (Blue Gradient)

A professional MERN stack portfolio:
- **Frontend:** React (Vite) + Tailwind + React Router
- **Backend:** Node + Express + MongoDB (Mongoose)
- **Admin Dashboard:** login + CRUD for projects + inbox for contact messages

## 1) Setup (Local)

### A) Backend
```bash
cd server
cp .env.example .env
# Edit .env and add your MongoDB connection string + JWT secret
npm install
npm run seed      # optional demo data
npm run dev
```

Backend runs on: `http://localhost:5000`

### B) Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 2) Admin Dashboard
Open:
- `http://localhost:5173/admin`

Use credentials from `server/.env`:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Then go to:
- `http://localhost:5173/admin/dashboard`

## 3) Customize Content
- Home hero text: `client/src/pages/Home.jsx`
- About text + skills: `client/src/pages/About.jsx`
- Services: `client/src/pages/Services.jsx`
- Replace photo placeholder: `client/src/pages/Home.jsx` (right-side profile card)
- Add/update projects from the Admin Dashboard (stored in MongoDB)

## Notes
- Contact form saves messages in MongoDB (`messages` collection).
- Project list loads from backend (`projects` collection).
