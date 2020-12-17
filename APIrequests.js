const fetch = require('node-fetch')
    
let request = async (url) => {
    try {
        let fetched = await fetch(url);
        if(fetched) {
            let read = await fetched.json()
            return read;
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
}

exports.request = request