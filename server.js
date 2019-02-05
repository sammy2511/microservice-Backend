var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
var { mongoose } = require('./mongoose');
var { Exercise } = require('./Models/Exercise');
var {Url} = require('./Models/Url');
var { User } = require('./Models/User');
const moment = require('moment')
const shortid = require("short-id");
const validUrl = require("valid-url");
const port = process.env.PORT || 5000;
var app = express();
const baseUri = `https://localhost:${port}`;

//middleware
app.use(bodyParser.json());


//route to Add new user
app.post('/api/exercise/new-user',(req,res) => {
    
    var user = new User({
        username: req.body.username
    });

    user.save().then((doc) => {
        res.send(doc);
    },(err) => {
        res.status(400).send(err);
    })

});


//route to Add Exercise
app.post('/api/exercise/add-exercise',(req,res) => {
    
     
    var exercise = new Exercise({
        userID:req.body.userID,
        description:req.body.description,
        duration:req.body.duration,
        date:new Date(req.body.date)
    })

    exercise.save().then((doc) => {
        res.send(doc);
    },(err) => {
        res.status(400).send(err);
    })
});

//timestamp route
app.get('/api/timestamp/:date_string?',(req,res)=>{

    const response = {
        "unix":"",
        "utc":""
    }
    
    if(req.params.date_string == undefined){
       
        response.unix = moment().unix();
        response.utc= moment().toISOString();

        res.send(response);
        
    }else{
        console.log(req.params.date_string)
        const is_valid = moment(req.params.date_string, "YYYY-MM-DD", true).isValid();
        if(is_valid){
            response.unix = moment(req.params.date_string).unix();
            response.utc = moment(req.params.date_string).toISOString();
            res.send(response);
        } else{
            
            response.unix = null;
            response.utc = "invalid date";
            res.send(response);
        }
    }
    
    
})

app.get('/api/whoami',(req,res)=>{
    const response = {
        "ipaddress":"",
        "language":"",
        "software":""
    }
    response.ipaddress = req.ip;
    response.language = req.headers['accept-language'];
    response.software = req.headers['user-agent'];
    res.send(response);
})

//rediect to Shorten URL
app.get('/:code', async (req,res)=>{
    const code = req.params.code;
    
    const item = await Url.findOne({urlCode:code});
    
    if(item){
        
        return res.redirect(item.originalUrl);
    }else{
        return res.status(400).send({
            "Text":"Invalid Code"
        })
    }
})

//Generate Short URL
app.post('/api/shorten',async (req,res) =>{
    
    const {url} = req.body;

    const code = shortid.generate();
    

    if(validUrl.isUri(url)){
        const item = await Url.findOne({originalUrl:url});

        if(item){
            res.status(200).json(item);
        }else{
            const shortUrl = baseUri + "/" + code;
            const item = new Url({
                originalUrl: url,
                urlCode: code,
                shortUrl: shortUrl,
                updatedAt: new Date()
            })

            await item.save();
            res.status(200).send(item);
        }
        
    }

    

})



//starting server
app.listen(port,() => {
  console.log(`Started on port ${port}`);
})
