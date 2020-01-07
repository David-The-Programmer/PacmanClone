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
        this.canvas = createCanvas(gameConsts.CANVAS_WIDTH * 2, gameConsts.CANVAS_HEIGHT);

        // centre the canvas
        this.canvas.position((windowWidth - (gameConsts.CANVAS_WIDTH * 2)) / 2, (windowHeight - (gameConsts.CANVAS_HEIGHT)) / 2);

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
            // console.log(`Game Score: ${this.pacman.gameScore}`);

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
        // if (keyIsPressed) {
        //     if (keyCode == UP_ARROW) {
        //         this.pacman.updateDirection(0, -1);

        //     } else if (keyCode == DOWN_ARROW) {
        //         this.pacman.updateDirection(0, 1);

        //     } else if (keyCode == LEFT_ARROW) {
        //         this.pacman.updateDirection(-1, 0);

        //     } else if (keyCode == RIGHT_ARROW) {
        //         this.pacman.updateDirection(1, 0);

        //     }
        // }


        // tml5 inputs
        if (label) {
            if (label === "up") {
                this.pacman.updateDirection(0, -1);
            } else if (label === "down") {
                this.pacman.updateDirection(0, 1);
            } else if (label == "left") {
                this.pacman.updateDirection(-1, 0);
            } else if (label == "right") {
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
    // returns the inputs for the neural network
    generateInputs() {
        // remap and get grid position of pacman
        let pacmanCurrentGridPos = this.maze.remap(this.pacman.currentPosition, this.pacman.currentDirection);

        // remap and get grid position of blinky
        let blinkyCurrentGridPos = this.maze.remap(this.blinky.currentPosition, this.blinky.currentDirection);

        // remap and get grid position of pinky
        let pinkyCurrentGridPos = this.maze.remap(this.pinky.currentPosition, this.pinky.currentDirection);

        // remap and get grid position of inky
        let inkyCurrentGridPos = this.maze.remap(this.inky.currentPosition, this.inky.currentDirection);

        // remap and get grid position of clyde
        let clydeCurrentGridPos = this.maze.remap(this.clyde.currentPosition, this.clyde.currentDirection);

        // array to store all the grid position of all ghosts
        let ghostsGridPosArr = [blinkyCurrentGridPos, pinkyCurrentGridPos, inkyCurrentGridPos, clydeCurrentGridPos];

        const UP_DIRECTION = createVector(0, -1);
        const DOWN_DIRECTION = createVector(0, 1);
        const LEFT_DIRECTION = createVector(-1, 0);
        const RIGHT_DIRECTION = createVector(1, 0);

        // max number of tiles pacman can see ahead for
        const MAX_TILES = 4;

        // number of columns in the maze
        let numCols = this.maze.numCols;

        // number of rows in the maze
        let numRows = this.maze.numRows;

        // array of inputs to be returned
        let inputs = [];


        // -----------------GETTING INVERSED DISTANCE OF PACMAN TO GHOSTS IN ALL 4 DIRECTIONS----------------//
        // check for each of the four directions
        // up, down, left, right
        for (let k = 0; k < 4; k++) {
            // Need to reset this for each direction
            // grid distance between pacman and ghosts (can be only from 1 to 4)
            let gridDist = 0;

            // Need to reset this for each direction
            // boolean to check if ghost is seen
            let ghostSeen = false;

            // Need to reset this for each direction
            // current direction to check
            let currentDirection = null;

            if (k == 0) {
                currentDirection = UP_DIRECTION;
            } else if (k == 1) {
                currentDirection = DOWN_DIRECTION;
            } else if (k == 2) {
                currentDirection = LEFT_DIRECTION;
            } else if (k == 3) {
                currentDirection = RIGHT_DIRECTION;
            }

            // now time to check in the current direction
            for (let i = 0; i < MAX_TILES; i++) {

                // Need to get the grid coords of the tile ahead in the current direction
                let gridCoordsAhead = p5.Vector.add(pacmanCurrentGridPos, p5.Vector.mult(currentDirection, (i + 1)));


                // need to make sure that the grid coords does not go out of index of maze object array
                if (gridCoordsAhead.x < 0) {
                    gridCoordsAhead.x = 0;
                } else if (gridCoordsAhead.x > numCols - 1) {
                    gridCoordsAhead.x = numCols - 1;
                }

                if (gridCoordsAhead.y < 0) {
                    gridCoordsAhead.y = 0;
                } else if (gridCoordsAhead.y > numRows - 1) {
                    gridCoordsAhead.y = numRows - 1;
                }

                // After getting the grid coords, check if it is the same as the grid coords of any of the ghosts
                for (let j = 0; j < ghostsGridPosArr.length; j++) {
                    // console.log(`ghostGridPosArr ${j} .x : ${ghostsGridPosArr[j].x}`);
                    // console.log(`ghostGridPosArr ${j} .y : ${ghostsGridPosArr[j].y}`);

                    if (gridCoordsAhead.x == ghostsGridPosArr[j].x && gridCoordsAhead.y == ghostsGridPosArr[j].y) {
                        // stop the incrementing grid distance if gridCoords ahead is the same as grid coords of any ghosts
                        // console.log(`Ghost spotted`);
                        ghostSeen = true;
                        break;
                    }
                }

                gridDist++;

                // if ghost is found, then just append the current grid dist to inputs
                if (ghostSeen) {
                    // console.log(`ghost seen`);
                    inputs.push(1 / gridDist);
                    break;
                }
            }
            // if no ghosts found, just append 0 to the inputs 
            if (!ghostSeen) {
                inputs.push(0);
            }

        }
        // -----------------END OF GETTING INVERSED DISTANCE OF PACMAN TO GHOSTS IN ALL 4 DIRECTIONS----------------//

        // ---------------BOOLEAN IF WALL PRESENT FOR ALL 4 DIRECTIONS------------------//
        // check for each of the four directions
        // up, down, left, right
        for (let k = 0; k < 4; k++) {
            // Need to reset this for each direction
            // current direction to check
            let currentDirection = null;

            // Need to get the tile ahead of pacman in the current direction
            let tileAhead = null;

            if (k == 0) {
                currentDirection = UP_DIRECTION;
            } else if (k == 1) {
                currentDirection = DOWN_DIRECTION;
            } else if (k == 2) {
                currentDirection = LEFT_DIRECTION;
            } else if (k == 3) {
                currentDirection = RIGHT_DIRECTION;
            }

            // now time to check in the current direction
            for (let i = 0; i < MAX_TILES; i++) {

                // Need to get the tile ahead of pacman in the current direction
                tileAhead = this.pacman.lookAhead(pacmanCurrentGridPos, p5.Vector.mult(currentDirection, (i + 1)), this.maze);
                // if wall is seen, return 1 to inputs
                if (tileAhead.part.wall) {
                    // console.log(`wall seen`);
                    inputs.push(1);
                    break;
                }
            }
            // if no wall found, return 0 to inputs
            if (!tileAhead.part.wall) {
                inputs.push(0);
            }

        }
        // ---------------END OF BOOLEAN IF WALL PRESENT FOR ALL 4 DIRECTIONS------------------//

        // ---------------BOOLEAN IF DOT PRESENT FOR ALL 4 DIRECTIONS------------------//
        // check for each of the four directions
        // up, down, left, right
        for (let k = 0; k < 4; k++) {
            // Need to reset this for each direction
            // current direction to check
            let currentDirection = null;

            // Need to get the tile ahead of pacman in the current direction
            let tileAhead = null;

            if (k == 0) {
                currentDirection = UP_DIRECTION;
            } else if (k == 1) {
                currentDirection = DOWN_DIRECTION;
            } else if (k == 2) {
                currentDirection = LEFT_DIRECTION;
            } else if (k == 3) {
                currentDirection = RIGHT_DIRECTION;
            }

            // index
            let index = 0;

            // now time to check in the current direction for dots
            // no max range limit for this
            while (true) {
                // keep looking ahead until wall or dot is seen
                // if pacman sees wall, append 0 to input
                // if pacman sees dot, appened 1 to input
                // Need to get the tile ahead of pacman in the current direction
                tileAhead = this.pacman.lookAhead(pacmanCurrentGridPos, p5.Vector.mult(currentDirection, (index + 1)), this.maze);

                if (tileAhead.part.wall) {
                    inputs.push(0);
                    break;

                } else if ((tileAhead.part.dot || tileAhead.part.energizer) && !tileAhead.eaten) {
                    inputs.push(1);
                    break;
                }
                index++;
            }
        }
        // ---------------END OF IF DOT PRESENT FOR ALL 4 DIRECTIONS------------------//
        // ---------------INPUTS FOR GHOST FRIGHTENED MODE----------------------------//
        for (let i = 0; i < 4; i++) {
            if (i == 0) {
                // check if blinky is frightened
                // if he is, add 1 to inputs
                if (this.blinky.mode.frightened) {
                    inputs.push(1);
                } else {
                    inputs.push(0);
                }
            } else if (i == 1) {
                // check if pinky is frightened
                // if she is, add 1 to inputs
                if (this.pinky.mode.frightened) {
                    inputs.push(1);
                } else {
                    inputs.push(0);
                }

            } else if (i == 2) {
                // check if inky is frightened
                // if he is, add 1 to inputs
                if (this.inky.mode.frightened) {
                    inputs.push(1);
                } else {
                    inputs.push(0);
                }

            } else if (i == 3) {
                // check if clyde is frightened
                // if he is, add 1 to inputs
                if (this.clyde.mode.frightened) {
                    inputs.push(1);
                } else {
                    inputs.push(0);
                }

            }

        }
        // ---------------END OF INPUTS FOR GHOST FRIGHTENED MODE----------------------------//
        // add the bias node
        inputs.push(1);

        // after getting all the inputs, return them
        return inputs;


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