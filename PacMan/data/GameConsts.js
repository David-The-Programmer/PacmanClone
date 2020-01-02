/**
 * File: GameConsts.js 
 * --------------------
 * Object to store all the game constants
 */
class GameConsts {
    constructor() {
        // Width of the canvas
        this.CANVAS_WIDTH = 448;

        // Height of the canvas
        this.CANVAS_HEIGHT = 496;

        // Number of rows of tiles
        this.NUM_ROWS_TILES = 31;

        // Number of columns of tiles
        this.NUM_COLS_TILES = 28;

        // Width of the tile
        this.TILE_WIDTH = this.CANVAS_WIDTH / this.NUM_COLS_TILES;

        // Height of the tile
        this.TILE_HEIGHT = this.CANVAS_HEIGHT / this.NUM_ROWS_TILES;

        // Width of the Pac-Man
        this.PACMAN_WIDTH = 20;

        // Speed of the Pac-Man
        this.PACMAN_SPEED = 2;

        // Starting x position of pacman
        this.START_X_PACMAN = (13 * this.TILE_WIDTH) + (this.TILE_WIDTH / 2);

        // Starting y position of pacman
        this.START_Y_PACMAN = (23 * this.TILE_HEIGHT) + (this.TILE_HEIGHT / 2);

        // Width of the ghost
        this.GHOST_WIDTH = this.PACMAN_WIDTH;

        // Speed of the ghost
        this.GHOST_SPEED = this.PACMAN_SPEED;

        // Starting x position of ghost
        this.START_X_GHOST = (13 * this.TILE_WIDTH) + (this.TILE_WIDTH / 2);

        // Starting y position of ghost
        this.START_Y_GHOST = (11 * this.TILE_HEIGHT) + (this.TILE_HEIGHT / 2);

        // x coordinates of target tile for scatter mode for Blinky(red)
        this.BLINKY_SCATTER_X_TARGET = ((this.NUM_COLS_TILES - 1) * this.TILE_WIDTH) + (this.TILE_WIDTH / 2);

        // y coordinates of target tile for scatter mode for Blinky(red)
        this.BLINKY_SCATTER_Y_TARGET = this.TILE_HEIGHT / 2;

        // x coordinates of target tile for scatter mode for Pinky(pink)
        this.PINKY_SCATTER_X_TARGET = this.TILE_WIDTH / 2;

        // y coordinates of target tile for scatter mode for Pinky(pink)
        this.PINKY_SCATTER_Y_TARGET = this.TILE_HEIGHT / 2;

        // x coordinates of target tile for scatter mode for Inky(turquoise)
        this.INKY_SCATTER_X_TARGET = ((this.NUM_COLS_TILES - 1) * this.TILE_WIDTH) + (this.TILE_WIDTH / 2);

        // y coordinates of target tile for scatter mode for Inky(turquoise)
        this.INKY_SCATTER_Y_TARGET = ((this.NUM_ROWS_TILES - 1) * this.TILE_HEIGHT) + (this.TILE_HEIGHT / 2);

        // x coordinates of target tile for scatter mode for Clyde(orange)
        this.CLYDE_SCATTER_X_TARGET = this.TILE_WIDTH / 2;

        // y coordinates of target tile for scatter mode for Clyde(orange)
        this.CLYDE_SCATTER_Y_TARGET = ((this.NUM_ROWS_TILES - 1) * this.TILE_HEIGHT) + (this.TILE_HEIGHT / 2);
    }
}