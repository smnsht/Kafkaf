export interface ConsumerGroupRow {
  groupId: string;
  numberOfMembers: number;
  numberOfTopics: number;
  consumerLag: number;
  coordinator: number;
  state: string;
}
