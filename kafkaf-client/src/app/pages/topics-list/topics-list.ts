import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { KafkafTable } from '../../directives/kafkaf-table';
import { TopicsDropdownMenu, PageWrapper } from '../../components/index';
import { TopicsListViewModel } from '../../response.models';
import { TopicsStore } from '../../store/topics-store';
import { DropdownMenuCommand } from '../../components/dropdown-menu/dropdown-menu';
import { map, Observable } from 'rxjs';

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
    this.store.deleteTopics(this.selectedTopics).subscribe(() => {
      this.selectedTopics = [];
    });
  }

  onCopyTopicClick(): void {
    try {
      const topic = this.getTopicByName(this.selectedTopics[0]);

      this.getTopicQueryParams(topic).subscribe((queryParams) => {
        this.router.navigate([this.router.url, 'create'], { queryParams });
      });
    } catch (err: any) {
      this.store.setError(err.message);
    }
  }

  onPurgeMessagesClick(): void {
    this.store.purgeMessages(this.selectedTopics).subscribe((res) => {
      this.store.setNotice(
        `Messages purged of ${res.length} ${res.length == 1 ? 'topic' : 'topics'}.`
      );
      this.selectedTopics = [];
    });
  }

  onCommandSelected(command: DropdownMenuCommand, topic: TopicsListViewModel): void {
    switch (command) {
      case 'ClearMessages':
        this.selectedTopics = [topic.topicName];
        this.onPurgeMessagesClick();
        break;

      case 'RemoveTopic':
        this.selectedTopics = [topic.topicName];
        this.onDeleteTopicsClick();
        break;

      case 'RecreateTopic':
        this.recreateTopic(topic);
        break;

      default:
        this.store.setError(`unknown command ${command}`);
    }
  }

  private getTopicByName(topicName: string): TopicsListViewModel {
    const topic = this.store.currentItems()?.find((topic) => topic.topicName == topicName);
    if (!topic) {
      //this.store.setError();
      throw new Error(`Can't find topic name ${topicName}!`);
    }

    return topic;
  }

  private getTopicQueryParams(topic: TopicsListViewModel): Observable<any> {
    return this.store.loadTopicSettings(topic.topicName).pipe(
      map((settings) => {
        const queryParams: any = {
          name: topic.topicName,
          numPartitions: topic.partitionsCount,
          replicationFactor: topic.replicationFactor,
        };

        settings.forEach((setting) => {
          switch (setting.name) {
            case 'cleanup.policy':
              queryParams['cleanupPolicy'] = setting.value;
              break;

            case 'min.insync.replicas':
              queryParams['minInSyncReplicas'] = setting.value;
              break;

            case 'retention.ms':
              queryParams['timeToRetain'] = setting.value;
              break;

            case 'max.message.bytes':
              queryParams['maxMessageBytes'] = setting.value;
              break;
          }
        });

        return queryParams;
      })
    );
  }

  private recreateTopic(topic: TopicsListViewModel): void {
    const topicSpecification = {
        name: topic.topicName + Date.now(),
        numPartitions: topic.partitionsCount,
        configs: new Map<string, string>()
      };

      this.store.loadTopicSettings(topic.topicName).subscribe(settings => {
        settings.forEach(setting => {
          if (setting.value != null) {
            topicSpecification.configs.set(setting.name, setting.value)
          }
        });

        this.store.createTopic(topicSpecification).subscribe();
      });



  }
}
