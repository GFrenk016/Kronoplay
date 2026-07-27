# Kronoplay — Progettazione

## Il progetto
App di tracking personale per tutto ciò che consumi nel tempo libero: film e serie TV (MVP), con anime, musica e videogiochi come espansioni future. Nome: **Kronoplay** (chrono/krono = tempo in greco, + play = intrattenimento).

Nato dal vuoto lasciato dalla chiusura di TV Time (15 luglio 2026), storico tracker di serie TV con oltre 26 milioni di installazioni, chiuso per insostenibilità del modello gratuito.

Progetto personale, autore unico, nessuna ambizione di fondare uno studio attorno a questo (lo studio resta un obiettivo separato, di lungo termine).

## Analisi competitor e lacune

**Trakt** — UI scarna, raccomandazioni algoritmiche basilari senza incrocio della cronologia completa, copre solo film/TV (niente anime/musica/libri), paywall VIP in espansione su funzioni core.

**Simkl** — free limitato a 100 elementi totali tra watchlist/collezione, server sotto stress per l'ondata di migrazione da TV Time, lato sociale debole (bravo a loggare, non a far discutere), UI datata e web-first.

**Serializd** — forte su recensioni stile Letterboxd, ma il focus è la critica scritta, non la reazione rapida episodio-per-episodio che rendeva TV Time immediato.

**Achriom** — unico competitor con libreria unificata multi-media (TV, film, libri, musica) e un "bibliotecario AI", ma privato di default: nessun feed pubblico, nessun follower — punta su riflessione personale, non su socialità.

**Nuovi entranti (rischio concorrenza diretta)** — Bingers (fondato da un ex-fondatore di TV Time) è ancora solo in waitlist, senza app pubblicata. Kino è un tracker iOS-only in beta, di uno sviluppatore solista, uscito da pochi giorni. La finestra di opportunità è aperta ma si sta affollando in fretta.

## Lacune concrete da colpire
1. **Reazione rapida + feed sociale stile TV Time** — nessun competitor la replica bene: Trakt troppo scarno, Simkl debole sul sociale, Serializd troppo "recensione lunga".
2. **Free tier onesto, senza limiti artificiali** — sia Trakt (VIP creep) che Simkl (100 item cap) spingono al pagamento in modi che gli utenti notano male.
3. **Import da TV Time con voti intatti** — pain point ricorrente: molti importer portano la cronologia ma perdono le valutazioni.
4. **UI mobile nativa e veloce** — Simkl è web-first/datato, Trakt è sparso su app di terze parti. Spazio libero per un'app mobile pulita pensata per uso quotidiano.

## Posizionamento
Tracker mobile-first con reazioni rapide + free tier senza trappole + import TV Time che preserva i voti. Incrocio non ancora occupato da nessuno, ma la velocità di esecuzione conta più della perfezione del feature-set iniziale.

## Scope MVP (fase 1, no social)
- Login/registrazione (email o anonimo)
- Ricerca titoli via TMDB API
- Segna come "visto" film/episodi, con voto 1-5
- Watchlist personale
- Storico/statistiche base (quanti visti, ore totali)

Il layer sociale (commenti, follow, feed) si valuta solo dopo aver validato che la base funziona con utenti reali — non va costruito a vuoto.

## Naming — verifica fatta
"ChronoPlay" (grafia classica) risultava già occupato da più prodotti reali (app quiz su Android/Microsoft Store, canale YouTube, pagina Facebook, progetto GitHub) — problematico per la ricercabilità. "Kronoplay" (con la K) è molto meno affollato: nessuna app pubblicata con questo nome su App Store/Play Store, solo presenze minori non competitive (un progetto GitHub, un gruppo Facebook, un canale YouTube). Da verificare ancora: disponibilità dominio e handle social specifici.
