import Config from '../Config';
import Axios from 'axios';

const Connexion = () => {

 const url = window.location.search;

 const urlParams = new URLSearchParams(url);

 //Une fois que l'user à valider son authentification, Twitch nous fourni un code dans l'url (valeur du parametre "code")
 //Ici, on récupère ce paramètre
 const code = urlParams.get('code');

 let oToken = '';

 //Ici, on envoie une requete POST à twitch avec les différents paramètres requis pour que Twitch nous remet un token d'acces
 const token = async () => { 
 await Axios.post(`https://id.twitch.tv/oauth2/token?client_id=${Config.clientID}&client_secret=${Config.clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${Config.redirectURI}`).then( (res) => {
 oToken = res.data.access_token;
 // console.log(res.data);
 sessionStorage.setItem('theToken', oToken);
 });
 }

 token();

 return(null);

}

export default Connexion;