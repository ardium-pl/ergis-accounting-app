import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: '_main-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main.page.html',
  styleUrl: './main.page.scss',
})
export class MainPage {}
