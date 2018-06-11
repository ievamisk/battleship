export class Render {
    constructor() {
        this.rowTags = [1 ,2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.letterTags = 'ABCDEFGHIJ';
    }

    renderTable(table) {
        if (table !== null) {
            let firstLine = '  | '
            this.rowTags.forEach(tag => {
                firstLine += `${tag} | `;
            });
            console.log(firstLine);
            
            table.forEach((row, rIndex) => {
                let rowString = `${this.letterTags.split('')[rIndex]} |`;
                row.forEach((col, cindex) => {
                    if (col === '') {
                        rowString += '   |';
                    } else {
                        rowString += ` ${col === 1 ? 'S' : '-' } |`;    
                    }
                });
                console.log(rowString);
            });
        }
    }
    
    renderShootingTable(table) {
        if (table !== null) {
            let firstLine = '  | '
            this.rowTags.forEach(tag => {
                firstLine += `${tag} | `;
            });

            console.log(firstLine);
            
            table.forEach((row, rIndex) => {
                let rowString = `${this.letterTags.split('')[rIndex]} |`;
                row.forEach((col, cindex) => {
                    if (col === '') {
                        rowString += '   |';
                    } else {
                        rowString += ` ${col === 1 || col === 0 ? '-' : (col === 2 ? 'H' : (col === 3 ? 'M' : '')) } |`;    
                    }
                });
                console.log(rowString);
            });
        }
    }
}