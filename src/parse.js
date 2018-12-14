const beauty = require('./beauty')
    , dailyHeadParse = require('./daily-head-parse')

module.exports = parse; 

/**
 * @description 文件的解析器 (将文件 parse 成特定对象)
 * @param { String } text 
 * @returns { { meta: Object, content: String, text: String } } parse 结果
 */
function parse(text, sp = ';;;;;;'){
    // 六个 ; 分割文章为头部和正文
    let arr = text.split(sp); 

    if (arr.length < 2){
        // 不合法的文章 
        // 应该换一个 sp 试试 , 递归 
        if (sp === '------'){
            // 如果已经是下一步 else 给的 ---- 了 ... 
            return null; 
        } else {
            return parse(text, '------'); 
        }
    } else {
        let [ head_text, ...remains ] = arr;
        let body = remains.join(sp); 

        let meta = getMetaFrom(head_text); 

        return {
            // meta 还需要预处理 (美化) 一下， 比如 tags 字段得转化成数组 
            meta: beauty(meta), 
            content: body,
            text: text
        }
    }
}

// 选择器 
let selector_table = {
    json: e => JSON.parse(e),
    daily: dailyHeadParse,
    default: e => JSON.parse(e)
}

/**
 * @description 格式化头部 
 * @param { String } head 
 * @returns { { title: String } } daily meta 信息
 */
function getMetaFrom(head){
    head = head.trim(); 

    let middle_pos = head.indexOf('{'); 

    if (middle_pos === -1){
        // 不合法的 meta 
        return null; 
    } else {
        let meta = null; 
        let selector_name = head.substring(0, middle_pos).trim().toLocaleLowerCase(); 
        let meta_text = head.substring(middle_pos); 
        let selector = selector_table[selector_name] ||
            selector_table['default']; 

        try {
            meta = selector(meta_text); 
        } catch (err) {
            console.log('md.daily: Meta Parse Error, info:', meta_text); 
            console.log(err); 
        }

        return meta; 
    }
}
