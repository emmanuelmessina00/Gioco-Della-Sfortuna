[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/uNTgnFHD)
# Exam #1: "Gioco della Sfortuna"
## Student: s333951 Messina Antonio Emmanuel 

## React Client Application Routes
- Route `/`:  
  **Home page**. Mostra la guida generale del gioco e introduce l'applicazione. Accessibile a tutti gli utenti.

- Route `/game`:  
  **Pagina di gioco**. Permette di giocare una partita (demo o completa) con le carte generate dal server. Disponibile solo per utenti autenticati.

- Route `/history`:  
  **Storico partite**. Visualizza la cronologia delle partite giocate dall'utente autenticato. Accessibile solo se loggato.

- Route `/login`:  
  **Pagina di login**. Consente agli utenti di autenticarsi. Se l'utente è già loggato, viene reindirizzato alla home.

# API Server Documentation

## Autenticazione

### POST `/api/sessions`
- Effettua il login di un utente
- Request body:
  ```json
  {
    "email": "user1@gmail.com",
    "password": "password"
  }
  ```
- Response body:
  ```json
  {
    "id": 1,
    "username": "user1",
    "email": "user1@gmail.com"
  }
  ```
- Error responses: `401 Unauthorized` se le credenziali non sono valide

### GET `/api/sessions/current`
- Verifica se l'utente è attualmente autenticato
- No request parameters
- Response body:
  ```json
  {
    "id": 1,
    "username": "user1",
    "email": "user1@gmail.com"
  }
  ```
- Error responses: `401 Unauthorized` se l'utente non è autenticato

### DELETE `/api/sessions/current`
- Effettua il logout dell'utente
- No request parameters
- No response body


## Gestione delle carte

### GET `/api/cards/`
- Inizializza le carte per una nuova partita
- No request parameters
- Response body:
  ```json
  [
    {
      "id": 1,
      "situation": "Hai dimenticato la password del portale studenti.",
      "index": 1.0,
      "link": "0.png"
    },
    {
      "id": 2,
      "situation": "Arrivi in aula e scopri che la lezione è online.",
      "index": 3.0,
      "link": "2.png"
    },
    ...
     {
      "situation": 'Ti dimentichi il badge e non puoi entrare in aula.',
      "link": '32.png',
      "id": 33
    }
  ]
  ```
- Error responses: `404 Not Found` se si verifica un errore durante il recupero delle carte

### GET `/api/cards/before/:number/:description`
- Verifica se una carta può essere posizionata prima di un indice specificato
- Request parameters: `number` (indice di riferimento), `description` (descrizione della carta)
- Response body (carta valida):
  ```json
  {
    "id": 3,
    "situation": "Piove e hai dimenticato l’ombrello.",
    "index": 5.0,
    "link": "3.png"
  }
  ```
- Response body (carta non valida):
  ```json
  {}
  ```
- Error responses: `404 Not Found` in caso di errore durante la verifica

### GET `/api/cards/after/:number/:description`
- Verifica se una carta può essere posizionata dopo di un indice specificato
- Request parameters: `number` (indice di riferimento), `description` (descrizione della carta)
- Response body (carta valida):
  ```json
  {
    "id": 3,
    "situation": "Piove e hai dimenticato l’ombrello.",
    "index": 5.0,
    "link": "3.png"
  }
  ```
- Response body (carta non valida):
  ```json
  {}
  ```
- Error responses: `404 Not Found` in caso di errore durante la verifica

### GET `/api/cards/between/:a/:b/:description`
- Verifica se una carta può essere posizionata tra due indici specificati
- Request parameters: `a` (primo indice), `b` (secondo indice), `description` (descrizione della carta)
- Response body (carta valida):
  ```json
  {
    "id": 3,
    "situation": "Piove e hai dimenticato l’ombrello.",
    "index": 5.0,
    "link": "3.png"
  }
  ```
- Response body (carta non valida):
  ```json
  {}
  ```
- Error responses: `404 Not Found` in caso di errore durante la verifica

### GET `/api/cards/random/:actualcards`
- Ottiene una nuova carta casuale che non è già presente nel gioco
- Request parameters: `actualcards` (lista di ID delle carte già in gioco, separati da virgola)
- Response body:
  ```json
  {
    "id": 3,
    "situation": "Piove e hai dimenticato l’ombrello.",
    "link": "http://localhost:3001/3.png"
  }
  ```
