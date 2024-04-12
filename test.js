const str = "/serial/wifi"
let url = "/serial/wifi";
let matches = url.match(/\/([^/]+)/g);

console.log(matches[0].slice(1))