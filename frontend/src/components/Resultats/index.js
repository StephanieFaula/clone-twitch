import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Config from '../Config';
import { Link, useParams } from 'react-router-dom';
import Erreur from '../Erreur';

const Resultats = () => {

    const oToken = sessionStorage.getItem('theToken');

    let {slug} = useParams();

    const [result, setResult] = useState(true);
    const [streamerInfo, setStreamerInfo] = useState([]);

    //Ici, on remplace tous les espace vides par rien du tout: '' PLUS DESPACE VIDE
    let cleanSearch = slug.replace(/ /g,'');

    useEffect(() => {
        const fetchData = async () => {
            const result = await Axios.create({
                headers: {
                    'Client-ID' : Config.clientID,
                    'Authorization' : 'Bearer ' + oToken
                }
            }).get(`https://api.twitch.tv/helix/users?login=${cleanSearch}`);

            // console.log(result);

            if(result.data.data.length === 0) {
                setResult(false);
            } else {
                setStreamerInfo(result.data.data);
            }

            
        }
        fetchData()
    }, [cleanSearch, oToken])

    return(

        result ?

            <div className="containerDecaleResultats">
                <h4>Resultats de la recherche : </h4>
                {streamerInfo.map((stream, index) => (
                    <div key={index} className="carteResultats">
                        <img className="imgCarte" src={stream.profile_image_url} alt="resultat profile"/>

                        <div className="cardBodyResults">
                            <h5 className="titreCartesStream">{stream.display_name}</h5>
                            <div className="txtResult">
                                {stream.description}
                            </div>
                            <Link
                            className="lien"
                            to={{
                                pathname: `/live/${stream.login}`
                            }}
                            >
                                <div className="btnCarte btnResult">Regarder {stream.display_name}</div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

        :

        <Erreur />
    )
}

export default Resultats;