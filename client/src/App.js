import React from 'react';
import { Router } from "@reach/router";

import Home from './routes/Home.js';
import Lobby from './routes/Lobby.js';
import Game from './routes/Game.js';

const colors = ['firebrick', 'magenta', 'lime', 'midnightblue', 'orange', 'teal'];
const foodColor = 'gold';


function App() {

    return (
        <Router>
            <Home path="/" />
            <Lobby path="/lobby/:id" colors={colors} />
            <Game path="/game/:id" foodColor={foodColor}/>
        </Router>);
}

export default App;
