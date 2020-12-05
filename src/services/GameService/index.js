
var GameManager = require('./obj/manager');

var gameManager = new GameManager();

const getHome = () => {
    console.log('Home called');
    return gameManager.showGames();
}

const createGame = (config) => {
    let id = gameManager.createGame(config);
    console.log(`New Game created with ID:${id}, config: ${JSON.stringify(config)}`);
    let game = gameManager.readGame(id);
    return {id: game && id, lobby: game && game.getLobby()}
}

const getGameLobby = (id) => {
    let game = gameManager.readGame(id);
    console.log(`Game Lobby ID:${id} called`);
    return {id: game && id, lobby: game && game.getLobby(), isGameStarted: game && game.started};
}

const updateGameLobby = (id, options) => {
    let game = gameManager.updateGame(id, options);
    console.log(`Game Lobby ID:${id} updated with:`+JSON.stringify(options));
    return {id: game && id, lobby: game && game.getLobby(), isGameStarted: game && game.started};
}

const updateGameStatus = (id, options) => {
    let game = gameManager.updateGame(id, options);
    console.log(`Running Game ID:${id} updated with:`+JSON.stringify(options));
    return {id: game && id, lobby: game && game.getLobby(), gameInstant: game && game.instant()};
}

module.exports = {
    getHome,
    createGame,
    getGameLobby,
    updateGameLobby,
    updateGameStatus,
}
