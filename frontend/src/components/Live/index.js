import React, { useState, useEffect } from 'react';
import ReactTwitchEmbedVideo from 'react-twitch-embed-video';
import { useParams } from 'react-router-dom';
import Config from '../Config';
import Axios from 'axios';

const Live = () => {

 //Le destructuring consiste à assigner des variables provenant d'un objet ou tableau en reposant sur leur structure. Ici slug vaut {slug: PseudoDuJoueur}, on recupère simplement la valeur de la propriété slug (grace aux {} autour de slug) pour avoir UNIQUEMENT la valeur: le slug
 let {slug} = useParams();
 // console.log(slug);

 const [infoStream, setInfoStream] = useState([]);
 const [infoGame, setInfoGame] = useState([]);

 const oToken = sessionStorage.getItem('theToken');

 useEffect(() => {
 const fetchData = async () => {
 const result = await Axios.create({
 headers: {
 'Client-ID' : Config.clientID,
 'Authorization' : 'Bearer ' + oToken
 }
 }).get(`https://api.twitch.tv/helix/streams?user_login=${slug}`);

 let gameID = result.data.data.map( gameid => {
 return gameid.game_id
 });

 const resultNomGame = await Axios.create({
 headers: {
 'Client-ID' : Config.clientID,
 'Authorization' : 'Bearer ' + oToken
 }
 }).get(`https://api.twitch.tv/helix/games?id=${gameID}`);
 // console.log(resultNomGame);

 let nomJeu = resultNomGame.data.data.map(gameName => {
 return gameName.name
 })

 setInfoGame(nomJeu);
 setInfoStream(result.data.data[0])
 // console.log(result);
 }

 fetchData();
 }, [])

 //&nbsp = espace en html
 return(
 <div className="containerDecale">
 <ReactTwitchEmbedVideo height="754" width="100%" channel={slug}/>
 <div className="contInfo">
 <div className="titreStream">{infoStream.title}</div>
 <div className="viewer">Viewers : {infoStream.viewer_count}</div>
 <div className="infoGame">Streamer : {infoStream.user_name}, &nbsp; Langue : {infoStream.language}</div>
 <div className="nomJeu">Jeu : {infoGame}</div>
 </div>
 </div>
 );
}

export default Live;