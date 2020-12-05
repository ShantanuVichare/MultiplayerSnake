import React, { useState } from 'react';
import { useNavigate } from "@reach/router";

import { requestNewGame, requestJoinGame } from '../../api';

import './Start.css';

function Start() {

    const navigate = useNavigate();

    const [newGame, setNewGame] = useState(false);
    const [joiningGame, setJoiningGame] = useState(false);

    const [inviteCodeValue, setInviteCodeValue] = useState("");

    const reset = () => {
        setNewGame(false);
        setJoiningGame(false);
    }

    const createGame = () => {
        if (!newGame) {
            setNewGame(true);
            requestNewGame().then(res => {
                if (res.gameID !== null) { navigate(`/lobby/${res.gameID}`) }
                else { alert("Please check your input and retry"); reset(); }
            }).catch(err => { alert("Server failing.. please try later"); reset(); });
        }
    }

    const joinGame = () => {
        setJoiningGame(true);
    }

    const handlePasteInviteCode = (e) => {
        e.preventDefault();
        navigator.clipboard.readText().then((clipboardValue) => {
            setInviteCodeValue(clipboardValue);
        })
    }

    const handleInviteCodeChange = (e) => {
        setInviteCodeValue(e.target.value);
    }

    const handleJoinGameSubmit = (e) => {
        e.preventDefault();
        requestJoinGame(inviteCodeValue).then(res => {
            if (res.gameID !== null) { navigate(`/lobby/${res.gameID}`) }
            else { alert("Please check your input and retry"); reset(); }
        }).catch(err => { alert("Server failing.. please try again"); reset(); });
    }

    return (
        <div>
            <div className="buttonGroup">
                {!joiningGame &&
                    <button className="buttons" onClick={createGame}>
                        {newGame ? "Creating Game..." : "Create Game"}
                    </button>
                }

                {/* <br /> */}
                {!newGame &&
                    <button className="buttons" onClick={joinGame}>
                        {joiningGame ? "Joining Game..." : "Join Game"}
                    </button>
                }

            </div>
            <div className="codeboxGroup">
                {
                    joiningGame &&

                    <form onSubmit={handleJoinGameSubmit}>
                        <input className="codebox" type="text" placeholder="Enter code here.." value={inviteCodeValue} onChange={handleInviteCodeChange} />
                        <button className="codebox " onClick={handlePasteInviteCode}>Paste Code</button>
                        <input className="codebox submitButton" type="submit" value=">>" />
                    </form>
                }
            </div>
        </div>
    );
}

export default Start;
