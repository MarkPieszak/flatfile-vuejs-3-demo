import { InitializeEmptyBatchResponse } from '../graphql/mutations/INITIALIZE_EMPTY_BATCH';
import { GetFinalDatabaseViewResponse } from '../graphql/queries/GET_FINAL_DATABASE_VIEW';
import { BatchStatusUpdatedResponse } from '../graphql/subscriptions/BATCH_STATUS_UPDATED';
export declare class ApiService {
    token: string;
    apiUrl: string;
    private client;
    private pubsub;
    private PAGE_LIMIT;
    constructor(token: string, apiUrl: string);
    private handleError;
    init(): Promise<InitializeEmptyBatchResponse['initializeEmptyBatch']>;
    getFinalDatabaseView(batchId: string, skip?: number, sample?: boolean): Promise<GetFinalDatabaseViewResponse['getFinalDatabaseView']>;
    subscribeBatchStatusUpdated(batchId: string, cb: (d: BatchStatusUpdatedResponse) => void): void;
}
