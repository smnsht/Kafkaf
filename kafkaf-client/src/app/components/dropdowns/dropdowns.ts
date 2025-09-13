import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ddl-sort-order',
  imports: [],
  template: `
  <div class="field">
      <label class="label">Sort</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select>
            <option value="FORWARD">Oldest First</option>
            <option value="BACKWARD">Newest First</option>
            <option value="TAILING">Live Mode</option>
          </select>
        </div>
      </div>
    </div>
  `
  // templateUrl: './dropdowns.html',
  //  styleUrl: './dropdowns.scss'
})
export class DDLSortOrder {

}


@Component({
  selector: 'app-ddl-serde',
  // standalone: true,
  imports: [],
  template: `
  <div class="field">
      <label class="label">{{ label() }}</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select>
            @for (serde of serdes; track $index) {
              <option [value]="serde">{{ serde }}</option>
            }
          </select>
        </div>
      </div>
    </div>
  `
})
export class DDLSerde {
  public label = input<string>('Serde');
  public serdes: string[] = ['String', 'Int32', 'Int64', 'UInt32', 'UInt64'];
}



@Component({
  selector: 'app-ddl-partitions',
  imports: [],
  template: `
  <div class="field">
      <label class="label">Partitions</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select>
            @for (part of partitions(); track $index) {
              <option [value]="part">{{ part }}</option>
            }
          </select>
        </div>
      </div>
    </div>
  `
})
export class DDLPartitions {
  public partitions = input<string[]>([]);
}
