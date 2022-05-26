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
    prices : [{
        script : {
            type: String
               
            },
        
        price:{
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



//   Shareprice.findOneAndDelete({scriptName:'AdaniPorts&SEZ '},
//   function (error, success) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('success',success);
//         }
//     });

/////////////////////////////////save price////////////////////////////////////////////////////

setInterval(() => {

     axios.get(`https://in.investing.com/indices/s-p-cnx-nifty-components`,{
       headers: {
    
           "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Mobile Safari/537.36"
       }})
    .then(function (respon) {
    
    const dom = new JSDOM(respon.data);
    
    let date = new Date().toLocaleString();
    let time = new Date().getTime();

    for(let oo = 0; oo < 50; oo++){

        console.log(dom.window.document.querySelectorAll('.u-clickable')[oo].children[2].textContent.replace('\n','').replace(' ','').replace(' ',''))
        
        console.log(dom.window.document.querySelectorAll('.u-clickable')[oo].children[3].textContent.replace('\n','').replace(' ','').replace(' ',''))

        

        Shareprice.findOneAndUpdate({scriptName:dom.window.document.querySelectorAll('.u-clickable')[oo].children[2].textContent.replace('\n','').replace(' ','').replace(' ','').replace(' ','')}, {$push: {prices: [{price:dom.window.document.querySelectorAll('.u-clickable')[oo].children[3].textContent.replace('\n','').replace(' ','').replace(' ','').replace(',',''),
        date:date,time:time,script:dom.window.document.querySelectorAll('.u-clickable')[oo].children[2].textContent.replace('\n','').replace(' ','').replace(' ','').replace(' ','')}]}},
            function (error, success) {
                  if (error) {
                      console.log(error);
                  } else {
                      console.log('price saved');
                  }
              });

        }
    
  
    }).catch(function(err) {  
    
       console.log('failed to fetch price');  
    
    });
    

 }, 10000)
// //////////////////////////////////////////////////////////////////////////////

// //////////////////////////////save in currentpositionlong /////////////////////////////

app.post('/currentlong', async (req, res) => {
let date = new Date().toLocaleString();
let time = new Date().getTime();
    console.log(req.body)
    Shareprice.findOne({'scriptName':req.body.scriptName},
    function (error, success) {
          if (error) {
              console.log(error);
          } else {
              console.log('Shareprice',success);
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
          } else {console.log('success',success)
         res.send(success.prices[success.prices.length-1].price)
        }})
    
    })

    app.get('/remove', async (req, res) => {


        Shareprice.find({},function (error, success) {
              if (error) {
                  console.log(error);
              } else {
                  console.log('all share',success[4].prices);

                  for(let i = 0; i < success.length; i++){
                 let sname=success[i].scriptName;
                    console.log('name',success[i].scriptName)               
                    Shareprice.findOneAndDelete({scriptName:success[i].scriptName},
        function (error, success) {
              if (error) {
                  console.log('error');
              } else {
                  console.log('deleted sh');
                  const shareprice = new Shareprice({
                    scriptName:sname
                 })
                 shareprice.save()
              }
          });
          console.log(success.length,'i',i)
                      if(i == success.length-1){
                       console.log('45435gdcfbcvb577rnvnv86888888877678ujhbmnbnb83333333333344444445455545455645656565646456565656555555555555555555555555555565555')
                       res.send({'deleted':'done'})
                       
                    }

                }
              }
          });

          console.log('removed')

    })

  
///////////////////////////////////////////////////////////////////////////////////
app.listen(port)

