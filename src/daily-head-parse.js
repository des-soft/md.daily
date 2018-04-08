module.exports = text => (
    text.slice(1, -1)
    .split('\n')
    .map(e => e.trim())
    .filter(e => e)
    .reduce((obj, cur) => {
        let middle_pos = cur.indexOf(':');
        if (!~middle_pos) return obj;
        let key = cur.slice(0, middle_pos);
        let val = cur.slice(middle_pos + 1, cur.length);

        if (!val || !key) {
            return obj;
        } else {
            key = key.trim();
            val = val.trim();

            obj[key] = val;

            return obj;
        }
    }, {})
);