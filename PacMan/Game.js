/**
 * File: Game.js 
 * --------------------
 * Class for the game object
 */
class Game {
    constructor() {
        // canvas object
        this.canvas;

        // maze object
        this.maze;

        // maze image
        this.mazeImg;

        // Pac-Man object
        this.pacman;

        // Ghost blinky
        this.blinky;

        // Ghost pinky
        this.pinky;

        // Ghost inky
        this.inky;

        // Ghost clyde
        this.clyde;

        // Array to store all four ghost
        this.ghostsArr;

        // timer to count how many frames has passed to init ghosts at different timings
        this.delayTimer = 0;

    }

    // init function
    // receives all the game constants(JSON), mazeImg and tile representation(JSON)
    init(gameConsts, mazeImg, tileRep) {
    }

    // run function
    // contains all the game logic 
    run() {

    }

    // function for setting the current mode of ghosts 
    // contains logic for setting current mode of ghosts
    setGhostModes() {

    }

    // function to handle modes of ghosts
    handleGhostModes() {

    }

    // function to update the position of the ghosts and pacman
    updatePositionOfEntities() {

    }

    // show function
    // draws background, dots, ghosts and pacman
    show() {

    }

    // generate inputs for neural network
    generateInput() {

    }

    // handle outputs from neural network
    // receives output from neural network
    handleOutputs() {

    }

    // function to determine if game is over
    // returns boolean
    gameOver() {

    }

    // get the fitness score of pacman
    // returns fitness score of pacman
    getFitnessScore() {

    }
}