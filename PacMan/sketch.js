/**
 * File: Sketch.js 
 * --------------------
 * Main program for the PacMan game
 */

// Constants used for the game
const GAME_CONSTS = new GameConsts();

// tile representation
let tileRep;

// Maze image 
let mazeImg;

// game object
let game = new Game();

// Loading lib here
const tml5 = new TML5();

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

    // TML5
    tml5.init(TML5_CONFIG);
}


function setup() {
    // init the game
    game.init(GAME_CONSTS, mazeImg, tileRep);

    // Set up the tml5
    tml5.setUpVideo();
    tml5.classifyVideo();
}

function draw() {
    if(game.gameOver) {
        noLoop();
    }
    game.run();
    game.show();

    if(label){
        tml5.drawVideo();
    }

    // // Game events execution order
    // // ---------------------------
    // // 1) Coordination of setting current mode of ghost
    // // 2) Handling what to do for the current mode of ghost
    // // 3) Move ghost 
    // // 4) Keyboard controls for pacman
    // // 5) Move pacman
    // // 6) Background 
    // // 7) Show dots / energizers
    // // 8) Show ghost
    // // 9) Show pacman

    // // Game functions to be in the game run function
    // // 1) Coordination of setting current mode of ghost
    // // 2) Handling what to do for the current mode of ghost
    // // 3) Updating position of entities (Move ghost, Keyboard controls for pacman, Move pacman)

    // // Show entities (Background, Show dots / energizers, Show ghost, Show pacman)
}