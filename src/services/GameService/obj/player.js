
class Player {
    constructor(player) {
        this.name = player.name;
        this.color = player.color;
        this.timeout = 10;

        this.currentDirection = undefined; // 'Up' or 'Down' or 'Left' or 'Right'
        this.nextDirection = undefined;

        this.body = [];
        this.previousBody = [];
        this.foodEaten = 0;
        this.alive = true;
        this.health = 100;

    }

    move() {

        if (!this.alive) { return; }

        if (!this.nextDirection || areDirectionsOpposites(this.nextDirection, this.currentDirection)) {
            this.nextDirection = this.currentDirection;
        }
        let nextPoint = { ...this.body[0] };
        switch (this.nextDirection) {
            case 'Up':
                nextPoint.x -= 1;
                break;
            case 'Down':
                nextPoint.x += 1;
                break;
            case 'Left':
                nextPoint.y -= 1;
                break;
            case 'Right':
                nextPoint.y += 1;
                break;
            default:
                break;
        }

        let lastIndex;
        if (this.foodEaten > 0) {
            this.foodEaten -= 1;
            this.health = 100;
        } else {
            lastIndex = -1;
            this.health -= 1;
        }
        this.previousBody = this.body;
        this.body = [nextPoint, ...this.body.slice(0, lastIndex)]
    }

    die() {
        this.body = this.previousBody;
        this.alive = false;
    }
}

function areDirectionsOpposites(d1, d2) {
    if (d1 === 'Up' && d2 === 'Down') {
        return true;
    } else if (d2 === 'Up' && d1 === 'Down') {
        return true;
    } else if (d1 === 'Left' && d2 === 'Right') {
        return true;
    } else if (d2 === 'Left' && d1 === 'Right') {
        return true;
    } else {
        return false
    }
}

module.exports = Player;
