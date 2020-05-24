import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Config from '../Config';

const Sidebar = () => {

 const oToken = sessionStorage.getItem('theToken');

 const [topStreams, setTopStreams] = useState([]);

 useEffect(() => {
 const fetchData = async () => {
 const result = await Axios.create({
 headers: {
 'Client-ID' : Config.clientID,
 'Authorization' : 'Bearer ' + oToken
 }
 }).get('https://api.twitch.tv/helix/streams');

 let dataArray = result.data.data;
 // console.log(dataArray);

 let gameIDs = dataArray.map( stream => {
 return stream.game_id;
 });

 let userIDs = dataArray.map( stream => {
 return stream.user_id;
 });

 //Creation des URLs personnalisées
 let baseUrlGames = "https://api.twitch.tv/helix/games?"
 let baseUrlUsers = "https://api.twitch.tv/helix/users?"

 let queryParamsGame = "";
 let queryParamsUsers = "";

 gameIDs.map(id => {
 return (queryParamsGame = queryParamsGame + `id=${id}&`)
 });
 userIDs.map(id => {
 return (queryParamsUsers = queryParamsUsers + `id=${id}&`)
 });

 //URL final
 let urlFinalGames = baseUrlGames + queryParamsGame;
 let urlFinalUsers = baseUrlUsers + queryParamsUsers;

 //Appels
 let gamesNames = await Axios.create({
 headers: {
 'Client-ID' : Config.clientID,
 'Authorization' : 'Bearer ' + oToken
 }
 }).get(urlFinalGames);
 let getUsers = await Axios.create({
 headers: {
 'Client-ID' : Config.clientID,
 'Authorization' : 'Bearer ' + oToken
 }
 }).get(urlFinalUsers);

 let gamesNameArray = gamesNames.data.data;
 let userArray = getUsers.data.data;

 // console.log(gamesNameArray, userArray);

 //Création du tableau final
 let finalArray = dataArray.map(stream => {

 stream.gameName = "";
 stream.truePic = "";
 stream.login = "";

 gamesNameArray.forEach(name => {
 userArray.forEach(user => {
 if(stream.user_id === user.id && stream.game_id === name.id) {
 stream.gameName = name.name;
 stream.truePic = user.profile_image_url;
 stream.login = user.login;
 }
 })
 });

 return stream
 })

 setTopStreams(finalArray.slice(0,6));

 }

 fetchData();
 }, [])

 // console.log(topStreams);

 return(
 <div className="sidebar">
 <h2 className="titreSidebar">Chaines recommandées</h2>
 <ul className="listeStream">
 {topStreams.map((stream, index) => (
 <li key={index} className="containerFlexSidebar">
 <img src={stream.truePic} className="profilePicRonde" alt="logo user"/>
 <div className="streamUser">
 {stream.user_name}
 </div>
 <div className="viewerRight">
 <div className="pointRouge"></div>
 <div>{stream.viewer_count}</div>
 </div>
 <div className="gameNameSidebar">
 {stream.gameName}
 </div>
 </li>
 ))}
 </ul>
 </div>
 )
}
export default Sidebar;