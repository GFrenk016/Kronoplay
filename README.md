# Kronoplay 🎬

Prototipo mobile-first per il tracking di **film e serie TV** viste. Nasce come
alternativa a TV Time (chiuso a luglio 2026): tracker con reazioni rapide, free
tier onesto e UI pulita per l'uso quotidiano.

> Questo è il **prototipo di fase 1**: scope volutamente piccolo, nessun backend.
> Tutto lo stato è locale (AsyncStorage), così è testabile subito senza configurare
> niente oltre alla API key TMDB.

## Cosa fa (scope del prototipo)

- 🔍 **Ricerca** titoli via TMDB (poster, titolo, anno)
- ✓ **Segna come visto** con voto da 1 a 5
- 🍿 **I miei visti**: lista di tutto il visto, con voto, ordinata per data di aggiunta
- 🔖 **Watchlist**: titoli salvati da guardare (senza voto), spostabili tra i visti
- 📊 **Statistiche base**: contatore totale visti + film/serie/voto medio

**Non incluso** (pianificato per dopo): autenticazione, backend/DB persistente
oltre AsyncStorage, layer sociale, import da TV Time.

## Stack

- **React Native + Expo** (managed workflow) — testabile su device reale con Expo Go
- **AsyncStorage** — persistenza locale (nessun backend per ora)
- **TMDB API** — ricerca e dati di film/serie
- **React Navigation** — bottom tab bar

---

## 🚀 Come lanciarlo in locale

### 1. Prerequisiti
- **Node.js 18+** installato
- L'app **Expo Go** sul tuo telefono (Android/iOS), dagli store ufficiali

### 2. Installa le dipendenze
Dalla cartella del progetto:
```bash
npm install
```

### 3. Configura la API key TMDB  🔑
La chiave TMDB **non** è nel codice: va messa in un file `.env` locale (ignorato da git).

1. Ottieni una API key gratuita da TMDB → https://www.themoviedb.org/settings/api
   (serve un account; scegli la **API Key v3 auth**)
2. Crea il file `.env` copiando il template:
   ```bash
   cp .env.example .env
   ```
3. Apri `.env` e incolla la tua key al posto del placeholder:
   ```
   EXPO_PUBLIC_TMDB_API_KEY=la_tua_key_qui
   ```

> ⚠️ Il prefisso `EXPO_PUBLIC_` è **obbligatorio**: Expo espone al bundle solo le
> variabili con questo prefisso. Se modifichi il `.env` mentre Expo è già avviato,
> riavvia con cache pulita (vedi sotto).

### 4. Avvia Expo
```bash
npx expo start
```
Poi:
- **iOS** → apri la fotocamera e inquadra il QR code nel terminale
- **Android** → apri Expo Go e scansiona il QR code

Se hai appena creato/modificato il `.env`, avvia svuotando la cache:
```bash
npx expo start -c
```

---

## 🗂️ Struttura del progetto

```
Kronoplay/
├── App.js                      # Entry point: provider + navigazione
├── index.js                    # Registrazione root component
├── app.json                    # Config Expo
├── .env.example                # Template variabili ambiente (copia in .env)
└── src/
    ├── components/             # UI riutilizzabile (presentazionale)
    │   ├── EmptyState.js
    │   ├── MediaRow.js         # Riga titolo (poster + meta + slot azioni)
    │   ├── MediaTypeBadge.js
    │   ├── PillButton.js
    │   ├── Poster.js           # Poster con fallback
    │   ├── RatingModal.js      # Modale voto 1-5
    │   └── RatingStars.js      # Stelle (display o interattive)
    ├── constants/
    │   └── theme.js            # Design tokens (colori, spacing, tipografia)
    ├── context/
    │   └── LibraryContext.js   # Stato globale libreria (visti + watchlist)
    ├── hooks/
    │   └── useLibrary.js       # Hook di accesso alla libreria
    ├── navigation/
    │   └── RootNavigator.js    # Bottom tab bar
    ├── screens/
    │   ├── SearchScreen.js
    │   ├── WatchedScreen.js
    │   ├── WatchlistScreen.js
    │   └── StatsScreen.js
    └── services/
        ├── api/
        │   └── tmdb.js         # Client TMDB + normalizzazione dati
        └── storage/
            └── libraryRepository.js  # Persistenza (AsyncStorage)
```

### Perché è organizzato così — pronto per Supabase

La UI **non parla mai** direttamente con lo storage. Il flusso è a strati:

```
Screens → useLibrary() → LibraryContext → libraryRepository → AsyncStorage
```

Il `libraryRepository` è l'unico modulo che sa *dove* stanno i dati ed espone
un'interfaccia asincrona generica (`getAll` / `save` / `remove` / `clear`).

Per **migrare a Supabase** in futuro, senza riscrivere una riga di UI:
1. crea `src/services/storage/supabaseLibraryRepository.js` con gli **stessi metodi**;
2. cambia l'import dentro `src/context/LibraryContext.js`.

Screen, componenti e hook restano identici.

---

## Note tecniche

- **Ricerca con debounce** (~450ms) e cancellazione delle richieste obsolete
  (`AbortController`), così scrivendo veloce non parte una chiamata per tasto.
- **Identità titoli**: ogni elemento ha chiave `${mediaType}-${id}` (es. `movie-27205`),
  quindi un film e una serie con lo stesso id TMDB non si sovrappongono.
- **Spostamento watchlist → visti**: assegnare un voto a un titolo in watchlist fa
  un upsert sulla stessa chiave, cambiando lo stato (nessun duplicato).
- Se la API key manca, l'app resta usabile e mostra un avviso chiaro nella Ricerca.
