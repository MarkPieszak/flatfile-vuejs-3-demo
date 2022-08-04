import { IEvents } from '../types/interfaces';
export declare const eventManager: import("eventemitter3")<string | symbol, any>;
declare type FilterFlags<Base, Condition> = {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};
declare type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];
declare type Diff<T, U> = T extends U ? never : T;
export declare function emit<K extends Diff<keyof IEvents, AllowedNames<IEvents, undefined>>, Attr extends IEvents[K]>(event: K, payload?: Attr | undefined): void;
export declare function listen<K extends keyof IEvents>(event: K, cb: (e: IEvents[K]) => void): () => void;
export declare const cleanup: () => void;
export {};
