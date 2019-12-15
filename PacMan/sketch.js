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
const START_X = (13 * TILE_WIDTH) + (TILE_WIDTH / 2);

// Starting y position of pacman
const START_Y = (23 * TILE_HEIGHT) + (TILE_HEIGHT / 2);

// Maze object to store all info about the 2D array of tiles
let maze;

// tile representation
let tileRep;

// Maze image 
let mazeImg;

// Pac-Man object
let pacman;

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
    pacman = new Pacman(START_X, START_Y, PACMAN_WIDTH, PACMAN_SPEED);

}

function draw() {
    background(0);
    // draw the image of maze
    image(mazeImg, 0, 0);

    // show the dots / energizers in the maze 
    maze.showDots();

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
    // check if pacman has eaten dot
    // if he did, remove it
    if(pacman.eatenDot(maze)) {
        // Get current grid coordinates of pacman 
        let currentGridCoords = maze.remap(pacman.currentPosition, pacman.currentDirection);

        // remove the dot
        maze.removeDot(currentGridCoords);
    }

    pacman.move(maze);

    // show the pacman
    pacman.show();


}