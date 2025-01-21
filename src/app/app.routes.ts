import { Routes } from '@angular/router';
import { GameComponent } from './modules/game/game.component';
import { HomepageComponent } from './modules/homepage/homepage.component';
import { RulesComponent } from './modules/rules/rules.component';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },

  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'game',
    children: [
      {
        path: ':player',
        children: [
          {
            path: ':id',
            component: GameComponent
          }
        ]
      }
    ]
  },
  {
    path: 'rule',
    component: RulesComponent
  }
];
