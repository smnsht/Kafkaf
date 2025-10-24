import { Directive, ElementRef, inject, Renderer2 } from '@angular/core';
import { LoggerService } from '@app/services/logger/logger';

@Directive({
  selector: '[appKafkafTable]',
})
export class KafkafTableDirective {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly logger = inject(LoggerService);

  constructor() {
    const nativeEl = this.el.nativeElement;

    if (nativeEl.tagName && nativeEl.tagName.toLowerCase() === 'table') {
      this.renderer.addClass(this.el.nativeElement, 'table');
      this.renderer.addClass(this.el.nativeElement, 'is-hoverable');
      this.renderer.addClass(this.el.nativeElement, 'is-fullwidth');
    } else {
      this.logger.warn('[KafkafTable]: This element is NOT a table.');
    }
  }
}
