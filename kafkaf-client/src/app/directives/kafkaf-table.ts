import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: 'table[appKafkafTable]',
})
export class KafkafTable {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(this.el.nativeElement, 'table');
    this.renderer.addClass(this.el.nativeElement, 'is-hoverable');
    this.renderer.addClass(this.el.nativeElement, 'is-fullwidth');
  }
}
