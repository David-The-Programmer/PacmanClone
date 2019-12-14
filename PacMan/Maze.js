/**
 * File: Maze.js
 * -------------
 * Class for the Maze object which consists of many tiles
 */
class Maze {
    constructor(numRows, numCols, tileWidth, tileHeight, tileRep) {
        // Number of rows of tiles in the maze
        this.numRows = numRows;

        // Number of cols of tiles in the maze
        this.numCols = numCols;

        // Width of a single tile in the maze
        this.tileWidth = tileWidth;

        // Height of a single tile in the maze
        this.tileHeight = tileHeight;

        // 2D array to store all the tiles
        this.tiles = [];

        // Init the tiles in the maze
        for (let row = 0; row < this.numRows; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < this.numCols; col++) {
                // set the parts that are going to be on each tile according to tileRep
                let part = tileRep[row][col];

                // Init new tile for each element in tiles array
                this.tiles[row][col] = new Tile(col * this.tileWidth, row * this.tileHeight, this.tileWidth, this.tileHeight);
                // 1 = wall
                // 0 = dot
                // 8 = energizer
                // 6 = blank space
                if (part == 1) {
                    this.tiles[row][col].part.wall = true;

                } else if (part == 0) {
                    this.tiles[row][col].part.dot = true;

                } else if (part == 8) {
                    this.tiles[row][col].part.energizer = true;

                } else if (part == 6) {
                    this.tiles[row][col].part.space = true;
                }
            }
        }
    }

    // function to show all the dots on the maze
    showDots() {
        // row x col
        for (let i = 0; i < this.numRows; i++) {
            for (let j = 0; j < this.numCols; j++) {
                this.tiles[i][j].showDot();
            }
        }
    }

    // function to remove a dot from a specific tile in the maze
    // receives the grid coordinates of the tile which contains the dot / energizer to remove
    removeDot(dotGridCoords) {
        this.tiles[dotGridCoords.y][dotGridCoords.x].removeDot();
    }

}