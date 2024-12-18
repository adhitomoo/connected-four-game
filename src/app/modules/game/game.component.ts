import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from "@angular/core";
import { elementAt } from "rxjs";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styles: `
  .hole {
    clip-path: circle(100%);
  }`
})
export class GameComponent implements OnInit, AfterViewInit {
  // @ViewChild('myElement') myElement!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  boards: any[] = [];
  rows: number = 7;
  cols: number = 6;

  boardColumns: any;

  ngOnInit(): void {
    this.boards = Array(this.rows * this.cols).fill(null);
  }

  ngAfterViewInit() {
    console.log(this.el?.nativeElement.classList.contains('marked'), 'testing');
    this.boardColumns = document.getElementsByClassName('marked');
    this.boardColumns.forEach((element: any) => {
      console.log(element);
    });
  }

  @HostListener('mouseover') onMouseOver() {

    // this.renderer.setStyle(element.fir, 'visibility', 'visible');
  }

  // @HostListener('mouseleave') onMouseLeave() {
  //   this.renderer.setStyle(this.marked, 'visibility', 'hidden');
  // }

}
