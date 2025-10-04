import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ddl-partitions',
  imports: [FormsModule],
  templateUrl: './ddl-partitions.html'
})
export class DDLPartitions {
  partitions = input<number[]>([]);
  partition = model<number>();
}
