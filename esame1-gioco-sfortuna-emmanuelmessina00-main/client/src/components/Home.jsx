
import Card from 'react-bootstrap/Card';
function Body() {
return (
    <Card body>
        <div style={{ padding: "2rem" }}>
            <h1 className="text-center mb-4 fw-bold text-dark">
                Benvenuto nel gioco Stuff Happens Versione Universitaria che mette alla prova il tuo karma studentesco
            </h1>
            <p className="lead text-center mb-5 text-secondary">
                Qui non si parla di CFU, esami o lauree (beh… forse un po' sì), ma di <b className="text-danger">sfiga pura e concentrata</b>, distillata in situazioni tanto assurde quanto plausibili nella tua tragica vita da universitario.
            </p>

            <Card className="mb-4 shadow-sm bg-light">
                <Card.Body>
                    <h4 className="mb-3 text-primary">📚 Cos'è questo gioco e perché ci fai questo?</h4>
                    <p>
                        Il tuo obiettivo è semplice: ottenere <b>6 carte</b>, ognuna rappresentante una situazione orribile che potrebbe capitare a qualsiasi studente universitario.
                        Da "Ti accorgi di aver studiato il capitolo sbagliato" a "Perdi il treno per l'esame" — nulla è troppo assurdo.
                    </p>
                    Ogni carta presentata avrà:
                    <ul>
                        <li>🧠 La descrizione della situazione orribile</li>
                        <li>🖼️ Una bella immagine che ti farà ridere</li>
                        <li>💀 Un indice di sfortuna da 1 a 100</li>
                    </ul>
                </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm bg-light">
                <Card.Body>
                    <h4 className="mb-3 text-success">🎲 Come si gioca</h4>
                    <p>
                        Parti con <b>3 carte casuali</b>. Ogni round ricevi una nuova situazione (senza indice di sfortuna) e devi indovinare dove si colloca rispetto alle tue carte.
                    </p>
                    <b>🤔 Esempio:</b>
                    <ul>
                        <li>“Ti perdi per strada il giorno della laurea.” (63.0)</li>
                        <li>“Scopri che ti mancano 0.5 CFU per laurearti.” (93.0)</li>
                        <li>“Hai stampato la tesi in Comic Sans” (99.0)</li>
                    </ul>
                    <p>
                        Ora arriva: <i>“Per sbaglio chiudi il file della tesi senza salvare.”</i>. Dove la metti? Tra la prima e la seconda? Dopo tutte? Prima di tutte?
                    </p>
                    <b>⏱️ Tempo:</b>
                    <ul>
                        <li>Hai <b>30 secondi</b> per scegliere.</li>
                        <li>Clicca sull'opzione che ritieni corretta</li>
                        <li>Se indovini → ottieni la carta.</li>
                        <li>Se sbagli → la carta sparisce.</li>
                        <li>Clicca per andare avanti e proseguire la partita</li>
                    </ul>
                </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm bg-light">
                <Card.Body>
                    <h4 className="mb-3 text-warning">🏁 Quando si vince?</h4>
                    <ul>
                        <li>Hai <b>6 carte</b>? Hai vinto!</li>
                        <li>Sbagli <b>3 volte</b>? Il gioco finisce, ma puoi riprovare.</li>
                    </ul>
                </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm bg-light">
                <Card.Body>
                    <h4 className="mb-3 text-purple">🙃 Note importanti</h4>
                    <ul>
                        <li>Le carte sono generate a caso.</li>
                        <li>Le tue carte sono ordinate per sfortuna crescente.</li>
                        <li>Il gioco è rigiocabile all'infinito.</li>
                    </ul>
                    <h5 className="mt-4 text-info">💡 Tips:</h5>
                    <ul>
                        <li>Usa l'istinto accademico.</li>
                        <li>Stai calmo: 30 secondi sono tanti… o pochissimi.</li>
                        <li>Prendila sul ridere!</li>
                    </ul>
                </Card.Body>
            </Card>

            <div className="text-center mt-5">
                <h3 className="fw-bold text-danger">
                    Pronto a dimostrare che nulla ti abbatte?
                </h3>
                <p style={{ fontSize: "1.2rem" }}>
                    In bocca al lupo, collega. Ne avrai bisogno.
                </p>
            </div>
        </div>
    </Card>
);

}
function Home(){
    return (<>
            <Body/>
            </>)
}
export default Home;