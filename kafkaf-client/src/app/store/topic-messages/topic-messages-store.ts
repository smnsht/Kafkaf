import { computed, Injectable, signal } from '@angular/core';
import { SectionedDataCollectionStore } from '../sectioned-collection-store';
import {
  createHttpParamsFromSearchOptions,
  CreateMessage,
  MessageRow,
  SearchMessagesOptions,
} from '@app/models/message.models';
import { finalize, Observable } from 'rxjs';

export const defaultSearchMessagesOptions: SearchMessagesOptions = {
  partitions: [],
  seekType: 'LIMIT',
  sortOrder: 'FORWARD',
  keySerde: 'String',
  valueSerde: 'String',
};

@Injectable({
  providedIn: 'root',
})
export class TopicMessagesStore extends SectionedDataCollectionStore<MessageRow> {
  private searchContext: SearchMessagesOptions | undefined;
  private showMessage = signal(false);

  readonly messages = computed(() => this.collection());
  readonly showMessageForm = computed(() => this.showMessage());

  constructor() {
    super({});
  }

  protected override fetchCollection(): Observable<MessageRow[]> {
    if (!this.searchContext) {
      throw new Error('Search context is empty!');
    }

    const params = createHttpParamsFromSearchOptions(this.searchContext);
    const url = `${this.getResourceUrl()}/messages`;

    return this.http
      .get<MessageRow[]>(url, { params })
      .pipe(finalize(() => (this.searchContext = undefined)));
  }

  loadMessages(searchOptions: SearchMessagesOptions) {
    this.searchContext = searchOptions;
    this.loadCollection();
  }

  clearAll(): void {
    this.state.update((state) => ({ ...state, collection: undefined }));
  }

  produceMessage(msg: CreateMessage): Observable<unknown> {
    this.setLoading(true);

    const url = `${this.getResourceUrl()}/messages`;
    const noticeHandler = this.withNoticeHandling(() => 'Message created.');

    // prettier-ignore
    return this.http.post(url, msg)
        .pipe(noticeHandler);
  }

  setShowMessageForm(value: boolean) {
    this.showMessage.set(value);
  }
}
