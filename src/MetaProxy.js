const { EventEmitter } = require('events'); 

module.exports = class MetaProxy extends EventEmitter {
    constructor(){
        super(); 
    }

    get meta(){
        if (this.data){
            return this.data.meta; 
        } else {
            return null; 
        }
    }

    get content(){
        if (this.data){
            return this.data.content; 
        } else {
            return null; 
        }
    }
}
