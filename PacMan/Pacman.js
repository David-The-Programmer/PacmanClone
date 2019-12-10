/**
 * File: Pacman.js
 * ------------------
 * Class for the pacman object  
 */
class Pacman {
    constructor(x, y, width) {
        // x coordinate of pacman
        this.x = x;

        // y coordinate of pacman
        this.y = y;

        // width (diameter) of pacman
        this.width = width;

        // X velocity of the pacman
        this.xVel = -1;

        // Y velocity of pacman
        this.yVel = 0;
    }

    // function to display the pacman
    show() {
        fill(255, 255, 0);
        noStroke();
        ellipse(this.x, this.y, this.width);
    }

    // function to make pacman move
    move() {
        this.x += this.xVel;
        this.y += this.yVel;
    }

    // function to update the x and y velocities to change direction which pacman moves
    // receives x velocity and y velocity which pacman is to move
    direction(xVel, yVel) {
        this.xVel = xVel;
        this.yVel = yVel;
    }

    // function to reset the x and y velocites of pacman
    // used when pacman reaches a wall
    resetVels() {
        this.xVel = 0;
        this.yVel = 0;
    }

    // function to check if pacman can move (to see if there is a wall in the direction pacman is moving in)
    // receives the 2D array of tile objects
    // returns boolean if pacman can move forward or not
    checkPosition(tiles) {
        // I need the tiles to see where is a wall
        // I need to convert pacman's current position to scale with the dimensions of the tile objects array
        // (to get index)
        // The above is to know which tile pacman is in
        // If the tile the pacman is on is a wall, 
        // Reposition pacman in the opposite direction pacman was moving in by one tile

        // Current position of pacman
        let currentPosition = createVector(this.x, this.y);

        // Remap current position to fit dimensions of 2D tile array
        currentPosition.x = currentPosition.x - (tiles[0][0].width / 2);
        if (this.xVel < 0) {
            currentPosition.x = Math.ceil(currentPosition.x / tiles[0][0].width);
        } else {
            currentPosition.x = Math.floor(currentPosition.x / tiles[0][0].width);
        }

        currentPosition.y = currentPosition.y - (tiles[0][0].height / 2);
        if (this.yVel < 0) {
            currentPosition.y = Math.ceil(currentPosition.y / tiles[0][0].width);
        } else {
            currentPosition.y = Math.floor(currentPosition.y / tiles[0][0].width);
        }


        // need to make sure that the current position does not go out of index of tile object array
        if (currentPosition.x < 0) {
            currentPosition.x = 0;
        } else if (currentPosition.x > tiles[0].length) {
            currentPosition.x = tiles[0].length;
        }

        if (currentPosition.y < 0) {
            currentPosition.y = 0;
        } else if (currentPosition.y > tiles.length) {
            currentPosition.y = tiles.length;
        }

        // if the tile pacman is on is a wall, reposition pacman one tile before the wall
        // return false so that pacman stops moving
        // if it is not a wall, return true so that pacman continues moving
        console.log("");
        console.log("Current position: " + currentPosition);
        if (tiles[currentPosition.y][currentPosition.x].part.wall) {
            return false;

        } else {
            return true;

        }


    }

}