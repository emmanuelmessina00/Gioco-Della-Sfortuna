import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cardDao from './card-dao.mjs';
import UserDao from './user-dao.mjs';
import { db } from './database.mjs';
const userDao = new UserDao();

const app = express();
app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));

/*** Passport ***/
import passport from 'passport';                              
import LocalStrategy from 'passport-local';                   

passport.use(new LocalStrategy(async function verify(email, password, callback) {
    const user = await userDao.getUserByCredentials(email, password);
    if(!user)
      return callback(null, false, 'Incorrect username or password');

    return callback(null, user); 
}));

passport.serializeUser(function (user, callback) { 
    callback(null, user);
});


passport.deserializeUser(function (user, callback) { 
    return callback(null, user); 

});


/** Creazione sessione */
import session from 'express-session';

app.use(session({
  secret: "This is a very secret information used to initialize the session!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authorized'});
}



// POST /api/sessions

app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        if (!user) {
          return res.status(401).json({ error: info});
        }
     
        req.login(user, (err) => {
          if (err)
            return next(err);
          return res.json(req.user);
        });
    })(req, res, next);
  });

  // GET /api/sessions/current

  app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.status(200).json(req.user);}
    else
      res.status(401).json({error: 'Not authenticated'});
  });

  // DELETE /api/session/current

  app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
      res.end();
    });
  });
app.use(express.static('cards')) // rende statica la cartella cards e accessibile

//Cards e Games API's
app.get('/api/cards/', async (req, res) => {
  try {
    const cards = await cardDao.initializeCardsForGame();
    res.json(cards);
  } catch (err) {
    res.status(404).json({ error: err.message });
  } 
});
app.get('/api/cards/before/:number/:description', async (req,res)=>{
  try{
    const n=req.params.number;
    const des=req.params.description;
    const card=await cardDao.getCardBefore(n,des);
    res.json(card);
  }catch(err){
    res.status(404).json({ error: err.message });
  }
});
app.get('/api/cards/after/:number/:description', async (req,res)=>{
  try{
    const n=req.params.number;
    const des=req.params.description;
    const card=await cardDao.getCardAfter(n,des);
    res.json(card);
  }catch(err){
    res.status(404).json({ error: err.message });
  }
});
app.get('/api/cards/between/:a/:b/:description', async (req,res)=>{
  try{
    const a=req.params.a;
    const b=req.params.b;
    const des=req.params.description;
    const card=await cardDao.getCardBetween(a,b,des);
    res.json(card);
  }catch(err){
    res.status(404).json({ error: err.message });
  }
});
app.get('/api/cards/random/:actualcards', async (req, res) => {
  try {
    const ids = req.params.actualcards.split(",").map(Number);
    let random;
    do {
      random = Math.floor(Math.random() * 50) + 1; // genera da 1 a 50 inclusi
    } while (ids.includes(random));
    const card = await cardDao.getCardById(random);
    res.json(card);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});
app.post('/api/games', isLoggedIn, async (req, res) => {
  try {
    
    const { date, initialCards, results, isWin, userId } = req.body;
    const savedGame = await cardDao.createGame(date, initialCards, results, isWin, userId);
    res.status(201).json(savedGame);
  } catch (err) {
    console.error('Error saving game:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
app.get('/api/games/:id', isLoggedIn, async (req, res) => {
  try {
    const games = await cardDao.getGamesByUserId(req.user.id);
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
// Attiva il server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));


