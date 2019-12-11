/**
 * File: Pacman.js
 * ------------------
 * Class for the pacman object  
 */

// Maximum number of steps pacman has to move from one tile to another
const MAX_STEPS = 16;

class Pacman {
    constructor(x, y, width, speed) {
        // current position vector of pacman
        this.currentPosition = createVector(x, y);

        // width (diameter) of pacman
        this.width = width;

        // direction vector which pacman moves
        this.direction = createVector(-1, 0);

        // number of steps pacman takes to move from one tile to the next
        this.steps = 0;

        // speed (number of pixels) which pacman moves every frame
        this.speed = speed;

        // previous direction which pacman was moving
        this.prevDirection = createVector(this.direction.x, this.direction.y);
    }

    // function to display the pacman
    show() {
        fill(255, 255, 0);
        noStroke();
        ellipse(this.currentPosition.x, this.currentPosition.y, this.width);
    }

    // function to make pacman move
    // receives the tile object array
    move(tiles) {
        // if pacman hits a wall, then have to check for difference between current and previous direction
        // if the current and previous direction are not the same
        // set the current direction to the previous direction
        if (this.hitsWall(tiles)) {
            if ((this.direction.x != this.prevDirection.x) && (this.direction.y != this.prevDirection.y)) {
                console.log("Changed to previous direction");

                this.direction.x = this.prevDirection.x;
                this.direction.y = this.prevDirection.y;
            }

        } else {
            // update the previous direction vector
            this.prevDirection = createVector(this.direction.x, this.direction.y);

            // update current position of pacman
            this.currentPosition.x += this.direction.x * this.speed;
            this.currentPosition.y += this.direction.y * this.speed;
            this.steps++;
            // reset steps when it hits 16 as pacman has to travel 16 pixels to move from one tile to the next
            if (this.steps == MAX_STEPS / this.speed) {
                this.steps = 0;
            }

        }
    }

    // function to update the x and y velocities to change direction which pacman moves
    // receives x velocity and y velocity which pacman is to move
    updateDirection(xVel, yVel) {
        // only if pacman is exactly on one tile, then update its direction
        if (this.steps == 0) {
            // need to update previous direction
            this.direction.x = xVel;
            this.direction.y = yVel;
        }
    }

    // function to check if pacman hits a wall
    // receives the tiles object array
    // returns boolean to determine is pacman hits a wall
    hitsWall(tiles) {
        // Number of rows of tiles array(maze)
        let numRows = tiles.length;

        // Number of cols of tiles array(maze)
        let numCols = tiles[0].length;

        // Width of a tile
        let tileWidth = tiles[0][0].width;

        // Height of a tile
        let tileHeight = tiles[0][0].height;

        // Remap x,y coordinates to grid coordinates (row number and col number of current position of pacman)
        let currentGridCoords = createVector(0, 0);
        currentGridCoords.x = this.currentPosition.x - (tileWidth / 2);

        if (this.direction.x < 0) {
            currentGridCoords.x = Math.ceil(currentGridCoords.x / tileWidth);
        } else {
            currentGridCoords.x = Math.floor(currentGridCoords.x / tileWidth);
        }

        currentGridCoords.y = this.currentPosition.y - (tileHeight / 2);

        if (this.direction.y < 0) {
            currentGridCoords.y = Math.ceil(currentGridCoords.y / tileHeight);
        } else {
            currentGridCoords.y = Math.floor(currentGridCoords.y / tileHeight);
        }

        // Now need to look one tile ahead of current position
        let gridCoordsAhead = currentGridCoords;

        gridCoordsAhead.x += this.direction.x;
        gridCoordsAhead.y += this.direction.y;

        // need to make sure that the grid coords does not go out of index of tile object array
        if (gridCoordsAhead.x < 0) {
            gridCoordsAhead.x = 0;
        } else if (gridCoordsAhead.x > numCols - 1) {
            gridCoordsAhead.x = numCols - 1;
        }

        if (gridCoordsAhead.y < 0) {
            gridCoordsAhead.y = 0;
        } else if (gridCoordsAhead.y > numRows - 1) {
            gridCoordsAhead.y = numRows - 1;
        }

        // if the tile that is ahead of pacman is a wall,
        // return true 
        if (tiles[gridCoordsAhead.y][gridCoordsAhead.x].part.wall) {
            return true;

        } else {
            return false;

        }
    }

}