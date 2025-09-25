import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type SpinnerFontSize = 1 | 2 | 3 | 4;

@Component({
  selector: 'app-page-wrapper',
  imports: [CommonModule],
  templateUrl: './page-wrapper.html',
  // styleUrl: './page-wrapper.scss'
})
export class PageWrapper {
  @Input() loading = false;
  @Input() spinnerFontSize: SpinnerFontSize = 1;
  @Input() error: string | null = null;
  @Input() notice: string | null = null;
}
