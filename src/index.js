const path = require('path')
    , fs = require('then-fs')
    , parse = require('./parse')
    , chokidar = require('chokidar')
    , MetaProxy = require('./MetaProxy')

class Daily extends MetaProxy {
    /**
     * @description Daily constructor 
     * @param { String } file_path 文件绝对路径
     */
    constructor(file_path) {
        super(); 

        // 参数初始化
        this.file_path = file_path; 
        this.data = null; 
    }

    /**
     * @description 带缓存的 getData 
     * @returns { Promise<Daily> }
     */
    getData() {
        if (this.data) {
            return Promise.resolve(this); 
        } else {
            return this.read().then(data => {
                data.file_path = this.file_path; 
                this.data = data; 
                return this; 
            }); 
        }
    }

    /**
     * @description 从磁盘中读取 file_path 返回 Promise 
     * @returns { Promise<Object> } 文章经过 parse 的结果 
     */
    read() {
        return fs.readFile(this.file_path)
            .then(e => e.toString())
            .then(parse) 
    }

    /**
     * @description watch 
     * @returns { Daily } 链式调用 
     */
    beginWatch() {
        if (this.watcher) return this; 
        // 绑定 watcher 
        this.watcher = chokidar.watch(this.file_path); 

        // !!! 热更新 
        this.watcher.on('change', path => {
            this.data = null; 
            this.emit('change', this); 
        }); 

        // 当文件被删除
        // 被动的取消绑定
        this.watcher.on('unlink', path => {
            this.endWatch(); 
        }); 

        return this; 
    }

    /**
     * @description 主动取消绑定
     * @returns { Daily } 链式调用 
     */
    endWatch() {
        this.watcher.close(); 
        this.watcher = null; 
        return this; 
    }
}

module.exports = Daily; 
