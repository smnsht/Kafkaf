import { computed, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { TopicDetailsViewModel } from './topic-details-view.model';
import { getErrorMessage } from '../base-store';
import { UpdateTopicModel } from './update-topic.model';
import { TopicSettingRow } from '../topic-settings/topic-settings-store';


interface TopicDetailsState {
  topic: string;
  clusterIdx: number;
  showMessageForm: boolean;
  details?: TopicDetailsViewModel;
  settings?: TopicSettingRow[];
  //consumers?: TopicConsumersRow[];
  //messages?: MessageRow[];
  // loading...
  loadingDetails?: boolean;
  //loadingSettings?: boolean;
  //loadingConsumers?: boolean;
  loadingMessages?: boolean;
  // error...
  errorDetails?: string;
  //errorSettings?: string;
  //errorConsumers?: string;
  //errorMessages?: string;
  // notice
  noticeDetails?: string;
  //noticeSettings?: string;
  //noticeMessages?: string;
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
  //readonly showMessageForm = computed(() => this.state().showMessageForm);
  readonly details = computed(() => this.state().details);
  //readonly settings = computed(() => this.state().settings);
  //readonly consumers = computed(() => this.state().consumers);
  //readonly messages = computed(() => this.state().messages);
  readonly partitions = computed(() => this.state().details?.partitions);

  // loading...
  readonly loadingDetails = computed(() => this.state().loadingDetails);
  //readonly loadingSettings = computed(() => this.state().loadingSettings);
  //readonly loadingConsumers = computed(() => this.state().loadingConsumers);
  readonly loadingMessages = computed(() => this.state().loadingMessages);

  // error...
  readonly errorDetails = computed(() => this.state().errorDetails);
  //readonly errorSettings = computed(() => this.state().errorSettings);
  //readonly errorConsumers = computed(() => this.state().errorConsumers);
  //readonly errorMessages = computed(() => this.state().errorMessages);

  // notice
  readonly noticeDetails = computed(() => this.state().noticeDetails);
  //readonly noticeSettings = computed(() => this.state().noticeSettings);
  //readonly noticeMessages = computed(() => this.state().noticeMessages);

  // setShowMessageForm(showMessageForm: boolean): void {
  //   this.state.update((state) => ({ ...state, showMessageForm }));
  // }

  loadTopicDetails(reload = false): void {
    if (reload || (!this.details() && !this.loadingDetails())) {
      this.state.update((state) => ({
        ...state,
        loadingDetails: true,
        errorDetails: undefined,
      }));

      this.fetchTopicDetails();
    }
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



}
