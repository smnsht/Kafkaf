import { Component, computed, signal } from '@angular/core';
import { DDLSortOrder, DDLSerde, DDLPartitions, SortOrderType, SerdeType } from '../../components/dropdowns/dropdowns';
import { DdlSeekType, SeekType } from '../../components/ddl-seek-type/ddl-seek-type';
import { KafkafTable } from '../../directives/kafkaf-table';
import { defaultSearchMessagesOptions, TopicDetailsStore } from '../../services/topic-details-store';
import { DatePipe } from '@angular/common';
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";

@Component({
  selector: 'app-topic-messages',
  standalone: true,
  imports: [DDLSortOrder, DDLSerde, DDLPartitions, DdlSeekType, KafkafTable, DatePipe, PageWrapper],
  templateUrl: './topic-messages.html',
  styleUrl: './topic-messages.scss',
})
export class TopicMessages {
  searchMessagesOptions = { ...defaultSearchMessagesOptions };
  partitions = computed<number[]>(() => {
    const partitions = this.store.partitions() ?? [];
    return partitions.map(p => p.partition);
  });

  constructor(readonly store: TopicDetailsStore){   }

  onSubmitClick(): void {
    //console.log(this.searchMessagesOptions)
    this.store.loadMessages(this.searchMessagesOptions)
  }
}
