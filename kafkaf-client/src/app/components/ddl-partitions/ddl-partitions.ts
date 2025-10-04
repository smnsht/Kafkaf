import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartitionInfo } from '../../response.models';
import { ClickOutsideDirective } from '../../directives/click-outside';

@Component({
  selector: 'ddl-partitions',
  imports: [FormsModule, ClickOutsideDirective],
  templateUrl: './ddl-partitions.html',
  styleUrl: './ddl-partitions.scss',
})
export class DDLPartitions {
  isActive = signal(false);
  search = signal('');
  selectAll = signal(false);

  src = input<PartitionInfo[] | undefined>();
  // array index -> partintion id
  selected = signal(new Map<number, number>([]));

  partitionsChange = output<number[]>();

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
    const selected = this.selected();
    return Array.from(selected.values()).join(',');
  });

  partitionsWithMessages = computed(() => {
    const partitions = this.src() || [];
    return partitions?.filter((p) => p.messagesCount > 0);
  });

  constructor() {
    effect(() => {
      if (this.selectAll()) {
        this.selected.update((map) => {
          map.clear();

          this.partitionsWithMessages().forEach((p, index) => map.set(index, p.partition));

          return map;
        });
      } else {
        this.selected.update((map) => {
          map.clear();
          return map;
        });
      }

      this.raisePartitionsChange();
    });
  }

  toggleIsActive(): void {
    const isActive = this.isActive();
    this.isActive.set(!isActive);
  }

  onCheckboxChange(index: number, p: PartitionInfo): void {
    const isChecked = this.selected().has(index);

    // toggle checkbox

    if (isChecked) {
      this.selected.update((map) => {
        map.delete(index);
        return map;
      });
    } else {
      this.selected.update((map) => {
        map.set(index, p.partition);
        return map;
      });
    }

    this.raisePartitionsChange();
  }

  onClickedOutside(): void {
    if(this.isActive()) {
      this.isActive.set(false);
    }
  }

  private raisePartitionsChange(): void {
    const selectedPartitions = this.selected().values();
    const arr = Array.from(selectedPartitions);
    this.partitionsChange.emit(arr);
  }
}
