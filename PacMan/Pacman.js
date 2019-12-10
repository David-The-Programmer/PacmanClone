/**
 * File: Pacman.js
 * ------------------
 * Class for the pacman object  
 */
class Pacman {
    constructor(x, y, width) {
        // current position vector of pacman
        this.currentPosition = createVector(x, y);

        // width (diameter) of pacman
        this.width = width;

        // direction vector which pacman moves
        this.direction = createVector(-1, 0);

        // number of steps pacman takes to move from one tile to the next
        this.steps = 0;


    }

    // function to display the pacman
    show() {
        fill(255, 255, 0);
        noStroke();
        ellipse(this.currentPosition.x, this.currentPosition.y, this.width);
    }

    // function to make pacman move
    move() {
        this.currentPosition.x += this.direction.x;
        this.currentPosition.y += this.direction.y;
        this.steps++;
        // reset steps when it hits 16 as pacman has to travel 16 pixels to move from one tile to the next
        if (this.steps == 16) {
            this.steps = 0;
        }
    }

    // function to update the x and y velocities to change direction which pacman moves
    // receives x velocity and y velocity which pacman is to move
    updateDirection(xVel, yVel) {
        // only if pacman is exactly on one tile, then update its direction
        if (this.steps == 0) {
            this.direction.x = xVel;
            this.direction.y = yVel;
        }
    }

    // function to stop pacman once it reaches a wall
    stop() {
        this.direction.x = 0;
        this.direction.y = 0;
    }

    // function to move pacman in the opposite direction for one tile
    moveBack() {
        this.currentPosition.x -= this.direction.x;
        this.currentPosition.y -= this.direction.y;
    }

}