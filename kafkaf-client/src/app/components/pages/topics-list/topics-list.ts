import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TopicsDropdownMenu } from '@app/components/features/topics-dropdown-menu/topics-dropdown-menu';
import { DropdownMenuEvent } from '@app/components/shared/dropdown-menu/dropdown-menu';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { ConfirmationService } from '@app/services/confirmation/confirmation';
import { CreateTopicModel } from '@app/store/topics/create-topic.model';
import { TopicsListViewModel } from '@app/store/topics/topics-list-view.model';
import { TopicsStore } from '@app/store/topics/topics.service';
import { filter, concatMap, Observable, map } from 'rxjs';

@Component({
  selector: 'app-topics-list',
  imports: [FormsModule, KafkafTableDirective, PageWrapper, RouterLink, TopicsDropdownMenu],
  templateUrl: './topics-list.html',
})
export class TopicsList {
  public readonly store = inject(TopicsStore);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly route = inject(ActivatedRoute);

  search = signal('');
  showInternalTopics = signal(false);
  selectedTopics: string[] = [];

  topics = computed(() => {
    const searchStr = this.search().toLowerCase();
    const showInternal = this.showInternalTopics();
    const topics = this.store.currentItems();

    return topics?.filter((topic) => {
      if (!showInternal && topic.isInternal) {
        return false;
      }

      if (searchStr && !topic.topicName.toLowerCase().includes(searchStr)) {
        return false;
      }

      return true;
    });
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const clusterIdx = Number.parseInt(params.get('cluster')!);
      this.store.selectCluster(clusterIdx);
      this.store.loadTopics();
    });
  }

  onCheckboxChange(value: string, isChecked: boolean) {
    this.selectedTopics = isChecked
      ? [...this.selectedTopics, value]
      : this.selectedTopics.filter((topicName) => topicName !== value);
  }

  onDeleteTopicsClick(): void {
    this.confirmationService
      .confirm('Confirm Deletion', 'Are you sure you want to delete the selected topics?')
      .pipe(
        filter((confirmed) => confirmed),
        concatMap(() => this.store.deleteTopics(this.selectedTopics)),
      )
      .subscribe(() => {
        this.selectedTopics = [];
      });
  }

  onCopyTopicClick(): void {
    const topicName = this.selectedTopics[0];
    const topic = this.store.currentItems()?.find((topic) => topic.topicName == topicName);

    if (!topic) {
      this.store.setError(`Can't find topic name ${topicName}!`);
      return;
    }

    this.getTopicQueryParams(topic).subscribe((queryParams) => {
      this.router.navigate([this.router.url, 'create'], { queryParams });
    });
  }

  onPurgeMessagesClick(): void {
    this.confirmationService
      .confirm(
        'Purge Messages',
        'This will permanently delete all messages from the selected topics. This action cannot be undone. Do you want to continue?',
      )
      .pipe(
        filter((confirmed) => confirmed),
        concatMap(() => this.store.purgeMessages(this.selectedTopics)),
      )
      .subscribe(() => {
        this.selectedTopics = [];
      });
  }

  onCommandSelected(event: DropdownMenuEvent, topic: TopicsListViewModel): void {
    if (event.confirmed) {
      switch (event.command) {
        case 'ClearMessages':
          this.store.purgeMessages([topic.topicName]).subscribe();
          break;

        case 'RemoveTopic':
          this.store.deleteTopic(topic.topicName).subscribe();
          break;

        case 'RecreateTopic':
          this.store
            .recreateTopic(topic.topicName, {
              numPartitions: topic.partitionsCount,
              replicationFactor: topic.partitionsCount,
            })
            .subscribe(() => {
              this.store.loadTopics(true);
            });
          break;

        default:
          this.store.setError(`unknown command ${event.command}`);
      }
    }
  }

  private getTopicQueryParams(topic: TopicsListViewModel): Observable<CreateTopicModel> {
    return this.store.loadTopicSettings(topic.topicName).pipe(
      map((settings) => {
        const queryParams: CreateTopicModel = {
          name: topic.topicName,
          numPartitions: topic.partitionsCount,
          customParameters: [],
        };

        settings.forEach((setting) => {
          switch (setting.name) {
            case 'cleanup.policy':
              queryParams.cleanupPolicy = setting.value;
              break;

            case 'min.insync.replicas':
              queryParams.minInSyncReplicas = Number.parseInt(setting.value);
              break;

            case 'retention.ms':
              queryParams.timeToRetain = Number.parseInt(setting.value);
              break;

            case 'max.message.bytes':
              queryParams.maxMessageBytes = Number.parseInt(setting.value);
              break;
          }
        });

        return queryParams;
      }),
    );
  }
}
