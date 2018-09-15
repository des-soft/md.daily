const { EventEmitter } = require('events')
    , path = require('path')
    , fs = require('fs')
    , chokidar = require('chokidar')
    , Daily = require('./Daily')
    , glob = require('glob')
    , slashNormalize = require('./slash-normalize')

class Pool extends EventEmitter {
    constructor(BASE) {
        super(); 

        this.PATTERN = path.join(BASE, './*.md').replace(/\\/g, '/'); 
        this.BASE = BASE; 
        this.FILES = glob.sync(this.PATTERN);  
        this.dailyMap = null; 
        this.watcher = null; 

        this.init(); 
    }

    init() {
        this.initDailyMap(); 
        this.addWatch(); 
    }

    addWatch() {
        this.watcher = chokidar.watch(this.PATTERN, {
            ignored: /(^|[\/\\])\../, 
            persistent: true,
            ignoreInitial: true
        }); 
        
        this.watcher.on('unlink', e => this.unlinkDaily(slashNormalize(e))); 
        this.watcher.on('add', e => this.addDaily(slashNormalize(e))); 
        this.watcher.on('change', _ => setTimeout(() => this.emit('change'))); 
    }
    
    /**
     * 初始化 dailyMap 
     */
    initDailyMap() {
        this.dailyMap = this.FILES.reduce((mapper, file) => {
            const daily = new Daily(file); 
            daily.beginWatch(); 

            mapper[daily.file_path] = daily; 
            
            return mapper; 
        }, {});
    }

    /**
     * 添加 daily 
     * @param { String } file_path 
     * @returns { this }
     */
    addDaily(file_path) {
        const newOne = new Daily(file_path); 
        newOne.beginWatch(); 

        this.dailyMap[file_path] = newOne; 

        this.emit('add', newOne); 

        return this; 
    }

    /**
     * 移除 daily 
     * @param { String } file_path 
     * @returns { this } 
     */
    unlinkDaily(file_path) {
        const target = this.dailyMap[file_path]; 
        delete this.dailyMap[file_path]; 

        this.emit('unlink', target); 

        return this; 
    }

    ////// Pool :: Function  

    /**
     * 获取全部 daily 实例 
     * @returns { Daily[] }
     */
    get dailys() {
        return Object.values(this.dailyMap); 
    }

    get dailysNames() {
        return Object.keys(this.dailyMap)
    }

    get dailysLength() {
        return this.dailysNames.length; 
    }

    /**
     * 拉取数据 
     */
    pull() {
        return Promise.all(
            this.dailys.map(d => d.getData())
        ).then(dailys => dailys.map(d => d.data)); 
    }
}

module.exports = Pool; 
