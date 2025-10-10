import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { concatMap, filter, map, Observable } from 'rxjs';
import { KafkafTable } from '../../directives/kafkaf-table';
import { TopicsDropdownMenu, PageWrapper } from '../../components/index';
import { TopicsListViewModel } from '../../response.models';
import { TopicsStore } from '../../store/topics-store';
import { DropdownMenuEvent } from '../../components/dropdown-menu/dropdown-menu';
import { CreateTopicModel } from '../../store/request.models';
import { ConfirmationService } from '../../services/confirmation-service';

@Component({
  selector: 'app-topics-list',
  imports: [FormsModule, KafkafTable, PageWrapper, RouterLink, TopicsDropdownMenu],
  templateUrl: './topics-list.html',
  styleUrl: './topics-list.scss',
})
export class TopicsList {
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

  constructor(
    public readonly store: TopicsStore,
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService,
    route: ActivatedRoute
  ) {
    route.paramMap.subscribe((params) => {
      const clusterIdx = parseInt(params.get('cluster')!);
      store.selectCluster(clusterIdx);
      store.loadTopics();
    });
  }

  onCheckboxChange(value: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedTopics.push(value);
    } else {
      this.selectedTopics = this.selectedTopics.filter((item) => item !== value);
    }
  }

  onDeleteTopicsClick(): void {
    this.confirmationService
      .confirm('Confirm Deletion', 'Are you sure you want to delete the selected topics?')
      .pipe(
        filter((confirmed) => confirmed),
        concatMap(() => this.store.deleteTopics(this.selectedTopics))
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
        'This will permanently delete all messages from the selected topics. This action cannot be undone. Do you want to continue?'
      )
      .pipe(
        filter((confirmed) => confirmed),
        concatMap(() => this.store.purgeMessages(this.selectedTopics))
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
              queryParams.minInSyncReplicas = parseInt(setting.value);
              break;

            case 'retention.ms':
              queryParams.timeToRetain = parseInt(setting.value);
              break;

            case 'max.message.bytes':
              queryParams.maxMessageBytes = parseInt(setting.value);
              break;
          }
        });

        return queryParams;
      })
    );
  }
}
