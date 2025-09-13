import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-broker-details',
  imports: [RouterLink],
  templateUrl: './broker-details.html',
  styleUrl: './broker-details.scss'
})
export class BrokerDetails {
  public pathParts: string[] = [];

  constructor(router: Router) {
    var arr = router.url.split('/');
    this.pathParts = ['/', ...arr.slice(1, 4)]
  }
}
