import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { LoggerService } from '../../services/logger/logger';

@Directive({
  selector: '[appKafkafTable]',
})
export class KafkafTableDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private readonly logger: LoggerService,
  ) {
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
