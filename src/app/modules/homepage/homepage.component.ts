import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  standalone: true,
  styleUrls: ['./homepage.component.scss'],
  imports: [RouterLink]
})
export class HomepageComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  public onNavigateGame(player: string) {
    const uuid = uuidv4();
    this._router.navigate(['./game/' + player + '/', uuid]);
  }

}
