import { Component, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonValidatorDirective, LoggerService } from '@app/shared';
import { TopicDetailsStore } from '../../store/topic-detais/topic-details';
import { SerdeTypes, DDLSerde } from '../ddl-serde/ddl-serde';

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
})
export class MessageForm {
  payload: CreateMessage;

  constructor(readonly store: TopicDetailsStore, private readonly logger: LoggerService) {
    this.payload = { ...defaultPayload };

    effect(() => {
      const visible = this.store.showMessageForm();
      if (!visible) {
        this.payload = { ...defaultPayload };
      }
    });
  }

  onProduceMessageClick(): void {
    this.logger.debug('[MessageForm]: ', this.payload);
    window.alert('not imeplemented yet');
  }
}
