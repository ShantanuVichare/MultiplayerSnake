import React from 'react';
import GameLobby from '../components/Game/GameLobby';



function Lobby({id, colors}) {


    return (
    <div >
        <GameLobby id={id} colors={colors} />
    </div>
    );
}

export default Lobby;
