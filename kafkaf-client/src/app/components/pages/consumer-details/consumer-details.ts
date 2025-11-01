import { JsonPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConsumersStore } from '@app/store/consumers/consumers.service';

@Component({
  selector: 'app-consumer-details',
  imports: [RouterLink, JsonPipe],
  templateUrl: './consumer-details.html',
  styleUrl: './consumer-details.scss'
})
export class ConsumerDetails implements OnInit {
  readonly store = inject(ConsumersStore);
  readonly route = inject(ActivatedRoute);

  readonly consumerParam = signal<string | undefined>(undefined);

  readonly consumer = computed(() => {
    const groupId = this.consumerParam();
    const consumers = this.store.consumers();

    if (groupId && consumers) {
      return consumers.find(c => c.groupId === groupId);
    }

    return undefined;
  });

  readonly partitions = computed(() => {
    const consumer = this.consumer();
    return consumer?.partitions;
  });

  cluster = 0;

  ngOnInit(): void {
    this.store.loadConsumers();
    this.route.paramMap.subscribe(params => {
      this.cluster = Number.parseInt(params.get('cluster')!);
      this.consumerParam.set(params.get('consumer')!);
    });
  }
}
