/**
 * File: Ghost.js
 * ---------------
 * Class for the ghost objects
 */
class Ghost {
    constructor(x, y, width, speed) {
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

        // previous direction which ghost was moving
        // this.prevDirection = createVector(this.direction.x, this.direction.y);

        // x, y coordinates of the target tile 
        this.targetTileCoords = createVector(0, 0);
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
            // if not check which one has the shorter distance to the target tile
            let distances = [];

            // Calculate all the distances
            for (let i = 0; i < tilesAhead.length; i++) {
                distances.push(dist(this.targetTileCoords.x, this.targetTileCoords.y, tilesAhead[i].x, tilesAhead[i].y));
            }

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

            // Need to handle a few different cases
            // Also implement the directional hierachy
            // Few cases that need to be handled
            // if there are only two distances and they are equal, need to check the directions
            // Direction hierachy
            // -------------------
            // 1) UP
            // 2) LEFT
            // 3) DOWN
            // 4) RIGHT
            // If the directions contains UP, return that direction
            // If the directions contains LEFT, return that direction
            // If the directions contains DOWN, return that direction
            // If the directions contains RIGHT, return that direction

            // if there are three distances 
            // and they are equal, do the same thing
            // if they are all different, find smallest
            // if two of them are the same, check if either one is smaller than the odd one out
            // if the two of the same are smaller, check against direction hierachy
            // if the two of the same are larger, then go with the odd one out which is smaller
            return directions[index];
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

}