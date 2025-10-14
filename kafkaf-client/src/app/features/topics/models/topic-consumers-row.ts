export interface TopicConsumersRow {
  groupId: string;
  state: string;
  activeConsumers: number;
  consumerLag: number;
  coordinator: number;
}
