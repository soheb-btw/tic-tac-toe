import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-content/dialog-content.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tic-tac-toe';
  indexAfterClicked: number = -1;
  currentPlayer: number = 0;
  winOrLoss: boolean = false;
  gameOver: boolean = false;
  gridObject: any;
  disableWonGrid: boolean = false;
  mainBoxValue: string[] = new Array(9).fill('');

  remainingTime: number = 7;
  timerRunning: boolean = false;
  timer: any;

  constructor(public dialog: MatDialog) {}

  startTimer() {
    if (!this.timerRunning) {
      this.timerRunning = true;
      this.timer = setInterval(() => {
        this.remainingTime--;

        if (this.remainingTime <= 0) {
          this.stopTimer();
        }
      }, 1000);
    }
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timerRunning = false;
  }

  navigateToSubGrid(position: number) {
    console.log(position);
    this.indexAfterClicked = position;
    if (this.mainBoxValue[this.indexAfterClicked] != '')
      this.disableWonGrid = true;
    else this.disableWonGrid = false;
  }

  disabledGrid(i: number) {
    if (this.mainBoxValue[this.indexAfterClicked] != '') {
      if (this.mainBoxValue[i] == '') return false;
      return true;
    }
    if (this.indexAfterClicked != i && this.indexAfterClicked != -1)
      return true;
    return false;
  }

  subGridData(subGridData: any,i: number) {
    this.gridObject = subGridData;
    this.currentPlayerEmit(subGridData.currentPlayer);
    this.checkForSubGridWin(subGridData.checkForWin,i);
    this.navigateToSubGrid(subGridData.position);
    if (subGridData.checkForWin) {
      const mainGameWin = this.checkForWin();
      if (mainGameWin) {
        this.gameOver = true;
      }
    }
  }

  checkForSubGridWin(winOrLoss: any,i : number) {
    this.winOrLoss = winOrLoss;
    if (this.indexAfterClicked != -1 && winOrLoss) {
      this.mainBoxValue[i] =
        this.currentPlayer == 0 ? 'O' : 'X';
    }
  }

  checkForWin(): boolean {
    // Check rows
    for (let i = 0; i < 9; i += 3) {
      if (
        this.mainBoxValue[i] !== '' &&
        this.mainBoxValue[i] === this.mainBoxValue[i + 1] &&
        this.mainBoxValue[i] === this.mainBoxValue[i + 2]
      ) {
        return true;
      }
    }


    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        this.mainBoxValue[i] !== '' &&
        this.mainBoxValue[i] === this.mainBoxValue[i + 3] &&
        this.mainBoxValue[i] === this.mainBoxValue[i + 6]
      ) {
        return true;
      }
    }

    // Check diagonals
    if (
      (this.mainBoxValue[0] !== '' &&
        this.mainBoxValue[0] === this.mainBoxValue[4] &&
        this.mainBoxValue[0] === this.mainBoxValue[8]) ||
      (this.mainBoxValue[2] !== '' &&
        this.mainBoxValue[2] === this.mainBoxValue[4] &&
        this.mainBoxValue[2] === this.mainBoxValue[6])
    ) {
      return true;
    }

    return false; // No win
  }

  iterateNineTimes(): number[] {
    return new Array(9);
  }

  currentPlayerEmit(currentPlayer: number) {
    this.currentPlayer = currentPlayer === 0 ? 1 : 0;
  }

  openDialog(): void {
    this.dialog.open(DialogContentComponent);
  }
}
