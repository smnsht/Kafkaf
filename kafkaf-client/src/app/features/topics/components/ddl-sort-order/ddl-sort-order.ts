import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type SortOrderType = 'FORWARD' | 'BACKWARD' | 'TAILING';

export const SortOrderOptions = Object.freeze(
  new Map<SortOrderType, string>([
    ['FORWARD', 'Oldest First'],
    ['BACKWARD', 'Newest First'],
    ['TAILING', 'Live Mode'],
  ]),
);

@Component({
  selector: 'ddl-sort-order',
  imports: [FormsModule],
  template: `
    <div class="field">
      <div class="label">Seek direction</div>
      <div class="control">
        <div class="select is-fullwidth">
          <select [ngModel]="sortOrder()" (ngModelChange)="sortOrder.set($event)">
            @for (item of options; track $index) {
              <option [value]="item[0]">{{ item[1] }}</option>
            }
          </select>
        </div>
      </div>
    </div>
  `,
})
export class DDLSortOrder {
  options = new Map(SortOrderOptions);
  sortOrder = model<SortOrderType>('FORWARD');
}
