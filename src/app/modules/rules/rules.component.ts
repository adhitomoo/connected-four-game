import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  standalone: true,
  imports: [RouterLink]
})
export class RulesComponent {
  constructor() { }

  ngOnInit(): void {
  }
}
