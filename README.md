# MESA — Food Delivery Casalingo

App React + Vite con dati sincronizzati in tempo reale tramite Firebase (Firestore + Auth).

## Sviluppo locale

**Prerequisiti:** Node.js

1. Installa le dipendenze: `npm install`
2. Avvia l'app: `npm run dev` (http://localhost:3000)

## Build e pubblicazione

- `npm run build` genera la cartella `dist/`
- `npm start` serve la build in locale
- Ogni push su `main` pubblica automaticamente su https://mesa-food.web.app (GitHub Actions, `.github/workflows/deploy.yml`)
- Il vecchio indirizzo https://mesa-app-59376.web.app rimanda al nuovo (`redirect-site/`)
