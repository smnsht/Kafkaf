import { Directive, ElementRef, Output, EventEmitter, OnDestroy, inject } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective implements OnDestroy {
  @Output() clickOutside = new EventEmitter<void>();

  private readonly elementRef = inject(ElementRef);
  private readonly documentClickSubscription: Subscription;

  constructor() {
    // Listen for clicks on the entire document
    this.documentClickSubscription = fromEvent(document, 'click')
      .pipe(
        filter((event) => {
          // Check if the clicked element is outside the host element
          const clickedInside = this.elementRef.nativeElement.contains(event.target);
          return !clickedInside;
        }),
      )
      .subscribe(() => {
        this.clickOutside.emit();
      });
  }

  ngOnDestroy(): void {
    if (this.documentClickSubscription) {
      this.documentClickSubscription.unsubscribe();
    }
  }
}
