import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Config from '../Config';
import { Link } from 'react-router-dom';

const TopStreams = () => {

    const oToken = sessionStorage.getItem('theToken');

    const [channels, setChannels] = useState([]);

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
            stream.login = "";

            gamesNameArray.forEach(name => {
                userArray.forEach(user => {
                    if(stream.user_id === user.id && stream.game_id === name.id) {
                        stream.gameName = name.name;
                        stream.login = user.login;
                    }
                })
            });

            let newUrl = stream.thumbnail_url.replace('{width}', "320").replace('{height}', "180");
            stream.thumbnail_url = newUrl;

            return stream
            })

            setChannels(finalArray);
        }

        fetchData();

    }, [])

    // console.log(channels);

    return(
        <div className="">
            <h1 className="titreGames">Stream les plus populaires</h1>
            <div className="flexAccueil">
                {channels.map((channel, index) => ( 
                    <div key={index} className="carteStream">
                        <img src={channel.thumbnail_url} alt="image-jeu" className="imgCarte"/>

                        <div className="cardBodyStream">
                            <h5 className="titreCartesStream">{channel.user_name}</h5>
                            <p className="txtStream viewers">Viewers : {channel.viewer_count}</p>

                            <Link
                            className="lien"
                            to={{
                            pathname: `/live/${channel.login}`
                            }}
                            >
                                <div className="btnCarte">Regarder {channel.user_name}</div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TopStreams;