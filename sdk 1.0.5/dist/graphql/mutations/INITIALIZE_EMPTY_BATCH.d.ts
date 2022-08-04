export interface InitializeEmptyBatchResponse {
    initializeEmptyBatch: {
        batchId: string;
        schemas: {
            id: string;
        }[];
        workspaceId: string;
    };
}
export interface InitializeEmptyBatchPayload {
    importedFromUrl: string;
}
export declare const INITIALIZE_EMPTY_BATCH: string;
