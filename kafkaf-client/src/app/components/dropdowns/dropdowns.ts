import { Component, input, model } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { SerdeType, SerdeTypes, SortOrderType } from './models';

// @Component({
//   selector: 'ddl-seek-type',
//   imports: [],
//   template: `

//   `,
// })
// export class DdlSeekType {

// }

@Component({
  selector: 'ddl-sort-order',
  imports: [FormsModule],
  template: `
    <div class="field">
      <label class="label">Sort</label>
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
  options = new Map<SortOrderType, string>([
    ['FORWARD', 'Oldest First'],
    ['BACKWARD', 'Newest First'],
    ['TAILING', 'Live Mode'],
  ]);
  sortOrder = model<SortOrderType>('FORWARD');
}

@Component({
  selector: 'ddl-serde',
  imports: [FormsModule],
  template: `
    <div class="field">
      <label class="label">{{ label() }}</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select [ngModel]="serde()" (ngModelChange)="serde.set($event)">
            @for (serde of options; track $index) {
            <option [value]="serde">{{ serde }}</option>
            }
          </select>
        </div>
      </div>
    </div>
  `,
})
export class DDLSerde {
  label = input<string>('Serde');
  options = [...SerdeTypes];
  serde = model<SerdeType>('String');
}

@Component({
  selector: 'ddl-partitions',
  imports: [FormsModule],
  template: `
    <div class="field">
      <label class="label">Partitions</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select [ngModel]="partition()" (ngModelChange)="partition.set($event)">
            @for (part of partitions(); track $index) {
            <option [value]="part">{{ part }}</option>
            }
          </select>
        </div>
      </div>
    </div>
  `,
})
export class DDLPartitions {
  partitions = input<number[]>([]);
  partition = model<number>();
}
