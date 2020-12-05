import React, { useState } from 'react';
import { Transition } from 'react-transition-group';

import './PlayerList.css'

const duration = 300;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
}

const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
};

function PlayerList({ gameID, players }) {

    // players = [{name: 'foo', color: 'orange'}, {name: 'bar', color: 'magenta'}, {name: 'lo', color: 'aquamarine'}];

    const [clipButtonText, setClipButtonText] = useState('Copy Code');

    const copyToClipboard = () => {
        navigator.clipboard.writeText(gameID).then(() => {
            setClipButtonText('Copied!');
        })
    }

    return (
        <div>
            <Transition in={players.length>0} timeout={duration}>
                {state => (
                    <div style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                    }}>
                        <div style={{ marginTop: '10%', marginBottom: '2%', border: 'thin solid grey', textAlign:'center', padding: '2%', margin: '10%' }}>
                            Players in current Game (ID: {gameID}) lobby: {players.length}
                            <br />

                            {
                                players.map((pl) =>
                                    <div key={pl.name + pl.color} className="playerbox" style={{ display: 'inline-flex' }} >
                                        <div className="playernamebox" > {pl.name} </div>
                                        {/* <div style={{ borderRadius: '10px', backgroundColor: pl.color}} />  */}
                                        <div className="playercolorbox" style={{ backgroundColor: pl.color }} />

                                    </div>
                                )
                            }
                            <br />
                            <br />
                            Share Game ID: "<text style={{fontSize:'large', fontWeight:'bold'}}>{gameID}</text>" with your friends!
                        <button className="namebox" onClick={copyToClipboard}>{clipButtonText}</button>
                        </div>
                    </div>
                )}
            </Transition>
        </div>
    );
}

export default PlayerList;
