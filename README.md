## 功能
vuex-persist-plugin是一个vuex的插件，支持vuex4以及ts。此插件配置项非常简单，只需要告知插件storage的名字、需要保存的state以及storage的种类（支持localstorage、sessionstorage）即可
<br /> <br />
## 配置项
| 参数名 | 可选值 | 含义 | 默认值 |
| ----- | ----- | --- | --- |
| storage | localstorage / sessionstorage / 空 | storage种类 | localstorage |
| saveParams | ['username', 'music.musicName'] / 空 | 需要加缓存的路径 | [] |
| key | 'my-vuex' / 空 | 缓存key的命名 | 'vuex-persist-plugin' |
