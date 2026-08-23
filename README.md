# Knot

**A global directory of real schools and their clubs — sign up, register a school, join clubs, and find friends across the network.**

🔗 **Live site:** [knot-web-app.vercel.app](https://knot-web-app.vercel.app/)

## What it is

Knot ties together a registered directory of schools from around the world so you can browse the clubs they offer, join them, register your own school, build a profile, and connect with friends elsewhere in the network.

- 🌍 Browse a global directory of real schools and their club catalogs
- 🔑 Sign in with Google (or a simulated demo picker when no OAuth client is configured)
- 🏫 Register your own school and its clubs
- 🙋 Join any club — a lightweight membership record tied to your account
- 👤 A profile page for the schools you've registered and clubs you've joined
- 🤝 A network page to search for other users, add friends, see their activity, and propose combined clubs
- 🌗 Light/dark theme, with a custom logo and full brand palette

## Tech stack

Plain **HTML, CSS, and vanilla JavaScript** — no framework, no bundler, no build step. See [`js/store.js`](js/store.js) for the data layer: it runs entirely on `localStorage` by default, or a shared **Firebase Firestore** database when configured, behind one identical API so the rest of the app doesn't need to know which backend is active.

## Running it locally

No build step — just serve the folder statically, e.g.:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
