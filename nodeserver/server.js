/**
 * Created by debasis on 14/9/16.
 */

var express = require('express');
var app = express();
var port = process.env.PORT || 3001;


var http = require('http').Server(app);





var bodyParser = require('body-parser');
app.use(bodyParser.json({ parameterLimit: 10000000,
    limit: '90mb'}));
app.use(bodyParser.urlencoded({ parameterLimit: 10000000,
    limit: '90mb', extended: false}));
var multer  = require('multer');
var datetimestamp='';
var filename='';
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {

        console.log(file.originalname);
        filename=file.originalname.split('.')[0].replace(/ /g,'') + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        console.log(filename);
        cb(null, filename);
    }
});


var EventEmitter = require('events').EventEmitter;

const emitter = new EventEmitter()
//emitter.setMaxListeners(100)
// or 0 to turn off the limit
emitter.setMaxListeners(0)

var upload = multer({ //multer settings
    storage: storage
}).single('file');


app.use(bodyParser.json({type: 'application/vnd.api+json'}));




app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});




/** API path that will upload the files */
app.post('/uploads', function(req, res) {
    datetimestamp = Date.now();
    upload(req,res,function(err){

        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }


        res.json({error_code:0,filename:filename});
    });
});

var mongodb = require('mongodb');
var db;
//var url = 'mongodb://localhost:27017/probidbackend';
var url = 'mongodb://localhost:27017/mzsadie';

var MongoClient = mongodb.MongoClient;

MongoClient.connect(url, function (err, database) {
    if (err) {
        console.log(err);

    }else{
        db=database;

    }});




app.get('/addexpertarea', function (req, resp) {

    value1 = {title: 'sdf',description: '5435', priority: 6,status: 0};

    var collection = db.collection('addexpertarea');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});


/*-----------------------------------START------------------------------------------*/
app.get('/test', function (req, resp) {

    value1 = {title: 'today',description: '5435', priority: 6,status: 0};

    var collection = db.collection('test');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Newesttttttttttt Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});

app.get('/addperson', function (req, resp) {

    value1 = {title: 'number10',description: '5435', priority: 1,status: 0};

    var collection = db.collection('person');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});


/*
app.post('/updateprofile',function(req,resp){
    var collection = db.collection('users');

    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
    }

    var o_id = new mongodb.ObjectID(req.body.id);

    collection.update({_id:o_id}, {$set: data}, true, true);

    resp.send(JSON.stringify({'status':'success'}));
});
*/

app.post('/changepassword', function (req, resp) {
    var cryptoold = require('crypto');
    var secretold = req.body.oldpassword;
    var hashold = cryptoold.createHmac('sha256', secretold)
        .update('password')
        .digest('hex');


    var cryptonew = require('crypto');
    var secretnew = req.body.password;
    var hashnew = cryptonew.createHmac('sha256', secretnew)
        .update('password')
        .digest('hex');
    var data = {
        password: hashnew
    }

  var collection = db.collection('users');
    var o_id = new mongodb.ObjectID(req.body.id);

    collection.find({_id: o_id, password: hashold}).toArray(function (err, items) {
       // console.log(items.length);

        if(items.length==0) {
            resp.send(JSON.stringify({'status': 'error', 'msg': 'Old password doesnot match'}));
            return;
           // console.log(1);
        }
        else {

            collection.update({_id: o_id}, {$set: data}, true, true);
            resp.send(JSON.stringify({'status': 'success', 'msg': 'Password updated..'}));
        }
    });
});





app.post('/adminlogin', function (req, resp) {
    var crypto = require('crypto');
    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');
    var collection = db.collection('users');
    //console.log(req.body.email+'====='+hash);

    collection.find({ email:req.body.email }).toArray(function(err, items){

            if(items.length==0){
                resp.send(JSON.stringify({'status':'error','msg':'Username invalid...'}));
                return;
            }


         if(items.length>0 && items[0].password!=hash){
                //console.log(items[0].password); //hex
                //console.log(hash); //given password
                //console.log(req.body.password);
                resp.send(JSON.stringify({'status':'error','msg':'Password Doesnot match'}));
                return;
            }


        if(items.length>0 && items[0].status!=1){
            resp.send(JSON.stringify({'status':'error','msg':'You are Blocked..'}));
            return;
            }


            if(items.length>0 && items[0].password==hash){
                resp.send(JSON.stringify({'status':'success','msg':items[0]}));   //sending the items[0] through msg variable
                return;
            }


    });



});



