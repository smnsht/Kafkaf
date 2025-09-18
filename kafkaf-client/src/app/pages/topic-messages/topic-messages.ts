import { Component } from '@angular/core';
import { DDLSortOrder, DDLSerde, DDLPartitions } from "../../components/dropdowns/dropdowns";
import { DdlSeekType } from "../../components/ddl-seek-type/ddl-seek-type";
import { KafkafTable } from "../../directives/kafkaf-table";

@Component({
  selector: 'app-topic-messages',
  standalone: true,
  imports: [DDLSortOrder, DDLSerde, DDLPartitions, DdlSeekType, KafkafTable],
  templateUrl: './topic-messages.html',
  styleUrl: './topic-messages.scss'
})
export class TopicMessages {

}
