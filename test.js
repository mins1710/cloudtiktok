const axios = require('axios');
const cheerio = require('cheerio');


const response= axios.post("https://sinhhv.bmctech.one:8080/api/get-mail-by-query",{
    "email":"eofwzzvnpqjv@bmctech.one",
    "filter": "@account.tiktok.com",
    "type":"read",
    "limit":1
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

response.then(response => {
   if (response.data["status"] == "OK"){
        const data = response.data.data;
        const base64String = data[0]["payload"]["body"]["data"]
        const decodedString = Buffer.from(base64String, 'base64').toString();
        const $ = cheerio.load(decodedString);
        const href = $('body').find('a').attr('href');
        return href
   } 
  
   console.log('Href:', href);

})