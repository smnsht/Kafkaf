import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type SortOrderType = 'FORWARD' | 'BACKWARD' | 'TAILING';

export const SortOrderOptions = Object.freeze(
  new Map<SortOrderType, string>([
    ['FORWARD', 'Oldest First'],
    ['BACKWARD', 'Newest First'],
    ['TAILING', 'Live Mode'],
  ])
);

@Component({
  selector: 'ddl-sort-order',
  imports: [FormsModule],
  templateUrl: './ddl-sort-order.html'
})
export class DDLSortOrder {
  options = new Map(SortOrderOptions);
  sortOrder = model<SortOrderType>('FORWARD');
}
