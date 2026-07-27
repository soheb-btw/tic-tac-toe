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
  @Output() subGridData: EventEmitter<any> = new EventEmitter<any>();
  @Output() cellHover: EventEmitter<number> = new EventEmitter<number>();
  @Input() disabled: boolean = false;
  @Input() currentPlayer: number = 0;
  @Input() previewTarget: boolean = false;

  playerOne: boolean = false;
  playerTwo: boolean = false;
  showCircle: boolean = false;
  showRectangle: boolean = false;
  boxValue: string[] = new Array(9).fill('');

  onCellHover(pos: number) {
    if (!this.disabled && !this.showCircle && !this.showRectangle && this.boxValue[pos] === '') {
      this.cellHover.emit(pos);
    }
  }

  onCellLeave() {
    this.cellHover.emit(-1);
  }

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  boxClicked(position: number) {
    if (this.disabled || this.showCircle || this.showRectangle || this.boxValue[position] !== '') {
      return;
    }

    this.boxValue[position] = this.currentPlayer == 0 ? 'O' : 'X';
    const checkForWin = this.checkForWin();
    if (checkForWin) {
      this.currentPlayer == 0
        ? (this.showCircle = true)
        : (this.showRectangle = true);
    }
    const isFull = this.boxValue.every(val => val !== '');
    let subGridData = {
      checkForWin: checkForWin,
      isFull: isFull,
      position: position,
      currentPlayer: this.currentPlayer
    };
    this.subGridData.emit(subGridData);
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