- Error responses: `404 Not Found` in caso di errore durante il recupero della carta

## Gestione delle partite

### POST `/api/games`
- Salva i risultati di una partita completata
- Richiede autenticazione (isLoggedIn)
- Request body:
  ```json
  {
    "Date": "2023-07-05T15:30:45.123Z",
    "initialCards": "Perdere il portafoglio-Trovare una moneta-Pioggia improvvisa",
    "cardsOfGames": "Incontrare un vecchio amico - Turno1: win; Forare una gomma - Turno2: lost",
    "isWin": false,
    "userId": 1
  }
  ```
- Response body:
  ```json
  {
    "id": 42,
    "date": "2023-07-05T15:30:45.123Z",
    "initialCards": "Perdere il portafoglio-Trovare una moneta-Pioggia improvvisa",
    "results": "Incontrare un vecchio amico - Turno1: win; Forare una gomma - Turno2: lost",
    "isWin": 0,
    "userId": 1
  }
  ```
- Error responses: `500 Internal Server Error` per errori di elaborazione

### GET `/api/games/:id`
- Recupera le partite giocate da un utente
- Richiede autenticazione (isLoggedIn)
- Request parameters: `id` (ID dell'utente)
- Response body:
  ```json
  [
    {
      "GameId": 51,
      "Date": "2025-06-15T21:33:18+02:00",
      "initialCards": "Il professore ti riconosce e ti interroga.-Il relatore ti dà un solo voto in più del minimo.-Il tuo gruppo ti lascia da solo a presentare.",
      "cardsOfGames": "Il tuo elaborato viene annullato per un errore formale. - Turno1: lost; Il professore ti riconosce e ti interroga. - Turno2: lost; Scopri che la tesi che hai stampato ha 20 pagine bianche. - Turno3: win; Hai il ciclo proprio il giorno della discussione. - Turno4: lost",
      "isWin": 0,
      "userId": 1
    },
    {
      "GameId": 52,
      "Date": "2025-06-17T11:47:41+02:00",
      "initialCards": "Il proiettore non funziona durante la tua presentazione.-Hai letto “facoltativo” come “non serve”.-Scopri di aver caricato il file sbagliato sul portale.",
      "cardsOfGames": "Il tuo coinquilino si dimentica di pagare l'affitto e vi sfrattano. - Turno1: lost; Il prof ti fa una domanda a cui nemmeno lui sa rispondere. - Turno2: lost; Il tuo compagno di gruppo non ha fatto nulla. - Turno3: lost",
      "isWin": 0,
      "userId": 1
    }
  ]
  ```
- Error responses: `500 Internal Server Error` per errori di elaborazione

## Database Tables

- Table `Cards` 
  - Campi: id, descrizione, indice, immagine
  - Contiene le informazioni delle carte che vengono generate
- Table `Games` 
  - Campi: Gameid, Date, initialCards, CardsOfGame, isWin, userId
  - Contiene l'esito delle partite del giocatore
- Table `Users` 
  - Campi: id, username, email, password, salt
  - Contiene le informazioni degli utenti

## Main React Components

- `LoginForm` (in `AuthComponent.jsx`): Componente per gestire il login
- `GameComponent` (in `GameComponent.jsx`): Componente che gestisce sia la partita demo che la partita completa. Sulla base delle carte generate dal server, gestisce l'interfaccia del gioco, mediante scelte possibili in cui mettere la carta, avvisi nel caso in cui il round sia vinto o meno per poi gestire il fine partita facendo vedere al giocatore le carte vinte e se la partita è vinta oppure no
- `History` (in `History.jsx`): Componente per far vedere la cronologia delle partite dell'utente, accessibile solo se l'utente è loggato.
- `NavbarComponent` (in `NavbarComponent.jsx`): Componente che permette di spostarsi nell'applicazione, in Home, Join the Game, Storico Partite (compare solo per gli utenti loggati)
- `Home` (in `Home.jsx`): Componente in cui viene illustrata la guida generale del gioco


## Screenshot

![Schermata1](.\screenshots\1.jpeg)

![Schermata2](.\screenshots\2.jpeg)
## Users Credentials

- username: user1, email: user1@gmail.com, password: password 
- username: user2, email: user2@gmail.com, password: PASSWORD 
