/**
 * File: Tile.js
 * ---------------
 * Class for the tile objects in the maze
 * each tile is part of the maze
 * Maze comprises of many many tiles
 */

// The width of the dots
const DOT_WIDTH = 3;

// The width of the energizers(big dots)
const ENERGIZER_WIDTH = DOT_WIDTH * 4;

class Tile {
    constructor(x, y, width, height) {
        // x position of the tile object (center of tile)
        this.x = x;

        // y position of the tile object (center of tile)
        this.y = y;

        // width of the tile object
        this.width = width;

        // height of the tile object
        this.height = height;

        // boolean to determine which parts of the maze(wall, dot, sapce, energizer) is on the tile
        this.part = {
            wall: false,
            dot: false,
            space: false,
            energizer: false
        };

        // boolean to determine of the dot / energizer(big dot) is eaten or not
        this.eaten = false;

    }

    // function to draw dots / energizers on the tile (as per type)
    // the walls and blank space would be already be drawn by the background map image
    showDots() {
        // if the tile has a small dot (dot still not eaten)
        // show it
        if (this.part.dot && !this.eaten) {
            fill(255, 255, 0);
            noStroke();
            ellipse(this.x + (this.width / 2), this.y + (this.height / 2), DOT_WIDTH);

            // if the tile has an energizer(large dot) and it is not eaten
            // show it
        } else if (this.part.energizer && !this.eaten) {
            fill(255, 255, 0);
            noStroke();
            ellipse(this.x + (this.width / 2), this.y + (this.height / 2), ENERGIZER_WIDTH);
        }
    }

}