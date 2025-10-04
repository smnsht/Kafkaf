import { computed, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import {
  ConsumerGroupRow,
  MessageRow,
  TopicDetailsViewModel,
  TopicSettingRow,
} from '../response.models';
import { environment } from '../../environments/environment';
import { SeekType } from '../components/ddl-seek-type/ddl-seek-type';
import { SerdeType } from '../components/ddl-serde/ddl-serde';
import { SortOrderType } from '../components/ddl-sort-order/ddl-sort-order';

export interface SearchMessagesOptions {
  seekType: SeekType;
  partition: number;
  keySerde: SerdeType;
  valueSerde: SerdeType;
  sortOrder: SortOrderType;
}

export const defaultSearchMessagesOptions: SearchMessagesOptions = {
  seekType: 'Offset',
  partition: 0,
  keySerde: 'String',
  valueSerde: 'String',
  sortOrder: 'FORWARD',
};

interface TopicDetailsState {
  topic: string;
  clusterIdx: number;
  details?: TopicDetailsViewModel;
  settings?: TopicSettingRow[];
  consumers?: ConsumerGroupRow[];
  messages?: MessageRow[];
  // loading...
  loadingDetails?: boolean;
  loadingSettings?: boolean;
  loadingConsumers?: boolean;
  loadingMessages?: boolean;
  // error...
  errorDetails?: string;
  errorSettings?: string;
  errorConsumers?: string;
  errorMessages?: string;
}

export class TopicDetailsStore {
  private readonly state: WritableSignal<TopicDetailsState>;
  private readonly url: string;
  private readonly http = inject(HttpClient);

  constructor(clusterIdx: number, topic: string) {
    const initialState: TopicDetailsState = { topic, clusterIdx };

    this.url = `${environment.apiUrl}/clusters/${clusterIdx}/topics/${topic}`;
    this.state = signal(initialState);
  }

  // required
  readonly topic = computed(() => this.state().topic);
  readonly clusterIdx = computed(() => this.state().clusterIdx);

  // data
  readonly details = computed(() => this.state().details);
  readonly settings = computed(() => this.state().settings);
  readonly consumers = computed(() => this.state().consumers);
  readonly messages = computed(() => this.state().messages);
  readonly partitions = computed(() => this.state().details?.partitions);

  // loading...
  readonly loadingDetails = computed(() => this.state().loadingDetails);
  readonly loadingSettings = computed(() => this.state().loadingSettings);
  readonly loadingConsumers = computed(() => this.state().loadingConsumers);
  readonly loadingMessages = computed(() => this.state().loadingMessages);

  // error...
  readonly errorDetails = computed(() => this.state().errorDetails);
  readonly errorSettings = computed(() => this.state().errorSettings);
  readonly errorConsumers = computed(() => this.state().errorConsumers);
  readonly errorMessages = computed(() => this.state().errorMessages);

  loadTopicDetails(): void {
    if (!this.details() && !this.loadingDetails()) {
      this.state.update((state) => ({
        ...state,
        loadingDetails: true,
        errorDetails: undefined,
      }));

      this.fetchTopicDetails();
    }
  }

  loadSettings(): void {
    if (!this.settings() && !this.loadingSettings()) {
      this.state.update((state) => ({
        ...state,
        loadingSettings: true,
        errorSettings: undefined,
      }));

      this.fetchSettings();
    }
  }

  loadConsumers(): void {
    if (!this.consumers() && !this.loadingConsumers()) {
      this.state.update((state) => ({
        ...state,
        loadingConsumers: true,
        errorConsumers: undefined,
      }));

      this.fetchConsumers();
    }
  }

  loadMessages(options: SearchMessagesOptions): void {
    this.state.update((state) => ({
      ...state,
      loadingMessages: true,
      errorMessages: undefined,
    }));

    this.fetchMessages(
      new HttpParams().appendAll({
        partitions: [options.partition],
        seekType: options.seekType,
        seekDirection: options.sortOrder,
        keySerde: options.keySerde,
        valueSerde: options.valueSerde,
      })
    );
  }

  private fetchTopicDetails() {
    this.http.get<TopicDetailsViewModel>(this.url).subscribe({
      next: (topicDetails) =>
        this.state.update((state) => ({
          ...state,
          details: topicDetails,
          loadingDetails: false,
        })),
      error: (err) => {
        this.state.update((state) => ({
          ...state,
          loadingDetails: false,
          errorDetails: err.message,
        }));
      },
    });
  }

  private fetchSettings(): void {
    this.http.get<TopicSettingRow[]>(`${this.url}/settings`).subscribe({
      next: (settings) =>
        this.state.update((state) => ({ ...state, settings, loadingSettings: false })),
      error: (err: HttpErrorResponse) =>
        this.state.update((state) => ({
          ...state,
          loadingSettings: false,
          errorSettings: err.message,
        })),
    });
  }

  private fetchConsumers(): void {
    this.http.get<ConsumerGroupRow[]>(`${this.url}/consumers`).subscribe({
      next: (consumers) =>
        this.state.update((state) => ({
          ...state,
          consumers,
          loadingConsumers: false,
        })),
      error: (err: HttpErrorResponse) =>
        this.state.update((state) => ({
          ...state,
          loadingConsumers: false,
          errorConsumers: err.message,
        })),
    });
  }

  private fetchMessages(params: HttpParams): void {
    this.http.get<MessageRow[]>(`${this.url}/messages`, { params }).subscribe({
      next: (messages) =>
        this.state.update((state) => ({
          ...state,
          messages,
          loadingMessages: false,
        })),
      error: (err) =>
        this.state.update((state) => ({
          ...state,
          loadingMessages: false,
          errorDetails: err.message,
        })),
    });
  }
}
