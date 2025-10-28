import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TopicsDropdownMenu } from '@app/components/features/topics-dropdown-menu/topics-dropdown-menu';
import { DropdownMenuEvent } from '@app/components/shared/dropdown-menu/dropdown-menu';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { ConfirmationService } from '@app/services/confirmation/confirmation';
import { HttpTopicsService } from '@app/services/http-topics/http-topics';
import { TopicsListViewModel } from '@app/store/topics/topics-list-view.model';
import { TopicsStore2 } from '@app/store/topics/topics-store';
import { filter, concatMap } from 'rxjs';

@Component({
  selector: 'page-topics-list',
  // prettier-ignore
  imports: [
    FormsModule,
    KafkafTableDirective,
    PageWrapper,
    RouterLink,
    TopicsDropdownMenu
  ],
  templateUrl: './topics-list.html',
})
export class TopicsList implements OnInit {
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly topicsService = inject(HttpTopicsService);

  readonly store = inject(TopicsStore2);
  readonly search = signal('');
  readonly showInternalTopics = signal(false);

  selectedTopics: string[] = [];

  topics = computed(() => {
    const searchStr = this.search().toLowerCase();
    const showInternal = this.showInternalTopics();
    const topics = this.store.collection();

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

  ngOnInit(): void {
    this.store.clusterIdx$
      .pipe(filter(Number.isInteger))
      .subscribe((_) => this.store.loadTopics());
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
        this.store.reloadTopics();
      });
  }

  onCopyTopicClick(): void {
    const topicName = this.selectedTopics[0];
    const topics = this.store.collection();
    const topic = topics?.find((topic) => topic.topicName == topicName);

    if (!topic) {
      this.store.setError(`Can't find topic name ${topicName}!`);
      return;
    }

    this.topicsService
      .getTopicQueryParams(this.store.clusterIndex(), topic)
      .subscribe((queryParams) => {
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
          this.store.deleteTopic(topic.topicName).subscribe(() => {
            this.selectedTopics = [];
            this.store.reloadTopics();
          });
          break;

        case 'RecreateTopic':
          this.store
            .recreateTopic(topic.topicName, {
              numPartitions: topic.partitionsCount,
              replicationFactor: topic.partitionsCount,
            })
            .subscribe(() => {
              this.store.reloadTopics();
            });
          break;

        default:
          this.store.setError(`unknown command ${event.command}`);
      }
    }
  }
}
