import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import API from '../API.mjs';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'

function GameComponent({ loggedIn, user }){
    const [cards, setCards]=useState([]); //stato per le carte attuali
    const [round, setRound]=useState(0);  //stato per il turno attuale
    const [newCard, setCard]=useState({}); //nuova carta generata
    const [start,setStart]= useState(false); //per dire se la partita è iniziata o meno
    const [roundsWin,setRoundWin]=useState([]); //segna i round vinti per turno
    const [isTrue,setIsTrue]=useState(); //serve per il messaggio Alarm per dire se la risposta è corretta o meno
    const [finish,setFinish]=useState(false); //dice se la partita è finita o meno
    const [time,setTime]=useState(null); //utizzato per visualizzare il valore effettivo del timer
    const [timer, setTimer] = useState(30); //stato per gestire il timer
    const [answered, setAnswered] = useState(false); //controllo se la risposta è data o meno
    const [totCards,setTotCards]=useState([]); //sono tutte le carte utilizzate nel gioco
    const [authRequired, setAuthRequired] = useState(false);
    const navigate = useNavigate();

    function handleTimer(){
        // Cancella qualsiasi timer esistente prima di crearne uno nuovo
        if (timer) {
            clearInterval(timer);
        }
        
        setTime(30);
        const newTimer = setInterval(() => {
            setTime((oldTime) => {
                // Se il tempo è arrivato a 0, ferma il timer e segna il round come perso
                if (oldTime == 0) {
                    clearInterval(newTimer);
                    setIsTrue(false);
                    setRoundWin(prev => [...prev, "lost"]);
                    setAnswered(true);
                    return 0;
                }
                return oldTime - 1;
            });
        }, 1000); //ripete la callback ogni 1000 ms
        
        setTimer(newTimer);
    }

useEffect(() => {
    if (start && !answered) {
        if (cards.length === 0) {
            const new_cards = API.getCardsFirstRound();
            new_cards.then(cardsArr => {
                setTotCards(cardsArr);
                setCards(cardsArr.slice(0, 3));
                setCard(cardsArr[cardsArr.length - 1]);
                handleTimer();
            });
        } else {
             if (round > 1 && !loggedIn) {
                    setAuthRequired(true);
                    return; 
                }
                
            const cardIds = totCards.map(c => c.id);
                
            API.getCardRandom(cardIds)
                .then(card => {
                    setCard(card);
                    setTotCards(prev=>[...prev,card]);
                })
                .catch(err => console.error("Errore nel caricamento della carta:", err));
            handleTimer();
        }
    }
}, [start, round]);


const saveGameResults = async (isWin) => {
    try {
        
        const currentDate = dayjs().format();
        const nameCards=totCards.map(c=>c.situation);
        //invio al server le informazioni a partita finita
        const result = await API.sendInfoGames(
            currentDate,
            nameCards,
            roundsWin,
            isWin,
            user.id  
        );
        
    } catch (error) {
        console.error('Errore durante il salvataggio del gioco:', error);
    }
};

async function handleAnswer(interval, description) {
    if (answered) return; // Impedisco più risposte

    try {
        const ans = await API.validateAnswer(interval, description);
        const isEmptyObject = Object.keys(ans).length === 0; //controllo se l'oggetto è senza chiavi

        setAnswered(true);  //  Blocca le risposte successive
        clearInterval(timer); // Ferma il timer

        if (isEmptyObject) {
            setIsTrue(false);
            setRoundWin(prev => [...prev, "lost"]);
        } else {
            setIsTrue(true);
            setRoundWin(prev => [...prev, "win"]);
            setCards(prev => [...prev, ans].sort((a,b)=>a.index-b.index));
        }

        
    } catch (error) {
        console.error("Errore:", error);
    }
}


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {start ? (
                <>  
                    {time} secondi
                    {round >= 1 && answered  && (
                        isTrue ? (
                            <Alert key={"success"} variant={"success"}>
                                Risposta giusta!
                            </Alert>
                        ) : (
                            <Alert key={"danger"} variant={"danger"}>
                                Risposta sbagliata!
                            </Alert>
                        )
                    )}
                    <h1>Round {round}</h1>
                        
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', flexWrap: 'nowrap', justifyContent: 'center' }}>
                        {cards.map(c => (
                            <Card style={{ width: '15rem'}} key={c.index}>
                                <Card.Img variant="top" src={c.link} />
                                <Card.Body>
                                    <Card.Text>
                                        <b>Situazione</b>: {c.situation} <b>Indice sfiga</b>: {c.index} 
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                    <p>La nuova carta generata è: </p>
                    <Card style={{ width: '15rem'}} key={newCard.id}>
                        <Card.Img variant="top" src={newCard.link} />
                        <Card.Body>
                            <Card.Text>
                                <b>Situazione</b>: {newCard.situation}  
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <ListGroup style={{ marginTop: '1rem', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                        {/* Prima del primo indice */}
                        {cards.length > 0 && (
                            <ListGroup.Item 
                                key={`before-${cards[0].index}`} 
                                action 
                                variant="light" 
                                onClick={() => handleAnswer(`Prima dell'indice sfiga ${cards[0].index}`, newCard.situation)}>
                                Prima dell'indice sfiga {cards[0].index}
                            </ListGroup.Item>
                        )}

                        {/* Tra gli indici */}
                        {cards.map((c1, i) => {
                            if (i < cards.length - 1) {
                                const c2 = cards[i + 1];
                                return (
                                    <ListGroup.Item 
                                        key={`between-${i}`} 
                                        action 
                                        variant="light" 
                                        onClick={() => handleAnswer(`Tra indice sfiga ${c1.index} e ${c2.index}`, newCard.situation)}>
                                        Tra indice sfiga {c1.index} e {c2.index}
                                    </ListGroup.Item>
                                );
                            }
                            return null;
                        })}

                        {/* Dopo l'ultimo indice */}
                        {cards.length > 0 && (
                            <ListGroup.Item 
                                key={`after-${cards[cards.length-1].index}`} 
                                action 
                                variant="light" 
                                onClick={() => handleAnswer(`Dopo l'indice sfiga ${cards[cards.length-1].index}`, newCard.situation)}>
                                Dopo l'indice sfiga {cards[cards.length-1].index}
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                    {answered && !finish && (
                    <Button style={{ marginTop: '1rem' }} onClick={() => {
                        if (round === 1 && !loggedIn) {
                            // Se l'utente non è autenticato e sta cercando di accedere al secondo round
                            setAuthRequired(true);
                            setStart(false);
                            setFinish(true);
                        } else {
                            // Altrimenti procedi normalmente
                            setRound(prev => prev + 1);
                            setAnswered(false);
                            setIsTrue(undefined);
                            const countRoundsWin = roundsWin.filter(r => r === "win").length;
                            const countRoundsLost = roundsWin.length-countRoundsWin;
                        
                            // Se il round è 5 o la partita deve terminare, ferma il gioco
                            if (round === 5 || countRoundsWin === 3 || countRoundsLost === 3) {
                                setStart(false);
                                setFinish(true);
                                
                                // Invio il risultato al database 
                                saveGameResults(countRoundsWin === 3);
                                
                            }
                       
                        }
                    }}>
                        Prossimo turno
                    </Button>
            )}

                </>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    {!finish ? (
                        <Button type="button" variant="primary" className="ms-2" onClick={() => {
                            setStart(true);
                            setRound(1);
                        }} style={{ marginTop: '80px' }}>
                            Inizia la partita
                        </Button>
                    ) : (
                        <>
                            <div style={{ textAlign: 'center', width: '100%', marginTop: '180px' }}>
                                Partita finita! Carte in possesso del giocatore alla fine della partita:
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', flexWrap: 'nowrap', justifyContent: 'center', marginTop: '1rem' }}>
                                {cards.map(c => (
                                    <Card style={{ width: '15rem'}} key={c.index}>
                                        <Card.Img variant="top" src={c.link} />
                                        <Card.Body>
                                            <Card.Text>
                                                <b>Situazione</b>: {c.situation} <b>Indice sfiga</b>: {c.index} 
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                            Carte Vinte: {roundsWin.filter(r => r === "win").length}
                            <br />
                            {roundsWin.filter(r => r === "win").length === 3 ? (
                                <b>Hai vinto!</b>
                            ) : (
                                <b>Hai perso!</b>
                            )}
                {/* Mostra l'alert di autenticazione se necessario */}
                {authRequired && (
                    <Alert variant="warning" className="mt-3 text-center" style={{ width: '80%' }}>
                        <Alert.Heading>Modalità demo completata</Alert.Heading>
                        <p>
                            Per accedere al gioco completo è necessario effettuare il login.
                        </p>
                        <div className="d-flex justify-content-center">
                            <Button 
                                variant="primary" 
                                onClick={() => navigate('/login')}
                                className="me-2"
                            >
                                Vai al login
                            </Button>
                            <Button 
                                variant="secondary" 
                                onClick={() => setAuthRequired(false)}
                            >
                                Chiudi
                            </Button>
                        </div>
                    </Alert>
                )}
                            <Button type="button" variant="primary" className="ms-2" onClick={() => {
                                setStart(true);
                                setRound(1);
                                setCards([]);
                                setTotCards([]);
                                setRoundWin([]);
                                setAnswered(false);
                                setIsTrue(undefined);
                                setFinish(false);
                                setTime(null);
                            }}>
                                Inizia una nuova partita
                            </Button>
                        </>
                    )}
                </div>
            )}
        </div>
    )


}
export default GameComponent;