app.post('/addadmin',function(req,resp){


    var collection = db.collection('users');

    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    //resp.send(req.body);
    //return;

    collection.insert([{
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        added_time: Math.floor(Date.now() / 1000),
        status: 0,
        supradmin:0,
        type:1 //1=>admin, 0=>user
    }], function (err, result) {
        if (err) {
            console.log('error'+err);
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            console.log(result);
            resp.send(JSON.stringify({'status':'success','id':result.ops[0]._id}));
        }
    });


});

app.get('/adminlist',function (req,resp) {

    var collection = db.collection('users');

    collection.find().toArray(function(err, items) {

        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));
        } else {
            resp.send(JSON.stringify({'res':items}));
        }

    });

});
app.post('/admindetails',function(req,resp){
//console.log("admindetails from server.js called");
    var resitem = {};

    var collection = db.collection('users');

    var o_id = new mongodb.ObjectID(req.body._id);

    collection.find({_id:o_id}).toArray(function(err, items) {

        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            resitem = items[0];

            resp.send(JSON.stringify({'status':'success','item':resitem}));
        }
    });
   // resp.send(JSON.stringify({'status':'error','id':0}));

});
app.post('/editadmin',function(req,resp){
    var collection = db.collection('users');

    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
    }

    var o_id = new mongodb.ObjectID(req.body.id);

    collection.update({_id:o_id}, {$set: data}, true, true);

    resp.send(JSON.stringify({'status':'success'}));
});


app.post('/updateprofile',function(req,resp){
    var collection = db.collection('users');

    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
    }

    var o_id = new mongodb.ObjectID(req.body.id);

    collection.update({_id:o_id}, {$set: data}, true, true);

    resp.send(JSON.stringify({'status':'success'}));
});



/*app.post('/admindell',function(req,resp){
    var collection = db.collection('users');

    var o_id = new mongodb.ObjectID(req.body.id);

   /!* collection.remove( {"_id": o_id});

    resp.send(JSON.stringify({'status':'success'}));
    *!/
    /!*collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //   db.close();
        }
    });*!/
    resp.send('success');

});*/

app.post('/userstatcng',function(req,resp){
    var collection = db.collection('users');

    var o_id = new mongodb.ObjectID(req.body.id);

    collection.update({_id:o_id}, {$set: {status:req.body.status}}, true, true);

    resp.send(JSON.stringify({'status':'success'}));
});


/*---------------------------------END--------------------------------------------*/



app.post('/adddealer', function (req, resp) {

    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    value1 = {fname: req.body.fname,lname: req.body.fname, phone: req.body.phone,zip: req.body.zip,username:req.body.username,password:hash,is_lead:1};

    var collection = db.collection('dealers');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});


app.post('/updatedealer',function (req,resp) {

    var collection = db.collection('dealers');
    collection.update({username: req.body.username}, {$set: {address:req.body.address,state:req.body.state,city:req.body.city,fname:req.body.fname,lname:req.body.lname,phone:req.body.phone,zip:req.body.zip}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //db.close();

        }
    });

});




app.post('/addadmin', function (req, resp) {

    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');
        var added_on=new Date();
    if(req.body.is_active==true){
       var is_active=1;
    }
    else {
        var is_active=0;
    }

    value1 = {username:req.body.username,password:hash,fname: req.body.fname,lname: req.body.lname,email:req.body.email,address:req.body.address,city:req.body.city,state:req.body.state,zip:req.body.zip, phone: req.body.phone,is_active:req.body.is_active,added_on:added_on};

    var collection = db.collection('admin');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});
/*app.get('/adminlist', function (req, resp) {


    var collection = db.collection('users');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});*/



