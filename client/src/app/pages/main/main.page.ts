import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent } from 'src/app/components/card/card.component';

@Component({
  selector: '_main-page',
  standalone: true,
  imports: [RouterModule, CardComponent],
  templateUrl: './main.page.html',
  styleUrl: './main.page.scss',
})
export class MainPage {}
