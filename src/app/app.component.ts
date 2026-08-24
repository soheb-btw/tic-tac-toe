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
  hoveredTargetGrid: number = -1;
  currentPlayer: number = 0;
  gameOver: boolean = false;
  gameStarted: boolean = false;
  winnerMessage: string = '';
  mainBoxValue: string[] = new Array(9).fill('');
  subGridCompleted: boolean[] = new Array(9).fill(false);

  playerOneScore: number = 0;
  playerTwoScore: number = 0;

  remainingTime: number = 30;
  timerRunning: boolean = false;
  gamePaused: boolean = false;
  timer: any;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    // Timer will start when the game is started via startGame()
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  get timerProgressOffset(): number {
    // Circle radius = 22, circumference = 2 * PI * 22 ≈ 138.2
    const totalCircumference = 138.2;
    return totalCircumference - (this.remainingTime / 30) * totalCircumference;
  }

  startTimer() {
    if (this.gameOver || !this.gameStarted) return;
    this.stopTimer();
    this.timerRunning = true;
    this.timer = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        this.handleTimeout();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.timerRunning = false;
  }

  resetTimer() {
    this.remainingTime = 30;
    this.startTimer();
  }

  togglePause() {
    if (this.gameOver || !this.gameStarted) return;
    if (this.gamePaused) {
      this.gamePaused = false;
      this.startTimer();
    } else {
      this.gamePaused = true;
      this.stopTimer();
    }
  }

  handleTimeout() {
    if (this.gameOver) return;
    this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
    this.resetTimer();
  }

  navigateToSubGrid(position: number) {
    this.indexAfterClicked = position;
  }

  onCellHover(targetGridIndex: number) {
    this.hoveredTargetGrid = targetGridIndex;
  }

  disabledGrid(i: number): boolean {
    if (this.gameOver) return true;
    if (this.subGridCompleted[i] || this.mainBoxValue[i] !== '') return true;

    if (
      this.indexAfterClicked === -1 ||
      this.subGridCompleted[this.indexAfterClicked] ||
      this.mainBoxValue[this.indexAfterClicked] !== ''
    ) {
      return false;
    }

    return i !== this.indexAfterClicked;
  }

  isFreeMove(): boolean {
    return (
      this.indexAfterClicked === -1 ||
      this.subGridCompleted[this.indexAfterClicked] ||
      this.mainBoxValue[this.indexAfterClicked] !== ''
    );
  }

  subGridData(subGridData: any, i: number) {
    if (this.gameOver) return;

    this.hoveredTargetGrid = -1;
    const playerWhoMoved = subGridData.currentPlayer;

    if (subGridData.checkForWin) {
      this.mainBoxValue[i] = playerWhoMoved === 0 ? 'O' : 'X';
      this.subGridCompleted[i] = true;
    } else if (subGridData.isFull) {
      if (this.mainBoxValue[i] === '') {
        this.mainBoxValue[i] = 'TIE';
      }
      this.subGridCompleted[i] = true;
    }

    if (this.checkForWin()) {
      this.gameOver = true;
      this.stopTimer();
      if (playerWhoMoved === 0) {
        this.playerOneScore++;
        this.winnerMessage = 'Player One (⭕) Has Won The Game!';
      } else {
        this.playerTwoScore++;
        this.winnerMessage = 'Player Two (❌) Has Won The Game!';
      }
      return;
    }

    if (this.checkForDraw()) {
      this.gameOver = true;
      this.stopTimer();
      this.winnerMessage = 'Game ended in a Draw!';
      return;
    }

    this.navigateToSubGrid(subGridData.position);
    this.currentPlayer = playerWhoMoved === 0 ? 1 : 0;
    this.resetTimer();
  }

  checkForWin(): boolean {
    // Check rows
    for (let i = 0; i < 9; i += 3) {
      if (
        this.mainBoxValue[i] !== '' &&
        this.mainBoxValue[i] !== 'TIE' &&
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
        this.mainBoxValue[i] !== 'TIE' &&
        this.mainBoxValue[i] === this.mainBoxValue[i + 3] &&
        this.mainBoxValue[i] === this.mainBoxValue[i + 6]
      ) {
        return true;
      }
    }

    // Check diagonals
    if (
      this.mainBoxValue[0] !== '' &&
      this.mainBoxValue[0] !== 'TIE' &&
      this.mainBoxValue[0] === this.mainBoxValue[4] &&
      this.mainBoxValue[0] === this.mainBoxValue[8]
    ) {
      return true;
    }

    if (
      this.mainBoxValue[2] !== '' &&
      this.mainBoxValue[2] !== 'TIE' &&
      this.mainBoxValue[2] === this.mainBoxValue[4] &&
      this.mainBoxValue[2] === this.mainBoxValue[6]
    ) {
      return true;
    }

    return false;
  }

  checkForDraw(): boolean {
    return (
      this.subGridCompleted.every((completed) => completed) ||
      this.mainBoxValue.every((val) => val !== '')
    );
  }

  resetGame() {
    this.indexAfterClicked = -1;
    this.hoveredTargetGrid = -1;
    this.currentPlayer = 0;
    this.gameOver = false;
    this.winnerMessage = '';
    this.mainBoxValue = new Array(9).fill('');
    this.subGridCompleted = new Array(9).fill(false);
    if (this.gameStarted) {
      this.resetTimer();
    }
  }

  startGame() {
    this.gameStarted = true;
    this.resetGame();
    this.openDialog();
  }

  iterateNineTimes(): number[] {
    return new Array(9);
  }

  openDialog(): void {
    const wasRunning = !this.gamePaused && this.gameStarted && !this.gameOver;
    if (wasRunning) {
      this.togglePause();
    }
    
    const dialogRef = this.dialog.open(DialogContentComponent);
    
    dialogRef.afterClosed().subscribe(() => {
      if (wasRunning && this.gamePaused && !this.gameOver) {
        this.togglePause();
      }
    });
  }
}
