const Player = require("./player");

class Game {
    constructor(id, index, config) {
        this.id = id;
        this.index = index;
        this.boardSize = config.boardSize;
        this.players = [];
        this.foodPoints = [];
        this.foodDelay = 0;

        this.allowLateJoin = config.allowLateJoin;
        this.started = false;
        this.finished = false;
        this.gameSpeed = config.timeStep;
        this.gameRunner = undefined;

        this.timeout = 10;
    }

    resetTimeout() {
        this.timeout = 10;
    }

    resetFoodDelay() {
        this.foodDelay = 3;
    }

    getLobby() {
        return this.players;
    }

    findPlayerIndex(player) {
        // let possiblePlayers = this.players.filter(pl => { (pl.name === player.name ) || (pl.color === player.color) });
        // if (possiblePlayers.length !== 1) {
        //     return null;
        // }
        return this.players.findIndex(pl => { return (pl.name === player.name) || (pl.color === player.color) });
    }

    addPlayer(player) {
        if (this.started && !this.allowLateJoin) { return false; }
        if (this.findPlayerIndex(player) > -1) { return false; }
        let newPlayer = new Player(player);
        const deactivator = setInterval(() => {
            newPlayer.timeout -= 1;
            if (newPlayer.timeout <= 0) {
                this.removePlayer(player);
                clearInterval(deactivator);
            }
        }, 3000);
        this.players = [...this.players, newPlayer];
        return true;
    }

    removePlayer(player) {
        let playerIndex = this.findPlayerIndex(player);
        if (playerIndex > -1) {
            delete this.players[playerIndex];
            this.players.splice(playerIndex, 1);
            return true;
        } else { return false; }
    }

    pingPlayer(player) {
        let playerIndex = this.findPlayerIndex(player);
        if (playerIndex >= 0 && playerIndex < this.players.length) {
            this.players[playerIndex].timeout = 10;
        }
        return true;
    }

    start() {
        this.initializeSnakeHeads();
        try {
            const delayedRunner = () => {
                this.gameRunner = setInterval(() => this.runStep(), this.gameSpeed);
            }
            this.started = true;

            setTimeout(delayedRunner, 3000)
            console.log(`Game ID:${this.id} started!`)
            return true;
        } catch {
            return false;
        }
    }

    setDirection(player, direction) {
        let playerIndex = this.findPlayerIndex(player);
        if (playerIndex > -1) {

            this.players[playerIndex].nextDirection = direction;

            return true;
        } else { return false; }
    }

    instant() {
        if (!this.started) return null;

        return {
            status: this.finished ? 'Game Finished':'Game Running' ,            
            size: this.boardSize,
            snakes: this.players.map(player => {return {
                body: player.body,
                name : player.name,
                color: player.color,
                alive: player.alive,
                health: player.health,
                }}),
            // [
            //     {
            //         body: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 3 }],
            //         color: 'red',
            //         alive: true,
            //     },
            //     {
            //         body: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 4, y: 2 }],
            //         color: 'blue',
            //         alive: true,
            //     },
            //     {
            //         body: [{ x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 6, y: 2 }],
            //         color: 'green',
            //         alive: false,
            //     }
            // ],
            food: this.foodPoints,
            // [
            //     { x: 2, y: 0 },
            //     { x: 0, y: 2 },
            // ]
        }
    }

    initializeSnakeHeads() {
        let occHeads = [];
        this.players.forEach(player => {
            let tempPoint;
            do {
                tempPoint = {x: getRndInteger(1, this.boardSize-1), y: getRndInteger(0, this.boardSize-1)};
            } while( occHeads.some(pt => (tempPoint.x === pt.x && tempPoint.y === pt.y)))
            player.body = [tempPoint];
            player.nextDirection = 'Up';
            player.foodEaten = 2;
            occHeads.push(tempPoint);
        });
    }



    runStep() {
        
        // Move snakes and note their bodies
        let occPts = [];
        let headsAndLengths = [];
        this.players.filter(player => player.alive).map(player => {
                player.move();
                headsAndLengths.push([player.body[0], player.body.length]);
                player.body.slice(1, undefined).map(point => occPts.push(point));
        });

        // Snake collisions and deaths
        this.players.filter(player => player.alive).map(player => {
            let head = player.body[0];
            let length = player.body.length;
            if (player.health <= 0) { // Health zeroed
                player.die()
            } else if (head.x < 0 || head.y < 0 || head.x >= this.boardSize || head.y >= this.boardSize) { // Out of board
                player.die();
            } else if (occPts.filter(pt => (head.x === pt.x && head.y === pt.y)).length > 0) { // Collision with other snake's body
                player.die();
            } else {
                for (let [otherHead, otherLength] in headsAndLengths) { // Collision with other snake's head
                    if (head !== otherHead && head.x === otherHead.x && head.y === otherHead.y && length <= otherLength) {
                        player.die();
                        break;
                    }
                }
            }
        })

        // Check for game completion
        let alivePlayers = this.players.filter(player => player.alive)
        if (alivePlayers.length <= 1) {
            this.finished = true;
            clearInterval(this.gameRunner);
            return;
        }

        // Eat food
        this.players.filter(player => player.alive).forEach(player => {
            let head = player.body[0];

            let fpi = this.foodPoints.findIndex(fp => { return (head.x === fp.x && head.y === fp.y) });
            if (fpi > -1) {
                this.foodPoints.splice(fpi, 1);
                player.foodEaten += 1;
            }
        })

        // Generate new food
        if (this.foodDelay == 0) {

            let availablePoints = [...Array(this.boardSize)].map((valx, r) => [...Array(this.boardSize)].map((valy, c) => { return {x:r, y:c}}));
            this.players.filter(player => player.alive).forEach(player => {
                player.body.map(point => {delete availablePoints[point.x][point.y]});
            });
            this.foodPoints.map(point => {delete availablePoints[point.x][point.y]});
    
            let avPts = [];
            availablePoints.forEach( (row, x) => { row.forEach( (point, y) => {
                if (point) {
                    avPts.push(point);
                }
            })});
            this.foodPoints.push( avPts[Math.floor(Math.random() * avPts.length)] );

            this.resetFoodDelay();
        } else {
            this.foodDelay -= 1;
        }

        // let matrix = [...Array(this.boardSize)].map(() => [...Array(this.boardSize)].map(() => new CellType()));
    }

    toString() {
        return `Game: { Size: ${this.boardSize}, ID: ${this.id}, Index: ${this.index} Timeout: ${this.timeout}}`;
    }
}


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

module.exports = Game;
