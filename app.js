const path = require('path')
const express = require('express')
const app = express()
app.use(express.json())
let cors = require('cors')
app.use(cors())
const publicDirectoryPath = path.join(__dirname, './client')
app.use(express.static(publicDirectoryPath))
const mongoose = require('mongoose')
const validator = require('validator')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require('axios');
const { json } = require('express/lib/response');

const port = process.env.PORT || 3000

mongoose.connect('mongodb+srv://virtual-trading:hkiyygh68tfgcfhs586@cluster0.ohx5a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

const Shareprice = mongoose.model('shareprice', {
  scriptName : {
    type: String
       
    },
    price : {
        type: String
           
        },
 
        date : {
            type: String
               
            }

})


    

setInterval(() => {
    let scriptNames = ['reliance-industries','cipla','state-bank-of-india','infosys','bajaj-finance'];
    
    for(let i = 0; i < scriptNames.length; i++){
    
    
     axios.get(`https://in.investing.com/equities/${scriptNames[i]}`,{
       headers: {
    
           "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Mobile Safari/537.36"
       }})
    .then(function (respon) {
    
    const dom = new JSDOM(respon.data);
    
    let currentPrice = dom.window.document.querySelector('.js-streamable-element').textContent;
    console.log(currentPrice)
    let date = new Date().toLocaleString();
    const pr = {scriptName:scriptNames[i],
        price:currentPrice,
        date:date}
        console.log(pr)
    const shareprice = new Shareprice({
        ...pr
    })
    shareprice.save()
    
    
    }).catch(function(err) {  
    
       console.log('led to fetch page: ', err);  
    
    });
    
    }
    
}, 10000)

app.listen(port)
