import { AfterViewInit, Component, ElementRef, HostListener, inject, OnDestroy, OnInit, Renderer2, signal, ViewChild } from "@angular/core";
import { NgIf } from "@angular/common";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { elementAt, Subject, take, takeUntil, takeWhile } from "rxjs";
import { GameService } from "./game.service";
import { GameMenuComponent } from "./game-menu/game-menu.component";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrl: "./game.component.scss",
  standalone: true,
  imports: [NgIf, MatDialogModule]
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  // @ViewChild('myElement') myElement!: ElementRef;
  @ViewChild('marker') marker!: ElementRef;

  dialog = inject(MatDialog);;

  counter = signal(0);
  countFn: any

  constructor(
    public _gameService: GameService,
    private _router: Router,
    private _activeRouter: ActivatedRoute
  ) {}

  boards: number[][] = [];
  moves!: any;
  rows: number = 7;
  cols: number = 6;

  boardColumns: any;
  markerColumns: any;

  currentPlayer: number = 1;
  totalWin: any = {
    p1: 0,
    p2: 0,
    cpu: 0
  }

  isWin: boolean = false;
  winner: number | null = null;
  directionWin!: any;


  unsubscribeAll: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.boards = this._gameService.gameState?.boards;
    this.countDown();
    // this.onPlayGame();
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  ngAfterViewInit() {
    this.markerColumns = document.querySelectorAll('.marker');
    this.markerColumns.forEach((item: any) => {
      item.classList.add('hidden');
    });

    this.boardColumns = document.querySelectorAll('.focus-marked');
    const arrayClass = Array.from(this.boardColumns);

    arrayClass.forEach((elmnt, index) => {
      const parentWrap = elmnt as HTMLElement;
      const currIndex = index % this.rows;

      const getElemnt = document.getElementsByClassName('col-marker');
      const children = getElemnt.item(currIndex) as HTMLElement;


      parentWrap.addEventListener('mouseover', (event:  MouseEvent) => {
        children?.classList.add('visible');
        children?.classList.remove('hidden');
      })

      parentWrap.addEventListener('mouseleave', (event:  MouseEvent) => {


        children?.classList.remove('visible');
        children?.classList.add('hidden');
      })

    });
  }

  public switchPlayer() {
    this._gameService.switchPlayer()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((result: number) => {
        this.currentPlayer = result;
      })
  }

  private countDown(resume?: boolean) {
    if(!resume) {
      this.counter.update((value) => value = 30);
    }
    this.countFn = setInterval(() => {
      this.counter.update((value) => value - 1);
      if (this.counter() === 0) {
        clearInterval(this.countFn);
        // this._gameService.dropPiece(0);
        this.switchPlayer();
        this.countDown();
      }
    }, 1000.5);
  }

  public onMenu() {
    clearInterval(this.countFn);
    const dialogRef = this.dialog.open(GameMenuComponent, {
      panelClass: 'game-menu-dialog',
      data: {
        boards: this.boards,
        currentPlayer: this.currentPlayer
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result === 'resume') {
        const resume = true
        this.countDown(resume);
      } else if(result === 'restart') {
        this.restartGame();
      } else if(result === 'quit') {
        this._router.navigate(['./'])
      }
    })
  }

  public restartGame(): void {
    this._gameService.restart()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((result: any) => {
        if(result) {
          this.boards = this._gameService.gameState?.boards;
          this.currentPlayer = result.currentPlayer;
          this.countDown();
          this.isWin = false;
          this.directionWin = null;

          this.markerColumns.forEach((item: any) => {
            item.classList.add('hidden');
            item.classList.remove('slide-bottom');
          });
        }
      })
    }
    /**
   * @param row The row the piece is in.
   * @param col The column the piece is in.
   */

  public onFill(col: number) {
    this._gameService.dropPiece(col);
    this.currentPlayer = this._gameService?.gameState.currentPlayer;
    let currentIndex!: number;

    this.makeWinner();

    if(this.checkCpuTurn()) {
      this._gameService.cpuMove().subscribe({
        next: (result) => {
          setTimeout(() => {
            this.onFill(result);
          }, 1000);
        }
      })
    }

    for (let row = 0; row < this.boards.length; row++) {
      for (let col = 0; col < this.boards[row].length; col++) {
        if(this.boards[row][col] !== 0) {
          currentIndex = (row * this.rows) + col;
          this.markerColumns[currentIndex]?.classList.remove('hidden');
          this.markerColumns[currentIndex]?.classList.add('slide-bottom');
        }
      }
    }

    this.counter.update((value) => value = 30);
  }

  private checkCpuTurn(): boolean {
    if(this.currentPlayer !== 1 && !this.isWin) {
      return true
    }

    return false
  }

  public makeWinner() {
    this._gameService.checkWinner(this.boards)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((result: any) => {
        if(result) {
          this._gameService.horizontalDirection(this.boards)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((result: any) => {
              this.directionWin = result;
            })

          this._gameService.verticalDirection(this.boards)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((result: any) => {
              this.directionWin = result;
            })

          this._gameService.diagonalDirection(this.boards)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((result: any) => {
              this.directionWin = result;
            })

          this.isWin = this._gameService.gameState.winner !== null;
          this.winner = this._gameService.gameState.winner;

          if(this.winner === 1) this.totalWin.p1 += 1
          if(this.winner !== 2) this.totalWin.p2 += 1

          return -1
        }

        return true
      });

  }

  markWin(rowIndex: number, colIndex: number) {
    if(this.isWin && this.directionWin) {
      clearInterval(this.countFn);
      // this.counter.update((value) => value = 0);
      for (let row = 0; row < this.directionWin.length; row++) {
        for (let col = 0; col < this.directionWin[row].length; col++) {
          if(rowIndex === this.directionWin[row][col] && colIndex === this.directionWin[row][col + 1]) {
            return true;
          }
        }
      }
    }

    return null;
  }

}
