import { computed, inject, signal, WritableSignal } from '@angular/core';
import { ConsumerGroupRow, TopicDetailsViewModel, TopicSettingRow } from '../response.models';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface TopicDetailsState {
  topic: string;
  clusterIdx: number;
  topicDetails?: TopicDetailsViewModel;
  settings?: TopicSettingRow[];
  consumers?: ConsumerGroupRow[];
  loading?: boolean;
  error?: string;

  loadingSettings?: boolean;
  errorSettings?: string;

  loadingConsumers?: boolean;
  errorConsumers?: string;
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

  readonly topic = computed(() => this.state().topic);
  readonly clusterIdx = computed(() => this.state().clusterIdx);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly topicDetails = computed(() => this.state().topicDetails);
  readonly settings = computed(() => this.state().settings);
  readonly consumers = computed(() => this.state().consumers);
  readonly loadingSettings = computed(() => this.state().loadingSettings);
  readonly errorSettings = computed(() => this.state().errorSettings);
  readonly loadingConsumers = computed(() => this.state().loadingConsumers);
  readonly ererrorConsumers = computed(() => this.state().errorConsumers);

  loadTopicDetails(): void {
    if (!this.topicDetails() && !this.loading()) {
      this.state.update((state) => ({
        ...state,
        loading: true,
        error: undefined,
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

  private fetchTopicDetails() {
    this.http.get<TopicDetailsViewModel>(this.url).subscribe({
      next: (topicDetails) =>
        this.state.update((state) => ({
          ...state,
          topicDetails,
          loading: false,
        })),
      error: (err) => {
        this.state.update((state) => ({
          ...state,
          loading: false,
          error: err.message,
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
        this.state.update((state) => ({ ...state, consumers, loadingConsumers: false })),
      error: (err: HttpErrorResponse) =>
        this.state.update((state) => ({
          ...state,
          loadingConsumers: false,
          errorConsumers: err.message,
        })),
    });
  }
}
