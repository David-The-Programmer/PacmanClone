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
const PACMAN_WIDTH = 25;

// Starting x position of pacman
const START_X = (13 * TILE_WIDTH) + (TILE_WIDTH / 2);

// Starting y position of pacman
const START_Y = (23 * TILE_HEIGHT) + (TILE_HEIGHT / 2);

// 2D array of tile objects
let tiles = [];

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

    // Setting up the tiles
    for (let row = 0; row < NUM_ROWS_TILES; row++) {
        tiles[row] = [];
        for (let col = 0; col < NUM_COLS_TILES; col++) {
            // set the parts that are going to be on each tile according to tileRep
            let part = tileRep[row][col];

            // Init new tile for each element in tiles array
            tiles[row][col] = new Tile(col * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
            // 1 = wall
            // 0 = dot
            // 8 = energizer
            // 6 = blank space
            if (part == 1) {
                tiles[row][col].part.wall = true;

            } else if (part == 0) {
                tiles[row][col].part.dot = true;

            } else if (part == 8) {
                tiles[row][col].part.energizer = true;

            } else if (part == 6) {
                tiles[row][col].part.space = true;
            }
        }
    }

    // Init the pacman
    pacman = new Pacman(START_X, START_Y, PACMAN_WIDTH);

}

function draw() {
    background(0);
    // draw the image of maze
    image(mazeImg, 0, 0);

    // show the dots / energizers  
    // row x col
    for (let i = 0; i < tiles.length; i++) {
        for (let j = 0; j < tiles[0].length; j++) {
            tiles[i][j].showDots();
        }
    }

    

    // show the pacman
    pacman.show();

    // move the pacman
    pacman.move();

    // check if pacman can move in the direction he is going
    // if he can, continue moving
    // if not, stop him from moving
    if(!pacman.checkPosition(tiles)) {
        noLoop();
    }


}

function keyPressed() {
    if (keyCode == UP_ARROW) {
        pacman.updateVels(0, -1);

    } else if (keyCode == DOWN_ARROW) {
        pacman.updateVels(0, 1);

    } else if (keyCode == LEFT_ARROW) {
        pacman.updateVels(-1, 0);

    } else if (keyCode == RIGHT_ARROW) {
        pacman.updateVels(1, 0);
    }
}