import { Card } from "../../server/objects.mjs";

const SERVER_URL = "http://localhost:3001";

const getCardsFirstRound = async () => {
  const response = await fetch(`${SERVER_URL}/api/cards/`);
  if(response.ok) {
    let ans = await response.json();
    return ans;
  }
  else
    throw new Error("Ops, there is an error on the server.");
}
const validateAnswer=async (interval, description)=>{
  if(interval.includes("Prima dell'indice sfiga")){
    const number= interval.split("Prima dell'indice sfiga")[1];
    const response = await fetch(`${SERVER_URL}/api/cards/before/${number}/${description}`);
    return await response.json(); 
  }else if(interval.includes("Tra indice sfiga")){
    const numbers=interval.split("Tra indice sfiga")[1].split("e");
    const a=numbers[0];
    const b=numbers[1];
    const response = await fetch(`${SERVER_URL}/api/cards/between/${a}/${b}/${description}`);
    return await response.json(); 
  }else if(interval.includes("Dopo l'indice sfiga")){
    const number= interval.split("Dopo l'indice sfiga")[1];
    const response = await fetch(`${SERVER_URL}/api/cards/after/${number}/${description}`);
    return await response.json(); 
  }
}
const getCardRandom=async(cards)=>{
  const ids=cards.join(",");

  const response = await fetch(`${SERVER_URL}/api/cards/random/${ids}`);
  if(response.ok) {
    let ans = await response.json();
    return ans;
  }else
    throw new Error("Ops, nothing found.");
}

const sendInfoGames = async (date, totCards, results, isWin, userId) => {
  
  const initialCards = totCards.slice(0, 3).join('-');
  const lastCards = totCards.slice(3);
  const results_string = results.map((res, idx) => `${lastCards[idx]} - Turno${idx+1}: ${res}`).join('; ');
  const game = {
    date: date,
    initialCards: initialCards,
    results: results_string,
    isWin: isWin,
    userId: userId, 
  }
  
  try {
    const response = await fetch(SERVER_URL + '/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(game),
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const errDetails = await response.text();
      throw new Error(errDetails);
    }
  } catch (error) {
    throw new Error(`Failed to save game info: ${error.message}`);
  }
}

const getGamesById = async(id) => {
  const response = await fetch(SERVER_URL + `/api/games/${id}`, {
    credentials: 'include' 
  });
  
  if(response.ok) {
    const games = await response.json();
    return games;
  } else {
    const errDetails = await response.text();
    throw new Error(`Failed to get games: ${errDetails}`);
  }
}
const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};


const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  
  }
};


const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}
const API = { getCardsFirstRound, logIn,logOut,getUserInfo,validateAnswer,getCardRandom,sendInfoGames,getGamesById };
export default API;