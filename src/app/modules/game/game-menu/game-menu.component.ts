import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  standalone: true,
  styleUrl: "./game-menu.component.scss",
  imports: [MatDialogModule]
})
export class GameMenuComponent {
  dialog = inject(MatDialogRef<GameMenuComponent>);

  constructor() { }

  ngOnInit(): void {
  }



  public onResume() {
    this.dialog.close('resume');
  }

  public onRestart() {
    this.dialog.close('restart');
  }

  public onQuit() {
    this.dialog.close('quit');
  }
}
