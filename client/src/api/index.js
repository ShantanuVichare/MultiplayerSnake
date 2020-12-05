async function _post(path, payload) {
    return await fetch('/api/'+path, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload) // body data type must match "Content-Type" header
    })
        .then(res => res.json());
}

async function _get(path) {
    return await fetch('/api/'+path, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(payload) // body data type must match "Content-Type" header
    })
        .then(res => res.json());
}

async function requestNewGame() {
    let payload = {
        boardSize: 10,
        timeStep: 1000,
        allowLateJoin: true,
    };
    return await _post('create', payload);
}

async function requestJoinGame(id) {
    
    return await _get('lobby/'+id);
}

async function requestReadGameAndPing(id, player) {
    let payload = {
        operation: 'ping',
        player: player,
    }
    return await _post('lobby/'+id, payload);
}

async function addPlayerToGame(id, player) {
    let payload = {
        operation: 'add-player',
        player: player,
    }
    return await _post('lobby/'+id, payload);
}

async function removePlayerFromGame(id, player) {
    let payload = {
        operation: 'remove-player',
        player: player,
    }
    return await _post('lobby/'+id, payload);
}

async function requestStartGame(id) {
    let payload = {
        operation: 'start-game',
    }
    return await _post('game/'+id, payload);
}


async function requestNextDirection(id, player, direction) {
    let payload = {
        operation: 'set-next-direction',
        player: player,
        direction: direction,
    }
    return await _post('game/'+id, payload);
}

async function requestRunningInstant(id, player) {
    let payload = {
        operation: 'running-instant',
        player: player,
    }
    return await _post('game/'+id, payload);
}




export {
    requestNewGame,
    requestJoinGame,
    requestReadGameAndPing,
    addPlayerToGame,
    removePlayerFromGame,
    requestStartGame,
    requestNextDirection,
    requestRunningInstant,
}
