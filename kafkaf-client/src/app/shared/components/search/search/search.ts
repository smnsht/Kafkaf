import { CommonModule } from '@angular/common';
import { Component, Input, input, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type ColumnWidth = 'is-one-third' | 'is-one-quarter' | 'is-one-fifth';

@Component({
  selector: 'app-search',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="columns">
      <div [ngClass]="['column', width()]">
        <div class="control has-icons-left">
          <input
            class="input"
            name="search"
            type="search"
            [(ngModel)]="search"
            [placeholder]="placeholder()"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-search"></i>
          </span>
        </div>
      </div>
    </div>
  `,
  host: {
    'class': 'column'
  }
})
export class Search {
  width = input<ColumnWidth>('is-one-third');
  placeholder = input('Search...');

  @Input({ required: true })
  search!: Signal<string>;
}
