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

- **React Native 0.81 + Expo SDK 54** (managed workflow) — testabile su device reale con Expo Go
  (Expo Go su iOS supporta **solo l'ultima SDK**, per questo il progetto è allineato a SDK 54)
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

Comando standard (modalità **LAN**, la più stabile e veloce quando PC e telefono
sono sulla **stessa rete/router**, anche se il PC è su cavo ethernet e il telefono
su WiFi):
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

#### 📱 Test su iPhone fisico via Expo Go — connessione stabile

La modalità **LAN** (default) è quella consigliata: il telefono si connette
direttamente al PC sulla rete locale, senza passare da server esterni. È più
veloce e più affidabile del tunnel. Perché funzioni servono due cose sul PC Windows:

1. **Rete impostata su "Privata"** (non "Pubblica"). Con profilo "Pubblico"
   Windows blocca *tutte* le connessioni in entrata → il telefono non raggiunge
   Metro. In *Impostazioni → Rete e Internet → (la tua rete) → Tipo di profilo di
   rete* scegli **Privata**.

2. **Windows Firewall deve lasciar passare Node.js in entrata** sulla rete privata.
   Al primo avvio Windows di solito mostra un popup "Consenti l'accesso" per Node.js:
   spunta **Reti private** e conferma. Se non è comparso o l'hai chiuso:
   *Windows Security → Firewall e protezione rete → Consenti app tramite firewall
   → Modifica impostazioni → Consenti un'altra app…* e aggiungi
   `node.exe` (tipicamente `C:\Program Files\nodejs\node.exe`), spuntando **Privato**.

Sintomo tipico del firewall/rete pubblica: il QR mostra un URL `127.0.0.1` /
`localhost`, oppure Expo Go dà **"Could not connect to the server"**. `127.0.0.1`
dal telefono punta al telefono stesso: il PC deve annunciare il proprio **IP di
rete locale** (es. `192.168.x.x`). Se dopo aver sistemato firewall e profilo di
rete l'URL resta su `localhost`, forza l'IP LAN prima di avviare:
```bash
set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.x.x   && npx expo start --lan
```
(sostituisci `192.168.x.x` con l'IPv4 del PC, che trovi con `ipconfig`).

#### 🌐 Tunnel — solo come fallback

Il tunnel (`--tunnel`) instrada la connessione attraverso i server **ngrok**
(terza parte): serve **solo** quando PC e telefono sono su reti diverse o la LAN
è bloccata da policy aziendali. È più lento e meno affidabile — se ngrok ha
problemi ottieni errori come `Cannot read properties of undefined (reading 'body')`.
**Su questo setup (stessa rete) non è necessario: usa la LAN.** Se ti serve
davvero, installa una versione recente del binding ngrok e riprova:
```bash
npm i -g @expo/ngrok@latest
npx expo start -c --tunnel
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
