import { useNavigate } from '@reach/router';
import _ from 'lodash';

import React, { useEffect, useState } from 'react';

import PlayerList from './Players/PlayerList';
import PlayerWindow from './Players/PlayerWindow';

import { requestJoinGame, requestReadGameAndPing, addPlayerToGame, removePlayerFromGame, requestStartGame } from '../../api';

function arraysEqual(_arr1, _arr2) {
    if (!Array.isArray(_arr1) || ! Array.isArray(_arr2) || _arr1.length !== _arr2.length) { return false; }

    for (let i = 0; i < _arr1.length; i++) {
        if (!_.isEqual(_arr1[i], _arr2[i])) { return false; }
    }

    return true;
}

let playerPersisted;
try {
    playerPersisted = JSON.parse(sessionStorage.getItem('player'));
} finally {
    console.log("Stored player:", playerPersisted);
}

let lobbyPlayersPersisted = [];


function GameLobby({id, colors}) {

    const navigate = useNavigate();

    const [player, setPlayer] = useState(playerPersisted);
    const [lobbyPlayers, setLobbyPlayers] = useState(lobbyPlayersPersisted);

    useEffect(() => {
        updateGameLobby();
        const lobbyUpdater = setInterval(updateGameLobby,1000);
        return () => clearInterval(lobbyUpdater);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const persistLobbyUpdate = (lobby) => {

        if(!arraysEqual(lobbyPlayersPersisted, lobby)) {
            console.log("Client Lobby:", lobbyPlayersPersisted); console.log("Server lobby:", lobby);
            lobbyPlayersPersisted = lobby;
            setLobbyPlayers(lobby);
        }

    }

    const persistPlayerUpdate = (playerData) => {
        playerPersisted = playerData;
        setPlayer(playerData);
        console.log("Updating player data:", playerData);
        (playerData) ? sessionStorage.setItem('player', JSON.stringify(playerPersisted))
        : sessionStorage.removeItem('player');
    }

    const updateGameLobby = () => {
        let requestGame = playerPersisted ? 
        (id) => requestReadGameAndPing(id, playerPersisted) : requestJoinGame;
        requestGame(id).then(({gameID, lobby, gameStarted}) => {
            if (id !== gameID) { throw Error("Returned ID is incorrect"); }
            persistLobbyUpdate(lobby);
            
            if (playerPersisted && !_.some(lobby, playerPersisted)) {
                persistPlayerUpdate(undefined);
            }

            if (gameStarted) { navigate(`/game/${gameID}`) }
        }).catch(err => {
            alert("Failed to read game.. please start new game");
            navigate('/')
        })
    }
    
    const addPlayer = (pname, pcolor, callback) => {
        persistPlayerUpdate({name: pname, color: pcolor});
        addPlayerToGame(id, playerPersisted).then(({gameID, lobby}) => {
            if (id !== gameID) { throw Error("Returned ID is incorrect"); }
            persistLobbyUpdate(lobby);
            callback();
        }).catch(err => {alert("Failed to add player");})
    }

    const removePlayer = (callback, player=playerPersisted) => {
        sessionStorage.removeItem('player');
        removePlayerFromGame(id, player).then(({gameID, lobby}) => {
            if (id !== gameID) { throw Error("Returned ID is incorrect"); }
            persistLobbyUpdate(lobby);
            callback();
        }).catch(err => {alert("Failed to remove player"); });

    }
    
    const startGame = () => {
        if(lobbyPlayersPersisted.length<2){
            alert("Wait for players to join!");
            return;
        }
        requestStartGame(id).then(res => {
            if (res.gameID !== null) { navigate(`/game/${res.gameID}`) }
            else { alert("Please retry again"); }
        }).catch(err => { alert("Server failing.. please try later"); });
    }

    const getAvailableColors = () => {
        let playerColors = lobbyPlayers.map(p => p.color);
        return colors.filter((color => !playerColors.includes(color)))
    };


    return (
        <div style={{textAlign:"center"}}>
        
            <PlayerWindow getColors={getAvailableColors} player={player} addPlayer={addPlayer} removePlayer={removePlayer} startGame={startGame}/>
            
            <PlayerList gameID={id} players={lobbyPlayers}/>
        </div>
    );
}

export default GameLobby;
