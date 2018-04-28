const parse = require('./parse'); 

let no_selector = parse(`{
    "title": "hello, world"
}
------

# hello; 

`); 

console.log(no_selector.meta); 
