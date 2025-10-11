import { ReplicaInfo } from "./ReplicaInfo";


export interface PartitionInfo {
    partition: number;
    leader: number;
    offsetMax: number;
    offsetMin: number;
    messagesCount: number;
    replicas: ReplicaInfo[];
}
