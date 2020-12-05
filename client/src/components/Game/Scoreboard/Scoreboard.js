import React from 'react';
import { Transition } from 'react-transition-group';

import './Scoreboard.css';

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


function Scoreboard({ trigger, styleConfig, gameID, players }) {

    // players = [{ name: 'foo', color: 'orange' }, { name: 'bar', color: 'magenta' }, { name: 'lo', color: 'aquamarine' }];

    return (
            <Transition in={trigger} timeout={duration}>
                {state => (
                    <div style={{
                        ...defaultStyle,
                        ...transitionStyles[state],
                    }}>
                        <div style={styleConfig}>
                            {/* Players in current Game (ID: {gameID}) lobby: {players.length} */}

                            <div className="scoreplayerbox heading" style={{ display: 'inline-flex', }} >
                                <div className="scoreplayernamebox" > Player Name </div>
                                <div className="scoreplayertextbox" > Color </div>
                                <div className="scoreplayertextbox" > Score </div>
                                <div className="scoreplayertextbox" > Health </div>

                            </div>
                            <br />

                            {
                                players.map((pl) =>
                                    <div key={pl.name + pl.color} className="scoreplayerbox" style={pl.alive ? { display: 'inline-flex', boxShadow: '0px 0px 5px' }: { display: 'inline-flex'}} >
                                        <div className="scoreplayernamebox" > {pl.name} </div>
                                        {/* <div style={{ borderRadius: '10px', backgroundColor: pl.color}} />  */}
                                        <div className="scoreplayercolorbox" style={{ backgroundColor: pl.color }} />
                                        <div className="scoreplayertextbox" > {pl.score} </div>
                                        <div className="scoreplayertextbox" > {pl.health} </div>

                                    </div>
                                )
                            }
                        </div>
                    </div>
                )}
            </Transition>
    );
}


export default Scoreboard;
