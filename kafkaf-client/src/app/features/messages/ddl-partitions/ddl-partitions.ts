import { Component, computed, effect, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PartitionInfo } from '../../shared/models/response.models';
import { ClickOutsideDirective } from '../../directives/click-outside';

@Component({
  selector: 'ddl-partitions',
  imports: [FormsModule, ClickOutsideDirective],
  templateUrl: './ddl-partitions.html',
  styleUrl: './ddl-partitions.scss',
})
export class DDLPartitions {
  // signals
  isActive = signal(false);
  search = signal('');
  selectAll = signal(false);

  // inputs
  src = input<PartitionInfo[] | undefined>();

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
    const all = this.src();
    const searchTopic = parseInt(this.search());

    if (isNaN(searchTopic)) {
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
    const partitions = this.src() || [];
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
