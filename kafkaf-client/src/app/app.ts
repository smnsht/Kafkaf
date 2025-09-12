import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('kafkaf-client');
}
