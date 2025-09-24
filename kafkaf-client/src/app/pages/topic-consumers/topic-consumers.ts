import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KafkafTable } from "../../directives/kafkaf-table";

@Component({
  selector: 'app-topic-consumers',
  imports: [FormsModule, KafkafTable],
  templateUrl: './topic-consumers.html',
  // styleUrl: './topic-consumers.scss'
})
export class TopicConsumers {
  public search?: string;

  onSearchChange(search: string): void {
    console.log(search)
  }
}
