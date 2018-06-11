'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Render = exports.Render = function () {
    function Render() {
        _classCallCheck(this, Render);

        this.rowTags = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.letterTags = 'ABCDEFGHIJ';
    }

    _createClass(Render, [{
        key: 'renderTable',
        value: function renderTable(table) {
            var _this = this;

            if (table !== null) {
                var firstLine = '  | ';
                this.rowTags.forEach(function (tag) {
                    firstLine += tag + ' | ';
                });
                console.log(firstLine);

                table.forEach(function (row, rIndex) {
                    var rowString = _this.letterTags.split('')[rIndex] + ' |';
                    row.forEach(function (col, cindex) {
                        if (col === '') {
                            rowString += '   |';
                        } else {
                            rowString += ' ' + (col === 1 ? 'S' : '-') + ' |';
                        }
                    });
                    console.log(rowString);
                });
            }
        }
    }, {
        key: 'renderShootingTable',
        value: function renderShootingTable(table) {
            var _this2 = this;

            if (table !== null) {
                var firstLine = '  | ';
                this.rowTags.forEach(function (tag) {
                    firstLine += tag + ' | ';
                });

                console.log(firstLine);

                table.forEach(function (row, rIndex) {
                    var rowString = _this2.letterTags.split('')[rIndex] + ' |';
                    row.forEach(function (col, cindex) {
                        if (col === '') {
                            rowString += '   |';
                        } else {
                            rowString += ' ' + (col === 1 || col === 0 ? '-' : col === 2 ? 'H' : col === 3 ? 'M' : '') + ' |';
                        }
                    });
                    console.log(rowString);
                });
            }
        }
    }]);

    return Render;
}();
