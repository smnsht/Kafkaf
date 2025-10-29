import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SerdeTypes, DDLSerde } from '../ddl-serde/ddl-serde';
import { JsonValidatorDirective } from '@app/directives/json-validator/json-validator';
import { CreateMessage } from '@app/models/message.models';
import { TopicDetailsStore } from '@app/store/topic-detais/topic-details.service';
import { TopicMessagesStore } from '@app/store/topic-messages/topic-messages-store';

const defaultPayload: CreateMessage = {
  rawJson: '{}',
  keySerde: SerdeTypes[0],
  valueSerde: SerdeTypes[0],
};

@Component({
  selector: 'app-message-form',
  imports: [DDLSerde, FormsModule, JsonValidatorDirective],
  templateUrl: './message-form.html',
})
export class MessageForm {
  readonly topicDetailsStore = inject(TopicDetailsStore);
  readonly messagesStore = inject(TopicMessagesStore);

  payload: CreateMessage;

  constructor() {
    this.payload = { ...defaultPayload };

    effect(() => {
      const visible = this.messagesStore.showMessageForm();
      if (!visible) {
        this.payload = { ...defaultPayload };
      }
    });
  }

  onProduceMessageClick(): void {
    this.messagesStore.produceMessage(this.payload).subscribe(() => {
      this.messagesStore.setShowMessageForm(false);
      this.topicDetailsStore.loadTopicDetails(true);
    });
  }
}
