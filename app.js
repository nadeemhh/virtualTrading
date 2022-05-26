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
    prices : [{price:{
        type: String
           
        },
 
        date:{
            type: String
               
            },
            
            time:{
                type: String
            }}]

})


const User = mongoose.model('user', {
    userName : {
      type: String
         
      },
      currentpositionlong: [{
        scriptName: {
            type: String,
        },
        buyprice: {
            type: String,
        },
        stoploss: {
            type: String,
        },
        quantity: {
            type: String,
        },
        pl: {
            type: String,
        },
        date: {
            type: String,
        },

        time:{
            type: String
        },
        currentprice: {
            type: String,
        },
        target: {
            type: String,
        }


    }],
    currentpositionshort: [{
        scriptName: {
            type: String,
        },
        buyprice: {
            type: String,
        },
        stoploss: {
            type: String,
        },
        quantity: {
            type: String,
        },
        pl: {
            type: String,
        },
        date: {
            type: String,
        },

        time:{
            type: String
        },
        currentprice: {
            type: String,
        },
        target: {
            type: String,
        }


    }],
    profit: [{
        scriptName: {
            type: String,
        },
        buyprice: {
            type: String,
        },
        stoploss: {
            type: String,
        },
        quantity: {
            type: String,
        },
        pl: {
            type: String,
        },
        date: {
            type: String,
        },

        time:{
            type: String
        },
        sellprice: {
            type: String,
        },
        target: {
            type: String,
        }


    }],
    loss: [{
        scriptName: {
            type: String,
        },
        buyprice: {
            type: String,
        },
        stoploss: {
            type: String,
        },
        quantity: {
            type: String,
        },
        pl: {
            type: String,
        },
        date: {
            type: String,
        },

        time:{
            type: String
        },
        sellprice: {
            type: String,
        },
        target: {
            type: String,
        }


    }],
          date : {
              type: String
                 
              }
  
  })

  
  let split_date= new Date().toLocaleString().split(',');
  let m_date = split_date[0];
  console.log(m_date)



/////////////////////////////////save price////////////////////////////////////////////////////

    let scriptNames = ['reliance-industries','cipla','state-bank-of-india','infosys'];
   setInterval(() => {
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
    let time = new Date().getTime();

    
    Shareprice.findOneAndUpdate({scriptName:scriptNames[i]}, {$push: {prices: [{price:currentPrice.replace(',',''),
    date:date,time:time}]}},
        function (error, success) {
              if (error) {
                  console.log(error);
              } else {
                  console.log('price saved');
              }
          });
    }).catch(function(err) {  
    
       console.log('failed to fetch price');  
    
    });
    
    }
}, 5000)
//////////////////////////////////////////////////////////////////////////////
    
    // let date = new Date().toLocaleString();
    // const pr = {scriptName:scriptNames[i],
    //     price:currentPrice,
    //     date:date}
    //     console.log(pr)
    // const user = new User({
    //     userName:'ajay',
    //     date:date
    // })
    // user.save()



//////////////////////////////save in currentpositionlong /////////////////////////////

app.post('/currentlong', async (req, res) => {
let date = new Date().toLocaleString();
let time = new Date().getTime();
    console.log(req.body)
    Shareprice.findOne({'scriptName':req.body.scriptName},
    function (error, success) {
          if (error) {
              console.log(error);
          } else {
              console.log('Shareprice');
              let currentprice = success.prices[success.prices.length - 1].price;

              User.findOneAndUpdate({userName:'nadeem'}, {$push: {currentpositionlong: {scriptName:req.body.scriptName,	
                buyprice:currentprice,
                stoploss :req.body.stoploss,
                quantity:req.body.quantity,
                pl:currentprice-currentprice,
                date:date,
                time:time,
                currentprice:currentprice,
                target:req.body.target	}}},
                function (error, success) {
                      if (error) {
                          console.log(error);
                      } else {
                          console.log('pushed in currentpositionlong');
                          res.send({'done':'done'})
                      }
                  });

          }
      });
    
    }) 

////////////////////////////////////////////////////true d///////////////////////////////////


//////////////////////////////save in loss and profit ////////////////////////////////////////////

