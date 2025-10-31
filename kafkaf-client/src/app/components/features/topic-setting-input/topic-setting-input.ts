import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MaybeString } from '@app/store/clusters/cluster-info.model';
import { TopicConfigsStore } from '@app/store/topic-configs/topic-configs-store';
import { DdlCleanupPolicy } from '../ddl-cleanup-policy/ddl-cleanup-policy';
import { Subscription } from 'rxjs';

export type TopicConfigType = 'number' | 'boolean' | 'text' | 'list';

@Component({
  selector: 'app-topic-setting-input',
  imports: [CommonModule, FormsModule, DdlCleanupPolicy],
  templateUrl: './topic-setting-input.html',
})
export class TopicSettingInput implements OnInit, AfterViewInit, OnDestroy {
  private readonly store = inject(TopicConfigsStore);
  private sub?: Subscription;

  private readonly configTypes = computed<Map<string, string>>(() => {
    const configs = this.store.configs() ?? [];

    return configs.reduce((acc, cfg) => {
      acc.set(cfg.key, cfg.type);
      return acc;
    }, new Map<string, string>());
  });

  @ViewChild('numInput') numInput!: NgModel;

  readonly configKey = input<MaybeString>();
  readonly selectInputClass = input<MaybeString>();
  readonly textInputClass = input<MaybeString>();
  readonly numberInputClass = input<MaybeString>();
  readonly value = model<string>();

  readonly configType = computed(() => {
    const cfgKey = this.configKey() ?? 'empty';
    return this.getConfigType(cfgKey);
  });

  readonly isValid = signal(true);

  ngOnInit(): void {
    this.store.loadConfigs();
  }

  ngAfterViewInit(): void {
    this.sub = this.numInput?.statusChanges?.subscribe((status) => {
      this.isValid.set(status === 'VALID');
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private getConfigType(cfgKey: string): TopicConfigType | undefined {
    switch (this.configTypes().get(cfgKey ?? 'empty')) {
      case 'int':
      case 'long':
      case 'double':
        return 'number';

      case 'boolean':
        return 'boolean';

      case 'string':
        return 'text';

      case 'list':
        return 'list';

      default:
        return undefined;
    }
  }
}
