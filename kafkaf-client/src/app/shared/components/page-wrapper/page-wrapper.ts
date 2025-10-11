import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PageState } from '@app/shared/models/page-state';

type SpinnerFontSize = 1 | 2 | 3 | 4;

@Component({
  selector: 'app-page-wrapper',
  imports: [CommonModule],
  templateUrl: './page-wrapper.html',
})
export class PageWrapper {
  @Input() spinnerFontSize: SpinnerFontSize = 1;

  @Input() loading: boolean | null | undefined;
  @Input() error: string | null | undefined;
  @Input() notice: string | null | undefined;

  @Input()
  set state(value: PageState) {
    // Sync other properties
    this.loading = value.loading;
    this.error = value.error;
    this.notice = value.notice;
  }
}
