/**
 * File: Ghost.js
 * ---------------
 * Class for the ghost objects
 */

class Ghost {
    constructor(x, y, width) {
        // current position vector of ghost
        this.currentPosition = createVector(x, y);

        // width (diameter) of ghost
        this.width = width;

        // current direction vector which ghost moves
        this.currentDirection = createVector(-1, 0);

        // number of steps ghost takes to move from one tile to the next
        this.steps = 0;

        // speed (number of pixels) which ghost moves every frame
        this.speed = speed;

        // previous direction which ghost was moving
        this.prevDirection = createVector(this.direction.x, this.direction.y);

        // grid coordinates of the target tile (tile ghost are supposed to move towards)
        this.targetTileGridCoords = createVector(0, 0);
    }

    // function to display the ghost
    show() {
        fill(255, 0, 0);
        noStroke();
        ellipse(this.currentPosition.x, this.currentPosition.y, this.width);
    }

    // function to set the target tile of the ghost (get the grid coords of the target tile)

    // function to allow ghost to look in all four directions
    // receives the maze object
    // returns an array of tiles, each being the tile ahead for each of the directions

    // subsequently a function to handle the direction which the ghost should move
    // receives the array of tiles ahead of ghost for each direction
    // returns direction which ghost should move 

    // function which handles movement of ghost(function wrapping the functions above)

}