let gridSize;
let sizeWinnerScale;
let grid = [];
let playerCurrent = 'X';
let historyGamePlay = { playerWin: '', gridSize: 3, sizeWinnerScale: 3, step: [] };
let gridIsFull = false;
let havePlayersWin = false;
let winnerPlayer = '';
let displayPlayer1, displayPlayer2, displayWinner, displayTextWinner;

// รับ id แสดง Player 1 , Player 2 , Winner และ TextWinner
function getIdDisplayPlayer(player1, player2, winner, textWinner) {
    displayPlayer1 = document.getElementById(player1);
    displayPlayer2 = document.getElementById(player2);
    displayWinner = document.getElementById(winner);
    displayTextWinner = document.getElementById(textWinner);
    //console.log("Done.");
}

//เปลี่ยนค่าต่างๆเป็นค่าเริ่มต้น
function resetGameValues() {
    playerCurrent = 'X';
    gridIsFull = false;
    havePlayersWin = false;
    winnerPlayer = '';
    historyGamePlay = { playerWin: '', gridSize: 3, sizeWinnerScale: 3, step: [] };
}

//เริ่มเกมส์
function startGame(gridSizeInput, sizeWinnerScaleInput, tableDisplay) {
    gridSize = parseInt(gridSizeInput);
    sizeWinnerScale = parseInt(sizeWinnerScaleInput);
    resetGameValues();
    historyGamePlay.gridSize = gridSize;
    historyGamePlay.sizeWinnerScale = sizeWinnerScale;
    grid = createGrid()
    tableDisplay.innerHTML = drawGrid();
    tableDisplay.style.display = "inline";
    //console.log("gridSize : " + gridSize + "|" + "sizeWinnerScale : " + sizeWinnerScale);
}

//สร้างตาราง
function createGrid() {
    let resultGrid = [];
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            resultGrid.push({ x: x, y: y, data: '' });
        }
    }
    return resultGrid;
}

//วาดตาราง
function drawGrid() {
    let gridDisplay = ``;
    let rowGrid = ``;
    for (let i = 0; i < grid.length; i++) {
        rowGrid += `<td class="slot" id="x${grid[i].x}y${grid[i].y}" onclick="gridXYAction(${grid[i].x}, ${grid[i].y})"></td>`;// i:${i},${grid[i].x},${grid[i].y}
        if (grid[i].x == (gridSize - 1)) {
            gridDisplay += `<tr>${rowGrid}</tr>`;
            rowGrid = ``;
        }
    }
    return gridDisplay;
}


// ตารางที่ตำแหน่ง X Y กดแล้วเกิดการเปลี่ยนแปลง
function gridXYAction(x, y) {
    if (checkEmptyInGridXY(x, y) == true && gridIsFull == false && havePlayersWin == false) {
        const gridXYDisplay = document.getElementById(`x${x}y${y}`);
        // console.log(x + "," + y);
        // เปลี่ยนค่า data ใน grid ที่ตำแหน่ง X Y เป็นค่า playerCurrent
        grid.find(grid => grid.x === x && grid.y === y).data = playerCurrent;
        gridXYDisplay.innerHTML = grid.find(grid => grid.x === x && grid.y === y).data;
        // จดจำตำแหน่งที่คลิก
        addHistoryStep(x, y);
        havePlayersWin = checkHavePlayerWinner();
        gridIsFull = checkEmptyInGridAll();
        // ตรวจสอบว่ามีผู้ชนะหรือตารางเต็ม
        if (havePlayersWin == true || gridIsFull == true) {
            displayWinner.style.display = "inline";
            if (havePlayersWin) {
                historyGamePlay.playerWin = playerCurrent;
                displayTextWinner.innerHTML = `ผู้เล่น ${playerCurrent} ชนะ`;
            } else {
                historyGamePlay.playerWin = 'เสมอ';
                displayTextWinner.innerHTML = `เสมอ`;
            }
            //console.log(historyGamePlay);
            saveDataToDataBase();
        } else {
            switchPlayer();
            displayPlayerCurrent();
        }
    }
}

// ตรวจสอบว่าตารางที่ตำแหน่ง X Y ว่าง
function checkEmptyInGridXY(x, y) {
    let result = false;
    if (grid.find(grid => grid.x === x && grid.y === y)?.data === '') {
        result = true;
    }
    return result;
}

