import { Component, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SerdeTypes, DDLSerde } from '../ddl-serde/ddl-serde';
import { JsonValidatorDirective } from '@app/directives/json-validator/json-validator';
import { LoggerService } from '@app/services/logger/logger';
import { CreateMessage } from '@app/store/topic-detais/create-message';
import { TopicDetailsStore } from '@app/store/topic-detais/topic-details.service';

const defaultPayload: CreateMessage = {
  rawJson: '{}',
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

  constructor(
    readonly store: TopicDetailsStore,
    private readonly logger: LoggerService,
  ) {
    this.payload = { ...defaultPayload };

    effect(() => {
      const visible = this.store.showMessageForm();
      if (!visible) {
        this.payload = { ...defaultPayload };
      }
    });
  }

  onProduceMessageClick(): void {
    try {
      const obj = JSON.parse(this.payload.rawJson ?? '{}');
      const map = new Map<string, string>(Object.entries(obj).map(([k, v]) => [k, String(v)]));
      this.payload.headers = Object.fromEntries(map);
    } catch (e) {
      alert('Error! Invalid JSON in headers.');
      return;
    }

    this.store.produceMessage(this.payload).subscribe(() => {
      this.store.loadTopicDetails();
      this.store.setShowMessageForm(false);
      this.store.loadTopicDetails(true);
      alert('Message created!');
    });
  }
}
