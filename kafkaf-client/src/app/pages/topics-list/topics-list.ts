import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KafkafTable } from '../../directives/kafkaf-table';
import { TopicsStore } from '../../services/topics-store';
import { PageWrapper } from '../../components/page-wrapper/page-wrapper';

@Component({
  selector: 'app-topics-list',
  imports: [FormsModule, KafkafTable, PageWrapper, RouterLink],
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

  constructor(public store: TopicsStore, route: ActivatedRoute) {
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
    this.store.deleteTopics(this.selectedTopics).then(() => {
      this.selectedTopics = [];
    });
  }

  onCopyTopicClick(): void {
    console.log('onCopyTopicClick', this.selectedTopics);
  }

  onPurgeMessagesClick(): void {
    this.store.purgeMessages(this.selectedTopics).then(() => {
      this.selectedTopics = [];
    });
  }
}
