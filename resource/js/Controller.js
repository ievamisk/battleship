import { Render } from './Render';
import { TableController } from './TableController';
// const prompt = require('prompt');
const readline = require('readline');

export class Controller {
    constructor(width = 10, height = 10) {
        this.tableConfig = {
            width,
            height
        };

        // tables
        this.table1player = [];
        this.table2player = [];
        
        this.shootingTable1player = [];
        this.shootingTable2player = [];

        // game states
        this.gameState = '';

        this.GAME_STATES = {
            START: 'START',
            END: 'END',
            PLACING_SHIPS_PLAYER1: 'PLACING_SHIPS_PLAYER1',
            PLACING_SHIPS_PLAYER2: 'PLACING_SHIPS_PLAYER2',
            PLAYER1_TURN: 'PLAYER1_TURN',
            PLAYER2_TURN: 'PLAYER2_TURN'
        }
        
        this.tableController = new TableController();
        this.render = new Render();

        // input
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.handleInput = this.handleInput.bind(this);
        this.readline.on('line', this.handleInput);

        this.currentShip = 'battleship:0';

        this.ships = {
            amount: 10,
            battleship: {
                size: 4,
                amount: 1
            },
            cruiser: {
                size: 3,
                amount: 2
            },
            destroyer: {
                size: 2,
                amount: 3
            },
            submarine: {
                size: 1,
                amount: 4
            }
        }

        for (let row = 0; row < this.tableConfig.height; row++) {
            this.table1player.push([]);
            this.table2player.push([]);
            for (let col = 0; col < this.tableConfig.width; col++) {
                this.table1player[row].push(0);
                this.table2player[row].push(0);
            }
        }
        this.init();
    }

    
    async handleInput(input) {
        switch(this.gameState) {
            case this.GAME_STATES.START: 
                console.log('Welcome to BATTLESHIP!');
                console.log('Player1 please place your ships (format: `a 1 h`)\n');

                this.render.renderTable(this.table1player);

                console.log(`Place: ${this.currentShip.split(':')[0]} Size of: ${this.ships[this.currentShip.split(':')[0]].size}`);

                this.gameState = this.GAME_STATES.PLACING_SHIPS_PLAYER1;
                break;

            case this.GAME_STATES.PLACING_SHIPS_PLAYER1:
                // fill this.table1player with its ships
                if (input !== '') {
                    const shipName = this.currentShip.split(':')[0];
                    const shipCount = Number.parseInt(this.currentShip.split(':')[1], 10);
                    const { table, isPlaced } = await this.tableController.placeShip(this.table1player, input, this.ships[shipName].size);
                    
                    if (isPlaced) {
                        this.placingShips(this.table1player, shipName, shipCount);
                    }

                } else {
                    console.log('something went wrong')
                }

                break;

            case this.GAME_STATES.PLACING_SHIPS_PLAYER2:
                // fill table2player with its ships
                if (input !== '') {
                    const shipName = this.currentShip.split(':')[0];
                    const shipCount = Number.parseInt(this.currentShip.split(':')[1], 10);

                    const { table, isPlaced } = await this.tableController.placeShip(this.table2player, input, this.ships[shipName].size);

                    if (isPlaced) {
                        this.placingShips(this.table2player, shipName, shipCount);
                    }
                } else {
                    console.log('Something went wrong')
                }

                break;

            case this.GAME_STATES.PLAYER1_TURN:
                const shot = await this.tableController.attackShip(this.table2player, input);

                this.table2player = shot[0];

                if (!shot[1]) {
                    this.render.renderShootingTable(this.table1player);
                    this.gameState = this.GAME_STATES.PLAYER2_TURN;
                    console.log('\nTake a hit, Player2:\n');
                } else {
                    this.render.renderShootingTable(this.table2player);
                    console.log('\nTake a hit, Player1:\n');
                }

                break;
            
            case this.GAME_STATES.PLAYER2_TURN:
                const shot2 = await this.tableController.attackShip(this.table1player, input);

                this.table1player = shot2[0];
                
                if (!shot2[1]) {
                    this.render.renderShootingTable(this.table2player);
                    this.gameState = this.GAME_STATES.PLAYER1_TURN;
                    console.log('\nTake a hit, Player1:\n');
                } else {
                    this.render.renderShootingTable(this.table1player);
                    console.log('\nTake a hit, Player2:\n');
                }

                break;

            case this.GAME_STATES.END: 
                console.log('Finish');
                break;
        }
    }

    placingShips(table, shipName, shipCount) {
        if (shipCount + 1 === this.ships[shipName].amount) {
            // switch to next ship!
            const currentIndex = Object.keys(this.ships).indexOf(shipName);

            if (currentIndex < Object.keys(this.ships).length - 1) {
                this.currentShip = `${Object.keys(this.ships)[currentIndex + 1]}:0`;
                
                if (this.gameState === this.GAME_STATES.PLACING_SHIPS_PLAYER1) {
                    this.render.renderTable(this.table1player);
                } else if (this.gameState === this.GAME_STATES.PLACING_SHIPS_PLAYER2) {
                    this.render.renderTable(this.table2player);
                }
                console.log(`Place: ${this.currentShip.split(':')[0]} Size of: ${this.ships[this.currentShip.split(':')[0]].size}`);
            } else {
                console.log('\nYay! All ships placed\n');

                if (this.gameState === this.GAME_STATES.PLACING_SHIPS_PLAYER1) {
                    this.currentShip = 'battleship:0';
                    console.log('\nPlayer2 please place your ships (format: `a 1 h`)\n');      

                    this.render.renderTable(this.table2player);

                    console.log(`Place: ${this.currentShip.split(':')[0]} Size of: ${this.ships[this.currentShip.split(':')[0]].size}`);
                    this.gameState = this.GAME_STATES.PLACING_SHIPS_PLAYER2;
                } else {
                    console.log('Take a hit, Player1:\n');
                    this.gameState = this.GAME_STATES.PLAYER1_TURN;
                }
            }
        } else {
            // increase placed amount
            this.currentShip = `${shipName}:${shipCount+1}`;
            console.log(`Place: ${this.currentShip.split(':')[0]} Size of: ${this.ships[this.currentShip.split(':')[0]].size}`);
        }
    }

    init() {
        let player = 0;
        this.gameState = this.GAME_STATES.START;

        this.handleInput(null);
    }
}