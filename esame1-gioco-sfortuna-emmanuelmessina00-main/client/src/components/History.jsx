import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import API from '../API.mjs';
import Alert from 'react-bootstrap/Alert';
import dayjs from 'dayjs';
function History({ user, loggedIn }){
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchGames = async () => {
            if (!user || !user.id) {
                setLoading(false);
                setError("Utente non autenticato");
                return;
            }
            
            try {
                const gamesData = await API.getGamesById(user.id);
                setGames(gamesData);
            } catch (err) {
                console.error("Errore nel recupero dei giochi:", err);
                setError("Impossibile caricare la cronologia dei giochi");
            } finally {
                setLoading(false);
            }
        };
        
        fetchGames();
    }, [user]);
    
    if (loading) {
        return <p className="text-center">Caricamento cronologia...</p>;
    }
    
    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }
    
    if (!games.length) {
        return <Alert variant="info">Non hai ancora giocato nessuna partita.</Alert>;
    }

    
    return (
        <div className="mt-4">
            <h2 className="mb-3 text-center">La tua cronologia delle partite</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Carte iniziali</th>
                        <th>Risultati turni</th>
                        <th>Carte vinte</th>
                        <th>Esito</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => {
                        
                        return (
                            <tr key={game.id}>
                                <td>{dayjs(game.date).format("YYYY-MM-DD HH:mm:ss")}</td>
                                <td>
                                    <ul>
                                        {game.initialCards.split("-").map((g, idx) => (
                                            <li key={idx}>{g}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        {game.CardsOfGame.split(";").map((g, idx) => (
                                            <li key={idx}>{g}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>{game.CardsOfGame.split(";").filter(l=>{
                                    const isWin=l.split("-")[1].split(":")[1]; 
                                    return isWin==" win";
                                }).length}</td>
                                <td>
                                    <strong>{game.isWin==0 ? "Sconfitta" : "Vittoria"}</strong>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
}

export default History;