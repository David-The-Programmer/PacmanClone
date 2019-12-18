/**
 * File: Pinky.js
 * ----------------
 * Class for the ghost Pinky
 * 
 * Inherits from ghost class
 */

class Pinky extends Ghost {
    constructor(x, y, width, speed) {
        super(x, y, width, speed);
    }

    // function to calculate and return target tile coords of chase mode for Pinky
    // receives pacman object and the maze object for calculation
    getChaseTargetTileCoords(pacman, maze) {
        // Need to get grid coords of pacman
        let pacmanGridCoords = maze.remap(pacman.currentPosition, pacman.currentDirection);

        // Now look 4 tiles ahead of current target tile coords
        let targetTile = super.lookAhead(pacmanGridCoords, p5.Vector.mult(pacman.currentDirection, 4), maze);

        // return the coordinates of target tile
        return createVector(targetTile.x +(targetTile.width / 2), targetTile.y +(targetTile.height / 2));

    }

    // function to handle the modes for Pinky
    handleMode(pacman, maze) {
        // get the new target tile coords
        let chaseTargetTileCoords = this.getChaseTargetTileCoords(pacman, maze);

        super.handleMode(chaseTargetTileCoords);
    }


    show() {
        // if the pinky is in eaten mode
        // set the pinky to be translucent
        if (this.mode.eaten) {
            fill(255, 184, 255, 30);

            // if the pinky is in frightened mode
            // set the pinky to be blue
        } else if (this.mode.frightened) {
            fill(0, 0, 255);

        } else {
            // if the pinky is in either scatter or chase mode, just put to pink (original colour)
            fill(255, 184, 255);
        }
        noStroke();
        ellipse(this.currentPosition.x, this.currentPosition.y, this.width);
        // target point
        fill(255, 0, 0);
        ellipse(this.targetTileCoords.x, this.targetTileCoords.y, this.width / 2);
    }
}