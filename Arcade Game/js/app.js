// Whole-script strict mode syntax
"use strict";
window.app = {};

app.tile_width = 101,
    app.tile_height = 83,
    app.tile_big_height = 171,
    app.numRows = 8,
    app.numCols = 8,
    app.top_offset = -30,
    app.enemy_num = 2,
    app.canvas_width = app.tile_width * app.numCols,
    app.canvas_height = app.tile_big_height + (app.tile_height * (app.numRows - 1));


var inherit = function(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype); // delegate to prototype
    subClass.prototype.constructor = subClass; // set constructor on prototype
};


var Actor = function(x, y, speed) {
    this.sprite = '';
    this.original_x = x;
    this.original_y = y;
    this.original_speed = speed;
    this.width = app.tile_width;
    this.height = app.tile_height;
    this.reset();
};

//display
Actor.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Actor.prototype.reset = function() {
    this.x = this.original_x;
    this.y = this.original_y;
    this.speed = this.original_speed;
};

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    Actor.call(this, x, y, speed);
    this.sprite = 'images/enemy-bug.png';
};
inherit(Enemy, Actor);

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    if (this.x > app.canvas_width) {
        this.x = 0 - this.width;
    }
};

// Draw the enemy on the screen, required method for game
// Enemy.prototype.render = function() {
//    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// };

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed) {
    Actor.call(this, x, y, speed);
    this.sprite = 'images/char-boy.png';
};

inherit(Player, Actor);

Player.prototype.handleInput = function(direction) {
    if (direction === 'left' && this.x > 0) {
        this.x -= app.tile_width;
    }
    if (direction === 'right' && this.x + app.tile_width < app.canvas_width) {
        this.x += app.tile_width;
    }
    if (direction === 'up' && this.y > app.top_offset + 0 * app.tile_height) {
        this.y -= app.tile_height;
    }
    if (direction === 'down' && this.y < app.top_offset + (app.numRows - 1) * app.tile_height) {
        this.y += app.tile_height;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

for (var row = 1; row <= app.numRows - 3; row++) {
    for (var x = 1; x <= app.enemy_num; x++) {
        var random_col = Math.floor((Math.random() * 4) + -1);
        var random_spd = Math.floor((Math.random() * 200) + 50);

        var enemy = new Enemy(random_col * app.tile_width, app.top_offset + row * app.tile_height, random_spd);

        allEnemies.push(enemy);

    }
}

var player = new Player(Math.floor(app.numCols / 2) * app.tile_width, app.top_offset + (app.numRows - 1) * app.tile_height, 10);

// This listens for key presses and sends the keys to your

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
