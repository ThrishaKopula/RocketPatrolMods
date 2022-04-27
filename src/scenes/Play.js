var text;
var count = 0;
class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }
    create() {
        // place tile sprite
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);
        this.backBuilding = this.add.tileSprite(0, 0, 640, 480, 'backBuilding').setOrigin(0, 0);
        this.mainBuilding = this.add.tileSprite(0, 0, 640, 480, 'mainBuilding').setOrigin(0, 0);
        this.road = this.add.tileSprite(0, 0, 640, 480, 'road').setOrigin(0, 0);
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x55b3b4).setOrigin(0, 0);
        this.add.rectangle(0, borderUISize + borderPadding-10, game.config.width, borderUISize * 2, 0x1a3c3d).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        // initialize score
        this.p1Score = 0;
        this.p2Score = 0;
         // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#55b3b4',
            color: '#000000',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 'P1 SCORE: ');
        this.scoreLeft = this.add.text(borderUISize + borderPadding+90, borderUISize + borderPadding*2, this.p1Score);

        this.scoreLeft2 = this.add.text(borderUISize + borderPadding+250, borderUISize + borderPadding*2, 'P2 SCORE: ');
        this.scoreLeft2 = this.add.text(borderUISize + borderPadding+340, borderUISize + borderPadding*2, this.p2Score);
        // GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        let winner;
        this.clock = this.time.delayedCall(60000, () => {
            if(this.p1Score > this.p2Score) {
                winner = 'P1';
            } else if(this.p2Score > this.p1Score) {
                winner = 'P2';
            } else {
                winner = 'TIE';
            }
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 128, 'WINNER:', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2 + 80, game.config.height/2 + 128, winner, scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        text = this.add.text(160, 53);
    }

    update() {
        text.setText( 'TIME: ' + (60 - this.clock.getElapsedSeconds()).toString().substr(0, 4));
        // check key input for restarts
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        this.road.tilePositionX -= 4; //parallax could be here
        this.mainBuilding.tilePositionX -= 2;
        this.backBuilding.tilePositionX -= 1;
        this.background.tilePositionX -= 0.5;
        this.p1Rocket.update();
        this.ship01.update();               // update spaceships (x3)
        this.ship02.update();
        this.ship03.update();
        // check collisions
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        } 

        if(keyF.isDown) {
            count = 0;
        }
        if(keyW.isDown) {
            count = 1;
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        this.sound.play('explosion');
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });
        console.log("count: ", count);
        if(count == 0) {
            this.p1Score += ship.points;
        } else if(count == 1) {
            this.p2Score += ship.points;
        }
        // score add and repaint
       // this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.scoreLeft2.text = this.p2Score;
    }

    preload() {
        // load images/tile sprites
        this.load.audio('explosion', './assets/explosion.wav');
        this.load.image('rocket', './assets/fireball.png');
        this.load.image('spaceship', './assets/ghost.png');
        this.load.image('starfield', './assets/newStarfield.png');
        this.load.image('background', './assets/starfieldBackground.png');
        this.load.image('backBuilding', './assets/backBuildings.png');
        this.load.image('mainBuilding', './assets/mainBuildings.png');
        this.load.image('road', './assets/road.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/newExplosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }
}