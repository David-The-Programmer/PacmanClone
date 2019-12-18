/**
 * File: Inky.js
 * ----------------
 * Class for the ghost Inky
 * 
 * Inherits from ghost class
 */

class Inky extends Ghost {
    constructor(x, y, width, speed) {
        super(x, y, width, speed);
    }

    // function to calculate and return target tile coords of chase mode for Inky
    // receives pacman object, the maze object and the ghost blinky
    getChaseTargetTileCoords(pacman, maze, blinky) {
        // Need to get grid coords of pacman
        let pacmanGridCoords = maze.remap(pacman.currentPosition, pacman.currentDirection);

        // Now look 2 tiles ahead of current target tile coords
        let intermediateTile = super.lookAhead(pacmanGridCoords, p5.Vector.mult(pacman.currentDirection, 2), maze);

        // point of rotation
        let pointOfRotation = createVector(intermediateTile.x + (intermediateTile.width / 2), intermediateTile.y + (intermediateTile.height / 2));

        // blinky's current position
        let blinkyPosition = createVector(blinky.currentPosition.x, blinky.currentPosition.y);

        // shift the point of origin to point of rotation
        push();
        translate(pointOfRotation.x, pointOfRotation.y);
        // rotate blinky's current position by 180 degrees (PI)
        blinkyPosition.rotate(Math.PI);
        pop();

        // return the coordinates of target tile
        return blinkyPosition;

    }

    // function to handle the modes for Inky
    // overides ghost handleMode method
    handleMode(pacman, maze, blinky) {
        // get the new target tile coords
        let chaseTargetTileCoords = this.getChaseTargetTileCoords(pacman, maze, blinky);

        super.handleMode(chaseTargetTileCoords);
    }
    // function to show Inky 
    // overrides ghost.show()
    show() {
        // if the inky is in eaten mode
        // set the inky to be translucent
        if (this.mode.eaten) {
            fill(0, 255, 255, 30);

            // if the inky is in frightened mode
            // set the inky to be blue
        } else if (this.mode.frightened) {
            fill(0, 0, 255);

        } else {
            // if the inky is in either scatter or chase mode, just put to aqua (original colour)
            fill(0, 255, 255);
        }
        noStroke();
        ellipse(this.currentPosition.x, this.currentPosition.y, this.width);
        // target point
        fill(0, 255, 255);
        ellipse(this.targetTileCoords.x, this.targetTileCoords.y, this.width / 2);
    }
}