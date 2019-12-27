/**
 * File: Clyde.js
 * ----------------
 * Class for the ghost Clyde
 * 
 * Inherits from ghost class
 */

class Clyde extends Ghost {
    constructor(x, y, width, speed) {
        super(x, y, width, speed);
    }

    // function to find the number of tiles between pacman and clyde
    // receives pacman object and the maze object for calculation
    // returns the number of tiles between pacman and clyde
    getNumTilesBtwnPacAndClyde(pacman, maze) {
        // Need to get grid coords of pacman
        let pacmanGridCoords = maze.remap(pacman.currentPosition, pacman.currentDirection);

        // Need to get grid coords of clyde
        let clydeGridCoords = maze.remap(this.currentPosition, this.currentDirection);

        // Find euclidean distance between pacman and clyde (which will be the number of tiles between them)
        let eucDist = dist(pacmanGridCoords.x, pacmanGridCoords.y, clydeGridCoords.x, clydeGridCoords.y);

        return eucDist;

    }

    // function to handle the modes for Clyde
    // overides ghost handleMode method
    handleMode(pacman, maze) {
        // Get the number of tiles between Clyde and pacman
        let numTilesBtwnPacAndClyde = this.getNumTilesBtwnPacAndClyde(pacman, maze);

        // the target tile of chase mode for clyde
        let chaseTargetTileCoords;

        // if the number of tiles is >= 8, then set the chase target tile coordinates to pacman's position
        if (numTilesBtwnPacAndClyde >= 8) {
            chaseTargetTileCoords = createVector(pacman.currentPosition.x, pacman.currentPosition.y);
        } else {
            // else set the chase target tile coordinates to scatter mode target tile coordinates
            chaseTargetTileCoords = createVector(this.scatterModeTargetTileCoords.x, this.scatterModeTargetTileCoords.y);
        }

        super.handleMode(chaseTargetTileCoords);
    }

    // function to show Clyde
    // overrides ghost.show()
    show() {
        // if the Clyde is in eaten mode
        // set the Clyde to be translucent
        if (this.mode.eaten) {
            fill(255, 184, 82, 30);

            // if the Clyde is in frightened mode
            // set the Clyde to be blue
        } else if (this.mode.frightened) {
            fill(0, 0, 255);

        } else {
            // if the Clyde is in either scatter or chase mode, just put to pink (original colour)
            fill(255, 184, 82);
        }
        noStroke();
        ellipse(this.currentPosition.x, this.currentPosition.y, this.width);
    }
}