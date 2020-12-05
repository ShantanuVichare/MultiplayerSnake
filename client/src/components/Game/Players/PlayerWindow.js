import React, { useEffect, useState } from 'react';
import Select, { components } from "react-select";

import './PlayerWindow.css';

const { Option } = components;

const ColorOption = props => (
    <Option {...props}>
      <div className="colorOption" style={{display:'inline-block',  backgroundColor: props.data.value}} />
      <div style={{ display:'inline-block'}}> {props.data.label}</div>
    </Option>
);

function PlayerWindow({ getColors, player, addPlayer, removePlayer, startGame }) {


    const [gameJoined, setGameJoin] = useState(player?true:false);
    const [userNameValue, setsUerNameValue] = useState(player?player.name:undefined);
    const [selectedColorOption, setSelectedColorOption] = useState(player?player.color:undefined);

    useEffect(() => {
        // const joinFlagUpdater = setInterval(() => setGameJoin(player?true:false),2000);
        // return () => clearInterval(joinFlagUpdater);
        setGameJoin(player?true:false)
    }, [player]);

    
    const handleUserNameChange = (e) => {
        setsUerNameValue(e.target.value);
    }

    const handleJoinGameSubmit = (e) => {
        e.preventDefault();
        addPlayer(userNameValue, selectedColorOption.value, () => setGameJoin(true));
        // .catch(err => alert("Failed to add player, check your name and color\nError:"+err));
        // let playerAdded = addPlayer(userNameValue, selectedColorOption.value);
        // if (playerAdded){
        //     // alert("submitted");
        //     setGameJoin(true);
        // } else {
        //     alert("check your name and color");
        // }
    }

    const handleSelectColor = (selectedOption) => {
        setSelectedColorOption(selectedOption);
    }

    const handleStartGame = () => {
        // alert("Game Started");
        startGame();
    }

    const handleLeaveGame = () => {
        removePlayer(() => setGameJoin(false));
    }

    let options = getColors().map((col) => {return {value: col, label: col}});


    return (
        !gameJoined ?
        <div >
            <div style={{fontSize: 'larger', marginTop: '5%'}}>
                Enter your details.. to enter the Game
            </div>
            <form onSubmit={handleJoinGameSubmit}>
                <input className="namebox" type="text" placeholder="Enter your name.." value={userNameValue} onChange={handleUserNameChange} />
                <span style={{display: 'inline-block', width: '200px', textAlign: 'left'}}>
                <Select 
                    placeholder="Select Snake Color"
                    value={selectedColorOption}
                    options={options}
                    onChange={handleSelectColor}
                    components={{ Option: ColorOption }}
                />
                </span>
                <input className="namebox submitButton" type="submit" value=">>" />

            </form>
        </div> 
        :
        <div>
            <button className="namebox" onClick={handleStartGame}> Start Game </button>
            <button className="namebox" onClick={handleLeaveGame}> Leave Game </button>
        </div>
    );
}

export default PlayerWindow;