//ตรวจสอบว่าช่องในตารางทั้งหมดเต็มหรือยัง
function checkEmptyInGridAll() {
    let result = true;
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].data === '') {
            result = false;
            break;
        }
    }
    return result;
}

// ตรวจสอบผู้ชนะ
function checkHavePlayerWinner() {
    let result = false;
    if (horizontalCheck() == true || verticalCheck() == true || diagonallyDownToRightCheck() == true || diagonallyDownToLeftCheck() == true) {
        result = true;
    }
    return result
}

// ตรวจสอบแนวนอน
function horizontalCheck() {
    let result = false;
    for (let i = 0; i < grid.length; i++) {
        // test
        // console.log("Horizontal Start: " + (i) + "|" + grid[i].x + "," + grid[i].y + "," + grid[i].data)
        // for (let index = i + 1; index < i + (sizeWinnerScale - 1); index++) {
        //     console.log("Horizontal loop: " + (index) + "|" + grid[index].x + "," + grid[index].y + "," + grid[index].data)
        // }
        // console.log("Horizontal End: " + (i + (sizeWinnerScale - 1)) + "|" + grid[i + (sizeWinnerScale - 1)].x + "," + grid[i + (sizeWinnerScale - 1)].y + "," + grid[i + (sizeWinnerScale - 1)].data);
        // if ((grid[i].x + sizeWinnerScale) == gridSize) {
        //     i += sizeWinnerScale - 1;
        // }

        // ตรวจสอบว่า 
        // grid[i] ที่ data ตรงกับ playerCurrent และ grid[i + (sizeWinnerScale-1)] ที่ data ตรงกับ playerCurrent 
        if (grid[i].data == playerCurrent && grid[i + (sizeWinnerScale - 1)].data == playerCurrent) {
            result = horizontalInsiteCheck(i);
            if (result) {
                break;
            }
        }
        // ตรวจสอบว่า
        // grid[i].x + sizeWinnerScale แล้วเท่ากับ gridSize(ขนาดของตาราง) ให้จบการทำงาน
        if ((grid[i].x + sizeWinnerScale) == gridSize) {
            i += sizeWinnerScale - 1;
        }
    }
    return result;
}

// วนตรวจสอบแนวนอนจากตำแหน่งถัดจากเริ่มต้นแต่ยังน้อยกว่าสิ้นสุด
function horizontalInsiteCheck(i) {
    let result = true;
    for (let index = i + 1; index < i + (sizeWinnerScale - 1); index++) {
        if (grid[index].data != playerCurrent) {
            result = false;
            break;
        }
    }
    return result;
}

// ตรวจสอบแนวตั้ง
function verticalCheck() {
    let result = false;
    for (let i = 0; i < grid.length; i++) {
        // test
        // console.log("Vertical Start: " + (i) + "|" + grid[i].x + "," + grid[i].y + "," + grid[i].data)
        // for (let index = i + gridSize; index < (i + (gridSize * (sizeWinnerScale - 1))); index+=gridSize) {
        //     console.log("Vertical loop: " + (index) + "|" + grid[index].x + "," + grid[index].y + "," + grid[index].data)
        // }
        // console.log("Vertical End: " + (i + (gridSize * (sizeWinnerScale - 1))) + "|" + grid[i + (gridSize * (sizeWinnerScale - 1))].x + "," + grid[i + (gridSize * (sizeWinnerScale - 1))].y + "," + grid[i + (gridSize * (sizeWinnerScale - 1))].data);
        // if (grid[i+1].y + (sizeWinnerScale - 1) == gridSize) {
        //     break;
        // }

        // ตรวจสอบว่า 
        // grid[i] ที่ data ตรงกับ playerCurrent และ grid[i + (gridSize * (sizeWinnerScale - 1))] ที่ data ตรงกับ playerCurrent 
        if (grid[i].data == playerCurrent && grid[i + (gridSize * (sizeWinnerScale - 1))].data == playerCurrent) {
            result = verticalInsiteCheck(i);
            if (result) {
                break;
            }
        }
        // ตรวจสอบว่า
        // grid[i+1].y + (sizeWinnerScale - 1) แล้วเท่ากับ gridSize(ขนาดของตาราง) ให้จบการทำงาน
        if (grid[i + 1].y + (sizeWinnerScale - 1) == gridSize) {
            break;
        }
    }
    return result;
}

