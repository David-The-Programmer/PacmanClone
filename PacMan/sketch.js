/**
 * File: Sketch.js 
 * --------------------
 * Main program for the PacMan game
 */

// Width of the canvas
const CANVAS_WIDTH = 448;

// Height of the canvas
const CANVAS_HEIGHT = 496;

// canvas object
// 

// Number of rows of tiles
const NUM_ROWS_TILES = 31;

// Number of columns of tiles
const NUM_COLS_TILES = 28;

// Width of the tile
const TILE_WIDTH = CANVAS_WIDTH / NUM_COLS_TILES;

// Height of the tile
const TILE_HEIGHT = CANVAS_HEIGHT / NUM_ROWS_TILES;

// Width of the Pac-Man
const PACMAN_WIDTH = 20;

// Speed of the Pac-Man
const PACMAN_SPEED = 2;

// Starting x position of pacman
const START_X_PACMAN = (13 * TILE_WIDTH) + (TILE_WIDTH / 2);

// Starting y position of pacman
const START_Y_PACMAN = (23 * TILE_HEIGHT) + (TILE_HEIGHT / 2);

// Width of the ghost
const GHOST_WIDTH = PACMAN_WIDTH;

// Speed of the ghost
const GHOST_SPEED = PACMAN_SPEED;

// Starting x position of ghost
const START_X_GHOST = (13 * TILE_WIDTH) + (TILE_WIDTH / 2);

// Starting y position of ghost
const START_Y_GHOST = (11 * TILE_HEIGHT) + (TILE_HEIGHT / 2);

// x coordinates of target tile for scatter mode for Blinky(red)
const BLINKY_SCATTER_X_TARGET = ((NUM_COLS_TILES - 1) * TILE_WIDTH) + (TILE_WIDTH / 2);

// y coordinates of target tile for scatter mode for Blinky(red)
const BLINKY_SCATTER_Y_TARGET = TILE_HEIGHT / 2;

// x coordinates of target tile for scatter mode for Pinky(pink)
const PINKY_SCATTER_X_TARGET = TILE_WIDTH / 2;

// y coordinates of target tile for scatter mode for Pinky(pink)
const PINKY_SCATTER_Y_TARGET = TILE_HEIGHT / 2;

// x coordinates of target tile for scatter mode for Inky(turquoise)
const INKY_SCATTER_X_TARGET = ((NUM_COLS_TILES - 1) * TILE_WIDTH) + (TILE_WIDTH / 2);

// y coordinates of target tile for scatter mode for Inky(turquoise)
const INKY_SCATTER_Y_TARGET = ((NUM_ROWS_TILES - 1) * TILE_HEIGHT) + (TILE_HEIGHT / 2);

// x coordinates of target tile for scatter mode for Clyde(orange)
const CLYDE_SCATTER_X_TARGET = TILE_WIDTH / 2;

// y coordinates of target tile for scatter mode for Clyde(orange)
const CLYDE_SCATTER_Y_TARGET = ((NUM_ROWS_TILES - 1) * TILE_HEIGHT) + (TILE_HEIGHT / 2);

// Maze object to store all info about the 2D array of tiles
let maze;

// tile representation
let tileRep;

// Maze image 
let mazeImg;

// Pac-Man object
let pacman;

// Ghost blinky
let blinky;

// Ghost pinky
let pinky;

// Ghost inky
let inky;

// Array to store all four ghost
let ghosts = [];

function preload() {
    // load the maze image
    mazeImg = loadImage("./assets/map.jpg");

    // load the tile representation data
    // need to import the tile representation(contains info of which parts are on which tile)
    // it is a 31 x 28 2D array 
    // 1 = wall
    // 0 = dot
    // 8 = energizer
    // 6 = blank space
    tileRep = loadJSON("./data/tileRep.json");
}


