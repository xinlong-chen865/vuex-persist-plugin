import { IOptions, IGetStorage, ISavedStorage, IStorageItem, IRecoveryState, ISetStorage } from './description'
import { MutationPayload, Store } from 'vuex'
import deepmerge from 'deepmerge'

export default class Persist<State> {
    key: string;
    storage: Storage;
    saveParams: string[];
    bootstrap: (store: Store<State>) => void

    constructor (options: IOptions) {
      this.key = options?.key ?? 'vuex-persist-plugin'
      this.storage = options?.storage ?? localStorage
      this.saveParams = options?.saveParams ?? []
      this.bootstrap = (store: Store<State>): void => {
        // 对state赋值
        this.recoveryState(this.key, this.storage, store)
        // 把修改storage加入到subscribe中
        this.subscribe(store)((mutations: MutationPayload, state: State) => {
          this.savedStorage(this.key, this.saveParams, state, this.storage)
        })
      }
    }

    /**
     * 刷新页面的时候，重置Vuex.State
     */
    recoveryState: IRecoveryState<State> = (key: string, storage: Storage, store: Store<State>): void => {
      const storageItem = this.getStorage(key, storage)
      if (storageItem) {
        store.replaceState(
          deepmerge(
            store.state,
            storageItem,
            { arrayMerge: (store: any, saved: any) => saved }
          )
        )
      }
    }

    /**
     * 把savedStorage注入到vuex subscribe中
     * 发布订阅
     */
    subscribe = (store: Store<State>) => (handler: (mutations: MutationPayload, state: State) => void) => store.subscribe(handler)

    /**
     * 保存
     */
     savedStorage: ISavedStorage<State> = (key: string, saveParams: string[], state: State, storage: Storage): void => saveParams.length > 0
       ? saveParams.length === 1
         ? this.setStorage(key, this.getState(saveParams[0], state) as any, storage)
         : this.setStorage(key, this.reducer(saveParams, state) as any, storage)
       : this.setStorage(key, state, storage)

    /**
     * 获取Storage
     */
    getStorage: IGetStorage<State> = (key: string, storage: Storage): IStorageItem<State> => {
      const storageItem = storage.getItem(key)
      try {
        let state: IStorageItem<State>
        switch (typeof storageItem) {
          case 'object':
            state = storageItem
            return state
          case 'string':
            state = JSON.parse(storageItem)
            return state
          default:
            return null
        }
      } catch (error) {
        return null
      }
    }

    /**
     * 设置Storage
     */
    setStorage: ISetStorage<State> = (key: string, state: State, storage: Storage): void => {
      storage.setItem(key, JSON.stringify(state))
    }

    /**
     * 通过key的路径，找到对象
     */
    getState = (stateKey: string, state: State) => {
      if (/\./.test(stateKey)) {
        return this.reducerTreeStateValue(stateKey, state)
      } else {
        return { [this.reducerStateKey(stateKey)]: this.reducerStateValue(stateKey, state) }
      }
    }

    /**
     * 递归Modules
     */
    reducer = (saveParams: string[], state: State) => {
      return saveParams.reduce((prev, curr) => deepmerge(this.getState(prev, state), this.getState(curr, state)) as any)
    }

    /**
     * 获取递归的Key
     */
    reducerStateKey = (stateKey: string) => {
      return stateKey.split('.')[0]
    }

    /**
     * 获取递归的Value
     */
    reducerStateValue = (stateKey: string, state: any) => {
      return state[stateKey]
    }

    /**
     * 获取多级递归的Value
     */
    reducerTreeStateValue = (stateKey: string, state: any) => {
      const splitKey = stateKey.split('.')
      return this.reducerStateDfs(splitKey, state)
    }

    reducerStateDfs = (stateKey: string[], state: any) => {
      if (stateKey.length === 0) return state
      const key = stateKey[0]
      const obj = { [key]: this.reducerStateDfs(stateKey.slice(1), state[key]) } as any
      return obj
    }
}
