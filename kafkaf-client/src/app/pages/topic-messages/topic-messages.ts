import { Component, computed, signal } from '@angular/core';
import { DdlSeekType } from '../../components/ddl-seek-type/ddl-seek-type';
import { KafkafTable } from '../../directives/kafkaf-table';
import {
  defaultSearchMessagesOptions,
  TopicDetailsStore,
} from '../../services/topic-details-store';
import { CommonModule } from '@angular/common';
import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { FormsModule } from '@angular/forms';
import { MessageDetails } from '../../components/message-details/message-details';
import { TimestampPipe } from '../../pipes/timestamp-pipe';
import { TruncatePipe } from '../../pipes/truncate-pipe';
import { DDLPartitions } from '../../components/ddl-partitions/ddl-partitions';
import { DDLSerde } from '../../components/ddl-serde/ddl-serde';
import { DDLSortOrder } from '../../components/ddl-sort-order/ddl-sort-order';

@Component({
  selector: 'app-topic-messages',
  standalone: true,
  imports: [
    DDLSortOrder,
    DDLSerde,
    DDLPartitions,
    DdlSeekType,
    KafkafTable,
    PageWrapper,
    FormsModule,
    CommonModule,
    MessageDetails,
    TimestampPipe,
    TruncatePipe,
  ],
  templateUrl: './topic-messages.html',
  styleUrl: './topic-messages.scss',
})
export class TopicMessages {
  searchMessagesOptions = { ...defaultSearchMessagesOptions };
  expandedRows = new Map<number, boolean>();

  search = signal('');

  partitions = computed<number[]>(() => {
    const partitions = this.store.partitions() ?? [];
    return partitions.map((p) => p.partition);
  });

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
