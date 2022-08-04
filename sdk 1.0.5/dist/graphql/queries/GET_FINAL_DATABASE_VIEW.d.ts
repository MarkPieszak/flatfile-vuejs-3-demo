export interface GetFinalDatabaseViewResponse__rows {
    data: Record<string, string | number | boolean | Record<string, any>>;
    info: {
        level: 'error' | 'warn' | 'info' | '';
        key: string;
        message: string;
    }[];
}
export interface GetFinalDatabaseViewResponse {
    getFinalDatabaseView: {
        rows: GetFinalDatabaseViewResponse__rows[];
        totalRows: number;
    };
}
export interface GetFinalDatabaseViewPayload {
    batchId: string;
    limit: number;
    skip: number;
}
export declare const GET_FINAL_DATABASE_VIEW: string;
