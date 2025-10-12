import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective implements OnDestroy {
  @Output() clickOutside = new EventEmitter<void>();

  private readonly documentClickSubscription: Subscription;

  constructor(private readonly elementRef: ElementRef) {
    // Listen for clicks on the entire document
    this.documentClickSubscription = fromEvent(document, 'click')
      .pipe(
        filter((event) => {
          // Check if the clicked element is outside the host element
          const clickedInside = this.elementRef.nativeElement.contains(event.target);
          return !clickedInside;
        })
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
