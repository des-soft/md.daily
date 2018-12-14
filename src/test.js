const path = require('path')
    , README_FILE = path.join(__dirname, 'README.md')
    , Daily = require('./Daily')

let readme = new Daily(README_FILE); 


readme.getData().then(daily => {
    
    console.log(daily.meta); 
}).catch(err => {
    console.log(err); 
})
