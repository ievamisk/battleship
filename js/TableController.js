'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TableController = exports.TableController = function () {
    function TableController() {
        _classCallCheck(this, TableController);

        this.col = 'abcdefghij';
        this.placeShip = this.placeShip.bind(this);
    }

    _createClass(TableController, [{
        key: 'placeShip',
        value: function placeShip(table, input, shipSize) {
            var _this = this;

            return new Promise(async function (resolve, reject) {
                var colIndex = -1;
                var rowIndex = void 0;
                var direction = void 0;

                // getting ship coords
                rowIndex = _this.col.split('').indexOf(input.toLowerCase().split(' ')[0]);
                colIndex = Number.parseInt(input.split(' ')[1], 10) - 1;
                direction = input.split(' ')[2];

                console.log(rowIndex, colIndex, direction);

                var _ref = await _this.getAllCoords([rowIndex, colIndex], direction, shipSize),
                    shipCoords = _ref.shipCoords,
                    shipSurroundingCoords = _ref.shipSurroundingCoords;

                if (shipCoords !== null && shipSurroundingCoords !== null) {
                    if ((await _this.checkAvailability(table, shipCoords)) && (await _this.checkAvailability(table, shipSurroundingCoords))) {
                        shipCoords.forEach(function (coord, index) {
                            table[coord[0]][coord[1]] = 1;

                            // checks when finished
                            if (index === shipCoords.length - 1) {
                                var isPlaced = true;
                                resolve({ table: table, isPlaced: isPlaced });
                            }
                        });
                    } else {
                        console.log('Sorry you can not place your ship here. Place elsewhere!');
                    }
                } else {
                    console.log('err');
                }
            });
        }
    }, {
        key: 'getAllCoords',
        value: function getAllCoords(coords, direction, size) {
            return new Promise(function (resolve, reject) {
                var shipCoords = [];
                var shipSurroundingCoords = [];

                if (direction === 'h') {
                    if (coords[1] + (size - 1) > 9) {
                        console.log('h', coords[0], size);
                        console.log('Not enough space to place your ship');
                        reject(null, null);
                    } else {
                        for (var i = 0; i < size; i++) {
                            // push ship coords
                            shipCoords.push([coords[0], coords[1] + i]);

                            // checking upper row if it is not negative
                            if (i === 0) {
                                shipSurroundingCoords.push([coords[0] - 1, coords[1] - 1]);
                                shipSurroundingCoords.push([coords[0], coords[1] - 1]);
                                shipSurroundingCoords.push([coords[0] + 1, coords[1] - 1]);
                            }

                            // getting surrounding (sides) coord
                            shipSurroundingCoords.push([coords[0] - 1, coords[1] + i]);
                            shipSurroundingCoords.push([coords[0] + 1, coords[1] + i]);

                            // checking for lower row if it less than 10
                            if (i === size - 1) {
                                shipSurroundingCoords.push([coords[0] - 1, coords[1] + i + 1]);
                                shipSurroundingCoords.push([coords[0], coords[1] + i + 1]);
                                shipSurroundingCoords.push([coords[0] + 1, coords[1] + i + 1]);
                            }
                        }
                    }
                } else {
                    if (coords[0] + (size - 1) > 9) {
                        console.log('v', coords[1], size);
                        console.log('Not enough space to place your ship');
                        reject(null, null);
                    } else {
                        for (var _i = 0; _i < size; _i++) {
                            shipCoords.push([coords[0] + _i, coords[1]]);

                            // checking upper row if it is not negative
                            if (_i === 0) {
                                shipSurroundingCoords.push([coords[0] - 1, coords[1] - 1]);
                                shipSurroundingCoords.push([coords[0] - 1, coords[1]]);
                                shipSurroundingCoords.push([coords[0] - 1, coords[1] + 1]);
                            }

                            // getting surrounding (sides) coord
                            shipSurroundingCoords.push([coords[0] + _i, coords[1] - 1]);
                            shipSurroundingCoords.push([coords[0] + _i, coords[1] + 1]);

                            // checking for lower row if it less than 10
                            if (_i === size - 1) {
                                shipSurroundingCoords.push([coords[0] + _i + 1, coords[1] - 1]);
                                shipSurroundingCoords.push([coords[0] + _i + 1, coords[1]]);
                                shipSurroundingCoords.push([coords[0] + +_i + 1, coords[1] + 1]);
                            }
                        }
                    }
                }

                resolve({ shipCoords: shipCoords, shipSurroundingCoords: shipSurroundingCoords });
            });
        }

        // checks if place for ship is available

    }, {
        key: 'checkAvailability',
        value: function checkAvailability(table, coords) {
            return new Promise(function (resolve, reject) {
                coords.forEach(function (coord, index) {
                    if (coord[0] > -1 && coord[0] < 10 && coord[1] > -1 && coord[1] < 10) {
                        if (table[coord[0]][coord[1]] !== 0) {
                            console.log(table[coord[0]][coord[1]], coord[0], coord[1]);
                            resolve(false);
                        }
                    }

                    if (index === coords.length - 1) {
                        resolve(true);
                    }
                });
            });
        }
    }, {
        key: 'attackShip',
        value: function attackShip(table, input) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                var colIndex = -1;
                var rowIndex = void 0;

                // getting coords
                rowIndex = _this2.col.split('').indexOf(input.toLowerCase().split(' ')[0]);
                colIndex = Number.parseInt(input.split(' ')[1], 10) - 1;

                if (table[rowIndex][colIndex] === 1) {
                    console.log('You hit the ship!\n');
                    table[rowIndex][colIndex] = 2; // 1 - ship, 2 - hited ship
                    resolve([table, true]);
                } else if (table[rowIndex][colIndex] === 2 || table[rowIndex][colIndex] === 3) {
                    console.log('You already hit that place! Hit again!\n');
                    resolve([table, true]);
                } else {
                    console.log('You missed\n');
                    table[rowIndex][colIndex] = 3;
                    resolve([table, false]);
                }
            });
        }
    }]);

    return TableController;
}();
