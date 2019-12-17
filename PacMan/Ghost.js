/**
 * File: Ghost.js
 * ---------------
 * Class for the ghost objects
 */
class Ghost {
    constructor(x, y, width, speed) {
        // starting position of ghost
        this.startingPosition = createVector(x, y);

        // current position vector of ghost
        this.currentPosition = createVector(x, y);

        // width (diameter) of ghost
        this.width = width;

        // current direction vector which ghost moves
        this.currentDirection = createVector(1, 0);

        // number of steps ghost takes to move from one tile to the next
        this.steps = 0;

        // speed (number of pixels) which ghost moves every frame
        this.speed = speed;

        // x, y coordinates of the target tile 
        this.targetTileCoords = createVector(0, 0);

        // current mode of the ghost
        // default mode of ghost is scatter mode
        this.mode = {
            chase: false,
            scatter: true,
            frightened: false,
            eaten: false
        };

        // previous mode of the ghost
        this.prevMode = {
            chase: false,
            scatter: true,
            frightened: false,
            eaten: false
        };

        this.modeChanged = false;

        // scatter mode target tile x, y coords
        this.scatterModeTargetTileCoords = createVector(0, 0);
    }

    // function to set the target tile for scatter mode
    // receives the x, y coords of the target tile for scatter mode
    setScatterTargetTile(scatterTargetTileCoords) {
        this.scatterModeTargetTileCoords.x = scatterTargetTileCoords.x;
        this.scatterModeTargetTileCoords.y = scatterTargetTileCoords.y;
    }

    // function to display the ghost
    show() {
        fill(255, 0, 0);
        noStroke();
        ellipse(this.currentPosition.x, this.currentPosition.y, this.width);
    }

    // function to set the target tile of the ghost (set the grid coords of the target tile)
    // receives the x, y coords of target tile
    setTargetTile(coords) {
        this.targetTileCoords.x = coords.x;
        this.targetTileCoords.y = coords.y;
    }

    // function to allow ghost to look in all four directions
    // receives the maze object
    // returns an array of tiles, each being the tile ahead for each of the directions
    // also returns the array of directions, corresponding to each tile respectively
    lookAllFourDirections(maze) {
        const UP_DIRECTION = createVector(0, -1);
        const DOWN_DIRECTION = createVector(0, 1);
        const LEFT_DIRECTION = createVector(-1, 0);
        const RIGHT_DIRECTION = createVector(1, 0);

        // Current grid coordinates of the ghost 
        let currentGridCoords = maze.remap(this.currentPosition, this.currentDirection);

        // tiles to be returned
        let tilesAhead = [];

        tilesAhead.push(this.lookAhead(currentGridCoords, UP_DIRECTION, maze));
        tilesAhead.push(this.lookAhead(currentGridCoords, DOWN_DIRECTION, maze));
        tilesAhead.push(this.lookAhead(currentGridCoords, LEFT_DIRECTION, maze));
        tilesAhead.push(this.lookAhead(currentGridCoords, RIGHT_DIRECTION, maze));

        return [tilesAhead, [UP_DIRECTION, DOWN_DIRECTION, LEFT_DIRECTION, RIGHT_DIRECTION]];
    }