app.get('/show', async (req, res) => {
    let date = new Date().toLocaleString();
    let time = new Date().getTime();
    let user = await User.findOne({ userName: 'nadeem' }).exec();

      
   
   for(let i = 0; i < user.currentpositionlong.length; i++){
    let price = await Shareprice.findOne({ scriptName : user.currentpositionlong[i].scriptName }).exec();
    for(let ii = 0; ii < price.prices.length; ii++){

/////////////cheack for loss/////////
//console.log(parseFloat( price.prices[ii].time) ,'time', parseFloat(user.currentpositionlong[i].time))
if(parseFloat( price.prices[ii].time) >= parseFloat(user.currentpositionlong[i].time)){
if(parseFloat(user.currentpositionlong[i].stoploss) >= parseFloat( price.prices[ii].price)){
    console.log('it is')

    User.findOneAndUpdate({userName:'nadeem'}, {$push: {loss: {scriptName:user.currentpositionlong[i].scriptName,	
        buyprice:user.currentpositionlong[i].buyprice,
        stoploss :user.currentpositionlong[i].stoploss,
        quantity:user.currentpositionlong[i].quantity,
        pl:(price.prices[ii].price - user.currentpositionlong[i].buyprice)*user.currentpositionlong[i].quantity,
        date:date,
        time:time,
        sellprice:price.prices[ii].price,
        target:user.currentpositionlong[i].target}
    }},
        function (error, success) {
              if (error) {
                  console.log(error);
              } else {
                  console.log('added into loss');
                  
                  User.findOneAndUpdate({userName:'nadeem'}, {$pull: {currentpositionlong:user.currentpositionlong[i]}},
                  function (error, success) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('pulled from currentpositionlong');
                           
                        }
                    });
              }
          });

          break;

}}
/////////////cheack for profit/////////
if(parseFloat( price.prices[ii].time) >= parseFloat(user.currentpositionlong[i].time)){
if(parseFloat( price.prices[ii].price) >= parseFloat(user.currentpositionlong[i].target)){
                            
    User.findOneAndUpdate({userName:'nadeem'}, {$push: {profit: {scriptName:user.currentpositionlong[i].scriptName,	
      buyprice:user.currentpositionlong[i].buyprice,
      stoploss :user.currentpositionlong[i].stoploss,
      quantity:user.currentpositionlong[i].quantity,
      pl:(price.prices[ii].price - user.currentpositionlong[i].buyprice)*user.currentpositionlong[i].quantity,
      date:date,
      time:time,
      sellprice:price.prices[ii].price,
      target:user.currentpositionlong[i].target}
  }},
      function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log('added into profit');
                User.findOneAndUpdate({userName:'nadeem'}, {$pull: {currentpositionlong:user.currentpositionlong[i]}},
                function (error, success) {
                      if (error) {
                          console.log(error);
                      } else {
                          console.log('pulled from currentpositionlong');
                      }
                  });
            }
            //i
        });

        break;
}}
   }
///////////////send data///////
if(i == user.currentpositionlong.length - 1){
    let userdata = await User.findOne({ userName: 'nadeem' }).exec();
    console.log('userdata',userdata)
    res.send(JSON.stringify(userdata))
}

   /////////////remove price//////////////
   if(i == user.currentpositionlong.length - 1){
       console.log(i,'equal',user.currentpositionlong.length-1)
       let price = await Shareprice.find({}).exec();
       for(let o = 0; o < price.length; o++){

        for(let oo = 0; oo < price[o].prices.length; oo++){
            if(price[o].prices[oo].date.split(',')[0] != m_date){
                     console.log(price[o].prices[oo].date.split(',')[0] ,'true date', m_date)
                Shareprice.findOneAndUpdate({scriptName:price[o].scriptName}, {$pull: {prices: {date:price[o].prices[oo].date}}},
        function (error, success) {
              if (error) {
                  console.log(error);
              } else {
                  console.log('removed old price');
              }
          });

            }
        }

       }


   }
}


    })

///////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////get price/////////////////////////////////////////////////
app.get('/getprices', async (req, res) => {

    console.log('req.query',req.query)
    
    Shareprice.findOne({'scriptName':req.query.scriptName},
    function (error, success) {
          if (error) {
              console.log(error);
          } else {console.log('success',success.prices[success.prices.length-1].price)
         res.send(success.prices[success.prices.length-1].price)
        }})
    
    })



    
///////////////////////////////////////////////////////////////////////////////////
app.listen(port)

