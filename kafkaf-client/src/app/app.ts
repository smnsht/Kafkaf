import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Navbar } from "./components/navbar/navbar";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('kafkaf-client');

  constructor(private router: Router) {}

  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }
}
