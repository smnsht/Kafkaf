import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DDLPartitions } from '@app/components/features/ddl-partitions/ddl-partitions';
import { DdlSeekType } from '@app/components/features/ddl-seek-type/ddl-seek-type';
import { DDLSerde } from '@app/components/features/ddl-serde/ddl-serde';
import { DDLSortOrder } from '@app/components/features/ddl-sort-order/ddl-sort-order';
import { MessageDetails } from '@app/components/features/message-details/message-details';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { TimestampPipe } from '@app/pipes/timestamp/timestamp';
import { TruncatePipe } from '@app/pipes/truncate/truncate';
import {
  defaultSearchMessagesOptions,
  TopicDetailsStore,
} from '@app/store/topic-detais/topic-details.service';

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
