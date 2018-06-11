export class TableController {
    constructor() {
        this.col = 'abcdefghij';
        this.placeShip = this.placeShip.bind(this);
    }

    placeShip(table, input, shipSize) {
        return new Promise(async (resolve, reject) => {
            let colIndex = -1;
            let rowIndex;
            let direction;

            // getting ship coords
            rowIndex = this.col.split('').indexOf(input.toLowerCase().split(' ')[0]);
            colIndex = (Number.parseInt(input.split(' ')[1], 10)) - 1;
            direction = input.split(' ')[2];
                        
            const { shipCoords, shipSurroundingCoords } = await this.getAllCoords([rowIndex, colIndex], direction, shipSize);

            if (shipCoords !== null && shipSurroundingCoords !== null) {
                if (await this.checkAvailability(table, shipCoords) && await this.checkAvailability(table, shipSurroundingCoords)) {
                    shipCoords.forEach((coord, index) => {
                        table[coord[0]][coord[1]] = 1;
                        
                        // checks when finished
                        if (index === shipCoords.length - 1) {
                            const isPlaced = true;
                            resolve({table, isPlaced});
                        }
                    });
                } else {
                    console.log('Sorry you can not place your ship here. Place elsewhere!');
                }
            } else {
                console.log('err')
            }
        });
    }

    getAllCoords(coords, direction, size) {
        return new Promise((resolve, reject) => {
            let shipCoords = [];
            let shipSurroundingCoords = [];

            if (direction === 'h') {
                if (coords[1] + (size - 1) > 9) {
                    console.log('Not enough space to place your ship')
                    reject(null, null);
                } else {
                    for (let i = 0; i < size; i++) {
                        // push ship coords
                        shipCoords.push([coords[0], coords[1] + i]);

                        // checking upper row if it is not negative
                        if (i === 0) {
                            shipSurroundingCoords.push([coords[0] - 1, coords[1] - 1]);
                            shipSurroundingCoords.push([coords[0], coords[1] - 1])
                            shipSurroundingCoords.push([coords[0] + 1, coords[1] - 1])
                        }

                        // getting surrounding (sides) coord
                        shipSurroundingCoords.push([coords[0] - 1, coords[1] + i]);
                        shipSurroundingCoords.push([coords[0] + 1, coords[1] + i]);

                        // checking for lower row if it less than 10
                        if (i === size-1) {
                            shipSurroundingCoords.push([coords[0] - 1, coords[1] + i + 1]);
                            shipSurroundingCoords.push([coords[0], coords[1] + i + 1])
                            shipSurroundingCoords.push([coords[0] + 1, coords[1] + i + 1])
                        }
                    }
                }
            } else {
                if (coords[0] + (size-1) > 9) {
                    console.log('Not enough space to place your ship')
                    reject(null, null);

                } else {
                    for (let i = 0; i < size; i++) {
                        shipCoords.push([coords[0] + i, coords[1]]);

                        // checking upper row if it is not negative
                        if (i === 0) {
                            shipSurroundingCoords.push([coords[0] - 1, coords[1] - 1]);
                            shipSurroundingCoords.push([coords[0] - 1, coords[1]])
                            shipSurroundingCoords.push([coords[0] - 1, coords[1] + 1])
                        }

                        // getting surrounding (sides) coord
                        shipSurroundingCoords.push([coords[0] + i, coords[1] - 1]);
                        shipSurroundingCoords.push([coords[0] + i, coords[1] + 1]);

                        // checking for lower row if it less than 10
                        if (i === size-1) {
                            shipSurroundingCoords.push([coords[0] + i + 1, coords[1] - 1]);
                            shipSurroundingCoords.push([coords[0] + i + 1, coords[1]])
                            shipSurroundingCoords.push([coords[0] + +i + 1, coords[1] + 1])
                        }
                    }
                }
            }

            resolve({shipCoords, shipSurroundingCoords});
        });
    }

    // checks if place for ship is available
    checkAvailability(table, coords) {
        return new Promise((resolve, reject) => {
            coords.forEach((coord, index) => {
                if (coord[0] > -1 && coord[0] < 10 && coord[1] > -1 && coord[1] < 10) {
                    if (table[coord[0]][coord[1]] !== 0) {
                        resolve(false);
                    }
                }
                
                if (index === coords.length - 1) {
                    resolve(true);       
                }
            });
        });
    }

    attackShip(table, input) {
        return new Promise((resolve, reject) => {
            let colIndex = -1;
            let rowIndex;

            // getting coords
            rowIndex = this.col.split('').indexOf(input.toLowerCase().split(' ')[0]);
            colIndex = (Number.parseInt(input.split(' ')[1], 10)) - 1;
            
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
}