/*---------------------------START--------------------------------------------------*/
app.get('/testlist', function (req, resp) {


    var collection = db.collection('test');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
app.get('/show', function (req, resp) {


    var collection = db.collection('person');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
app.get('/deleteperson', function (req, resp) {

    var o_id = new mongodb.ObjectID('58f44da6520983ab4bb87ce0');

    var collection = db.collection('person');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //   db.close();
        }
    });

});
app.get('/updateperson',function (req,resp) {

    var o_id = new mongodb.ObjectID('58f44db8520983ab4bb87ce2');
    var collection = db.collection('person');
    collection.update({_id: o_id}, {$set: {description:'Updated'}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //db.close();

        }
    });

});


app.post('/deleteadmin', function (req, resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('users');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //   db.close();
        }
    });



});

/*app.post('/adminlogin', function (req, resp) {

    var resitem = {};

    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    var collection = db.collection('users');

    collection.find({ email:req.body.email , password: hash }).toArray(function(err, items) {
        if(err){
            resp.send(JSON.stringify({'status':'error','msg':'Database error occurred! Try again.'}));
        }else{
            if(items.length == 0){
                resp.send(JSON.stringify({'status':'error','msg':'Your information is incorrect.'}));
            }else{

                resitem = items[0];

                var accesscode = makeaccesscode();

                db.collection('accesscodes').insert([{
                    user_id: resitem._id,
                    access_code: accesscode,
                    status: 0,
                    time: Math.floor(Date.now() / 1000),
                }], function (err2, result2) {
                    mailsend('userverification',resitem.email,{accesscode:accesscode});
                });

                if(resitem.status == 0){
                    resp.send(JSON.stringify({'status':'error','msg':'This user is not activated.'}));
                }else{
                    resp.send(JSON.stringify({'status':'success','item':resitem}));
                }
            }
        }



    });





});*/


/*-----------------------------------END------------------------------------------------*/

app.post('/adminstatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('admin');
    collection.update({_id: o_id}, {$set: {is_active: req.body.is_active}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


});
app.post('/admincheck',function(req,resp){
    var collection=db.collection('admin');
    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    collection.find({username:req.body.username,password:hash}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //db.close();
        ///dbresults.push(items);
    });
})

app.post('/addcustomer', function (req, resp) {

    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    value1 = {fname: req.body.fname,lname: req.body.fname, phone: req.body.phone,zip: req.body.zip,username:req.body.username,password:hash,is_lead:1};

    var collection = db.collection('customer');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});

app.post('/updatecustomer',function (req,resp) {

    var collection = db.collection('customer');
    collection.update({username: req.body.username}, {$set: {address:req.body.address,state:req.body.state,city:req.body.city,fname:req.body.fname,lname:req.body.lname,phone:req.body.phone,zip:req.body.zip}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //db.close();

        }
    });

});
//let link = this.serverUrl+'adminlist';

app.get('/listexpert', function (req, resp) {


    var collection = db.collection('addexpertarea');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});

