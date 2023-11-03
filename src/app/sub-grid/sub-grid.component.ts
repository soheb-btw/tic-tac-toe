import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-sub-grid',
  templateUrl: './sub-grid.component.html',
  styleUrls: ['./sub-grid.component.scss'],
})
export class SubGridComponent {
  @Output() subGridData: EventEmitter<any> =
    new EventEmitter<any>();
  @Input() currentPlayer: number = -1;

  playerOne: boolean = false;
  playerTwo: boolean = false;
  showCircle: boolean = false;
  showRectangle: boolean = false;
  boxValue: string[] = new Array(9).fill('');

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  boxClicked(position: number) {
    if (this.boxValue[position] == '') {
      this.boxValue[position] = this.currentPlayer == 0 ? 'O' : 'X';
      const checkForWin = this.checkForWin();
      if (checkForWin) {
        this.currentPlayer == 0
          ? (this.showCircle = true)
          : (this.showRectangle = true);
      }
      let subGridData = {
        checkForWin : checkForWin,
        position : position,
        currentPlayer : this.currentPlayer
      }
      this.subGridData.emit(subGridData);
    }
  }

  checkForWin(): boolean {
    // Check rows
    for (let i = 0; i < 9; i += 3) {
      if (
        this.boxValue[i] !== '' &&
        this.boxValue[i] === this.boxValue[i + 1] &&
        this.boxValue[i] === this.boxValue[i + 2]
      ) {
        return true;
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        this.boxValue[i] !== '' &&
        this.boxValue[i] === this.boxValue[i + 3] &&
        this.boxValue[i] === this.boxValue[i + 6]
      ) {
        return true;
      }
    }

    // Check diagonals
    if (
      (this.boxValue[0] !== '' &&
        this.boxValue[0] === this.boxValue[4] &&
        this.boxValue[0] === this.boxValue[8]) ||
      (this.boxValue[2] !== '' &&
        this.boxValue[2] === this.boxValue[4] &&
        this.boxValue[2] === this.boxValue[6])
    ) {
      return true;
    }

    return false; // No win
  }
}
