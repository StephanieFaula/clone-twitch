import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import Config from '../Config';
import { Link } from 'react-router-dom';

const GameStreams = () => {

    let {slug} = useParams();

    const [streamData, setStreamData] = useState([]);
    const [viewers, setViewers] = useState(0);

    const oToken = sessionStorage.getItem('theToken');

    useEffect(() => {
    const fetchData = async () => {
        const fetchIdGame = await Axios.create({
            headers: {
                'Client-ID' : Config.clientID,
                'Authorization' : 'Bearer ' + oToken
            }
        }).get(`https://api.twitch.tv/helix/games?name=${slug}`);

        // console.log(fetchIdGame);

        let idGame = fetchIdGame.data.data[0].id;

        // console.log(idGame);

        const result = await Axios.create({
        headers: {
            'Client-ID' : Config.clientID,
            'Authorization' : 'Bearer ' + oToken
        }
        }).get(`https://api.twitch.tv/helix/streams?game_id=${idGame}`);
        // console.log(result);

        let dataArray = result.data.data;

        let finalArray = dataArray.map(stream => {
            let newURL = stream.thumbnail_url
            .replace('{width}', '320')
            .replace('{height}', '180');
            stream.thumbnail_url = newURL;
            return stream;
        })

        //Calcul du total des viewers

        //La méthode reduce() applique une fonction qui est un « accumulateur » et qui traite chaque valeur d'une liste (de la gauche vers la droite) afin de la réduire à une seule valeur.
        let totalViewers = finalArray.reduce((acc, val) => {
            return acc + val.viewer_count;
        }, 0)

        let userIDs = dataArray.map(stream => {
            return stream.user_id
        })

        let baseUrl = "https://api.twitch.tv/helix/users?";
        let queryParamsUsers = "";

        userIDs.map(id => {
            return (queryParamsUsers = queryParamsUsers + `id=${id}&`)
        });
        let finalUrl = baseUrl + queryParamsUsers;

        let getUsersLogin = await Axios.create({
        headers: {
            'Client-ID' : Config.clientID,
            'Authorization' : 'Bearer ' + oToken
        }
        }).get(finalUrl);

        let userLoginArray = getUsersLogin.data.data;

        finalArray = dataArray.map(stream => {
            stream.login = "";

            userLoginArray.forEach(login => {
            if(stream.user_id === login.id) {
            stream.login = login.login
            }
            })

            return stream;
        })

        setViewers(totalViewers);
        setStreamData(finalArray);
    }

    fetchData();

    }, [slug, oToken])

    console.log(streamData);
    return(
        <div>
            <h1 className="titreGamesStreams">Stream : {slug}</h1>
            <h3 className="sousTitreGameStreams">
                <strong className="textColored">{viewers}</strong> personnes regardent {slug}
            </h3>

            <div className="flexAccueil">
                {streamData.map((stream, index) => ( 
                    <div key={index} className="carteGameStreams">
                        <img src={stream.thumbnail_url} alt="jeu carte" className="imgCarte"/>
                        <div className="cardBodyGameStreams">
                            <h5 className="titreCartesStream">{stream.user_name}</h5>
                            <p className="txtStream">Nombre de viewers : {stream.viewer_count}</p>

                            <Link
                            className="lien"
                            to={{
                                pathname: `/live/${stream.login}`
                            }}>
                                <div className="btnCarte">Regarder {stream.user_name}</div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GameStreams;