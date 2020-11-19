const fs = require("fs");
const constants = {};
const variables = {};
!function t(callback) {
    callback(fs.readFileSync("test.fsa").toString())
}(e => {
    e = e.split("\n");
    for(var i in e) {
        for(var n = 0, s = e[i].split(" "); n < s.length; n++) {
            if(s[n] == " ") continue;
            if(!!s[n].match(/[=]/g)) {
                if(s[n + 1]) {
                    s[n + 1] = s[n + 1].replace(/[\";\r]/g, "");
                    if(!!!s[n + 1].match(/[^\w\s]|_/g)) {
                        variables[s[n - 1]] = s[n + 1];
                    }
                }
            };
        }
    }
    
    console.log(variables)
})
