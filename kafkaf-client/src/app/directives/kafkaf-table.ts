import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appKafkafTable]',
})
export class KafkafTable {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    const nativeEl = this.el.nativeElement;

    if (nativeEl.tagName && nativeEl.tagName.toLowerCase() === 'table') {
      this.renderer.addClass(this.el.nativeElement, 'table');
      this.renderer.addClass(this.el.nativeElement, 'is-hoverable');
      this.renderer.addClass(this.el.nativeElement, 'is-fullwidth');
    } else {
      console.log('This element is NOT a table.');
    }
  }
}
