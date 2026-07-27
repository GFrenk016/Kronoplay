# Kronoplay — Sviluppo

## Vincoli di partenza
- Tempo disponibile: poche ore a settimana (ritagli tra lavoro e università)
- Budget: qualche decina di euro al mese
- Obiettivo lancio: entro 2-3 mesi
- Autore unico

Con questi vincoli, l'MVP deve restare volutamente piccolo. Il rischio principale è il feature creep: aggiungere funzioni "carine" (commenti, follow, feed sociale) prima ancora di avere il tracker base solido e testato.

## Stack tecnico (a costo zero per l'MVP)
- **React Native + Expo** — niente Mac necessario per build Android, testing su device reale via Expo Go, riusa le competenze già presenti in React/Node
- **Supabase** (piano free) — DB Postgres + autenticazione + storage, copre tranquillamente un MVP
- **TMDB API** — gratuita per uso non commerciale/basso volume, per ricerca e dati di film/serie
- **GitHub** — repo per il codice, gratis

## Fase 1 — Sviluppo MVP (settimane 1-8)
- Sett. 1-2: setup progetto, autenticazione, integrazione TMDB (ricerca titoli)
- Sett. 3-4: schema dati (utente, titoli visti, voti, watchlist) + CRUD base
- Sett. 5-6: UI schermate principali (home, ricerca, profilo/statistiche)
- Sett. 7-8: bug fixing, rifinitura, TestFlight/Play Internal Testing con 5-10 persone (soft launch)

Costo fase 1: **€0**, salvo superamento dei tier free (improbabile con pochi utenti iniziali).

## Fase 2 — Pubblicazione (settimana 9-10)
- Apple Developer Program: $99/anno (obbligatorio per iOS)
- Google Play: $25 una tantum (non ricorrente)
- Se si vuole restare a budget quasi zero: si può lanciare prima solo su Android e rimandare iOS
- Checklist: screenshot, descrizione store con parole chiave (ASO), privacy policy (generabile gratis con tool online tipo Termly/FreePrivacyPolicy)

## Import dati da TV Time (differenziazione chiave)
Punto di forza da costruire con cura: molti importer concorrenti perdono le valutazioni durante la migrazione da TV Time. Un import che preserva sia la cronologia che i voti è un vantaggio competitivo immediato per chi arriva ora dal pubblico orfano di TV Time.

## Roadmap futura (post-MVP)
Solo dopo aver validato il tracker base con utenti reali:
1. Layer sociale leggero (reazioni rapide episodio-per-episodio, non solo recensioni lunghe)
2. Espansione ad anime come categoria di prima classe
3. Espansione a musica e videogiochi (obiettivo dichiarato di lungo termine per il nome/brand)
