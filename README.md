## 功能
vuex-persist-plugin是一个vuex的插件，支持vuex4以及ts。此插件配置项非常简单，只需要告知插件storage的名字、需要保存的state以及storage的种类（支持localstorage、sessionstorage）即可
<br /> <br />

## 用法
支持保存整个module的数据，并支持保存module中某一个state的数据
```
import { createStore } from 'vuex'
import VuexPersister from "vuex-persist-plugin-ts";

const vuexPersister = new VuexPersister({
  key: 'my_key',
  saveParams: ['count', 'A.number'],
});

export default createStore({
  state: {
    count: 0,
    age: 0,
  },
  modules: {
    A: {
      namespaced: true,
      state: {
        number: 0,
      },
    }
  },
  plugins: [
    vuexPersister.bootstrap,
  ]
})
```
<br /><br />
## 配置项
| 参数名 | 可选值 | 含义 | 默认值 |
| ----- | ----- | --- | --- |
| storage | localstorage / sessionstorage / 空 | storage种类 | localstorage |
| saveParams | ['username', 'music.musicName'] / 空 | 需要加缓存的路径 | [] |
| key | 'my-vuex' / 空 | 缓存key的命名 | 'vuex-persist-plugin' |
