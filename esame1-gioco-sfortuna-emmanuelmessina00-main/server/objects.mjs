
export function Card(situation, link, index,id) {
    this.situation = situation;
    this.link = link;
    this.index = index; 
    this.id=id;
}

export function Game(id, date, initialCards,CardsOfGame, isWin, userId) {
    this.id = id;
    this.date = date;
    this.initialCards = initialCards;
    this.CardsOfGame = CardsOfGame;
    this.isWin = isWin;
    this.userId = userId;
}