// วนตรวจสอบแนวตั้งจากตำแหน่งถัดจากเริ่มต้นแต่ยังน้อยกว่าสิ้นสุด
function verticalInsiteCheck(i) {
    let result = true;
    for (let index = i + gridSize; index < (i + (gridSize * (sizeWinnerScale - 1))); index += gridSize) {
        if (grid[index].data != playerCurrent) {
            result = false;
            break;
        }
    }
    return result;
}


// ตรวจสอบเฉียงลงทางขวา
function diagonallyDownToRightCheck() {
    let result = false;
    for (let i = 0; i < grid.length; i++) {
        // test
        // console.log("DiagonallyDownToRight Start: " + (i) + "|" + grid[i].x + "," + grid[i].y + "," + grid[i].data)
        // for (let index = 2; index < sizeWinnerScale; index ++) {
        //     console.log("DiagonallyDownToRight loop: " + (i + ((gridSize + 1) * (index - 1))) + "|" + grid[i + ((gridSize + 1) * (index - 1))].x + "," + grid[i + ((gridSize + 1) * (index - 1))].y + "," + grid[i + ((gridSize + 1) * (index - 1))].data)
        // }
        // console.log("DiagonallyDownToRight End: " + (i + ((gridSize + 1) * (sizeWinnerScale - 1))) + "|" + grid[i + ((gridSize + 1) * (sizeWinnerScale - 1))].x + "," + grid[i + ((gridSize + 1) * (sizeWinnerScale - 1))].y + "," + grid[i + ((gridSize + 1) * (sizeWinnerScale - 1))].data);
        // if ((i + ((gridSize + 1) * (sizeWinnerScale - 1))) + 1 == grid.length) {
        //     break;
        // }
        // if (grid[i].x + sizeWinnerScale == gridSize) {
        //     i += sizeWinnerScale - 1;
        // }

        // ตรวจสอบว่า 
        // grid[i] ที่ data ตรงกับ playerCurrent และ grid[i + ((gridSize + 1) * (sizeWinnerScale - 1))] ที่ data ตรงกับ playerCurrent 
        if (grid[i].data == playerCurrent && grid[i + ((gridSize + 1) * (sizeWinnerScale - 1))].data == playerCurrent) {
            result = diagonallyDownToRightInsiteCheck(i);
            if (result) {
                break;
            }
        }
        // ตรวจสอบว่า
        // (i + ((gridSize + 1) * (sizeWinnerScale - 1))) + 1 แล้วเท่ากับ gridSize(ขนาดของตาราง) ให้จบการทำงาน
        if ((i + ((gridSize + 1) * (sizeWinnerScale - 1))) + 1 == grid.length) {
            break;
        }
        // grid[i].x + sizeWinnerScale แล้วเท่ากับ gridSize(ขนาดของตาราง)ให้เลื่อน i เพื่อให้เริ่ม grid[i].x เท่ากับ 0 
        if (grid[i].x + sizeWinnerScale == gridSize) {
            i += sizeWinnerScale - 1;
        }
    }
    return result;
}

// วนตรวจสอบแนวเฉียงลงทางขวาจากตำแหน่งถัดจากเริ่มต้นแต่ยังน้อยกว่าสิ้นสุด
function diagonallyDownToRightInsiteCheck(i) {
    let result = true;
    for (let index = 2; index < sizeWinnerScale; index++) {
        if (grid[i + ((gridSize + 1) * (index - 1))].data != playerCurrent) {
            result = false;
            break;
        }
    }
    return result;
}

