import { useNavigate } from '@reach/router';
import React, { useState, useEffect } from 'react';

import Board from './Board/Board';
import { CellType } from './Board/Cell';
import Controls from './Controls/Controls';
import Scoreboard from './Scoreboard/Scoreboard';
import { requestNextDirection, requestRunningInstant } from '../../api';

let playerPersisted;
let boardUpdater;

function GameWindow({id, foodColor}) {

    const [matrix, setMatrix] = useState([]);
    const [players, setPlayers] = useState([]);

    const [gameFinished, setGameFinished] = useState(false);

    const navigate = useNavigate();
    try {
        playerPersisted = JSON.parse(sessionStorage.getItem('player'));
    } catch {
        console.log("Player details failed to parse from session");
    }
    if(!playerPersisted) {
        alert("Player details not found.. please retry");
        navigate(`/lobby/${id}`);
    }
    
    const changeDirection = (dir) => {
        requestNextDirection(id, playerPersisted, dir).then(({gameID, lobby}) => {
            if (id !== gameID) { throw Error("Returned ID is incorrect"); }
            console.log(`Moved ${dir}`);
        }).catch(err => {alert("Failed to change direction"); });
    }

    const updateGameMatrix = (instant) => {
        let {size, food, snakes} = instant;

        let tempPlayers = [];
        let occPts = [...Array(size)].map(() => [...Array(size)].map(() => new CellType()));
        let renderSnake = snake => {
            snake.body.forEach(({ x, y }, i) => {
                occPts[x][y].makeSnake(snake.color, i, snake.body.length, snake.alive)
            })
            tempPlayers.push({name: snake.name, color: snake.color, score: snake.body.length>=3?snake.body.length-3:0, health: snake.health, alive: snake.alive});
        };
        snakes.filter(snake => !snake.alive).map(renderSnake);
        snakes.filter(snake => snake.alive).map(renderSnake);
        food.forEach(({ x, y }) => { occPts[x][y].makeFood(foodColor); })
        // occPts[food.posn.x][food.posn.y].makeFood(foodColor);
        setMatrix(occPts);
        setPlayers(tempPlayers);
    }

    const runGame = () => {
        requestRunningInstant(id, playerPersisted).then(({gameID, lobby, instant}) => {
            // console.log(gameID, lobby, instant);
            
            if (gameFinished){
                clearInterval(boardUpdater);
                console.log("Game has stopped updating!");
            } else if (instant && instant.status==='Game Finished') {
                updateGameMatrix(instant);
                setGameFinished(true);
            } else if (instant) {
                updateGameMatrix(instant);
            } else {
                console.log("Game not started!");
            }
        }).catch(err => {console.log("Failed to get game instant"); console.log(err.message); });
    }

    useEffect(() => {
        runGame();
        boardUpdater = setInterval(runGame,1000);
        return () => clearInterval(boardUpdater);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    

    return (
    <div >
        Game ID: {id} 
        <br />
        <Board matrix={matrix} />
        <div style={{display: 'inline-flex',}}>
            <Controls changeDirection={changeDirection}/>

            <div style={{display: 'inline-block', width:'700px'}}>
            <Scoreboard trigger={true} 
            styleConfig={{ marginTop: '10%', marginBottom: '2%', textAlign:'center', padding: '2%', margin: '10%' }}
            gameID={id} players={players} />
            </div>
        </div>
        {
            gameFinished && <div style={{
                position:'fixed', 
                bottom: '0', 
                left: '0', 
                height: '100%', 
                width: '100%', 
                backgroundColor: 'rgba(100,100,100,0.5)', 
                border: '3px solid rgba(100,100,100,0.7)'
            }}>
            
            <Scoreboard trigger={gameFinished} 
            styleConfig={{ marginTop: '10%', marginBottom: '2%', textAlign:'center', backgroundColor: 'rgba(200,200,200,0.8)', boxShadow: '0px 0px 50px 10px rgba(200,200,200,0.8)', padding: '2%', margin: '10%' }} 
            gameID={id} players={players}/>
            <div className="buttonGroup">
            <button className="buttons" onClick={()=>navigate('/')}> Leave Game </button>
            </div>
            </div>
        }
    </div>
    );
}

export default GameWindow;