app.get('/listdealers', function (req, resp) {


    var collection = db.collection('dealers');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
/*app.post('/usercheck',function(req,resp){
    var collection=db.collection('dealers');
    var crypto = require('crypto');
    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    collection.find({username:req.body.username,password:hash}).toArray(function(err, items) {

       // resp.send(JSON.stringify(items));
        //db.close();
        ///dbresults.push(items);
    });
})*/

app.get('/getusastates',function (req,resp) {


    var usastates=[
        {
            "name": "Alabama",
            "abbreviation": "AL"
        },
        {
            "name": "Alaska",
            "abbreviation": "AK"
        },
        {
            "name": "American Samoa",
            "abbreviation": "AS"
        },
        {
            "name": "Arizona",
            "abbreviation": "AZ"
        },
        {
            "name": "Arkansas",
            "abbreviation": "AR"
        },
        {
            "name": "California",
            "abbreviation": "CA"
        },
        {
            "name": "Colorado",
            "abbreviation": "CO"
        },
        {
            "name": "Connecticut",
            "abbreviation": "CT"
        },
        {
            "name": "Delaware",
            "abbreviation": "DE"
        },
        {
            "name": "District Of Columbia",
            "abbreviation": "DC"
        },
        {
            "name": "Federated States Of Micronesia",
            "abbreviation": "FM"
        },
        {
            "name": "Florida",
            "abbreviation": "FL"
        },
        {
            "name": "Georgia",
            "abbreviation": "GA"
        },
        {
            "name": "Guam",
            "abbreviation": "GU"
        },
        {
            "name": "Hawaii",
            "abbreviation": "HI"
        },
        {
            "name": "Idaho",
            "abbreviation": "ID"
        },
        {
            "name": "Illinois",
            "abbreviation": "IL"
        },
        {
            "name": "Indiana",
            "abbreviation": "IN"
        },
        {
            "name": "Iowa",
            "abbreviation": "IA"
        },
        {
            "name": "Kansas",
            "abbreviation": "KS"
        },
        {
            "name": "Kentucky",
            "abbreviation": "KY"
        },
        {
            "name": "Louisiana",
            "abbreviation": "LA"
        },
        {
            "name": "Maine",
            "abbreviation": "ME"
        },
        {
            "name": "Marshall Islands",
            "abbreviation": "MH"
        },
        {
            "name": "Maryland",
            "abbreviation": "MD"
        },
        {
            "name": "Massachusetts",
            "abbreviation": "MA"
        },
        {
            "name": "Michigan",
            "abbreviation": "MI"
        },
        {
            "name": "Minnesota",
            "abbreviation": "MN"
        },
        {
            "name": "Mississippi",
            "abbreviation": "MS"
        },
        {
            "name": "Missouri",
            "abbreviation": "MO"
        },
        {
            "name": "Montana",
            "abbreviation": "MT"
        },
        {
            "name": "Nebraska",
            "abbreviation": "NE"
        },
        {
            "name": "Nevada",
            "abbreviation": "NV"
        },
        {
            "name": "New Hampshire",
            "abbreviation": "NH"
        },
        {
            "name": "New Jersey",
            "abbreviation": "NJ"
        },
        {
            "name": "New Mexico",
            "abbreviation": "NM"
        },
        {
            "name": "New York",
            "abbreviation": "NY"
        },
        {
            "name": "North Carolina",
            "abbreviation": "NC"
        },
        {
            "name": "North Dakota",
            "abbreviation": "ND"
        },
        {
            "name": "Northern Mariana Islands",
            "abbreviation": "MP"
        },
        {
            "name": "Ohio",
            "abbreviation": "OH"
        },
        {
            "name": "Oklahoma",
            "abbreviation": "OK"
        },
        {
            "name": "Oregon",
            "abbreviation": "OR"
        },
        {
            "name": "Palau",
            "abbreviation": "PW"
        },
        {
            "name": "Pennsylvania",
            "abbreviation": "PA"
        },
        {
            "name": "Puerto Rico",
            "abbreviation": "PR"
        },
        {
            "name": "Rhode Island",
            "abbreviation": "RI"
        },
        {
            "name": "South Carolina",
            "abbreviation": "SC"
        },
        {
            "name": "South Dakota",
            "abbreviation": "SD"
        },
        {
            "name": "Tennessee",
            "abbreviation": "TN"
        },
        {
            "name": "Texas",
            "abbreviation": "TX"
        },
        {
            "name": "Utah",
            "abbreviation": "UT"
        },
        {
            "name": "Vermont",
            "abbreviation": "VT"
        },
        {
            "name": "Virgin Islands",
            "abbreviation": "VI"
        },
        {
            "name": "Virginia",
            "abbreviation": "VA"
        },
        {
            "name": "Washington",
            "abbreviation": "WA"
        },
        {
            "name": "West Virginia",
            "abbreviation": "WV"
        },
        {
            "name": "Wisconsin",
            "abbreviation": "WI"
        },
        {
            "name": "Wyoming",
            "abbreviation": "WY"
        }
    ];

    resp.send(usastates);

});



var server = app.listen(port, function () {

    var host = server.address().address
    var port = server.address().port

    //  console.log("Example app listening at http://%s:%s", host, port)

})