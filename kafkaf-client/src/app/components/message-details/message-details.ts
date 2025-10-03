import { Component, computed, input, signal } from '@angular/core';
import { MessageRow } from '../../response.models';
import { TimestampPipe } from '../../pipes/timestamp-pipe';

type tMessageTab = 'Key' | 'Value' | 'Headers';
@Component({
  selector: 'message-details',
  imports: [TimestampPipe],
  templateUrl: './message-details.html',
})
export class MessageDetails {
  message = input<MessageRow>();
  selectedTab = signal<tMessageTab>('Value');

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

  onTabClick(event: Event, tab: tMessageTab): void {
    event.preventDefault();
    this.selectedTab.set(tab);
  }
}
