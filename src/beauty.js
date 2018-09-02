const md5 = require('md5'); 

/**
 * @description 美化对象上的一些字段
 * @param { Object } obj 
 * @returns { Object } 会修改源对象
 */
module.exports = function beauty(obj) {
	// 预设 
	obj.tags   =  obj.tags   || ''; 
	obj.title  =  obj.title  || '未定义标题'; 
	// obj.author =  obj.author || 'x in (eczn, deswan)'

	// 过滤 
	obj.tags = obj.tags.split(',').map(e => e.trim()).filter(e => e);
	
	// id = md5(title)
	obj.id = md5(obj.title);
	
	obj.time = new Date(obj.time || obj.date); 
	

	return obj;
}
