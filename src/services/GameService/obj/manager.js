
const Game = require('./game');

// console.log(Buffer.from('0').toString('base64'));
const encode = (dec_id) => Buffer.from(String(dec_id)).toString('base64');
const decode = (enc_id) => Buffer.from(String(enc_id), 'base64').toString();

class GameManager {
    constructor() {
        this.size = 64;
        this.games = new Array(this.size);
        this.gameCount = 0;
        this.nextGameIndex = 0;

    }

    showGames() {
        return this.games.filter(game => game !== undefined).map(game => game.toString());
    }

    getNewGameIndex() {
        let currGameIndex = null;
        while (true) {
            if (this.gameCount === this.size) {
                break;
            } else if (this.games[this.nextGameIndex] === undefined) {
                currGameIndex = this.nextGameIndex;
                this.nextGameIndex = (this.nextGameIndex + 1) % this.size;
                break;
            } else {
                this.nextGameIndex = (this.nextGameIndex + 1) % this.size;
            }
        }
        return currGameIndex;
    }

    createGame(config) {
        config = config || {};
        let gameIndex = this.getNewGameIndex();
        if (gameIndex !== null) {
            this.gameCount += 1;
            let id = encode(gameIndex);
            this.games[gameIndex] = new Game(id, gameIndex, config);
            console.log(this.games[gameIndex].toString());

            const deactivator = setInterval(() => {
                this.games[gameIndex].timeout -= 1;
                if (this.games[gameIndex].timeout <= 0) {
                    this.deleteGame(gameIndex);
                    clearInterval(deactivator);
                }
            }, 3000);
            return id;
        }
        else {
            return null;
        }
    }

    readGame(id) {
        let index = decode(id);
        if (index < 0 || index > this.size || this.games[index] === undefined) {
            return null;
        }
        let game = this.games[index];
        game.resetTimeout();
        return game;

    }

    updateGame(id, options) {
        options = options || {};
        let game = this.readGame(id);

        if (!game || !options.operation) {
            return null;
        }


        if (options.operation === 'add-player') {
            return game.addPlayer(options.player) ? game : null;
        } else if (options.operation === 'remove-player') {
            return game.removePlayer(options.player) ? game : null;
        } else if (options.operation === 'ping') {
            return game.pingPlayer(options.player) ? game : null;
        } else if (options.operation === 'start-game') {
            return game.start() ? game : null;
        } else if (options.operation === 'set-next-direction') {
            return game.setDirection(options.player, options.direction) ? game : null;
        } else if (options.operation === 'running-instant') {
            return game.pingPlayer(options.player) ? game : null;
        } else {
            return null;
        }
    }

    deleteGame(index) {
        delete this.games[index];
        this.gameCount -= 1;
        return true;
    }
}

module.exports = GameManager;
