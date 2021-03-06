
> VERSION 2.0.2

# 日记 md.daily 

> 私人用 

# 格式 Format  

日记以文件的形式存储在磁盘上，本库用于方便的读取此文件为某种 JS 对象。 

这是 Daily 的标准形式： 

``` daily  
json {                      | => 这里是 Meta 元信息 
    "title": "hello"        |
}                           |
;;;;;;                      | => 用六个分号分隔开
                            |
# Content                   | => 此处是正文, 可以书写 Markdown
                            |
Last day, Good Morning      |
                            |
                            |
```

三大要素：

1. Meta 元信息 
2. 分隔符 
3. 正文 

> 注, 分隔符本身占用了字符串 `;;;;;;`，因此请勿在 Meta 里出现该分隔符，否则会造成解析的失败


# 元 Meta 

可以看到 Daily 都会带一个 Meta 放在头部用来 `记录` Daily 的元信息，为了方便阅读和程序读取的方便，可以采用 JSON 方式进行存储。 

``` 
json {
    "title": "漫语三月",
    "time": "2018年3月25日 02:02",
    "from": "a@b.com",
    "to": "c@d.com",
    "theme": "pure"
}
```

当然，可以使用其他方式处理，要采用其他方式，仅需如此编写： 

```
daily {
    title: 漫语三月
    time: 2018年3月25日 02:02
    from: a@b.com
    to: c@d.com
    theme: pure
}
```

这两段的第一行的不同，让本解析器采取了不同的方式解析。此处的 `json` 或者 `daily` 叫做解析器选择器，受 CSS 选择器的启发。 

> 推荐使用 daily 作为解析器选择器，比 JSON 好读一些，写起来也省些事


# 字段 Fields 

Meta 中目前可以使用的字段 

1. `title`* 标题
2. `time`*  时间
3. `from`   来自于
4. `to`     发送到
5. `theme`  主题

> 注: 带 * 的为必填字段


# 在 JavaScript 中使用 Daily 

先安装 

``` bash 
$ npm i md.daily 
``` 

使用方法 

``` js
const { Daily } = require('md.daily'); 

let daily = new Daily('path/to/your/daily.md'); 

daily.getData().then(daily => {
    // 此处的 daily 和外面的 daily 是同一个引用 
    console.log(daily.meta); 
}).catch(err => {
    console.log(err); 
}); 
```

更多使用，参见 [使用法](./src/README.md)


# 目录里的 Daily 

在实际应用里，更多的情况是 Daily 都放在目录里，为此引入 Pool 类针对这种情况进行编程。 

``` js
const { Pool } = require('md.daily'); 

const my_daily_diretory = '/home/eczn/dailys'; 
const pool = new Pool(my_daily_diretory); 

// 拉取文件夹内部全部 dailys 
pool.pull().then(console.log); 
```

除却 `pull()` 之外，Pool 还实现了很多特性：

1. Pool 内部有它自己的数据结构，存储着 文件夹下 `.md` 文件的 Daily 实例。 
2. Pool 会监听文件夹，随时更新上面提到的数据结构 (添加 / 删除)
3. Pool 继承自 EventEmitter，有三个事件：`add` `unlink` `change` 参数是对应的 Daily 实例 

更多请参考源码实现，或者函数签名。 


# LICENSE 

MIT 
