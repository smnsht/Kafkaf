import { Component } from '@angular/core';
import { DDLSortOrder, DDLSerde, DDLPartitions, SortOrderType, SerdeType } from '../../components/dropdowns/dropdowns';
import { DdlSeekType, SeekType } from '../../components/ddl-seek-type/ddl-seek-type';
import { KafkafTable } from '../../directives/kafkaf-table';

@Component({
  selector: 'app-topic-messages',
  standalone: true,
  imports: [DDLSortOrder, DDLSerde, DDLPartitions, DdlSeekType, KafkafTable],
  templateUrl: './topic-messages.html',
  styleUrl: './topic-messages.scss',
})
export class TopicMessages {
  partitions = [0, 1, 2];

  seekType: SeekType = 'Offset';
  partition = 0;
  keySerde: SerdeType = 'String';
  valueSerde: SerdeType = 'String';
  sortOrder: SortOrderType = 'FORWARD';
}
