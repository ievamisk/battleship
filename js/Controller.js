'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Controller = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Render = require('./Render');

var _TableController = require('./TableController');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// const prompt = require('prompt');
var readline = require('readline');

var Controller = exports.Controller = function () {
    function Controller() {
        var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
        var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

        _classCallCheck(this, Controller);

        this.tableConfig = {
            width: width,
            height: height
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
        };

        this.tableController = new _TableController.TableController();
        this.render = new _Render.Render();

        // input
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.handleInput = this.handleInput.bind(this);
        this.readline.on('line', this.handleInput);

        this.currentShip = 'battleship:0';
        this.winner = 0;

        this.ships = {
            amount: 10,
            parts: 20,
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
        };

        for (var row = 0; row < this.tableConfig.height; row++) {
            this.table1player.push([]);
            this.table2player.push([]);
            for (var col = 0; col < this.tableConfig.width; col++) {
                this.table1player[row].push(0);
                this.table2player[row].push(0);
            }
        }
        this.init();
    }

    _createClass(Controller, [{
        key: 'handleInput',
        value: async function handleInput(input) {
            switch (this.gameState) {
                case this.GAME_STATES.START:
                    console.log('Welcome to BATTLESHIP!');
                    console.log('Player1 please place your ships (format: `a 1 h`)\n');

                    this.render.renderTable(this.table1player);

                    console.log('Place: ' + this.currentShip.split(':')[0] + ' Size of: ' + this.ships[this.currentShip.split(':')[0]].size);

                    this.gameState = this.GAME_STATES.PLACING_SHIPS_PLAYER1;
                    break;

                case this.GAME_STATES.PLACING_SHIPS_PLAYER1:
                    // fill this.table1player with its ships
                    if (input !== '') {
                        var shipName = this.currentShip.split(':')[0];
                        var shipCount = Number.parseInt(this.currentShip.split(':')[1], 10);

                        var _ref = await this.tableController.placeShip(this.table1player, input, this.ships[shipName].size),
                            table = _ref.table,
                            isPlaced = _ref.isPlaced;

                        if (isPlaced) {
                            this.placingShips(this.table1player, shipName, shipCount);
                        }
                    } else {
                        console.log('something went wrong');
                    }

                    break;

                case this.GAME_STATES.PLACING_SHIPS_PLAYER2:
                    // fill table2player with its ships
                    if (input !== '') {
                        var _shipName = this.currentShip.split(':')[0];
                        var _shipCount = Number.parseInt(this.currentShip.split(':')[1], 10);

                        var _ref2 = await this.tableController.placeShip(this.table2player, input, this.ships[_shipName].size),
                            _table = _ref2.table,
                            _isPlaced = _ref2.isPlaced;

                        if (_isPlaced) {
                            this.placingShips(this.table2player, _shipName, _shipCount);
                        }
                    } else {
                        console.log('Something went wrong');
                    }

                    break;

                case this.GAME_STATES.PLAYER1_TURN:
                    var shot = await this.tableController.attackShip(this.table2player, input);

                    this.table2player = shot[0];

                    if (!shot[1]) {
                        this.render.renderShootingTable(this.table1player);
                        this.gameState = this.GAME_STATES.PLAYER2_TURN;
                        console.log('\nTake a hit, Player2:\n');
                    } else {
                        this.render.renderShootingTable(this.table2player);

                        console.log((await this.calculateWin(this.table2player)));

                        if ((await this.calculateWin(this.table2player)) === this.ships.parts) {
                            this.winner = 1;
                            this.gameState = this.GAME_STATES.END;
                            this.handleInput(null);
                        } else {
                            console.log('\nTake a hit, Player1:\n');
                        }
                    }

                    break;

                case this.GAME_STATES.PLAYER2_TURN:
                    var shot2 = await this.tableController.attackShip(this.table1player, input);

                    this.table1player = shot2[0];

                    if (!shot2[1]) {
                        this.render.renderShootingTable(this.table2player);
                        this.gameState = this.GAME_STATES.PLAYER1_TURN;
                        console.log('\nTake a hit, Player1:\n');
                    } else {
                        this.render.renderShootingTable(this.table1player);

                        if ((await this.calculateWin(this.table1player)) === this.ships.parts) {
                            this.winner = 2;
                            this.gameState = this.GAME_STATES.END;
                            this.handleInput(null);
                        } else {
                            console.log('\nTake a hit, Player2:\n');
                        }
                    }

                    break;

                case this.GAME_STATES.END:
                    console.log('Congrats, ' + (this.winner === 1 ? 'Player1' : 'Player2') + '!');
                    break;
            }
        }
    }, {
        key: 'placingShips',
        value: function placingShips(table, shipName, shipCount) {
            if (this.gameState === this.GAME_STATES.PLACING_SHIPS_PLAYER1) {
                this.render.renderTable(this.table1player);
            } else if (this.gameState === this.GAME_STATES.PLACING_SHIPS_PLAYER2) {
                this.render.renderTable(this.table2player);
            }

            if (shipCount + 1 === this.ships[shipName].amount) {
                // switch to next ship!
                var currentIndex = Object.keys(this.ships).indexOf(shipName);
                if (currentIndex < Object.keys(this.ships).length - 1) {
                    this.currentShip = Object.keys(this.ships)[currentIndex + 1] + ':0';

                    console.log('Place: ' + this.currentShip.split(':')[0] + ' Size of: ' + this.ships[this.currentShip.split(':')[0]].size);
                } else {
                    console.log('\nYay! All ships placed\n');

                    if (this.gameState === this.GAME_STATES.PLACING_SHIPS_PLAYER1) {
                        this.currentShip = 'battleship:0';
                        console.log('\nPlayer2 please place your ships (format: `a 1 h`)\n');

                        this.render.renderTable(this.table2player);

                        console.log('Place: ' + this.currentShip.split(':')[0] + ' Size of: ' + this.ships[this.currentShip.split(':')[0]].size);
                        this.gameState = this.GAME_STATES.PLACING_SHIPS_PLAYER2;
                    } else {
                        console.log('Take a hit, Player1:\n');
                        this.gameState = this.GAME_STATES.PLAYER1_TURN;
                    }
                }
            } else {
                // increase placed amount
                this.currentShip = shipName + ':' + (shipCount + 1);
                console.log('Place: ' + this.currentShip.split(':')[0] + ' Size of: ' + this.ships[this.currentShip.split(':')[0]].size);
            }
        }
    }, {
        key: 'calculateWin',
        value: function calculateWin(table) {
            return new Promise(function (resolve) {
                var count = 0;

                table.forEach(function (row, rIndex) {
                    row.forEach(function (col, cIndex) {
                        if (col === 2) {
                            count++;
                        }

                        if (rIndex === table.length - 1 && cIndex === row.length - 1) {
                            resolve(count);
                        }
                    });
                });
            });
        }
    }, {
        key: 'init',
        value: function init() {
            var player = 0;
            this.winner = 0;
            this.gameState = this.GAME_STATES.START;

            this.handleInput(null);
        }
    }]);

    return Controller;
}();
