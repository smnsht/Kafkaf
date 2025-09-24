import { Component } from '@angular/core';
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";
import { KafkafTable } from "../../directives/kafkaf-table";

@Component({
  selector: 'app-consumers',
  imports: [PageWrapper, KafkafTable],
  templateUrl: './consumers.html',
  styleUrl: './consumers.scss'
})
export class Consumers {

}
