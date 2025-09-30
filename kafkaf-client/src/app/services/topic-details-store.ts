import { computed, inject, signal, WritableSignal } from '@angular/core';
import { TopicDetailsViewModel } from '../response.models';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

interface TopicDetailsState {
  topic: string;
  clusterIdx: number;
  topicDetails?: TopicDetailsViewModel;
  loading?: boolean;
  error?: string;
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
  readonly topicDetails = computed(() => this.state().topicDetails );
  readonly error = computed(() => this.state().error);

  loadTopicDetails(): void {
    this.state.update((state) => ({ ...state, loading: true }));

    this.fetchTopicDetails();
  }

  private fetchTopicDetails() {
    return this.http.get<TopicDetailsViewModel>(this.url).subscribe({
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
}
