import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const Games = () => {

    const [games, setGames] = useState([]);

    const url = window.location.search;

    const urlParams = new URLSearchParams(url);

    //Une fois que l'user à valider son authentification, Twitch nous fourni un code dans l'url (valeur du parametre "code")
    //Ici, on récupère ce paramètre
    const code = urlParams.get('code');

    let oToken = '';

    useEffect(() => {

        //la déclaration async permet d'effectuer des actions de façon asynchrones. Ici, aller chercher des données ET les recevoir en même temps
        const fetchData = async () => {

            //Ici, on envoie une requete POST à twitch avec les différents paramètres requis pour que Twitch nous remet un token d'acces
            const token = await Axios.post(`https://id.twitch.tv/oauth2/token?client_id=lhvw6vqelrbmgygm5wekb9upiov0pc&client_secret=y8byiyt2wu5qqtlpvqpzi0e52j1p3h&code=${code}&grant_type=authorization_code&redirect_uri=http://localhost:3000`).then( (res) => {
                oToken = res.data.access_token;
                console.log(res.data);
            });

            const result = await Axios.create({
                headers: {
                    'Client-ID' : 'lhvw6vqelrbmgygm5wekb9upiov0pc',
                    'Authorization' : 'Bearer ' + oToken
                }
            }).get('https://api.twitch.tv/helix/games/top');

            // console.log(result.data.data);

            let dataArray = result.data.data;

            let finalArray = dataArray.map( game => {
                let newUrl = game.box_art_url
                .replace("{width}", "250")
                .replace("{height}", "300");

                game.box_art_url = newUrl;
                return game;
            });

            setGames(finalArray);

        }
        fetchData();
        // console.log(fetchData);
        // console.log(oToken);


    }, [])

    console.log(games);

    return(
        <div className="">
            <h1 className="titreGames">Jeux les plus populaires</h1>

            {code &&
                <div className="flexAccueil">
                    {games.map((game, index) => ( 
                        <div key={index} className="carteGames">
                            <img src={game.box_art_url} alt="image-jeu" className="imgCarte"/>
                            <div className="cardBodyGames">
                                <h5 className="titreCartesGames">{game.name}</h5>
                                <div className="btnCarte">Regarder {game.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
            }
            {!code &&
                <div className="connexion">
                <a href="https://id.twitch.tv/oauth2/authorize?client_id=lhvw6vqelrbmgygm5wekb9upiov0pc&redirect_uri=http://localhost:3000&response_type=code&scope=viewing_activity_read"><button type="button" className="button-connexion">Se connecter</button></a>
                </div>
            }
        </div>
    );

}

export default Games;