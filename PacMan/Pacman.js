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
    // receives the maze object
    move(maze) {
        // if pacman hits a wall in the current direction he is moving in, 
        // set the current direction to the previous direction
        // if pacman hits a wall in the previous direction he was moving in,
        // he has truly hit a wall, thus he should stop moving.
        // if pacman does not hit a wall in the previous direction he was moving in,
        // pacman should continue moving in the previous direction
        // this is so that pacman would continue moving if pacman is in between parallel walls
        // and pacman is trying to move towards the walls
        if (this.hitsWall(maze)) {
            this.updateDirection(this.prevDirection.x, this.prevDirection.y);
            if (!this.hitsWall(maze)) {

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
    // receives the maze object 
    // returns boolean to determine is pacman hits a wall
    hitsWall(maze) {
        // Number of rows of tiles array(in the maze)
        let numRows = maze.numRows;

        // Number of cols of tiles array(in the maze)
        let numCols = maze.numCols;

        // Width of a tile
        let tileWidth = maze.tileWidth;

        // Height of a tile
        let tileHeight = maze.tileHeight;

        // Remap x,y coordinates to grid coordinates (row number and col number of current position of pacman)
        let currentGridCoords = this.remap(this.currentPosition, tileWidth, tileHeight);

        // Now need to look one tile ahead of current position
        // let gridCoordsAhead = currentGridCoords;
        let gridCoordsAhead = this.lookAhead(currentGridCoords, this.direction, numCols, numRows);

        // if the tile that is ahead of pacman is a wall,
        // return true 
        if (maze.tiles[gridCoordsAhead.y][gridCoordsAhead.x].part.wall) {
            return true;

        } else {
            return false;

        }
    }

    // function to remap normal x,y coordinates of pacman's position to grid coordinates (col and row number)
    // receives the current x, y coordinates vector object, width and height of a tiles 
    // returns the grid coordinates of the current position of pacman
    remap(currentPosition, tileWidth, tileHeight) {
        let currentGridCoords = createVector(0, 0);
        currentGridCoords.x = currentPosition.x - (tileWidth / 2);

        if (this.direction.x < 0) {
            currentGridCoords.x = Math.ceil(currentGridCoords.x / tileWidth);
        } else {
            currentGridCoords.x = Math.floor(currentGridCoords.x / tileWidth);
        }

        currentGridCoords.y = currentPosition.y - (tileHeight / 2);

        if (this.direction.y < 0) {
            currentGridCoords.y = Math.ceil(currentGridCoords.y / tileHeight);
        } else {
            currentGridCoords.y = Math.floor(currentGridCoords.y / tileHeight);
        }

        return currentGridCoords;
    }

    // function to allow pacman to look ahead one tile in the direction pacman is moving towards
    // receives the current grid coordinates vector object, 
    // the current direction vector object,
    // number of rows and number of cols of tiles array(maze)
    // returns the grid coordinates of the tile ahead in the direction pacman is moving towards
    lookAhead(currentGridCoords, currentDirection, numCols, numRows) {

        let gridCoordsAhead = currentGridCoords;

        gridCoordsAhead.x += currentDirection.x;
        gridCoordsAhead.y += currentDirection.y;

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

        return gridCoordsAhead;
    }

    // function to check if pacman has eaten a dot
    // receives the maze object 
    // return boolean to determine if pacman has eaten the dot
    eatenDot(maze) {
        // Width of a tile
        let tileWidth = maze.tileWidth;

        // Height of a tile
        let tileHeight = maze.tileHeight;

        // find the current position of pacman in grid coordinates
        let currentGridCoords = this.remap(this.currentPosition, tileWidth, tileHeight);

        // find the tile pacman is currently on
        let currentTile = maze.tiles[currentGridCoords.y][currentGridCoords.x];

        // if the tile has a dot, then return true
        if (currentTile.part.dot) {
            return true;
        } else {
            return false;
        }
    }

    // function to check if pacman has eaten a energizer
    // receives the maze object 
    // return boolean to determine if pacman has eaten the dot
    eatenEnergizer(maze) {
        // Width of a tile
        let tileWidth = maze.tileWidth;

        // Height of a tile
        let tileHeight = maze.tileHeight;

        // find the current position of pacman in grid coordinates
        let currentGridCoords = this.remap(this.currentPosition, tileWidth, tileHeight);

        // find the tile pacman is currently on
        let currentTile = maze.tiles[currentGridCoords.y][currentGridCoords.x];

        // if the tile has a energizer, then return true
        if (currentTile.part.energizer) {
            return true;
        } else {
            return false;
        }
    }

}