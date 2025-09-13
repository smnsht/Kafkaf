import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topics-list',
  imports: [FormsModule],
  templateUrl: './topics-list.html',
  styleUrl: './topics-list.scss',
})
export class TopicsList {
  public search = '';
  public showInternalTopics = false;

  constructor(private router: Router){}

  onSearchChange(search: string): void {
    console.log(search)
  }

  onShowInternalTopicsChange(newValue: boolean): void {
    console.log('Checkbox changed to:', newValue);
  }

  navigateToTopicDetails(topic: number): void {
    console.log(topic)
    this.router.navigate([this.router.url, topic]);
  }
}
