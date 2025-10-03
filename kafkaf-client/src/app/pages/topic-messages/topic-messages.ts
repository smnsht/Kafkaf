import { Component, computed, signal } from '@angular/core';
import { DDLSortOrder, DDLSerde, DDLPartitions } from '../../components/dropdowns/dropdowns';
import { DdlSeekType } from '../../components/ddl-seek-type/ddl-seek-type';
import { KafkafTable } from '../../directives/kafkaf-table';
import {
  defaultSearchMessagesOptions,
  TopicDetailsStore,
} from '../../services/topic-details-store';
import { CommonModule, DatePipe } from '@angular/common';
import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { FormsModule } from '@angular/forms';
import { MessageDetails } from "../../components/message-details/message-details";
import { TimestampPipe } from '../../pipes/timestamp-pipe';
import { TruncatePipe } from '../../pipes/truncate-pipe';


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
    TruncatePipe
],
  templateUrl: './topic-messages.html',
  styleUrl: './topic-messages.scss',
})
export class TopicMessages {
  searchMessagesOptions = { ...defaultSearchMessagesOptions };
  search = signal('');
  expandedRows = signal<Map<number, boolean>>(new Map());

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

  // isRowExpanded(rowIndex: number): boolean {
  //   return this.expandedRows().has(rowIndex);
  // }

  onSubmitClick(): void {
    this.store.loadMessages(this.searchMessagesOptions);
  }

  onClearAllClick(): void {
    this.searchMessagesOptions = { ...defaultSearchMessagesOptions };
  }

  onToggleRowClick(rowIndex: number): void {
    const expanded = this.expandedRows();

    if (expanded.has(rowIndex)) {
      expanded.delete(rowIndex);
    } else {
      expanded.set(rowIndex, true);
    }

    this.expandedRows.set(expanded);
    /////////////////////////////////////////////////////////
    const messages = this.messages();
    if (messages && messages.length > 0) {
      const msg  = messages[rowIndex] as any;
      const expanded = !!msg['_expanded'];
      msg['_expanded'] = !expanded;
    }
  }
}