    // function to handle the direction which the ghost should move
    // receives the array which contains the array of tiles ahead of ghost for each direction
    // and the array of directions, corresponding to each tile respectively
    // returns direction which ghost should move 
    handleDirection(tilesAhead, directions) {
        // check the tiles
        // if anyone of them is a wall 
        // remove them from the array
        // and remove their corresponding direction as well
        for (let i = tilesAhead.length - 1; i >= 0; i--) {
            if (tilesAhead[i].part.wall) {
                tilesAhead.splice(i, 1);
                directions.splice(i, 1);
            }
        }

        // get the opposite direction to the current one
        let oppDirection = createVector(this.currentDirection.x * -1, this.currentDirection.y * -1);
        for (let i = directions.length - 1; i >= 0; i--) {
            // if any of the directions is equal to the opposite direction to the current one
            // remove it
            // also remove the corresponding tile as well
            if (directions[i].x == oppDirection.x && directions[i].y == oppDirection.y) {
                directions.splice(i, 1);
                tilesAhead.splice(i, 1);
            }
        }

        // if there is only one direction left, return the direction leading to the tile
        if (directions.length == 1) {

            return directions[0];
        } else {
            // else, have to calculate and compare distance from the tile ahead (in all possible directions)
            // to the target tile to determine direction to go
            let distances = [];

            // Calculate all the distances
            for (let i = 0; i < directions.length; i++) {
                distances.push(dist(this.targetTileCoords.x, this.targetTileCoords.y, tilesAhead[i].x, tilesAhead[i].y));
            }

            // Before comparing the distances, need to see how many distances are there
            // if there are only two/three distances and they are equal,
            // need to check the directions according to direction hierarchy
            // Direction hierachy
            // -------------------
            // 1) UP
            // 2) LEFT
            // 3) DOWN
            // 4) RIGHT
            const UP_DIRECTION = createVector(0, -1);
            const DOWN_DIRECTION = createVector(0, 1);
            const LEFT_DIRECTION = createVector(-1, 0);
            const RIGHT_DIRECTION = createVector(1, 0);

            // Array to store the direction hierachy in order
            const DIRECTION_HIERACHY = [UP_DIRECTION, LEFT_DIRECTION, DOWN_DIRECTION, RIGHT_DIRECTION];


            // if there are two distances to compare and both of them are equal
            // or if there are three distances to compare and all three are equal
            // return the direction according to the direction hierarchy
            if ((distances.length == 2 && distances[0] == distances[1]) ||
                (distances.length == 3 && distances[0] == distances[1] && distances[1] == distances[2])) {
                // Array to store the indexes of the directions in relation to the DIRECTION_HIERACHY
                // for e.g, if the directions array contains UP_DIRECTION and LEFT_DIRECTION,
                // then the array would contain [0, 1] 
                let directionIndexes = [];

                // check what directions are remaining
                for (let i = 0; i < directions.length; i++) {
                    if (directions[i].x == UP_DIRECTION.x && directions[i].y == UP_DIRECTION.y) {
                        directionIndexes.push(0);

                    } else if (directions[i].x == LEFT_DIRECTION.x && directions[i].y == LEFT_DIRECTION.y) {
                        directionIndexes.push(1);

                    } else if (directions[i].x == DOWN_DIRECTION.x && directions[i].y == DOWN_DIRECTION.y) {
                        directionIndexes.push(2);

                    } else if (directions[i].x == RIGHT_DIRECTION.x && directions[i].y == RIGHT_DIRECTION.y) {
                        directionIndexes.push(3);
                    }
                }
                // after checking who is remaining, 
                // find the smallest index 
                let smallestIndex = Infinity;
                for (let i = 0; i < directionIndexes.length; i++) {
                    if (smallestIndex > directionIndexes[i]) {
                        smallestIndex = directionIndexes[i];
                    }
                }
                // after finding the smallest index
                // use that index to return the direction to go
                return DIRECTION_HIERACHY[smallestIndex];

            } else {
                // if not check which one has the shorter distance to the target tile
                // compare all the distances to find the smallest one
                // and get the index of the smallest distance
                let smallestDist = Infinity;
                let index = 0;
                for (let i = distances.length - 1; i >= 0; i--) {
                    if (smallestDist > distances[i]) {
                        smallestDist = distances[i];
                        index = i;
                    }
                }
                return directions[index];
            }
        }

    }

    // function to allow ghost to look ahead one tile in any direction 
    // receives the grid coordinates vector object, 
    // the direction vector object,
    // and maze object
    // returns the tile in the direction specified
    lookAhead(currentGridCoords, direction, maze) {
        // number of columns in the maze
        let numCols = maze.numCols;

        // number of rows in the maze
        let numRows = maze.numRows;

        let gridCoordsAhead = createVector(currentGridCoords.x, currentGridCoords.y);
        gridCoordsAhead.x += direction.x;
        gridCoordsAhead.y += direction.y;

        // need to make sure that the grid coords does not go out of index of tile object array
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

        return maze.tiles[gridCoordsAhead.y][gridCoordsAhead.x];
    }

    // function which handles movement of ghost
    // receives the maze object
    move(maze) {
        // should only update direction when steps == 0
        // only if ghost is exactly on one tile, then update its direction
        if (this.steps == 0) {
            let result = this.lookAllFourDirections(maze);

            // Array of all the tiles ahead in all four directions of the ghost
            let tilesAhead = result[0];

            // get all the respective directions
            let directions = result[1];

            // find out which direction to go
            let directionToGo = this.handleDirection(tilesAhead, directions);

            this.updateDirection(directionToGo.x, directionToGo.y);
        }
        // update current position of ghost
        this.currentPosition.x += this.currentDirection.x * this.speed;
        this.currentPosition.y += this.currentDirection.y * this.speed;
        this.steps++;
        // reset steps when it hits 16 as ghost has to travel 16 pixels to move from one tile to the next
        if (this.steps == MAX_STEPS / this.speed) {
            this.steps = 0;
        }

    }

