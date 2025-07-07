import { db } from "./database.mjs";
import { Card, Game } from "./objects.mjs";
const SERVER_URL = "http://localhost:3001";

function initializeCardsForGame() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Cards ORDER BY RANDOM() LIMIT ?";
        db.all(sql, [4], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const cards = rows.map(row => 
                    new Card(row.descrizione, `${SERVER_URL}/${row.immagine}`, row.indice,row.id)
                );
                const last_card = cards.pop();

                cards.sort((a, b) => a.index - b.index);
                cards.push({situation: last_card.situation,
                    link: last_card.link,
                    id: last_card.id,
                });
                
                resolve(cards);
            }
        });
    });
}
function getCardBefore(number,description){
return new Promise((resolve, reject) => {
    const sql="SELECT * FROM Cards WHERE descrizione=? AND indice < ?";
    db.get(sql,[description,number],(err,row)=>{
        if(err){

            reject(err);
        }else{
            if (typeof row === 'undefined'){
                row= {};
            }else{
                row= new Card(row.descrizione, `${SERVER_URL}/${row.immagine}`, row.indice, row.id);
            }
            
            resolve(row);
        }
    })
});
}
function getCardBetween(a,b,description){
return new Promise((resolve, reject) => {
    const sql="SELECT * FROM Cards WHERE descrizione=? AND indice > ? AND indice < ?";
    db.get(sql,[description,a,b],(err,row)=>{
        if(err){
            reject(err);
        }else{
            if (typeof row === 'undefined'){
                row= {};
            }else{
                row= new Card(row.descrizione, `${SERVER_URL}/${row.immagine}`, row.indice, row.id);
            }
           
            resolve(row);
        }
    })
});
}
function getCardAfter(number,description){
return new Promise((resolve, reject) => {    
    const sql="SELECT * FROM Cards WHERE descrizione=? AND indice > ?";
    db.get(sql,[description,number],(err,row)=>{
        if(err){
            resolve({ situation: "", link: "", index: -1 }); // Oggetto vuoto con valori di default
        }else{
            
            if (row === undefined) {
                console.log("è undefined");
                row = {};
            }else{
                row= new Card(row.descrizione, `${SERVER_URL}/${row.immagine}`, row.indice, row.id);
            }
            resolve(row);
        }
    })
});
}
function getCardById(id){
return new Promise((resolve, reject) => {
    const sql="SELECT * FROM Cards WHERE id=?";
    db.get(sql,[id],(err,row)=>{
        if(err){
            reject(err);
        }else{
            const card= {situation:row.descrizione, link:`${SERVER_URL}/${row.immagine}`, id:row.id};
            resolve(card);
        }
    })
});
} 
function createGame(date, initialCards, results, isWin, userId){
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Games (Date, initialCards, cardsOfGame, isWin, userId) VALUES (?, ?, ?, ?, ?)";
        db.run(sql, [date, initialCards, results, isWin, userId], function(err) {
            if (err) {
                console.error("Database error:", err);
                reject(err);
            } else {
                
                const savedGame = {
                    GameId: this.lastID,
                    Date: date,
                    initialCards: initialCards,
                    cardsOfGames: results,
                    isWin: isWin,
                    userId: userId
                };
                resolve(savedGame);
            }
        });
    });
}
function getGamesByUserId(userId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Games WHERE userId = ? ORDER BY Date DESC";
        
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                console.error("Database error:", err);
                reject(err);
            } else {
                
                const games = rows.map(row => {
                    return new Game(row.GameId,row.Date,row.initialCards,row.CardsOfGame,row.isWin,userId);
                });
                
                resolve(games);
            }
        });
    });
}
export default {initializeCardsForGame,getCardBefore,getCardBetween,getCardAfter,getCardById,createGame,getGamesByUserId}