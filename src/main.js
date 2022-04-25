//Thrisha Kopula, Rocket Patrol Modifications, 4/20/22, ~10 hours to complete

//Changed the theme (art, UI, sounds) - 60 points
//Implemented alternating 2 player mode (A for left, D for right, and W for fire) - 20 points
//Implemented parallax scrolling - 10 points
//Displayed time on screen - 10 points

//Note: You have to click on the screen to hear the background music because of a chrome error


let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;

// 2nd player
let keyW, keyA, keyD;