    // function to update the current direction
    // receives x velocity and y velocity which ghost is to move
    updateDirection(xVel, yVel) {
        this.currentDirection.x = xVel;
        this.currentDirection.y = yVel;
    }

    // function to execute when ghost is in scatter mode 
    // In the scatter mode function,
    // ghost has to turn 180 (PI)
    // Set target tile to one of the four corners of maze
    // then move!
    // scatter mode only activates four times
    // duration of scatter mode is very short(duration can be based on number of frames that passed)

    // Activation
    // ------------
    // What point of time does it activate?
    // At the start, after that ???

    // receives the x,y coordinates of the target tile (one of the four corners of the maze, dependent on ghost)
    // and receives maze object
    scatterMode(targetTileCoords, maze) {
        this.setTargetTile(targetTileCoords);
        this.move(maze);
    }

    // HANDLE DIRECTION NEEDS TO BE ABLE TO HANDLE FRIGHTENED MODE AS WELL (JUST MODIFY AFTER CHECKING length of direction)

    // Actually, I just need a function to turn 180 degrees (when needed) and most importantly
    // set the target tile x, y coords for each mode, that is all
    // that function should take in the 

    // function to set the mode 
    // receives the mode to switch to (string)
    setMode(mode) {
        if (mode == "chase") {
            // if ghost are set to chase,
            // reset all other modes to false
            // set chase mode to true
            this.resetAllModes();
            this.mode.chase = true;

            // Do the same for the rest of the modes
        } else if (mode == "scatter") {
            this.resetAllModes();
            this.mode.scatter = true;

        } else if (mode == "frightened") {
            this.resetAllModes();
            this.mode.frightened = true;

        } else if (mode == "eaten") {
            this.resetAllModes();
            this.mode.eaten = true;

        }

        // if the attributes of current mode does not match the attributes of previous mode
        // this means there was a change in mode
        if (this.mode.frightened != this.prevMode.frightened ||
            this.mode.scatter != this.prevMode.scatter ||
            this.mode.chase != this.prevMode.chase ||
            this.mode.eaten != this.prevMode.eaten) {
            this.modeChanged = true;
        }
        // Make sure prevMode is equal to mode 
        this.prevMode.eaten = this.mode.eaten;
        this.prevMode.scatter = this.mode.scatter;
        this.prevMode.frightened = this.mode.frightened;
        this.prevMode.chase = this.mode.chase;

    }
    // After setting mode, need to turn 180 degrees (if entering chase, scatter or frightened mode),
    // get appropriate target
    // only for chase mode, target tile keeps changing
    // for eaten mode, the target tile is the starting tile
    // for scatter mode, the target tile is one of the four corners (just need setter function to set target tile)
    // for frightened mode, no target tile

    // function to handle modes
    // receives the pacman current position
    handleMode(pacmanCurrentPosition) {
        // if current mode is not eaten mode
        // turn 180 degrees
        // have to keep track of previous mode
        // if previous mode is different from current mode
        // then turning 180 degrees would execute once

        if (!this.mode.eaten) {

            // if the attributes of current mode does not match the attributes of previous mode
            // this means there was a change in mode
            // thus turn the ghost 180 degrees
            // only change direction only when the ghost is exactly on one tile
            // BIG PROBLEM...IT DOES NOT WORK AS IT SHOULD
            // Problem is that this only happens once, and if the change happens 
            // while the ghost is not exactly on a tile, turning 180 degrees does not happen

            // actually when setting mode,  check if there was a mode change
            // use a boolean to store if there was a mode change in the setMode() function
            // use the boolean and compare with the steps
            // if there was a mode change and steps is 0, turn 180 degrees,
            // change the boolean modeChange back to false
            if (this.steps == 0 && this.modeChanged) {

                console.log("HELLO");

                this.updateDirection(this.currentDirection.x * -1, this.currentDirection.y * -1);
                this.modeChanged = false;
            }
        }
        // set target tile according to respective mode activated
        // if scatter mode is activated, then set the target tile to be the scatter mode target tile
        if (this.mode.scatter) {
            this.setTargetTile(this.scatterModeTargetTileCoords);

            // if chase mode is activated then set target tile to be pacman current position
        } else if (this.mode.chase) {
            this.setTargetTile(pacmanCurrentPosition);

            // if eaten mode is activated, then set the target tile to the ghost's starting position
            // in order to force the ghost to return back to the ghost house
        } else if (this.mode.eaten) {
            this.setTargetTile(this.startingPosition);
        }

    }


    // function to reset all the other modes
    resetAllModes() {
        this.mode.chase = false;
        this.mode.scatter = false;
        this.mode.frightened = false;
        this.mode.eaten = false;
    }

}