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
    updateVels(xVel, yVel) {
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
        // Then check one tile in the direction which pacman is going
        // if that tile is a wall, then reset pacman's velocity

        // Current position of pacman
        let currentPosition = createVector(this.x, this.y);

        // Remap current position to fit dimensions of 2D tile array
        currentPosition.x = currentPosition.x - (tiles[0][0].width / 2);
        currentPosition.x = currentPosition.x / tiles[0][0].width;

        currentPosition.y = currentPosition.y - (tiles[0][0].height / 2);
        currentPosition.y = currentPosition.y / tiles[0][0].height;

        // Position to check
        // need to check for velocity
        // if x vel is negative, need to use Math.ceil
        // if x vel is position, need to use Math.floor
        // same for y vels
        // this is to fix the bug of the pacman stopping one tile before the walls
        let positionToCheck = createVector(0, 0);
        if(this.xVel < 0) {
            positionToCheck.x = Math.ceil(currentPosition.x + this.xVel);
        } else {
            positionToCheck.x = Math.floor(currentPosition.x + this.xVel);
        }
        
        if(this.yVel < 0) {
            positionToCheck.y = Math.ceil(currentPosition.y + this.yVel);
        } else {
            positionToCheck.y = Math.floor(currentPosition.y + this.yVel);
        }

        // need to make sure that the position to check does not go out of index of tile object array
        if (positionToCheck.x < 0) {
            positionToCheck.x = 0;
        } else if (positionToCheck.x > tiles[0].length) {
            positionToCheck.x = tiles[0].length;
        }

        if (positionToCheck.y < 0) {
            positionToCheck.y = 0;
        } else if (positionToCheck.y > tiles.length) {
            positionToCheck.y = tiles.length;
        }

        // Now the position to check (which is now containing the row and col indexes of which tile to check for)
        // is found, get the part that is on that tile and check if it is a wall
        // if it is a wall, return false so that pacman stops moving
        // if it is not a wall, return true so that pacman continues moving
        console.log("");
        console.log("Current position: " + currentPosition);
        console.log("Position to check:" + positionToCheck);
        if (tiles[positionToCheck.y][positionToCheck.x].part.wall) {
            return false;

        } else {
            return true;

        }


    }

}