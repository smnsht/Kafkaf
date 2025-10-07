import { Component, effect } from '@angular/core';
import { TopicDetailsStore } from '../../services/topic-details-store';
import { DDLSerde, SerdeTypes } from '../ddl-serde/ddl-serde';
import { FormsModule } from '@angular/forms';
import { JsonValidatorDirective } from "../../directives/json-validator-directive";

interface CreateMessage {
  partition: number;
  keySerde: string;
  valueSerde: string;
  keepContents?: boolean;
  key?: string;
  message?: string;
  headers?: string;
}

const defaultPayload: CreateMessage = {
  partition: 0,
  headers: '{}',
  keySerde: SerdeTypes[0],
  valueSerde: SerdeTypes[0],
};

@Component({
  selector: 'message-form',
  imports: [DDLSerde, FormsModule, JsonValidatorDirective],
  templateUrl: './message-form.html',
  styleUrl: './message-form.scss',
})
export class MessageForm {
  payload: CreateMessage;

  constructor(readonly store: TopicDetailsStore) {
    this.payload = { ...defaultPayload };

    effect(() => {
      const visible = this.store.showMessageForm();
      if (!visible) {
        this.payload = { ...defaultPayload };
      }
    });
  }

  onProduceMessageClick(): void {
    console.log(this.payload);
    window.alert('not imeplemented yet');
  }
}
