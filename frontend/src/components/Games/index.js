import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Config from '../Config';

const Games = () => {

 const [games, setGames] = useState([]);

 const [connexion, setConnexion] = useState(false);

 let oToken = sessionStorage.getItem('theToken');

 useEffect(() => {

 //la déclaration async permet d'effectuer des actions de façon asynchrones. Ici, aller chercher des données ET les recevoir en même temps
 const fetchData = async () => {

 const result = await Axios.create({
 headers: {
 'Client-ID' : Config.clientID,
 'Authorization' : 'Bearer ' + oToken
 }
 }).get('https://api.twitch.tv/helix/games/top');

 if(result.status === 200) {
 setConnexion(true);
 } else {
 setConnexion(false);
 }

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

 }, [])

 console.log(connexion);
 // console.log(games);

 return(
 <div className="">
 <h1 className="titreGames">Jeux les plus populaires</h1>

 {connexion &&
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
 {!connexion &&
 <div className="connexion">
 <a href="https://id.twitch.tv/oauth2/authorize?client_id=lhvw6vqelrbmgygm5wekb9upiov0pc&redirect_uri=http://localhost:3000&response_type=code&scope=viewing_activity_read"><button type="button" className="button-connexion">Se connecter</button></a>
 </div>
 }
 </div>
 );

}

export default Games;