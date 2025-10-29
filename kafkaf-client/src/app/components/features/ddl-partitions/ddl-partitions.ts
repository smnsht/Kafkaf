import { Component, computed, effect, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PartitionInfo } from '@app/models/partition-info';
import { ClickOutsideDirective } from '@app/directives/click-outside/click-outside';
import { TopicOverviewStore } from '@app/store/topic-overview/topic-overview-store';

@Component({
  selector: 'ddl-partitions',
  imports: [FormsModule, ClickOutsideDirective],
  templateUrl: './ddl-partitions.html',
  styleUrl: './ddl-partitions.scss',
})
export class DDLPartitions implements OnInit {
  private readonly store = inject(TopicOverviewStore);

  // signals
  isActive = signal(false);
  search = signal('');
  selectAll = signal(false);

  // model
  selected = model<number[]>();

  selectedNotEmpty = computed(() => {
    const arr = this.selected();
    return arr && arr.length > 0;
  });

  selectedSet = computed(() => {
    const arr = this.selected();
    return new Set(arr);
  });

  partitionsFiltered = computed(() => {
    const all = this.store.partitions(); //this.src();
    const searchTopic = Number.parseInt(this.search());

    if (Number.isNaN(searchTopic)) {
      return all;
    }

    const search = searchTopic.toString();

    return all?.filter((item) => item.partition.toString().includes(search));
  });

  partitionsCommaSeparted = computed(() => {
    const selected = this.selected() || [];
    return selected.join(',');
  });

  partitionsWithMessages = computed(() => {
    const partitions = this.store.partitions() || [];
    return partitions?.filter((p) => p.messagesCount > 0);
  });

  constructor() {
    effect(() => {
      if (this.selectAll()) {
        const arr = this.partitionsWithMessages().map((p) => p.partition);
        this.selected.set(arr);
      } else {
        this.selected.set([]);
      }
    });
  }

  ngOnInit(): void {
    this.store.loadTopicDetails();
  }

  toggleIsActive(): void {
    const isActive = this.isActive();
    this.isActive.set(!isActive);
  }

  onCheckboxChange(p: PartitionInfo): void {
    const selectedSet = this.selectedSet();
    const isChecked = selectedSet.has(p.partition);

    // toggle checkbox

    if (isChecked) {
      selectedSet.delete(p.partition);
    } else {
      selectedSet.add(p.partition);
    }

    this.selected.set(Array.from(selectedSet.values()));
  }

  onClickedOutside(): void {
    if (this.isActive()) {
      this.isActive.set(false);
    }
  }
}
