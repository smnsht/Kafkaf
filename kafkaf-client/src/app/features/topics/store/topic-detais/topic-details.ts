import { computed, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { getErrorMessage } from '@app/shared';
import { environment } from 'environments/environment';
import { MessageRow } from '../../models/message-row';
import { SearchMessagesOptions } from '../../models/search-messages-options';
import { TopicDetailsViewModel } from '../../models/topic-details-view-model';
import { TopicSettingRow } from '../../models/topic-setting-row';
import { UpdateTopicModel } from '@app/shared/models/update-topic';
import { Observable, tap } from 'rxjs';
import { TopicConsumersRow } from '../../models/topic-consumers-row';
import { CreateMessage } from '../../models/create-message';

export const defaultSearchMessagesOptions: SearchMessagesOptions = {
  seekType: 'Offset',
  partitions: [],
  keySerde: 'String',
  valueSerde: 'String',
  sortOrder: 'FORWARD',
};

interface TopicDetailsState {
  topic: string;
  clusterIdx: number;
  showMessageForm: boolean;
  details?: TopicDetailsViewModel;
  settings?: TopicSettingRow[];
  consumers?: TopicConsumersRow[];
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
  // notice
  noticeDetails?: string;
  noticeSettings?: string;
  noticeMessages?: string;
}

export class TopicDetailsStore {
  private readonly state: WritableSignal<TopicDetailsState>;
  private readonly url: string;
  private readonly http = inject(HttpClient);

  constructor(clusterIdx: number, topic: string) {
    const initialState: TopicDetailsState = { topic, clusterIdx, showMessageForm: false };

    this.url = `${environment.apiUrl}/clusters/${clusterIdx}/topics/${topic}`;
    this.state = signal(initialState);
  }

  // required
  readonly topic = computed(() => this.state().topic);
  readonly clusterIdx = computed(() => this.state().clusterIdx);

  // data
  readonly showMessageForm = computed(() => this.state().showMessageForm);
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

  // notice
  readonly noticeDetails = computed(() => this.state().noticeDetails);
  readonly noticeSettings = computed(() => this.state().noticeSettings);
  readonly noticeMessages = computed(() => this.state().noticeMessages);

  setShowMessageForm(showMessageForm: boolean): void {
    this.state.update((state) => ({ ...state, showMessageForm }));
  }

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
        partitions: options.partitions,
        seekType: options.seekType,
        seekDirection: options.sortOrder,
        keySerde: options.keySerde,
        valueSerde: options.valueSerde,
      }),
    );
  }

  produceMessage(msg: CreateMessage): Observable<object> {
    this.state.update((state) => ({
      ...state,
      loadingMessages: true,
      errorMessages: undefined,
    }));

    return this.http.post<object>(`${this.url}/messages`, msg).pipe(
      tap({
        next: () => {
          this.state.update((state) => ({
            ...state,
            loadingMessages: false,
            noticeMessages: 'Message created.',
          }));
        },
        error: (err) =>
          this.state.update((state) => ({
            ...state,
            loadingMessages: false,
            errorDetails: getErrorMessage(err),
          })),
      }),
    );
  }

  updateTopic(model: UpdateTopicModel) {
    this.state.update((state) => ({
      ...state,
      loadingDetails: true,
      errorDetails: undefined,
    }));

    this.http.put<void>(this.url, model).subscribe({
      next: () => {
        this.state.update((state) => ({
          ...state,
          details: undefined,
          settings: undefined,
          loadingDetails: false,
          noticeDetails: `Topic ${this.topic()} updated.`,
        }));
      },
      error: (err: HttpErrorResponse) => {
        this.state.update((state) => ({
          ...state,
          loadingDetails: false,
          errorDetails: getErrorMessage(err),
        }));
      },
    });
  }

  patchSetting(model: { name: string; value: string }) {
    this.state.update((state) => ({
      ...state,
      loadingSettings: true,
      errorSettings: undefined,
      noticeSettings: undefined,
    }));

    return this.http.patch<void>(`${this.url}/settings/${model.name}`, model).pipe(
      tap({
        next: () => {
          this.state.update((state) => ({
            ...state,
            settings: undefined,
            loadingSettings: false,
            noticeSettings: `Setting ${model.name} updated.`,
          }));

          this.fetchSettings();
        },
        error: (err: HttpErrorResponse) => {
          this.state.update((state) => ({
            ...state,
            loadingSettings: false,
            errorSettings: getErrorMessage(err),
          }));
        },
      }),
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
      error: (err: HttpErrorResponse) => {
        this.state.update((state) => ({
          ...state,
          loadingDetails: false,
          errorDetails: getErrorMessage(err),
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
          errorSettings: getErrorMessage(err),
        })),
    });
  }

  private fetchConsumers(): void {
    this.http.get<TopicConsumersRow[]>(`${this.url}/consumers`).subscribe({
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
          errorConsumers: getErrorMessage(err),
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
      error: (err: HttpErrorResponse) =>
        this.state.update((state) => ({
          ...state,
          loadingMessages: false,
          errorDetails: getErrorMessage(err),
        })),
    });
  }
}
