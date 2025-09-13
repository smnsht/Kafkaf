import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-topic-overview',
  imports: [RouterLink],
  templateUrl: './topic-overview.html',
  styleUrl: './topic-overview.scss'
})
export class TopicOverview {
  public pathParts: string[] = [];
  public topic: number;

  constructor(router: Router) {
    var arr = router.url.split('/');
    arr[0] = '/';

    this.topic = Number.parseInt(arr.pop() || '');
    this.pathParts = arr;
  }
}