// ตรวจสอบเฉียงลงทางซ้าย
function diagonallyDownToLeftCheck() {
    let result = false;
    for (let i = 0; i < grid.length; i++) {
        //test
        // console.log("DiagonallyDownToLeft Start: " + (i+(sizeWinnerScale-1)) + "|" + grid[i+(sizeWinnerScale-1)].x + "," + grid[i+(sizeWinnerScale-1)].y + "," + grid[i+(sizeWinnerScale-1)].data)
        // for (let index = 2; index < sizeWinnerScale; index ++) {
        //     console.log("DiagonallyDownToLeft loop: " + ((i+(sizeWinnerScale-1)) + ((gridSize - 1) * (index - 1))) + "|" + grid[(i+(sizeWinnerScale-1)) + ((gridSize - 1) * (index - 1))].x + "," + grid[(i+(sizeWinnerScale-1)) + ((gridSize - 1) * (index - 1))].y + "," + grid[(i+(sizeWinnerScale-1)) + ((gridSize - 1) * (index - 1))].data)
        // }
        // console.log("DiagonallyDownToLeft End: " + ((i+(sizeWinnerScale-1)) + ((gridSize - 1) * (sizeWinnerScale - 1))) + "|" + grid[(i+(sizeWinnerScale-1)) + ((gridSize - 1) * (sizeWinnerScale - 1))].x + "," + grid[(i+(sizeWinnerScale-1)) + ((gridSize - 1) * (sizeWinnerScale - 1))].y + "," + grid[(i+(sizeWinnerScale-1)) + ((gridSize - 1) * (sizeWinnerScale - 1))].data);
        // if (((i+(sizeWinnerScale-1)) + ((gridSize - 1) * (sizeWinnerScale - 1)))  + sizeWinnerScale == grid.length) {
        //     break;
        // }
        // if (grid[i+(sizeWinnerScale-1)].x + 1== gridSize) {
        //     i += sizeWinnerScale - 1;
        // }

        // ตรวจสอบว่า 
        // grid[i+(sizeWinnerScale-1) ที่ data ตรงกับ playerCurrent และ grid[(i+(sizeWinnerScale-1)) + ((gridSize - 1) * (sizeWinnerScale - 1))] ที่ data ตรงกับ playerCurrent 
        if (grid[i + (sizeWinnerScale - 1)].data == playerCurrent && grid[(i + (sizeWinnerScale - 1)) + ((gridSize - 1) * (sizeWinnerScale - 1))].data == playerCurrent) {
            result = diagonallyDownToLeftInsiteCheck(i);
            if (result) {
                break;
            }
        }
        // ตรวจสอบว่า
        // ((i+(sizeWinnerScale-1)) + ((gridSize - 1) * (sizeWinnerScale - 1)))  + sizeWinnerScale แล้วเท่ากับ gridSize(ขนาดของตาราง) ให้จบการทำงาน
        if (((i + (sizeWinnerScale - 1)) + ((gridSize - 1) * (sizeWinnerScale - 1))) + sizeWinnerScale == grid.length) {
            break;
        }
        // grid[i+(sizeWinnerScale-1)].x + 1 แล้วเท่ากับ gridSize(ขนาดของตาราง)ให้เลื่อน i เพื่อให้เริ่ม i เท่ากับ i + gridSize
        if (grid[i + (sizeWinnerScale - 1)].x + 1 == gridSize) {
            i += sizeWinnerScale - 1;
        }
    }
    return result;
}

// วนตรวจสอบแนวเฉียงลงทางซ้ายจากตำแหน่งถัดจากเริ่มต้นแต่ยังน้อยกว่าสิ้นสุด
function diagonallyDownToLeftInsiteCheck(i) {
    let result = true;
    for (let index = 2; index < sizeWinnerScale; index++) {
        if (grid[(i + (sizeWinnerScale - 1)) + ((gridSize - 1) * (index - 1))].data != playerCurrent) {
            result = false;
            break;
        }
    }
    return result;
}

// เก็บประวัติการเดิน
function addHistoryStep(x, y) {
    historyGamePlay.step.push({ x: x, y: y, data: playerCurrent });
}

// บันทึกประวัติการเดินลงฐานข้อมูล
function saveDataToDataBase() {
    // แปลง historyGamePlay จาก object เป็น string
    const historyParam = JSON.stringify(historyGamePlay);
    fetch(`/saveData/${historyParam}`);
}

// สลับผู้เล่น
function switchPlayer() {
    if (playerCurrent === 'X') {
        playerCurrent = 'O';
    } else {
        playerCurrent = 'X';
    }
}

// แสดงผู้เล่นคนถัดไป
function displayPlayerCurrent() {
    if (playerCurrent === 'X') {
        displayPlayer1.style.color = '#000000';
        displayPlayer2.style.color = '#9c9c9c';
    } else {
        displayPlayer2.style.color = '#000000';
        displayPlayer1.style.color = '#9c9c9c';
    }
}