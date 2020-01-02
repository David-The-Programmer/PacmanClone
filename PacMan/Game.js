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

        // boolean to determine if game over
        this.gameOver = false;

    }

    // init function
    // receives all the game constants(JSON), mazeImg and tile representation(JSON)
    init(gameConsts, mazeImg, tileRep) {
        // init the canvas
        this.canvas = createCanvas(gameConsts.CANVAS_WIDTH, gameConsts.CANVAS_HEIGHT);

        // centre the canvas
        this.canvas.position((windowWidth - gameConsts.CANVAS_WIDTH) / 2, (windowHeight - gameConsts.CANVAS_HEIGHT) / 2);

        // init the maze
        this.maze = new Maze(gameConsts.NUM_ROWS_TILES, gameConsts.NUM_COLS_TILES, gameConsts.TILE_WIDTH, gameConsts.TILE_HEIGHT, tileRep);

        // set the maze image
        this.mazeImg = mazeImg;

        // Init the pacman
        this.pacman = new Pacman(gameConsts.START_X_PACMAN, gameConsts.START_Y_PACMAN, gameConsts.PACMAN_WIDTH, gameConsts.PACMAN_SPEED);

        // init blinky
        this.blinky = new Ghost(gameConsts.START_X_GHOST, gameConsts.START_Y_GHOST, gameConsts.GHOST_WIDTH, gameConsts.GHOST_SPEED);

        // init the scatter mode target tile of blinky
        this.blinky.setScatterTargetTile(createVector(gameConsts.BLINKY_SCATTER_X_TARGET, gameConsts.BLINKY_SCATTER_Y_TARGET));

        // init pinky
        this.pinky = new Pinky(gameConsts.START_X_GHOST, gameConsts.START_Y_GHOST, gameConsts.GHOST_WIDTH, gameConsts.GHOST_SPEED);

        // init the scatter mode target tile of pinky
        this.pinky.setScatterTargetTile(createVector(gameConsts.PINKY_SCATTER_X_TARGET, gameConsts.PINKY_SCATTER_Y_TARGET));

        // init inky
        this.inky = new Inky(gameConsts.START_X_GHOST, gameConsts.START_Y_GHOST, gameConsts.GHOST_WIDTH, gameConsts.GHOST_SPEED);

        // init the scatter mode target tile of inky
        this.inky.setScatterTargetTile(createVector(gameConsts.INKY_SCATTER_X_TARGET, gameConsts.INKY_SCATTER_Y_TARGET));

        // init clyde
        this.clyde = new Clyde(gameConsts.START_X_GHOST, gameConsts.START_Y_GHOST, gameConsts.GHOST_WIDTH, gameConsts.GHOST_SPEED);

        // init the scatter mode target tile of clyde
        this.clyde.setScatterTargetTile(createVector(gameConsts.CLYDE_SCATTER_X_TARGET, gameConsts.CLYDE_SCATTER_Y_TARGET));

        // init ghost array
        this.ghostsArr = [this.blinky];
    }

    // run function
    // contains all the game logic 
    run() {
        // Initialising ghosts at different timings
        if (this.delayTimer % 500 == 0 && this.delayTimer != 0 && this.ghostsArr.length < 4) {
            if (this.ghostsArr.length == 1) {
                this.ghostsArr.push(this.pinky);

            } else if (this.ghostsArr.length == 2) {
                this.ghostsArr.push(this.inky);

            } else if (this.ghostsArr.length == 3) {
                this.ghostsArr.push(this.clyde);
            }
        }

        // only increment timer if still initialising ghosts
        if (this.ghostsArr.length < 4) {
            this.delayTimer++;
        } else {
            this.delayTimer = 0;
        }
        this.setGhostModes();
        this.handleGhostModes();
        this.updatePositionOfEntities();
    }

    // function for setting the current mode of ghosts 
    // contains logic for setting current mode of ghosts
    setGhostModes() {
        for (let i = 0; i < this.ghostsArr.length; i++) {
            // Have to first check if ghosts is not eaten
            // as long as ghosts is not eaten, set other modes appropriately
            if (!this.ghostsArr[i].mode.eaten) {
                // if this.pacman eats a ghosts that is not eaten yet
                // check if ghosts is frightened
                if (this.pacman.eatGhost(this.ghostsArr[i].currentPosition)) {
                    // if ghosts is not frightened, this.pacman is dead (GAME OVER)
                    if (!this.ghostsArr[i].mode.frightened) {
                        this.gameOver = true;

                    } else {
                        // if ghosts is frightened, then set ghosts to eaten mode
                        this.ghostsArr[i].setMode("eaten");
                    }

                    // if frightened mode has ended, set mode to mode before frightened mode (chase or scatter)
                } else if (this.ghostsArr[i].frightenedModeEnded()) {
                    this.ghostsArr[i].setMode(this.ghostsArr[i].modeBefFrightMode());

                    // if this.pacman eats energizer, then set ghosts to frightened mode
                } else if (this.pacman.eatenEnergizer(this.maze)) {
                    this.ghostsArr[i].setMode("frightened");

                    // if chase mode has ended, set mode to scatter mode
                } else if (this.ghostsArr[i].chaseModeEnded()) {
                    this.ghostsArr[i].setMode("scatter");

                    // if scatter mode has ended, set the mode to chase mode
                } else if (this.ghostsArr[i].scatterModeEnded()) {
                    this.ghostsArr[i].setMode("chase");

                }
            } else {
                // if ghosts is eaten, check if it has reached front of ghosts house
                if (this.ghostsArr[i].reachedGhostHouse()) {
                    // if it has reached, check if mode before frightened was chase or scatter
                    // then set mode accordingly
                    this.ghostsArr[i].setMode(this.ghostsArr[i].modeBefFrightMode());
                }
            }
        }
        // if this.this.pacman eats dots/energizer, remove them, regardless of state of ghosts
        if (this.pacman.eatenDot(this.maze) || this.pacman.eatenEnergizer(this.maze)) {
            // Get current grid coordinates of this.this.pacman 
            let currentGridCoords = this.maze.remap(this.pacman.currentPosition, this.pacman.currentDirection);
            // remove the dot/energizer
            this.maze.removeDot(currentGridCoords);

            // Increment the game score 
            this.pacman.incrementGameScore(1);
            console.log(`Game Score: ${this.pacman.gameScore}`);

            // Update the fitness score of this.this.pacman accordingly
            this.pacman.calculateFitness();
            // console.log(`Fitness Score: ${this.pacman.fitnessScore}`);

        }

    }

    // function to handle modes of ghosts
    handleGhostModes() {
        for (let i = 0; i < this.ghostsArr.length; i++) {
            // handle the mode appropriately according to the length of ghost array
            // (to compensate for ghost initialised at different timings)
            if (this.ghostsArr.length == 1) {
                // if only blinky is present, then handle mode for blinky
                // if handling mode for Blinky, just give this.pacman's current position
                this.ghostsArr[i].handleMode(this.pacman.currentPosition);

            } else if (this.ghostsArr.length == 2) {
                // if both blinky and pinky are present, handle modes for both
                if (i == 0) {
                    // if handling mode for Blinky, just give this.pacman's current position
                    this.ghostsArr[i].handleMode(this.pacman.currentPosition);
                } else {
                    // if handling mode for Pinky, give this.pacman and this.maze
                    this.ghostsArr[i].handleMode(this.pacman, this.maze);
                }

            } else if (this.ghostsArr.length == 3) {
                // if blinky, pinky and inky are present, handle modes for all
                if (i == 0) {
                    // if handling mode for Blinky, just give this.pacman's current position
                    this.ghostsArr[i].handleMode(this.pacman.currentPosition);

                } else if (i == 1) {
                    // if handling mode for Pinky, give this.pacman and this.maze
                    this.ghostsArr[i].handleMode(this.pacman, this.maze);

                } else if (i == 2) {
                    // if handling mode for Inky, give this.pacman, this.maze and blinky
                    this.ghostsArr[i].handleMode(this.pacman, this.maze, this.blinky);
                }

            } else if (this.ghostsArr.length == 4) {
                // if all ghost are present, handle modes for all
                if (i == 0) {
                    // if handling mode for Blinky, just give this.pacman's current position
                    this.ghostsArr[i].handleMode(this.pacman.currentPosition);

                } else if (i == 1 || i == 3) {
                    // if handling mode for Pinky and Clyde, give this.pacman and this.maze
                    this.ghostsArr[i].handleMode(this.pacman, this.maze);

                } else if (i == 2) {
                    // if handling mode for Inky, give this.pacman, this.maze and blinky
                    this.ghostsArr[i].handleMode(this.pacman, this.maze, this.blinky);
                }
            }

        }

    }

    // function to update the position of the ghosts and pacman
    updatePositionOfEntities() {
        for (let i = 0; i < this.ghostsArr.length; i++) {
            // move the ghosts(update the position of ghosts)
            this.ghostsArr[i].move(this.maze);
        }

        // keyboard movements to control pacman
        if (keyIsPressed) {
            if (keyCode == UP_ARROW) {
                this.pacman.updateDirection(0, -1);

            } else if (keyCode == DOWN_ARROW) {
                this.pacman.updateDirection(0, 1);

            } else if (keyCode == LEFT_ARROW) {
                this.pacman.updateDirection(-1, 0);

            } else if (keyCode == RIGHT_ARROW) {
                this.pacman.updateDirection(1, 0);

            }
        }
        // move the pacman (update the position of pacman)
        this.pacman.move(this.maze);

    }

    // show function
    // draws background, dots, ghosts and pacman
    show() {
        background(0);

        // draw the image of maze
        image(this.mazeImg, 0, 0);

        // show the dots / energizers in the maze 
        this.maze.showDots();

        for (let i = 0; i < this.ghostsArr.length; i++) {
            // show the ghosts
            this.ghostsArr[i].show();
        }

        // show the pacman
        this.pacman.show();

    }

    // generate inputs for neural network
    generateInput() {

    }

    // handle outputs from neural network
    // receives output from neural network
    handleOutputs() {

    }

    // get the fitness score of pacman
    // returns fitness score of pacman
    getFitnessScore() {

    }
}