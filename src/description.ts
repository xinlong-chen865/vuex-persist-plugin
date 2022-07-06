import { Store } from 'vuex'

export interface IOptions {
    storage?: Storage;
    saveParams?: string[];
    key?: string;
};

export type IStorageItem<State> = null | State ;

export interface IGetStorage<State> {
    (key: string, storage: Storage): IStorageItem<State>
}

export interface ISetStorage<State> {
    (key: string, state: State, storage: Storage): void
}

export interface IRecoveryState<State> {
    (key: string, storage: Storage, store: Store<State>): void
}

export interface ISavedStorage<State> {
    (key: string, saveParams: string[], state: State, storage: Storage): void
}
