import { Component, computed, signal } from '@angular/core';
import { DdlSeekType } from '../../components/ddl-seek-type/ddl-seek-type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KafkafTableDirective, PageWrapper, TruncatePipe } from '@app/shared';
import { TimestampPipe } from '../../pipes/timestamp';
import {
  defaultSearchMessagesOptions,
  TopicDetailsStore,
} from '../../store/topic-detais/topic-details';
import { DDLPartitions } from '../ddl-partitions/ddl-partitions';
import { DDLSerde } from '../ddl-serde/ddl-serde';
import { DDLSortOrder } from '../ddl-sort-order/ddl-sort-order';
import { MessageDetails } from '../message-details/message-details';

@Component({
  selector: 'app-topic-messages',
  standalone: true,
  imports: [
    DDLSortOrder,
    DDLSerde,
    DDLPartitions,
    DdlSeekType,
    KafkafTableDirective,
    PageWrapper,
    FormsModule,
    CommonModule,
    MessageDetails,
    TimestampPipe,
    TruncatePipe,
  ],
  templateUrl: './topic-messages.html',
})
export class TopicMessages {
  searchMessagesOptions = { ...defaultSearchMessagesOptions };
  expandedRows = new Map<number, boolean>();

  search = signal('');

  messages = computed(() => {
    const search = this.search().toLowerCase();

    return this.store.messages()?.filter((msg) => {
      if (search) {
        const key = msg.key?.toLowerCase() || '';
        const value = msg.value?.toLowerCase() || '';
        return key.includes(search) || value.includes(search);
      }

      return true;
    });
  });

  constructor(readonly store: TopicDetailsStore) {}

  onSubmitClick(): void {
    this.store.loadMessages(this.searchMessagesOptions);
    this.expandedRows.clear();
  }

  onClearAllClick(): void {
    this.searchMessagesOptions = { ...defaultSearchMessagesOptions };
  }

  onToggleRowClick(rowIndex: number): void {
    const messages = this.messages();

    if (messages && messages.length > 0) {
      const expanded = !!this.expandedRows.get(rowIndex);
      this.expandedRows.set(rowIndex, !expanded);
    }
  }
}
