import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { Subject, switchMap, tap, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TimestampPipe } from '@app/pipes/timestamp/timestamp';
import { LoggerService } from '@app/services/logger/logger';
import { MessageRow } from '@app/models/message.models';

type tMessageTab = 'Key' | 'Value' | 'Headers';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'message-details',
  imports: [TimestampPipe],
  templateUrl: './message-details.html',
})
export class MessageDetails {
  private readonly destroyRef = inject(DestroyRef);
  private readonly logger = inject(LoggerService);
  private readonly hideCopiedSuccessfullySubject = new Subject<void>();

  message = input<MessageRow>();
  selectedTab = signal<tMessageTab>('Value');
  showCopiedSuccessfully = false;

  contents = computed(() => {
    const msg = this.message();

    if (msg) {
      switch (this.selectedTab()) {
        case 'Headers':
          return msg.headers;

        case 'Key':
          return msg.key;

        case 'Value':
          return msg.value;
      }
    }

    return null;
  });

  messageAsJSON = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msgCopy = { ...this.message() } as any;

    delete msgCopy['_expanded'];
    // pretty-print JSON
    return JSON.stringify(msgCopy, null, 2);
  });

  constructor() {
    this.hideCopiedSuccessfullySubject.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(() => {
        return timer(2000).pipe(tap(() => (this.showCopiedSuccessfully = false)));
      }),
    );
  }

  onTabClick(event: Event, tab: tMessageTab): void {
    event.preventDefault();
    this.selectedTab.set(tab);
  }

  onCopy2ClipboardClick(): void {
    const text = this.messageAsJSON();
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.showCopiedSuccessfully = true;
        this.hideCopiedSuccessfullySubject.next();
      })
      .catch((err) => this.logger.error('Failed to copy: ', err));
  }

  onSaveAsFileClick(): void {
    const json = this.messageAsJSON();
    const blob = new Blob([json], { type: 'text/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'message.json';
    a.click();

    URL.revokeObjectURL(url);
  }
}