function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    // init the maze
    maze = new Maze(NUM_ROWS_TILES, NUM_COLS_TILES, TILE_WIDTH, TILE_HEIGHT, tileRep);

    // Init the pacman
    pacman = new Pacman(START_X_PACMAN, START_Y_PACMAN, PACMAN_WIDTH, PACMAN_SPEED);

    // init blinky
    blinky = new Ghost(START_X_GHOST, START_Y_GHOST, GHOST_WIDTH, GHOST_SPEED);

    // init the scatter mode target tile of blinky
    blinky.setScatterTargetTile(createVector(BLINKY_SCATTER_X_TARGET, BLINKY_SCATTER_Y_TARGET));

    // init pinky
    pinky = new Pinky(START_X_GHOST, START_Y_GHOST, GHOST_WIDTH, GHOST_SPEED);

    // init the scatter mode target tile of pinky
    pinky.setScatterTargetTile(createVector(PINKY_SCATTER_X_TARGET, PINKY_SCATTER_Y_TARGET));

    // init inky
    inky = new Inky(START_X_GHOST, START_Y_GHOST, GHOST_WIDTH, GHOST_SPEED);

    // init the scatter mode target tile of inky
    inky.setScatterTargetTile(createVector(INKY_SCATTER_X_TARGET, INKY_SCATTER_Y_TARGET));

}

function draw() {
    background(0);
    // draw the image of maze
    image(mazeImg, 0, 0);

    // show the dots / energizers in the maze 
    maze.showDots();

    // ----------------------------------Setting the ghosts mode----------------------------------------//
    // Have to first check if pinky is not eaten
    // as long as pinky is not eaten, set other modes appropriately
    if (!pinky.mode.eaten) {
        // if pacman eats a pinky that is not eaten yet
        // check if pinky is frightened
        if (pacman.eatGhost(pinky.currentPosition)) {
            // if pinky is not frightened, pacman is dead (GAME OVER)
            if (!pinky.mode.frightened) {
                console.log("GAME OVER");

            } else {
                // if pinky is frightened, then set pinky to eaten mode
                pinky.setMode("eaten");
                console.log("EATEN");

            }

            // if frightened mode has ended, set mode to mode before frightened mode (chase or scatter)
        } else if (pinky.frightenedModeEnded()) {
            pinky.setMode(pinky.modeBefFrightMode());
            console.log(pinky.modeBefFrightMode());

            // if pacman eats energizer, then set pinky to frightened mode
        } else if (pacman.eatenEnergizer(maze)) {
            pinky.setMode("frightened");
            console.log("FRIGHTENED");

            // if chase mode has ended, set mode to scatter mode
        } else if (pinky.chaseModeEnded()) {
            pinky.setMode("scatter");
            console.log("SCATTER");

            // if scatter mode has ended, set the mode to chase mode
        } else if (pinky.scatterModeEnded()) {
            pinky.setMode("chase");
            console.log("CHASE");

        }
    } else {
        // if pinky is eaten, check if it has reached front of pinky house
        if (pinky.reachedGhostHouse()) {
            // if it has reached, check if mode before frightened was chase or scatter
            // then set mode accordingly
            pinky.setMode(pinky.modeBefFrightMode());
            console.log(pinky.modeBefFrightMode());
        }
    }
    // if pacman eats dots/energizer, remove them, regardless of state of pinky
    if (pacman.eatenDot(maze) || pacman.eatenEnergizer(maze)) {
        // Get current grid coordinates of pacman 
        let currentGridCoords = maze.remap(pacman.currentPosition, pacman.currentDirection);
        // remove the dot/energizer
        maze.removeDot(currentGridCoords);
    }

    // console.log(pinky.timer);
    console.log("Frightened Mode Timer: " + pinky.frightenedModeTimer);

    // ----------------------------------Setting the ghosts mode----------------------------------------//

    // handle the mode appropriately
    pinky.handleMode(pacman, maze);

    // show the pinky
    pinky.show();

    // move the pinky
    pinky.move(maze);

    // keyboard movements to control pacman
    if (keyIsPressed) {
        if (keyCode == UP_ARROW) {
            pacman.updateDirection(0, -1);

        } else if (keyCode == DOWN_ARROW) {
            pacman.updateDirection(0, 1);

        } else if (keyCode == LEFT_ARROW) {
            pacman.updateDirection(-1, 0);

        } else if (keyCode == RIGHT_ARROW) {
            pacman.updateDirection(1, 0);

        }
    }
    // move the pacman
    pacman.move(maze);

    // show the pacman
    pacman.show();

    // Game events execution order
    // ---------------------------
    // 1) Background 
    // 2) Show dots / energizers
    // 3) Coordination of setting current mode of ghost
    // 4) Handling what to do for the current mode of ghost
    // 5) Show ghost
    // 6) Move ghost 
    // 7) Keyboard controls for pacman
    // 8) Move pacman
    // 9) Show pacman
}