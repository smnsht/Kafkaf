export interface ConsumerGroupRow {
    groupId: string;
    activeConsumers: number;
    consumerLag: number;
    coordinator: number;
    state: string;
}
