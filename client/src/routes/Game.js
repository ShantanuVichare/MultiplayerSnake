import React from 'react';
import GameWindow from '../components/Game/GameWindow';



function Game({id, foodColor}) {


    return (
    <div >
        <GameWindow id={id} foodColor={foodColor} />
    </div>
    );
}

export default Game;
