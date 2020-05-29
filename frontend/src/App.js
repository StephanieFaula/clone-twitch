import React from 'react';
import { 
 BrowserRouter as Router,
 Route, 
 Switch
} from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Games from './components/Games';
import Connexion from './components/Connexion';
import TopStreams from './components/TopStreams';
import Live from './components/Live';
import GameStreams from './components/GameStreams';
import Resultats from './components/Resultats';
import Erreur from './components/Erreur';

// react-router contains all the common components between react-router-dom and react-router-native. When should you use one over the other? If you're on the web then react-router-dom should have everything you need as it also exports the common components you'll need. If you're using React Native, react-router-native should have everything you need for the same reason. So you'll probably never have to import anything directly from react-router.

export const App = () => {
  return (
    //forceRefresh permet comme son nom l'indique de forcer l'actualisation de la page
    <Router>
      <div className="App">
        <Connexion />
        <Header />
        <Sidebar />
        <Switch>
          <Route exact path="/" component={Games} />
          <Route exact path="/top-streams" component={TopStreams} />
          <Route exact path="/live/:slug" component={Live} />
          <Route exact path="/game/:slug" component={GameStreams} />
          <Route exact path="/resultats/:slug" component={Resultats} />
          <Route exact path="/resultats/" component={Erreur} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;