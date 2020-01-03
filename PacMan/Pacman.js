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

        // current direction vector which pacman moves
        this.currentDirection = createVector(-1, 0);

        // number of steps pacman takes to move from one tile to the next
        this.steps = 0;

        // speed (number of pixels) which pacman moves every frame
        this.speed = speed;

        // previous direction which pacman was moving
        this.prevDirection = createVector(this.currentDirection.x, this.currentDirection.y);

        // game score of pacman
        this.gameScore = 0;

        // fitness score of pacman
        this.fitnessScore = 0;
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
        }
        if (!this.hitsWall(maze)) {
            // update the previous direction vector
            this.prevDirection = createVector(this.currentDirection.x, this.currentDirection.y);

            // update current position of pacman
            this.currentPosition.x += this.currentDirection.x * this.speed;
            this.currentPosition.y += this.currentDirection.y * this.speed;
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
            this.currentDirection.x = xVel;
            this.currentDirection.y = yVel;
        }
    }

    // function to check if pacman hits a wall
    // receives the maze object 
    // returns boolean to determine is pacman hits a wall
    hitsWall(maze) {
        // Remap x,y coordinates to grid coordinates (row number and col number of current position of pacman)
        let currentGridCoords = maze.remap(this.currentPosition, this.currentDirection);

        // Now need to get the tile ahead of current position
        let tileAhead = this.lookAhead(currentGridCoords, this.currentDirection, maze);

        // if the tile that is ahead of pacman is a wall,
        // return true 
        if (tileAhead.part.wall) {
            return true;

        } else {
            return false;

        }
    }

    // function to allow pacman to look ahead one tile in the direction pacman is moving towards
    // receives the current grid coordinates vector object, 
    // the current direction vector object,
    // and maze object
    // returns the tile ahead in the direction pacman is moving towards
    lookAhead(currentGridCoords, currentDirection, maze) {
        // number of columns in the maze
        let numCols = maze.numCols;

        // number of rows in the maze
        let numRows = maze.numRows;

        let gridCoordsAhead = createVector(currentGridCoords.x, currentGridCoords.y);

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

        // return the tile ahead in the direction pacman is moving
        return maze.tiles[gridCoordsAhead.y][gridCoordsAhead.x];
    }

    // function to check if pacman has eaten a dot
    // receives the maze object 
    // return boolean to determine if pacman has eaten the dot
    eatenDot(maze) {
        // find the current position of pacman in grid coordinates
        let currentGridCoords = maze.remap(this.currentPosition, this.currentDirection);

        // find the tile pacman is currently on
        let currentTile = maze.tiles[currentGridCoords.y][currentGridCoords.x];

        // if the tile has a dot and it is not eaten, then return true
        if (currentTile.part.dot && !currentTile.eaten) {
            return true;
        } else {
            return false;
        }
    }

    // function to check if pacman has eaten a energizer
    // receives the maze object 
    // return boolean to determine if pacman has eaten the dot
    eatenEnergizer(maze) {
        // find the current position of pacman in grid coordinates
        let currentGridCoords = maze.remap(this.currentPosition, this.currentDirection);

        // find the tile pacman is currently on
        let currentTile = maze.tiles[currentGridCoords.y][currentGridCoords.x];

        // if the tile has a energizer and it is not eaten, then return true
        if (currentTile.part.energizer && !currentTile.eaten) {
            return true;
        } else {
            return false;
        }
    }

    // function to check if pacman is eating a ghost
    // receives ghost current position
    eatGhost(ghostCurrentPosition) {
        // if the distance between pacman and the ghost is less than the radius(half the width) of pacman
        // pacman is eating ghost
        // Note: the x,y coords of pacman / ghost are centre of circle
        if (dist(this.currentPosition.x, this.currentPosition.y,
            ghostCurrentPosition.x, ghostCurrentPosition.y) <= (this.width / 2)) {
            return true;
        } else {
            return false;
        }
    }

    // function to increment game score of pacman
    // receives points used to increment the game score
    incrementGameScore(points) {
        this.gameScore += points;
    }

    // function to calculate fitness score of pacman
    calculateFitness() {
        this.fitnessScore = this.gameScore ** 2;
    }

}