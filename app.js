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
              },
              counter:{
                  type: String
                     
                  },
          }]
  
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

  

 
// /////////////////////////////////save price////////////////////////////////////////////////////

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

        let nam =dom.window.document.querySelectorAll('.u-clickable')[oo].children[2].textContent.replace('\n','').replace(' ','').replace(' ','').replace(' ','');
        if(nam[0]=='O' && nam[1]=='i'&& nam[2]=='l'){
           
            console.log('nammmmmmmmmmmmmmmmmmmmmmmmmmm',nam)
            nam='OilandNaturalGas';

            async function name1(){
                let price = await Shareprice.findOne({ scriptName : nam }).exec();
               if(price == null){
                   console.log(price,'seeeeeeeeeeeeeeeeeeeeeeeee1111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
                const shareprice = new Shareprice({
                    scriptName:nam
                 })
                 shareprice.save()
               }
            }
            name1()
            Shareprice.findOneAndUpdate({scriptName:nam}, {$push: {prices: [{price:dom.window.document.querySelectorAll('.u-clickable')[oo].children[3].textContent.replace('\n','').replace(' ','').replace(' ','').replace(',',''),
            date:date,time:time,script:dom.window.document.querySelectorAll('.u-clickable')[oo].children[2].textContent.replace('\n','').replace(' ','').replace(' ','').replace(' ','')}]}},
                function (error, success) {
                      if (error) {
                          console.log(error);
                      } else {
                          console.log('price saved');
                      }
                  });
    
        }

        else if(nam[5]=='P' && nam[6]=='o'&& nam[7]=='r'){
            
            console.log('nammmmmmmmmmmmmmmmmmmmmmmmmmm',nam)
            nam='AdaniPortsandSEZ';
            async function name2(){
                let price = await Shareprice.findOne({ scriptName : nam }).exec();
               if(price == null){
                   console.log(price,'seeeeeeeeeeeeeeeeeeeeeeeeeeee2222eeeeeeeeeeeeeeeeeeeeeeeeeeeee')
                const shareprice = new Shareprice({
                    scriptName:nam
                 })
                 shareprice.save()
               }
            }
            name2()
            Shareprice.findOneAndUpdate({scriptName:nam}, {$push: {prices: [{price:dom.window.document.querySelectorAll('.u-clickable')[oo].children[3].textContent.replace('\n','').replace(' ','').replace(' ','').replace(',',''),
            date:date,time:time,script:dom.window.document.querySelectorAll('.u-clickable')[oo].children[2].textContent.replace('\n','').replace(' ','').replace(' ','').replace(' ','')}]}},
                function (error, success) {
                      if (error) {
                          console.log(error);
                      } else {
                          console.log('price saved');
                      }
                  });
    
        }

        else if(nam[0]=='L' && nam[1]=='a'&& nam[2]=='r'){
            console.log('nammmmmmmmmmmmmmmmmmmmmmmmmmm',nam)
            nam='LarsenandToubro';
            async function name3(){
                let price = await Shareprice.findOne({ scriptName : nam }).exec();
               if(price == null){
                   console.log(price,'seeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee3333eeeeeeeeeeeeeeeeeeeeee')
                const shareprice = new Shareprice({
                    scriptName:nam
                 })
                 shareprice.save()
               }
            }
            name3()
            Shareprice.findOneAndUpdate({scriptName:nam}, {$push: {prices: [{price:dom.window.document.querySelectorAll('.u-clickable')[oo].children[3].textContent.replace('\n','').replace(' ','').replace(' ','').replace(',',''),
            date:date,time:time,script:dom.window.document.querySelectorAll('.u-clickable')[oo].children[2].textContent.replace('\n','').replace(' ','').replace(' ','').replace(' ','')}]}},
                function (error, success) {
                      if (error) {
                          console.log(error);
                      } else {
                          console.log('price saved');
                      }
                  });
    
        }

        else if(nam[2]=='h' && nam[3]=='i'&& nam[4]=='n'){
            console.log('nammmmmmmmmmmmmmmmmmmmmmmmmmm',nam)
            nam='MahindraandMahindra';
            async function name4(){
                let price = await Shareprice.findOne({ scriptName : nam }).exec();
               if(price == null){
                   console.log(price,'seeeeeeeeeeeeeeeee4444eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
                const shareprice = new Shareprice({
                    scriptName:nam
                 })
                 shareprice.save()
               }
            }
            name4()
            Shareprice.findOneAndUpdate({scriptName:nam}, {$push: {prices: [{price:dom.window.document.querySelectorAll('.u-clickable')[oo].children[3].textContent.replace('\n','').replace(' ','').replace(' ','').replace(',',''),
            date:date,time:time,script:dom.window.document.querySelectorAll('.u-clickable')[oo].children[2].textContent.replace('\n','').replace(' ','').replace(' ','').replace(' ','')}]}},
                function (error, success) {
                      if (error) {
                          console.log(error);
                      } else {
                          console.log('price saved');
                      }
                  });
    
        }

       else{ async function name5(){
            let price = await Shareprice.findOne({ scriptName : nam }).exec();
           if(price == null){
               console.log(price,'seeeeeeeeeeeeeeeeee55555eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
            const shareprice = new Shareprice({
                scriptName:nam
             })
             shareprice.save()
           }
        }
        name5()
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


////////////////////////////////////////send data//////////////////////////////////

app.get('/show', async (req, res) => {
    
    let userdata = await User.findOne({ userName: 'nadeem' }).exec();
    console.log('userdata',userdata)
    res.send(JSON.stringify(userdata))

      
    console.log('enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
    let user = await User.findOne({ userName: 'nadeem' }).exec();

      
   if(user.currentpositionlong.length > 0){
       
   for(let i = 0; i < user.currentpositionlong.length; i++){
    console.log('enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr2')

    
    let price = await Shareprice.findOne({ scriptName : user.currentpositionlong[i].scriptName }).exec();
    
    console.log(user.currentpositionlong[i].scriptName,'enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr08rrrrrrrrrrrrrrrrrrrrrrrrrrr3')
    for(let ii = 0; ii < price.prices.length; ii++){
        console.log(price.prices.length,'enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr0rrrrrrrrrrrrrrrrrrrrrrrrrrr3',ii)

        console.log('reach');
        
        


/////////////cheack for loss/////////
if(parseFloat( price.prices[ii].time) >= parseFloat(user.currentpositionlong[i].time)){
if(parseFloat(user.currentpositionlong[i].stoploss) >= parseFloat( price.prices[ii].price)){

    let date = price.prices[ii].date;
    let time =price.prices[ii].time;

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

                    ///
              }
          });

          break;

}}
/////////////cheack for profit/////////
if(parseFloat( price.prices[ii].time) >= parseFloat(user.currentpositionlong[i].time)){
if(parseFloat( price.prices[ii].price) >= parseFloat(user.currentpositionlong[i].target)){
            
    let date = price.prices[ii].date;
    let time =price.prices[ii].time;

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

   
}
    }

    })

/////////////////////////////////////save in loss and profit //////////////////////////////////////////////////


setInterval(() => {
    async function myFunction() {
        
      console.log('enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
    let user = await User.findOne({ userName: 'nadeem' }).exec();

      
   if(user.currentpositionlong.length > 0){
       
   for(let i = 0; i < user.currentpositionlong.length; i++){
    console.log('enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr2')

    
    let price = await Shareprice.findOne({ scriptName : user.currentpositionlong[i].scriptName }).exec();
    console.log(user.currentpositionlong[i].scriptName,'enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr08rrrrrrrrrrrrrrrrrrrrrrrrrrr3')
    for(let ii = 0; ii < price.prices.length; ii++){
        console.log(price.prices.length,'enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr0rrrrrrrrrrrrrrrrrrrrrrrrrrr3',ii)

        console.log('reach');
        

/////////////cheack for loss/////////
if(parseFloat( price.prices[ii].time) >= parseFloat(user.currentpositionlong[i].time)){
if(parseFloat(user.currentpositionlong[i].stoploss) >= parseFloat( price.prices[ii].price)){

    let date = price.prices[ii].date;
    let time =price.prices[ii].time;

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

                    ///
              }
          });

          break;

}}
/////////////cheack for profit/////////
if(parseFloat( price.prices[ii].time) >= parseFloat(user.currentpositionlong[i].time)){
if(parseFloat( price.prices[ii].price) >= parseFloat(user.currentpositionlong[i].target)){
            
    let date = price.prices[ii].date;
    let time =price.prices[ii].time;

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
console.log(i,'enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',user.currentpositionlong.length)

if(i == user.currentpositionlong.length - 1){

    console.log('enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr5')

    Shareprice.find({},function (error, success) {
        if (error) {
            console.log(error);
        } else {
    
            for(let iii = 0; iii < success.length; iii++){
           let sname=success[iii].scriptName;
           console.log(success[iii].prices.length,'enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr6')

              if(success[iii].prices.length > 10){
                console.log('enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr7')

              Shareprice.findOneAndDelete({scriptName:success[iii].scriptName},
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
    })};
    
                if(iii == success.length-1){
                 
                 
                 
              }
    
          }
        }
    });
    
}

   
}
    }
}
myFunction()

}, 900000);

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


        /////remove data of loss and profit and current

       app.get('/removecurrent', async (req, res) => {

        let user = await User.findOne({ userName: 'nadeem' }).exec();
    
        if(user.currentpositionlong.length > 0){

        for(let i = 0; i < user.currentpositionlong.length; i++){
            
    User.findOneAndUpdate({userName:'nadeem'}, {$pull: {currentpositionlong: {scriptName:user.currentpositionlong[i].scriptName}}},
            function (error, success) {
                  if (error) {
                      console.log(error);
                  } else {
                      console.log('removed',success);
                  }
              });

              if(i == user.currentpositionlong.length  -1 ){
                res.send({'rem':'removed'})
              }
        }
    }
       })
        

       app.get('/removeloss', async (req, res) => {

        let user = await User.findOne({ userName: 'nadeem' }).exec();
    
        if(user.loss.length > 0){

        for(let i = 0; i < user.loss.length; i++){
            
    User.findOneAndUpdate({userName:'nadeem'}, {$pull: {loss: {scriptName:user.loss[i].scriptName}}},
            function (error, success) {
                  if (error) {
                      console.log(error);
                  } else {
                      console.log('removed',success);
                  }
              });

              if(i == user.loss.length - 1 ){
                  res.send({'rem':'removed'})
              }
        }
    }
       })
        

       app.get('/removeprofit', async (req, res) => {

        let user = await User.findOne({ userName: 'nadeem' }).exec();
    
        if(user.profit.length > 0){

        for(let i = 0; i < user.profit.length; i++){
            
    User.findOneAndUpdate({userName:'nadeem'}, {$pull: {profit: {scriptName:user.profit[i].scriptName}}},
            function (error, success) {
                  if (error) {
                      console.log(error);
                  } else {
                      console.log('removed',success);
                  }
              });

              if(i == user.profit.length  -1 ){
                res.send({'rem':'removed'})
              }
        }
    }
       })
        

       
///////////////////////////////////////////////////////////////////////////////////
app.listen(port)