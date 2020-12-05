var express = require('express');

var GameService = require('../services/GameService');

var router = express.Router();

router.get('/', (req, res, next) => {
    const games = GameService.getHome();
    res.json({games: games});
});


router.post('/create/', (req, res, next) => {
    const config = req.body;
    const {id, lobby} = GameService.createGame(config);
    res.json({gameID: id, lobby: lobby});
});

router.get('/lobby/:id', (req, res, next) => {
    const reqId = req.params['id'];
    const {id, lobby, isGameStarted} = GameService.getGameLobby(reqId);
    res.json({gameID: id, lobby: lobby, gameStarted: isGameStarted});
});


router.post('/lobby/:id', (req, res, next) => {
    const reqId = req.params['id'];
    const options = req.body;
    const {id, lobby, isGameStarted} = GameService.updateGameLobby(reqId, options);
    res.json({gameID: id, lobby: lobby, gameStarted: isGameStarted});
});


router.post('/game/:id', (req, res, next) => {
    const reqId = req.params['id'];
    const options = req.body;
    const {id, lobby, gameInstant} = GameService.updateGameStatus(reqId, options);
    res.json({gameID: id, lobby: lobby, instant: gameInstant});
});

module.exports = router;
