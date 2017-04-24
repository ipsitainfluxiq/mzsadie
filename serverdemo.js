var express = require('express');
var app = express();
var port = process.env.PORT || 8003;


var http = require('http').Server(app);
var request = require('request');


var mailer = require("nodemailer");


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
        cb(null, './uploadedfiles/sharelinks/');
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
        var item =new Object();

        item.error_code=0;
        item.filename=filename;

        res.send(filename);
    });
});

var mongodb = require('mongodb');
var db;
//var faqdb;
//var url = 'mongodb://localhost:27017/probidbackend';
var url = 'mongodb://localhost:27017/probidbackend';

var MongoClient = mongodb.MongoClient;

MongoClient.connect(url, function (err, database) {
    if (err) {
        console.log(err);

    }else{
        db=database;
        //faqdb=database.faqs;

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
app.post('/addmanagepost', function (req, resp) {
    var added_on=Date.now();
    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }
    value1 = {dealerusername:req.body.dealerusername,title: req.body.title,posttype: req.body.posttype,postbody:req.body.postbody, priority: req.body.priority,is_active: is_active,added_on:added_on};

    var collection = db.collection('managepost');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});


app.post('/addmessage', function (req, resp) {

    var added_on=Date.now();
    value1 = { 'to': req.body.to, 'subject': req.body.subject, 'body': req.body.body, 'parentid': req.body.parentid, 'from': req.body.from ,'addedon':added_on};

    var collection = db.collection('message');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});
app.post('/addjobticket', function (req, resp) {

    var added_on=Date.now();
    value1 = { 'to': req.body.to, 'subject': req.body.subject, 'body': req.body.body, 'parentid': req.body.parentid, 'from': req.body.from ,'addedon':added_on};

    var collection = db.collection('jobticket');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);


        } else {
            if(req.body.from=='iftekar') {
                var collectiondealer = db.collection('dealers');
                collectiondealer.find({username: req.body.to}).toArray(function (err, items) {

                    console.log(items[0].email);
                    //resp.send(JSON.stringify(req.body.id));
                    mailsend('adminsendjobticket', items[0].email, req.body.parentid, items, req.body.subject, req.body.body);

                    //db.close();\
                    //console.log('job ticket');
                    ///dbresults.push(items);

                });
            }

            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});



app.get('/messagelist',function(req,resp){
    var collection=db.collection('message');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find().sort({added_on:-1}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.get('/managepostlistall',function(req,resp){
    var collection=db.collection('managepost');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find().sort({added_on:-1}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.post('/managepostlist',function(req,resp){
    var collection=db.collection('managepost');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({dealerusername:req.body.dealerusername}).sort({added_on:-1}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})

app.get('/jobticketlist',function(req,resp){
    var collection=db.collection('jobticket');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find().sort({added_on:-1}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})


app.get('/deleteallmessage',function(req,resp){
    //db.collection('messgae').drop();
    //collection.remove({});
})


app.post('/adddealer', function (req, resp) {

    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');
    var added_on=Date.now();

    var is_active=1;


    value1 = {fname: req.body.fname,lname: req.body.fname, phone: req.body.phone,zip: req.body.zip,username:req.body.username,password:hash,email:req.body.email,is_lead:1,is_active:is_active,added_on:added_on};

    var collection = db.collection('dealers');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            // resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

            request('http://influxiq.com/projects/domainmanager/createsubdomain.php?subdomain='+req.body.username, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var result={status:body};
                    mailsend('dealersignup',req.body.email,added_on,'','','');

                    resp.send(JSON.stringify(result));
                    console.log(body) // Show the HTML for the Google homepage.
                }
            })

        }
    });

});


app.post('/dealerautologin',function(req,resp){
    var collection=db.collection('dealers');


    collection.find({username:req.body.username}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //db.close();
        ///dbresults.push(items);
    });
})

app.post('/updatedealer',function (req,resp) {

    var collection = db.collection('dealers');

    var o_id = new mongodb.ObjectID(req.body.id);

    collection.update({username: req.body.username}, {$set: {address:req.body.address,state:req.body.state,city:req.body.city,fname:req.body.fname,lname:req.body.lname,email:req.body.email,phone:req.body.phone,zip:req.body.zip}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            collection.find({username: req.body.username}).toArray(function(err, items) {

                console.log(items[0].email);
                //resp.send(JSON.stringify(req.body.id));
                mailsend('dealercreditcard',items[0].email,items[0].added_on,items,'',items[0]._id);
                //db.close();
                ///dbresults.push(items);
            });

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
    var added_on=Date.now();
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }

    value1 = {username:req.body.username,password:hash,fname: req.body.fname,lname: req.body.lname,email:req.body.email,address:req.body.address,city:req.body.city,state:req.body.state,zip:req.body.zip, phone: req.body.phone,is_active:is_active,added_on:added_on};

    var collection = db.collection('admin');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});
app.post('/addaffiliate', function (req, resp) {

    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');
    var added_on=Date.now();
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }

    value1 = {username:req.body.username,password:hash,dealereusername:req.body.dealereusername,fname: req.body.fname,lname: req.body.lname,email:req.body.email,address:req.body.address,city:req.body.city,state:req.body.state,zip:req.body.zip, phone: req.body.phone,is_active:is_active,added_on:added_on};

    var collection = db.collection('affiliate');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});


app.post('/addfaq', function (req, resp) {

    var added_on=Date.now();
    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }

    value1 = {title:req.body.title,priority:req.body.priority,addedby: req.body.addedby,addedusertype: req.body.addedusertype,body:req.body.body,is_active:req.body.is_active,added_on:added_on};

    var collection = db.collection('faqs');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});
app.post('/addsharemedia', function (req, resp) {

    var added_on=Date.now();
    var is_public=0;
    if(req.body.is_public==true){
        var is_public=1;
    }
    else {
        var is_public=0;
    }

    value1 = {name:req.body.name,description:req.body.description,url:req.body.url,filename:req.body.filename,priority:req.body.priority,is_public:is_public,added_on:added_on};

    var collection = db.collection('sharemedia');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});
app.post('/addrsvp', function (req, resp) {


    var added_on=Date.now();

    var status=0;
    // mailsend('rsvpsend',req.body.customeremail,added_on,req.body.dealername,req.body.carinfo,req.body.inventorymatchval);
    // resp.send('success');
    value1 = {inventoryid:req.body.inventoryid,dealerid:req.body.dealerid,customerusername:req.body.customerusername,retialcommission:req.body.retialcommission,status:status,added_on:added_on};

    var collection = db.collection('rsvp');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {

            mailsend('rsvpsend',req.body.customeremail,added_on,req.body.dealername,req.body.carinfo,req.body.inventorymatchval);

            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});
app.post('/sendinfo', function (req, resp) {
    var added_on=Date.now();
    mailsend('rsvpsend',req.body.customeremail,added_on,req.body.dealername,req.body.carinfo,req.body.inventorymatchval);
    resp.send('success');
});

app.post('/customerrsvpsend' , function(req,resp){
    var added_on=Date.now();
    var collection = db.collection('rsvp');
    var o_id=new mongodb.ObjectID(req.body.id);
    collection.update({_id: o_id}, {$set: {status: 1}},function(err, results) {
        if (err) {
            resp.send(err);
        } else {

            mailsend('customerrsvpsend', req.body.dealeremail, added_on, req.body.customername, req.body.carinfo, '');
            resp.send('success');

        }
    });


})
app.post('/customerrsvpsenduncommit' , function(req,resp){
    var added_on=Date.now();
    var collection = db.collection('rsvp');
    var o_id=new mongodb.ObjectID(req.body.id);
    collection.update({_id: o_id}, {$set: {status: 2}},function(err, results) {
        if (err) {
            resp.send(err);
        } else {

            mailsend('customerrsvpsenduncommit', req.body.dealeremail, added_on, req.body.customername, req.body.carinfo, '');
            resp.send('success');

        }
    });


})
app.post('/customersetmaxbit' , function(req,resp){
    var added_on=Date.now();
    var collection = db.collection('rsvp');
    var o_id=new mongodb.ObjectID(req.body.id);
    collection.update({_id: o_id}, {$set: {maxbid: req.body.maxbid}},function(err, results) {
        if (err) {
            resp.send(err);
        } else {

            resp.send('success');

        }
    });


})
app.post('/customerparticipate' , function(req,resp){
    var added_on=Date.now();
    var collection = db.collection('rsvp');
    var o_id=new mongodb.ObjectID(req.body.id);
    collection.update({_id: o_id}, {$set: {customer_partcicipate: req.body.customer_participiate}},function(err, results) {
        if (err) {
            resp.send(err);
        } else {

            resp.send('success');

        }
    });


})
app.post('/customersetmaxbitall' , function(req,resp){
    var added_on=Date.now();
    var collection = db.collection('rsvp');
    var o_id=new mongodb.ObjectID(req.body.id);
    collection.update({}, {$set: {maxbid: '',customer_partcicipate:''}}, {multi: true});
    /* collection.update({}, {$set: {maxbid: '',customer_partcicipate:''}},function(err, results) {
     if (err) {
     resp.send(err);
     } else {

     resp.send('success');

     }
     });*/


})
app.get('/customerallsetaffiliateid' , function(req,resp){
    var collection = db.collection('customer');

    collection.update({}, {$set: {affiliateid: ''}}, {multi: true});
    /* collection.update({}, {$set: {maxbid: '',customer_partcicipate:''}},function(err, results) {
     if (err) {
     resp.send(err);
     } else {

     resp.send('success');

     }
     });*/


})

app.post('/addbannersize', function (req, resp) {

    value1 = {sizename:req.body.sizename,height:req.body.height,width:req.body.width};

    var collection = db.collection('bannersize');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});
app.post('/addopenchannelmanagement', function (req, resp) {
    var added_on=Date.now();
    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else{
        var is_active=0;
    }
    value1 = {channelname:req.body.channelname,dealereusername:req.body.dealereusername,is_active:is_active,added_on:added_on};

    var collection = db.collection('openchannel');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});



app.post('/addauction',function(req,resp){
    var added_on=Date.now();
    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else{
        var is_active=0;
    }

    value1 = {username:req.body.username,name:req.body.name,description:req.body.description,filename:req.body.filename,priority:req.body.priority,auction_date:req.body.auction_date,is_active:is_active,added_on:added_on};

    //console.log(value1);
    var collection=db.collection('auction');
    collection.insert([value1],function(err,result)
    {
        if (err) {
            resp.send(err);
        }
        else {
            var id=result.insertedIds[0].toString();
            console.log(id);
            var o_id=new mongodb.ObjectID(id);
            collection.update({_id:o_id},{$set: {auctionid:id}},function(err1,results1){
                if (err1){
                    resp.send("failed");
                    throw err;
                }
                else {
                    resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

                }
            });


        }
    });
});
app.post('/addcar',function(req,resp){
    var added_on=Date.now();
    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else{
        var is_active=0;
    }


    value1 = {username:req.body.username,
        doctype:req.body.doctype,
        est_retail_value:req.body.est_retail_value,
        vin:req.body.vin,
        color:req.body.color,
        drive:req.body.drive,
        fuel:req.body.fuel,
        notes:req.body.notes,
        cylinder:req.body.cylinder,
        carlogolist:req.body.carlogolist,
        model:req.body.model,
        carautoyearlist:req.body.carautoyearlist,
        mileage:req.body.mileage,
        enginetype:req.body.enginetype,
        carbodystylelist:req.body.carbodystylelist,
        power_locks:req.body.power_locks,
        power_window:req.body.power_window,
        sunroof:req.body.sunroof,
        digital_display:req.body.digital_display,
        stereo_system:req.body.stereo_system,
        bluetooth:req.body.bluetooth,
        dvd_player:req.body.dvd_player,
        gps:req.body.gps,
        airbags:req.body.airbags,
        seats:req.body.seats,
        satellite_radio:req.body.satellite_radio,
        lights:req.body.lights,
        gear_type:req.body.gear_type,
        trinted_window:req.body.trinted_window,
        basepricerange:req.body.basepricerange,
        feature:req.body.feature,
        auctionid:req.body.auctionid,
        filename:req.body.filename,
        additionalfilename:req.body.additionalfilename,
        priority:req.body.priority,
        is_active:is_active,
        added_on:added_on};

    var collection=db.collection('car');
    collection.insert([value1],function(err,result)
    {
        if (err) {
            resp.send(err);
        }
        else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
        }
    });
});
app.post('/addopencontract',function(req,resp){
    var added_on=Date.now();

    value1 = {dealeridn:req.body.dealeridn,
        commissiontypen:req.body.commissiontypen,
        option_name:req.body.option_name,
        priority:req.body.priority,
        commissionn:req.body.commissionn,
        base_price:req.body.base_price,
        color_opiton:req.body.color_opiton,
        car_feature:req.body.car_feature,
        upcoming_auction:req.body.upcoming_auction,
        car_body_style:req.body.car_body_style,
        car_auto_year:req.body.car_auto_year,
        car_mileage:req.body.car_mileage,
        added_on:added_on};

    var collection=db.collection('opencontract');
    collection.insert([value1],function(err,result)
    {
        if (err) {
            resp.send(err);
        }
        else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
        }
    });
});


app.post('/addbanner', function (req, resp) {
    var added_on=Date.now();
    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }


    value1 = {bannername:req.body.bannername,bannersize:req.body.bannersize,sharelink:req.body.sharelink,filename:req.body.filename,priority:req.body.priority,is_active:is_active,added_on:added_on};

    var collection = db.collection('banner');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});
app.post('/addinventory', function (req, resp) {
    var added_on=Date.now();
    value1 = {auctionid:req.body.auctionid,dealerid:req.body.dealerid,added_on:added_on};

    var collection = db.collection('dealerauctioninventory');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});

app.post('/addpurchasetime', function (req, resp) {
    var added_on=Date.now();
    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }


    value1 = {name:req.body.name,is_active:is_active,added_on:added_on};

    var collection = db.collection('purchasetime');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});
app.post('/addbaseprice', function (req, resp) {
    var added_on=Date.now();
    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }


    value1 = {baseprice:req.body.baseprice,is_active:is_active,added_on:added_on};

    var collection = db.collection('baseprice');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});
app.post('/addcolor', function (req, resp) {
    var added_on=Date.now();
    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }


    value1 = {color:req.body.color,priority:req.body.priority,is_active:is_active,added_on:added_on};

    var collection = db.collection('color');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});

app.post('/addmemshippackage',function(req,resp){

    var added_on=Date.now();
    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else{
        var is_active=0;
    }

    value1 = {username:req.body.username,name:req.body.name,free_member:req.body.free_member,cost_extra_member:req.body.cost_extra_member,description:req.body.description,filename:req.body.filename,priority:req.body.priority,is_active:is_active,added_on:added_on};

    var collection=db.collection('membershippackage');
    collection.insert([value1],function(err,result)
    {
        if (err) {
            resp.send(err);
        }
        else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
        }
    });
});
app.post('/buymembershippackagebydealer',function(req,resp){

    var added_on=Date.now();
    var is_active=1;


    value1 = {username:req.body.username,name:req.body.name,free_member:req.body.free_member,cost_extra_member:req.body.cost_extra_member,description:req.body.description,filename:req.body.filename,packageid:req.body.packageid,added_on:added_on,is_active:is_active};

    var collection=db.collection('dealermembershippackage');
    collection.insert([value1],function(err,result)
    {
        if (err) {
            resp.send(err);
        }
        else {
            var invoiceno=result.insertedIds[0];

            var collection1 = db.collection('dealers');
            collection1.find({username:req.body.username}).toArray(function(err,items){




                var free_member=parseInt(parseInt(items[0].free_member)+parseInt(req.body.free_member));


                collection1.update({username: req.body.username}, {$set: {free_member:free_member}},function(err, results) {
                    if (err) {
                        resp.send("failed");
                        throw err;
                    }
                    else {

                        mailsend('dealerpackagepurchase',items[0].email,added_on,items,value1,invoiceno);


                        resp.send(JSON.stringify(result.insertedIds));
                        //db.close();

                    }

                });

            });





        }
    });
});


app.post('/updateadmin',function (req,resp) {

    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }

    var collection = db.collection('admin');
    collection.update({username: req.body.username}, {$set: {address:req.body.fname,state:req.body.state,city:req.body.city,fname:req.body.fname,lname:req.body.lname,phone:req.body.phone,zip:req.body.zip,is_active:is_active}},function(err, results) {
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
app.post('/updatepurchasetime',function (req,resp) {

    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }
    var o_id = new mongodb.ObjectID(req.body.id);
    var collection = db.collection('purchasetime');
    collection.update({_id: o_id}, {$set: {name:req.body.name,is_active:is_active}},function(err, results) {
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
app.post('/updatebaseprice',function (req,resp) {

    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }
    var o_id = new mongodb.ObjectID(req.body.id);
    var collection = db.collection('baseprice');
    collection.update({_id: o_id}, {$set: {baseprice:req.body.baseprice,is_active:is_active}},function(err, results) {
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
app.post('/updatecolor',function (req,resp) {

    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }
    var o_id = new mongodb.ObjectID(req.body.id);
    var collection = db.collection('color');
    collection.update({_id: o_id}, {$set: {color:req.body.color,priority:req.body.priority,is_active:is_active}},function(err, results) {
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
app.post('/updatedealerprofile',function (req,resp) {

    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }
    var o_id = new mongodb.ObjectID(req.body.id);
    var collection = db.collection('dealers');
    collection.update({_id: o_id}, {$set: {address:req.body.address,state:req.body.state,city:req.body.city,fname:req.body.fname,lname:req.body.lname,email:req.body.email,phone:req.body.phone,zip:req.body.zip,description:req.body.description,websiteurl:req.body.websiteurl,is_active:is_active,filename:req.body.filename,banner:req.body.banner}},function(err, results) {
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

app.post('/updateaffiliate',function (req,resp) {
    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }

    var collection = db.collection('affiliate');
    collection.update({username: req.body.username}, {$set: {address:req.body.fname,state:req.body.state,city:req.body.city,fname:req.body.fname,lname:req.body.lname,phone:req.body.phone,zip:req.body.zip,is_active:is_active}},function(err, results) {
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

app.get('/updatefaqstatus',function (req,resp) {

    console.log((req.params));
    console.log((req.query));
    //resp.send((req.params));
    //return;

    var o_id = new mongodb.ObjectID(req.param('id'));
    var collection = db.collection('faqs');
    collection.update({_id: o_id}, {$set: {is_active:req.query.value}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            /*if(req.query.type=='dealer' && req.query.is_system==1){

             var match={
             "addedusertype": { "$in":["admin",]},
             "is_active": { "$in":['1']}
             };
             var from ='admin';
             }

             if(req.query.type=='dealer' && req.query.is_system==0){

             var match={
             "addedusertype": { "$in":["admin",]},
             "is_active": { "$in":['1']}
             };
             var from ='dealers';
             }
             if(req.query.type=='admin'){

             var match={
             "addedusertype": { "$in":["admin",]},
             };
             var from ='admin';
             }
             var collection=db.collection('faqs').aggregate([
             //{ "$match": match},
             {
             $lookup : {
             from: from,
             localField: "addedby",
             foreignField: "username",
             as: "userdetails"
             }

             }
             ]);

             collection.toArray(function(err, items) {

             //console.log(JSON.stringify(items));
             resp.send(JSON.stringify(items));

             });
             //db.close();*/

        }
    });

});
app.post('/updatecarautomilagestatus',function (req,resp) {

    console.log((req.params));
    console.log((req.query));
    //resp.send((req.params));
    //return;

    var o_id = new mongodb.ObjectID(req.param('id'));
    var collection = db.collection('carautomilage');
    collection.update({_id: o_id}, {$set: {is_active:req.query.value}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");


        }
    });

});


app.post('/updatefaqs',function (req,resp) {


    var o_id = new mongodb.ObjectID(req.body._id);
    var collection = db.collection('faqs');
    collection.update({_id: o_id}, {$set: {title:req.body.title,priority:req.body.priority,body:req.body.body,is_active:req.body.is_active}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");

        }
    });

});
app.post('/updatesharemedia',function (req,resp) {

    var is_public=0;
    if(req.body.is_public==true){
        var is_public=1;
    }
    else {
        var is_public=0;
    }


    var o_id = new mongodb.ObjectID(req.body._id);
    var collection = db.collection('sharemedia');
    collection.update({_id: o_id}, {$set: {name:req.body.name,description:req.body.description,url:req.body.url,filename:req.body.filename,priority:req.body.priority,is_public:is_public}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");

        }
    });

});
app.post('/updatebannersize',function (req,resp) {
    var o_id = new mongodb.ObjectID(req.body._id);
    var collection = db.collection('bannersize');
    collection.update({_id: o_id}, {$set: {sizename:req.body.sizename,height:req.body.height,width:req.body.width}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");

        }
    });

});
app.post('/updatememshippackage',function(req,resp){
    var o_id=new mongodb.ObjectID(req.body._id);

    if(req.body.is_active==true){
        var is_active=1;
    }
    else{
        var is_active=0;
    }

    var collection = db.collection('membershippackage');
    collection.update({_id:o_id},{$set: {name:req.body.name,free_member:req.body.free_member,cost_extra_member:req.body.cost_extra_member,description:req.body.description,filename:req.body.filename,priority:req.body.priority,is_active:is_active}},function(err,results){
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");

        }
    });
});
app.post('/updateauction',function(req,resp){
    var o_id=new mongodb.ObjectID(req.body._id);

    if(req.body.is_active==true){
        var is_active=1;
    }
    else{
        var is_active=0;
    }

    var collection = db.collection('auction');
    collection.update({_id:o_id},{$set: {name:req.body.name,description:req.body.description,filename:req.body.filename,priority:req.body.priority,auction_date:req.body.auction_date,is_active:is_active}},function(err,results){
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");

        }
    });
});

app.post('/updatebanner',function (req,resp) {
    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }


    var o_id = new mongodb.ObjectID(req.body._id);
    var collection = db.collection('banner');
    collection.update({_id: o_id}, {$set: {bannername:req.body.bannername,bannersize:req.body.bannersize,sharelink:req.body.sharelink,filename:req.body.filename,priority:req.body.priority,is_active:is_active}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");

        }
    });

});
app.post('/dealerordermember',function(req,resp){
    var collection=db.collection('dealermembershippackage');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})


app.post('/editadmin',function(req,resp){
    var collection=db.collection('admin');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})

app.post('/getcarlogobyid',function(req,resp){
    var collection=db.collection('carlogo');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.post('/editmanagepostbyid',function(req,resp){
    var collection=db.collection('managepost');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})

app.post('/getopencontractbyid',function(req,resp){
    var collection=db.collection('opencontract');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.post('/getopenchannelmanagementbyid',function(req,resp){
    var collection=db.collection('openchannel');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})



app.post('/getcarfeaturebyid',function(req,resp){
    var collection=db.collection('carfeature');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})


app.post('/getcarautomilagebyid',function(req,resp){
    var collection=db.collection('carautomilage');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})

app.post('/getcarautoyearbyid',function(req,resp){
    var collection=db.collection('carautoyear');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();yd
        ///dbresults.push(items);
    });
})


app.post('/getcustomerbyusername',function(req,resp){
    var collection=db.collection('customer');
    /* collection.find({dealerusername: req.body.dealerusername}).sort({added_on:-1}).limit(8).toArray(function(err, items) {*/
    collection.find({dealerusername: req.body.dealerusername}).sort({added_on:-1}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.post('/getcustomerbyusernamecount',function(req,resp){
    var collection=db.collection('customer');
    collection.find({dealerusername: req.body.dealerusername}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.post('/getcustomerbyrandomstring',function(req,resp){
    var collection=db.collection('customer');
    collection.find({randomstring: req.body.randomstring}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})

app.post('/getcarbyid',function(req,resp){
    var collection=db.collection('car');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})

app.post('/getcarbodystylebyid',function(req,resp){
    var collection=db.collection('carbodystyle');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.post('/getinventorybydealer',function(req,resp){
    var collection=db.collection('dealerauctioninventory');

    var o_id = new mongodb.ObjectID(req.body.dealerid);
    collection.find({dealerid: req.body.dealerid}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})

app.get('/getinventoryfordealer',function(req,resp){
    var collection=db.collection('dealerauctioninventory');

    //var o_id = new mongodb.ObjectID(req.body.dealerid);
    /*collection.find({dealerid: req.query.dealerid}).toArray(function(err, items) {

     resp.send(JSON.stringify(items));
     //resp.send(JSON.stringify(req.body.id));
     //db.close();
     ///dbresults.push(items);
     });*/


    var collection=db.collection('dealerauctioninventory').aggregate([

        {$unwind:"$auctionid"},
        //{ $match : { is_active : 1 } },
        { $match : { "dealerid" : req.query.dealerid  } },

        {
            $lookup : {
                from: "car",
                localField: "auctionid",
                foreignField: "auctionid",
                as: "cardata"
            },

        },
        /*{
         $match: { "cardata": { $ne: [] }, "dealerid" : req.query.dealerid }
         }*/
        {
            $lookup : {
                from: "auction",
                localField: "auctionid",
                foreignField: "auctionid",
                as: "auctiondata"
            },

        }


    ]);

    collection.toArray(function(err, items) {

        resp.send(JSON.stringify(items));

    });
});



app.get('/getauctionwithinventory',function(req,resp){
    var collection=db.collection('dealerauctioninventory');

    //var o_id = new mongodb.ObjectID(req.body.dealerid);
    /*collection.find({dealerid: req.query.dealerid}).toArray(function(err, items) {

     resp.send(JSON.stringify(items));
     //resp.send(JSON.stringify(req.body.id));
     //db.close();
     ///dbresults.push(items);
     });*/


    var collection=db.collection('auction').aggregate([

        //{$unwind:"$auctionid"},
        //{ $match : { is_active : 1 } },
        //{ $match : { "dealerid" : req.query.dealerid  } },

        {
            $lookup : {
                from: "car",
                localField: "auctionid",
                foreignField: "auctionid",
                as: "cardata"
            },

        },
        /*{
         $match: { "cardata": { $ne: [] }, "dealerid" : req.query.dealerid }
         }*/
        /*{
         $lookup : {
         from: "auction",
         localField: "auctionid",
         foreignField: "auctionid",
         as: "auctiondata"
         },

         }
         */

    ]);

    collection.toArray(function(err, items) {

        resp.send(JSON.stringify(items));

    });
});
app.get('/getinventoryforcustomerbydealer',function(req,resp){
    var collection=db.collection('customer');
    collection.find({dealerusername: req.query.dealerusername}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.get('/getcustomeractivity',function(req,resp){
    var collection=db.collection('customeractivity');
    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.post('/getcustomeractivitybyusername',function(req,resp){
    var collection=db.collection('customeractivity');
    collection.find({dealerid:req.body.dealerusername}).sort({added_on:-1}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})



app.post('/editpurchasetime',function(req,resp){
    var collection=db.collection('purchasetime');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.post('/editbaseprice',function(req,resp){
    var collection=db.collection('baseprice');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.post('/editcolor',function(req,resp){
    var collection=db.collection('color');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.post('/editdealer',function(req,resp){
    var collection=db.collection('dealers');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})

app.post('/editdealerbyusername',function(req,resp){
    var collection=db.collection('dealers');

    // var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({username: req.body.username}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})


app.post('/editdcustomerbyusername',function(req,resp){
    var collection=db.collection('customer');
    collection.find({username: req.body.username}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.post('/getcustomerinfobyid',function(req,resp){
    var collection=db.collection('customer');
    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {


        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})

app.post('/editaffiliate',function(req,resp){
    var collection=db.collection('affiliate');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.post('/editsharemedia',function(req,resp){
    var collection=db.collection('sharemedia');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.post('/editbanner',function(req,resp){
    var collection=db.collection('banner');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.post('/editbannersize',function(req,resp){
    var collection=db.collection('bannersize');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})
app.post('/editmembershippackage',function(req,resp){
    var collection=db.collection('membershippackage') ;
    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id:o_id}).toArray(function(err,items){
        resp.send(JSON.stringify(items));
    });
});

app.post('/editauction',function(req,resp){
    var collection=db.collection('auction');
    var o_id= new mongodb.ObjectID(req.body.id);
    collection.find({_id:o_id}).toArray(function(err,items){
        resp.send(JSON.stringify(items))
    });
});
app.post('/getfaqdetailsbyid',function(req,resp){
    var collection=db.collection('faqs');

    var o_id = new mongodb.ObjectID(req.body.id);
    collection.find({_id: o_id}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });
})


app.get('/adminlist', function (req, resp) {


    var collection = db.collection('admin');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
app.get('/opencontractlist', function (req, resp) {


    var collection = db.collection('opencontract');


    collection.find({dealeridn: req.query.dealeridn}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
app.get('/rsvplist', function (req, resp) {


    var collection = db.collection('rsvp');


    collection.find({dealeridn: req.query.dealeridn}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
app.post('/getrsvpbydealerid',function(req,resp){
    var collection=db.collection('rsvp');


    collection.find({dealerid: req.body.dealerid}).sort({added_on:-1}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();yd
        ///dbresults.push(items);
    });
})
app.post('/getrsvpbydealeridforuser',function(req,resp){
    var collection=db.collection('rsvp');


    collection.find({dealerid: req.body.dealerid,customerusername:req.body.customerid}).sort({added_on:-1}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send(JSON.stringify(req.body.id));
        //db.close();yd
        ///dbresults.push(items);
    });
})


app.get('/dealerinventorylist', function (req, resp) {


    var collection = db.collection('dealerauctioninventory');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});

app.get('/purchasetimelist', function (req, resp) {


    var collection = db.collection('purchasetime');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
app.get('/basepricelist', function (req, resp) {


    var collection = db.collection('baseprice');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
app.get('/colorlist', function (req, resp) {


    var collection = db.collection('color');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});

app.get('/customerlist', function (req, resp) {


    var collection = db.collection('customer');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
app.get('/dealerlist', function (req, resp) {


    var collection = db.collection('dealers');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
app.post('/affiliatelist', function (req, resp) {

    var collection = db.collection('affiliate');

    collection.find({dealereusername: req.body.dealereusername}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
app.post('/openchannelmanagementlist', function (req, resp) {

    var collection = db.collection('openchannel');

    collection.find({dealereusername: req.body.dealereusername}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});

app.get('/sharemedialist', function (req, resp) {


    var collection = db.collection('sharemedia');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
app.get('/sharemedialistdealer', function (req, resp) {
    var collection = db.collection('sharemedia');

    collection.find({is_public: 1}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
app.get('/getbannersizelist', function (req, resp) {


    var collection = db.collection('bannersize');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});
app.get('/auctionlist',function(req,resp){
    var collection=db.collection('auction');
    collection.find().toArray(function(err,items){
        resp.send(JSON.stringify(items));
    })
})

app.get('/dealerauctionlist',function(req,resp){
    var collection=db.collection('auction');
    collection.find({is_active:1}).sort({priority:-1}).toArray(function(err,items){
        //resp.send(JSON.stringify(items));
    });

    var collection=db.collection('auction').aggregate([
        //{$group:{'_id':'$_id','auctionid': {'$push': '$auctionid'}}},
        //{ $group: { _id: '$_id', auctionid: { $addToSet: '$auctionid' }}},
        //{$unwind:"$auctionid"},
        //{$unwind:"$auctionid"},
        //{$group:{'_id':'$_id','auctionid': {'$push': '$auctionid'}}},

        {
            $lookup : {
                from: "car",
                localField: "auctionid",
                foreignField: "auctionid",
                as: "cardata"
            }
        },
        /*{$group:{_id:{auctionid:'$auctionid', odometer:'$odometer', primary_damage:'$primary_damage'}, numberOfauctionids:{$sum:1}}},
         {$sort:{numberOfauctionids:-1}},
         {$group:{_id:'$_id.auctionid', odometer:{$first:'$_id.odometer'},primary_damage:{$first:'$_id.primary_damage'},
         numberOfauctionids:{$first:'numberOfauctionids'}}}*/


        /*{
         // this receives the output from the first aggregation.
         // So the (originally) non-unique 'id' field is now
         // present as the _id field. We want to rename it.
         $project:{
         _id : '$_id', // Restore original ID.

         id  : '$_id', //
         doctype : '$doctype',
         odometer: '$odometer',
         primary_damage : '$primary_damage',
         found_in: {$addToSet:'$_id'}
         }
         }*/
        /* {
         $group:
         {
         _id: { _id: { $_id: "$_id"} },
         itemsSold: { $addToSet: "$doctype" }
         }
         }*/
        //{$group: {_id: {_id: "$_id"},
        //  count: {$sum: 1}}}
        //{$group:{'auctionid': {'$push': '$auctionid'}}}
        //{$group:{_id: '$auctionid', found_in: {$addToSet:'$_id'}}},

        //{$group:{'_id':'$_id','auctionid': {'$push': '$auctionid'}}}

        //{$group:{_id: '$auctionid', found_in: {$addToSet:'$_id'}}},

    ]);

    collection.toArray(function(err, items) {

        resp.send(JSON.stringify(items));

    });
})



app.get('/carlist',function(req,resp){


    var collection=db.collection('car').aggregate([
        //{$group:{'_id':'$_id','auctionid': {'$push': '$auctionid'}}},
        //{ $group: { _id: '$_id', auctionid: { $addToSet: '$auctionid' }}},
        {$unwind:"$auctionid"},
        //{$unwind:"$auctionid"},
        //{$group:{'_id':'$_id','auctionid': {'$push': '$auctionid'}}},

        {
            $lookup : {
                from: "auction",
                localField: "auctionid",
                foreignField: "auctionid",
                as: "auctiondata"
            }
        },
        /*{$group:{_id:{auctionid:'$auctionid', odometer:'$odometer', primary_damage:'$primary_damage'}, numberOfauctionids:{$sum:1}}},
         {$sort:{numberOfauctionids:-1}},
         {$group:{_id:'$_id.auctionid', odometer:{$first:'$_id.odometer'},primary_damage:{$first:'$_id.primary_damage'},
         numberOfauctionids:{$first:'numberOfauctionids'}}}*/


        /*{
         // this receives the output from the first aggregation.
         // So the (originally) non-unique 'id' field is now
         // present as the _id field. We want to rename it.
         $project:{
         _id : '$_id', // Restore original ID.

         id  : '$_id', //
         doctype : '$doctype',
         odometer: '$odometer',
         primary_damage : '$primary_damage',
         found_in: {$addToSet:'$_id'}
         }
         }*/
        /* {
         $group:
         {
         _id: { _id: { $_id: "$_id"} },
         itemsSold: { $addToSet: "$doctype" }
         }
         }*/
        //{$group: {_id: {_id: "$_id"},
        //  count: {$sum: 1}}}
        //{$group:{'auctionid': {'$push': '$auctionid'}}}
        //{$group:{_id: '$auctionid', found_in: {$addToSet:'$_id'}}},

        //{$group:{'_id':'$_id','auctionid': {'$push': '$auctionid'}}}

        //{$group:{_id: '$auctionid', found_in: {$addToSet:'$_id'}}},

    ]);

    collection.toArray(function(err, items) {

        resp.send(JSON.stringify(items));

    });

});

app.get('/carlogolist', function(req,resp){
    var collection = db.collection('carlogo');
    collection.find().toArray(function(err,items){
        resp.send(JSON.stringify(items));
    });
});
app.get('/carautoyearlist', function(req,resp){
    var collection = db.collection('carautoyear');
    collection.find().toArray(function(err,items){
        resp.send(JSON.stringify(items));
    });
});
app.get('/carbodystylelist', function(req,resp){
    var collection = db.collection('carbodystyle');
    collection.find().toArray(function(err,items){
        resp.send(JSON.stringify(items));
    });
});
app.get('/membershippackagelist', function(req,resp){
    var collection = db.collection('membershippackage');
    collection.find().toArray(function(err,items){
        resp.send(JSON.stringify(items));
    });
});

app.get('/dealerpackagelist', function(req,resp){
    var collection = db.collection('dealermembershippackage');
    collection.find().toArray(function(err,items){
        resp.send(JSON.stringify(items));
    });
});
app.get('/membershiporderreportlist', function(req,resp){
    var collection=db.collection('dealermembershippackage').aggregate([

        {
            $lookup : {
                from: "dealers",
                localField: "username",
                foreignField: "username",
                as: "dealername"
            }

        },

    ]);

    collection.toArray(function(err,items){
        resp.send(JSON.stringify(items));
    });
});
app.get('/dealermembershiporderpackagelist', function(req,resp){
    var collection = db.collection('dealermembershippackage');
    collection.find({username:req.query.dealerusername}).toArray(function(err,items){
        resp.send(JSON.stringify(items));
    });
});

app.get('/bannerlist', function (req, resp) {


    /*var collection = db.collection('banner');

     collection.find().toArray(function(err, items) {

     resp.send(JSON.stringify(items));
     });*/


    var collection=db.collection('banner').aggregate([

        {
            $lookup : {
                from: "sharemedia",
                localField: "sharemedia",
                foreignField: "mongoose.Types.ObjectId(_id)",
                as: "sharelinkdetails"
            }

        },
        {
            $lookup : {
                from: "bannersize",
                localField: "sizename",
                foreignField: "mongoose.Types.ObjectId(_id)",
                as: "bannersizedetails1"
            }

        }

    ]);

    collection.toArray(function(err, items) {

        resp.send(JSON.stringify(items));

    });

});
app.get('/bannerlistactive', function (req, resp) {
    var collection=db.collection('banner').aggregate([
        {$match : {is_active : 1}},
        // { "$match": {
        //     "is_active": { "$in":['1']}
        //
        // }},
        /* {
         $lookup : {
         from: "sharemedia",
         localField: "sharemedia",
         foreignField: "mongoose.Types.ObjectId(_id)",
         as: "sharelinkdetails"
         }

         },*/
        {
            $lookup : {
                from: "bannersize",
                localField: "sizename",
                foreignField: "mongoose.Types.ObjectId(_id)",
                as: "bannersizedetails1"
            }

        }

    ]);

    collection.toArray(function(err, items) {

        resp.send(JSON.stringify(items));

    });

});

app.get('/faqlist', function (req, resp) {


    var collection=db.collection('faqs').aggregate([
        { "$match": {
            "addedusertype": { "$in":["admin",]},

        }},
        {
            $lookup : {
                from: "admin",
                localField: "addedby",
                foreignField: "username",
                as: "userdetails"
            }

        }

    ]);

    collection.toArray(function(err, items) {

        resp.send(JSON.stringify(items));

    });

    /*//resp.send(JSON.stringify(collection));
     var arr=new Array();

     console.log(collection.length+"<br/>");
     collection.forEach(function(coll) {
     //console.log("Found a coll" + JSON.stringify(coll));
     arr.push(coll);
     console.log(arr.length+"<br/>");
     });

     console.log(arr.length+"<br/>");
     //resp.send(JSON.stringify(arr));
     */

});

app.get('/systemfaqlist', function (req, resp) {




    var collection=db.collection('faqs').aggregate([
        { "$match": {
            "addedusertype": { "$in":["admin",]},
            "is_active": { "$in":['1']}

        }},
        {
            $lookup : {
                from: "admin",
                localField: "addedby",
                foreignField: "username",
                as: "userdetails"
            }

        }

    ]);


    collection.toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //resp.send((items.length));

    });

    /*//resp.send(JSON.stringify(collection));
     var arr=new Array();

     console.log(collection.length+"<br/>");
     collection.forEach(function(coll) {
     //console.log("Found a coll" + JSON.stringify(coll));
     arr.push(coll);
     console.log(arr.length+"<br/>");
     });

     console.log(arr.length+"<br/>");
     //resp.send(JSON.stringify(arr));
     */

});


app.get('/dealerfaqlist', function (req, resp) {



    //collection('students')
    //console.log((req.query));
    if(typeof (req.query.dealerid!='customer')){
        var match={
            "addedusertype": { "$in":["dealer",]},
            "addedby": { "$in":[req.query.dealerid,]},

        }
    }
    else{
        var match={
            "addedusertype": { "$in":["dealer",]},
            //"addedby": { "$in":[req.param('dealerid'),]},

        }
    }
    //console.log(match);

    var collection=db.collection('faqs').aggregate([
        { "$match":match },
        {
            $lookup : {
                from: "dealers",
                localField: "addedby",
                foreignField: "username",
                as: "dealerdetails"
            }
        }

    ]);

    collection.toArray(function(err, items) {

        resp.send(JSON.stringify(items));

    });

    /*//resp.send(JSON.stringify(collection));
     var arr=new Array();

     console.log(collection.length+"<br/>");
     collection.forEach(function(coll) {
     //console.log("Found a coll" + JSON.stringify(coll));
     arr.push(coll);
     console.log(arr.length+"<br/>");
     });

     console.log(arr.length+"<br/>");
     //resp.send(JSON.stringify(arr));
     */

});




app.post('/deleteadmin', function (req, resp) {



    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('admin');
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
app.post('/deletemanagepost', function (req, resp) {



    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('managepost');
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
app.post('/deletecustomebyid', function (req, resp) {



    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('customeractivity');
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


app.post('/deleteFromInventory', function(req,resp){
    var collection = db.collection('dealerauctioninventory');
    collection.deleteOne({dealerid:req.body.dealerid,auctionid:req.body.auctionid}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //   db.close();
        }
    });

})

app.post('/deletecarfeature', function (req, resp) {



    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('carfeature');
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


app.post('/deletecarautomilage', function (req, resp) {



    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('carautomilage');
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



app.post('/deletecarlogo', function (req, resp) {



    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('carlogo');
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
app.post('/deletecarautoyear', function (req, resp) {



    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('carautoyear');
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


app.post('/deletecarbodystyle', function (req, resp) {



    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('carbodystyle');
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


app.post('/deletedealer', function (req, resp) {



    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('dealers');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            request('http://influxiq.com/projects/domainmanager/deletesubdomain.php?subdomain='+req.body.username, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var result={status:body};
                    //resp.send(JSON.stringify(result));
                    console.log(body) // Show the HTML for the Google homepage.
                }
            })
            resp.send("success");
            //   db.close();
        }
    });



});
app.post('/deleteaffiliate', function (req, resp) {



    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('affiliate');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            /*request('http://influxiq.com/projects/domainmanager/deletesubdomain.php?subdomain='+req.body.username, function (error, response, body) {
             if (!error && response.statusCode == 200) {
             var result={status:body};
             //resp.send(JSON.stringify(result));
             console.log(body) // Show the HTML for the Google homepage.
             }
             })*/
            resp.send("success");
            //   db.close();
        }
    });



});
app.post('/deleteopenchannel', function (req, resp) {



    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('openchannel');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            /*request('http://influxiq.com/projects/domainmanager/deletesubdomain.php?subdomain='+req.body.username, function (error, response, body) {
             if (!error && response.statusCode == 200) {
             var result={status:body};
             //resp.send(JSON.stringify(result));
             console.log(body) // Show the HTML for the Google homepage.
             }
             })*/
            resp.send("success");
            //   db.close();
        }
    });



});



app.post('/deletefaq', function (req, resp) {



    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('faqs');
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
app.post('/deletepurchasetime', function (req, resp) {



    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('purchasetime');
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
app.post('/deletebaseprice', function (req, resp) {



    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('baseprice');
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
app.post('/deletecolor', function (req, resp) {



    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('color');
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
app.post('/deletesharemedia', function (req, resp) {
    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('sharemedia');
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
app.post('/deletememberpackage', function (req, resp) {
    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('membershippackage');
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
app.post('/deletedealerpackage', function (req, resp) {
    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('dealermembershippackage');
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


app.post('/deleteauction',function(req,resp){
    var o_id=new mongodb.ObjectID(req.body._id);
    var collection=db.collection('auction');
    collection.deleteOne({_id:o_id},function(err,results){
        if(err){
            resp.send('failed');
            throw err;
        }
        else{
            resp.send('success');
        }
    });
});
app.post('/deletecar',function(req,resp){
    var o_id=new mongodb.ObjectID(req.body._id);
    var collection=db.collection('car');
    collection.deleteOne({_id:o_id},function(err,results){
        if(err){
            resp.send('failed');
            throw err;
        }
        else{
            resp.send('success');
        }
    });
});

app.post('/deletebannersize', function (req, resp) {
    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('bannersize');
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
app.post('/deletebanner', function (req, resp) {
    var o_id = new mongodb.ObjectID(req.body._id);

    var collection = db.collection('banner');
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
app.post('/customerstatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('customer');
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

app.post('/updateopencontract',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('opencontract');
    collection.update({_id: o_id}, {$set: {dealeridn:req.body.dealeridn,
        commissiontypen:req.body.commissiontypen,
        option_name:req.body.option_name,
        priority:req.body.priority,
        commissionn:req.body.commissionn,
        base_price:req.body.base_price,
        color_opiton:req.body.color_opiton,
        car_feature:req.body.car_feature,
        upcoming_auction:req.body.upcoming_auction,
        car_body_style:req.body.car_body_style,
        car_auto_year:req.body.car_auto_year,
        car_mileage:req.body.car_mileage}},function(err, results) {
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

app.post('/updatecarautoyear',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('carautoyear');
    collection.update({_id: o_id}, {$set: {is_active: req.body.is_active,year: req.body.year,priority: req.body.priority}},function(err, results) {
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
app.post('/updateopenchannelmanagement', function (req, resp) {
    // var added_on=Date.now();
    var is_active=0;
    if(req.body.is_active==true){
        var is_active=1;
    }
    else{
        var is_active=0;
    }
    var o_id = new mongodb.ObjectID(req.body.id);
    value1 = {channelname:req.body.channelname,dealereusername:req.body.dealereusername,is_active:is_active};

    var collection = db.collection('openchannel');

    collection.update({_id: o_id}, {$set: {channelname:req.body.channelname,dealereusername:req.body.dealereusername,is_active:is_active}},function(err, results) {
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

app.post('/updatecarautomilage',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('carautomilage');
    collection.update({_id: o_id}, {$set: {mileage:req.body.mileage,is_active: req.body.is_active,year: req.body.year,priority: req.body.priority}},function(err, results) {
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

app.post('/updatecarfeature',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('carfeature');
    collection.update({_id: o_id}, {$set: {feature:req.body.feature,is_active: req.body.is_active,priority: req.body.priority}},function(err, results) {
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



app.post('/carlogostatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('carlogo');
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

app.post('/carfeaturestatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('carfeature');
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
app.post('/managepoststatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('managepost');
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


app.post('/carautoyearstatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('carautoyear');
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
app.post('/carbodystylestatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('carbodystyle');
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
app.post('/updatecustomerimage',function (req,resp) {

    var collection = db.collection('customer');
    collection.update({username: req.body.username}, {$set: {filename: req.body.filename}},function(err, results) {
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

app.post('/updateallcustomerfield1',function (req,resp) {

    var collection = db.collection('customer');
    collection.update({}, {$set: {finance_check: 0}}, {multi: true});

    /*collection.update({}, {$set: {finance_check: 0}},function(err, results) {
     if (err){
     resp.send("failed");
     throw err;
     }
     else {
     resp.send("success");
     // db.close();

     }
     });*/


});
app.post('/updatealldealerfield',function (req,resp) {

    var collection = db.collection('dealers');
    /*  var randomstring='';
     collection.update({username:req.body.dealerusername}, {$set: {randomstring: randomstring}}, {multi: true});*/

    collection.update({}, {$set: {finance_check: 0}},function(err, results) {
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
app.post('/updateallcustomerfield',function (req,resp) {

    var collection = db.collection('customer');
    var randomstring='';
    collection.update({}, {$set: {randomstring: randomstring}}, {multi: true});

    /*collection.update({}, {$set: {finance_check: 0}},function(err, results) {
     if (err){
     resp.send("failed");
     throw err;
     }
     else {
     resp.send("success");
     // db.close();

     }
     });*/


});

app.post('/financestatuschangeofcustomer',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('customer');
    collection.update({_id: o_id}, {$set: {finance_check: req.body.finance_check}},function(err, results) {
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


app.post('/purchasetimestatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('purchasetime');
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
app.post('/basepricestatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('baseprice');
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
app.post('/membershiporderstatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('dealermembershippackage');
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
app.post('/colorstatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('color');
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


app.post('/dealerstatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('dealers');
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
app.post('/affiliatestatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('affiliate');
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
app.post('/openchannelstatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('openchannel');
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
app.post('/bannerstatuschange',function (req,resp) {

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('banner');
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
app.post('/packagestatuschange', function(req,resp){
    var o_id = new mongodb.ObjectID(req.body.id);
    var collection=db.collection('membershippackage');
    collection.update({_id:o_id},{$set: {is_active:req.body.is_active}},function(err,result){
        if(err){
            resp.send("failed");throw err;
        }
        else{
            resp.send("success");
        }
    });

});
app.post('/auctionstatuschange',function(req,resp){
    var o_id=new mongodb.ObjectID(req.body.id);
    var collection = db.collection('auction');
    collection.update({_id:o_id},{$set :{is_active:req.body.is_active}},function(err,results){
        if(err){
            resp.send('failed');
        }
        else{
            resp.send('success');
        }
    });
});
app.post('/carstatuschange',function(req,resp){
    var o_id=new mongodb.ObjectID(req.body.id);
    var collection = db.collection('car');
    collection.update({_id:o_id},{$set :{is_active:req.body.is_active}},function(err,results){
        if(err){
            resp.send('failed');
        }
        else{
            resp.send('success');
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

    var added_on=Date.now();
    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');
    if(req.body.term==true){
        var term=1;
    }
    else {
        var term=0;
    }
    var randomstring='';

    var items='';
    value1 = {fname: req.body.fname,lname: req.body.lname, phone: req.body.phone,zip: req.body.zip,dealerusername:req.body.dealerusername,username:req.body.username,password:hash,is_lead:1,term:term,email:req.body.email,added_on:added_on,finance_check:0,randomstring:randomstring,affiliateid:req.body.affiliateid};

    var collection = db.collection('customer');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {

            mailsend('customersignup',req.body.email,added_on,items,'','');
            /*var smtpTransport = mailer.createTransport("SMTP", {
             service: "Gmail",
             auth: {
             user: "itplcc40@gmail.com",
             pass: "DevelP7@"
             }
             });

             var mail = {
             from: "Admin <samsujdev@gmail.com>",
             to: req.body.email,
             subject: "THANK YOU FOR SIGNING UP WITH PROBIDAUTO.COM ",
             //text: "Node.js New world for me",
             html: html
             }

             smtpTransport.sendMail(mail, function (error, response) {
             // resp.send((response.message));
             smtpTransport.close();
             });*/
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});
app.post('/mailtocustomerforfreesignup', function (req, resp) {

    var added_on=Date.now();


    var items=req.body.fname;
    value1 = {randomstring: req.body.randomstring};

    var collection = db.collection('customer');

    collection.update({username: req.body.customerusername}, {$set: {randomstring: req.body.randomstring}},function(err, results) {
        if (err) {
            resp.send(err);
        } else {

            mailsend('customerfreesignup',req.body.email,added_on,items,req.body.username,req.body.randomstring);

            resp.send('success');

        }
    });

});


app.post('/addcarlogo', function (req, resp) {


    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }

    value1 = {name: req.body.name,logo: req.body.logo,is_active: is_active,priority: req.body.priority};

    var collection = db.collection('carlogo');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});

app.post('/addcarfeature', function (req, resp) {


    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }

    value1 = {feature: req.body.feature,logo: req.body.logo,is_active: is_active,priority: req.body.priority};

    var collection = db.collection('carfeature');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});

app.post('/addcarautoyear', function (req, resp) {


    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }

    value1 = {year: req.body.year,is_active: is_active,priority: parseInt(req.body.priority)};

    var collection = db.collection('carautoyear');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});

app.post('/addcarautomileage', function (req, resp) {


    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }

    value1 = {year: req.body.year,mileage: req.body.mileage,is_active: is_active,priority: parseInt(req.body.priority)};

    var collection = db.collection('carautomilage');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});


app.post('/addcarbodystyle', function (req, resp) {


    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }

    value1 = {name: req.body.name,logo: req.body.logo,is_active: is_active,priority: req.body.priority};

    var collection = db.collection('carbodystyle');

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
    collection.update({username: req.body.username}, {$set: {address:req.body.address,state:req.body.state,city:req.body.city,fname:req.body.fname,lname:req.body.lname,phone:req.body.phone,zip:req.body.zip,is_lead:0,email:req.body.email}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            var added_on=Date.now();
            var activity_content='Customer '+req.body.fname+' '+req.body.lname+' has successfully signed up';
            var activity_type=1;
            value4={dealerid:req.body.dealerusername,customerid:req.body.username,activity_content:activity_content,activity_type:activity_type,added_on:added_on}
            var collection4=db.collection('customeractivity');
            collection4.insert([value4], function (err4, result4) {
                if (err4) {
                    resp.send(err4);
                } else {
                    collection.find({username: req.body.username}).toArray(function(err, items) {

                        console.log(items[0].email);
                        //resp.send(JSON.stringify(req.body.id));
                        mailsend('customercreditcard',items[0].email,items[0].added_on,items,'',items[0]._id);
                        //db.close();
                        ///dbresults.push(items);
                    });

                }
            });



            resp.send("success");
            //db.close();

        }
    });

});

app.post('/updatecustomerfree',function (req,resp) {

    var added_on=Date.now();
    var collection = db.collection('customer');
    collection.update({username: req.body.username}, {$set: {address:req.body.address,state:req.body.state,city:req.body.city,fname:req.body.fname,lname:req.body.lname,phone:req.body.phone,zip:req.body.zip,is_lead:0,email:req.body.email,added_on:added_on}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {

            var added_on = Date.now();
            var activity_content ='Cuatomer '+req.body.fname + ' ' + req.body.lname + ' has successfully signed up';
            var activity_type = 1;
            value4 = {
                dealerid: req.body.dealerusername,
                customerid: req.body.username,
                activity_content: activity_content,
                activity_type: activity_type,
                added_on: added_on
            }
            var collection4 = db.collection('customeractivity');
            collection4.insert([value4], function (err4, result4) {
                if (err4) {
                    resp.send(err4);
                } else {


                    collection.find({username: req.body.username}).toArray(function (err, items) {

                        console.log(items[0].email);
                        var collection1 = db.collection('dealers');
                        collection1.find({username: req.body.dealerusername}).toArray(function (err1, items1) {


                            var free_member = parseInt(parseInt(items1[0].free_member) - 1);
                            console.log(free_member);

                            collection1.update({username: req.body.dealerusername}, {$set: {free_member: free_member}}, function (err11, results) {
                                if (err11) {
                                    resp.send("failed");
                                    throw err11;
                                }
                                else {

                                    mailsend('freecustomercreditcard', items[0].email, added_on, items, '', items[0]._id);


                                    resp.send("success");
                                    //db.close();

                                }

                            });

                        });


                        // resp.send(JSON.stringify('success'));


                        //db.close();
                        ///dbresults.push(items);
                    });


                    //db.close();


                }


            });
        }



    });

});

app.post('/updatecarlogo',function (req,resp) {


    var collection = db.collection('carlogo');
    var o_id = new mongodb.ObjectID(req.body.id);
    collection.update({_id: o_id}, {$set: {name:req.body.name,logo:req.body.logo,is_active:req.body.is_active,priority:req.body.priority}},function(err, results) {
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

app.post('/modifyretailscommission',function (req,resp) {


    var collection = db.collection('retailcommission');

    collection.find({dealerid: req.body.dealerid}).toArray(function(err, items) {

        if(items.length>0){
            collection.update({dealerid: req.body.dealerid}, {$set: {commissiontype:req.body.commissiontype,commission:req.body.commission}},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else {
                    resp.send("success");
                    //db.close();

                }
            });
        }
        else{
            value1 = {dealerid: req.body.dealerid,commissiontype: req.body.commissiontype, commission: req.body.commission};
            collection.insert([value1], function (err, result) {
                if (err) {
                    resp.send(err);
                } else {
                    resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

                }
            });



        }
        //resp.send(JSON.stringify(req.body.id));
        //db.close();
        ///dbresults.push(items);
    });






});
app.post('/getretailcommissionlist',function (req,resp) {


    var collection = db.collection('retailcommission');

    collection.find({dealerid: req.body.dealerid}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //db.close();
        ///dbresults.push(items);
    });






});



app.post('/updatecar',function (req,resp) {
    if(req.body.is_active==true){
        var is_active=1;
    }
    else {
        var is_active=0;
    }

    var collection = db.collection('car');
    var o_id = new mongodb.ObjectID(req.body.id);
    collection.update({_id: o_id}, {$set: {doctype:req.body.doctype,
        est_retail_value:req.body.est_retail_value,
        vin:req.body.vin,
        color:req.body.color,
        drive:req.body.drive,
        fuel:req.body.fuel,
        notes:req.body.notes,
        cylinder:req.body.cylinder,
        carlogolist:req.body.carlogolist,
        model:req.body.model,
        carautoyearlist:req.body.carautoyearlist,
        mileage:req.body.mileage,
        enginetype:req.body.enginetype,
        carbodystylelist:req.body.carbodystylelist,
        power_locks:req.body.power_locks,
        power_window:req.body.power_window,
        sunroof:req.body.sunroof,
        digital_display:req.body.digital_display,
        stereo_system:req.body.stereo_system,
        bluetooth:req.body.bluetooth,
        dvd_player:req.body.dvd_player,
        gps:req.body.gps,
        airbags:req.body.airbags,
        seats:req.body.seats,
        satellite_radio:req.body.satellite_radio,
        lights:req.body.lights,
        gear_type:req.body.gear_type,
        trinted_window:req.body.trinted_window,
        basepricerange:req.body.basepricerange,
        feature:req.body.feature,
        auctionid:req.body.auctionid,
        filename:req.body.filename,
        additionalfilename:req.body.additionalfilename,
        priority:req.body.priority,
        is_active:is_active}},function(err, results) {
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


app.post('/updatecarbodystyle',function (req,resp) {


    var collection = db.collection('carbodystyle');
    var o_id = new mongodb.ObjectID(req.body.id);
    collection.update({_id: o_id}, {$set: {name:req.body.name,logo:req.body.logo,is_active:req.body.is_active,priority:req.body.priority}},function(err, results) {
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


app.post('/updatecustomer2',function (req,resp) {
    if(req.body.term==true){
        var term=1;
    }
    else {
        var term=0;
    }
    var collection = db.collection('customer');
    collection.update({username: req.body.username}, {$set: {address:req.body.address,state:req.body.state,city:req.body.city,fname:req.body.fname,lname:req.body.lname,phone:req.body.phone,zip:req.body.zip,addressline2:req.body.addressline2,alt_phone:req.body.alt_phone,company_name:req.body.company_name,term:term,email:req.body.email}},function(err, results) {
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

app.post('/updatecustomerformobile',function (req,resp) {
    var rv = {};
    console.log(req.body.username);
    console.log(req.body.arg);
    for (x in req.body.arg) {
        rv[x] = req.body.arg[x];
    }
    //return rv;
    console.log(rv);
    var collection = db.collection('customer');
    collection.update({username: req.body.username}, {$set: rv},function(err, results) {
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
app.post('/updatecustomerprefference',function (req,resp) {

    if(req.body.term==true){
        var term=1;
    }
    else {
        var term=0;
    }

    var collection = db.collection('customer');
    collection.update({username: req.body.username}, {$set: {fname:req.body.fname,lname:req.body.lname,email:req.body.email,phone:req.body.phone,address:req.body.address,addressline2:req.body.addressline2,city:req.body.city,zip:req.body.city,company_name:req.body.company_name,alt_phone:req.body.alt_phone,state:req.body.state,term:term,send_mail:req.body.send_mail,retail_calculator:req.body.retail_calculator,purchase_time:req.body.purchase_time,base_price:req.body.base_price,color_opiton:req.body.color_opiton,upcoming_auction:req.body.upcoming_auction,car_body_style:req.body.car_body_style,car_auto_year:req.body.car_auto_year,car_mileage:req.body.car_mileage,car_feature:req.body.car_feature}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {

            collection.find({username: req.body.username}).toArray(function(err, items) {

                console.log(items[0].email);
                //resp.send(JSON.stringify(req.body.id));
                // mailsend('retailcustomerconnect',items[0].email,items[0].added_on,items,'','');
                //db.close();
                ///dbresults.push(items);
            });




            resp.send("success");
            //db.close();

        }
    });

});

app.post('/updatecustomer22',function (req,resp) {

    var collection = db.collection('customer');
    collection.update({username: req.body.username}, {$set: {send_mail:req.body.send_mail,retail_calculator:req.body.retail_calculator,purchase_time:req.body.purchase_time,base_price:req.body.base_price,color_opiton:req.body.color_opiton,upcoming_auction:req.body.upcoming_auction,car_body_style:req.body.car_body_style,car_auto_year:req.body.car_auto_year,car_mileage:req.body.car_mileage,car_feature:req.body.car_feature}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {



            collection.find({username: req.body.username}).toArray(function (err, items) {

                console.log(items[0].email);
                //resp.send(JSON.stringify(req.body.id));
                var added_on=Date.now();
                var activity_content='Customer '+items[0].fname+' '+items[0].lname+' has added preferences';

                var activity_type=2;
                value4={dealerid:req.body.dealerusername,customerid:items[0].username,activity_content:activity_content,activity_type:activity_type,added_on:added_on}
                var collection4=db.collection('customeractivity');
                collection4.insert([value4], function (err4, result4) {
                    if (err4) {
                        resp.send(err4);
                    } else {

                        mailsend('retailcustomerconnect', items[0].email, items[0].added_on, items, '', '');
                    }
                });

                //db.close();
                ///dbresults.push(items);
            });





            resp.send("success");
            //db.close();

        }
    });

});
app.post('/updatecustomerfinance',function (req,resp) {
    if(req.body.term==true){
        var term=1;
    }
    else {
        var term=0;
    }
    var application_info_check=0;
    if(req.body.application_info_check==true){
        var application_info_check=1;
    }
    else {
        var application_info_check=0;
    }

    var loan_check=0
    if(req.body.loan_check==true){
        var loan_check=1;
    }
    else {
        var loan_check=0;
    }
    if(req.body.previousresidence_check==true){
        var previousresidence_check=1;
    }
    else {
        var previousresidence_check=0;
    }
    if(req.body.mailingaddress_check==true){
        var mailingaddress_check=1;
    }
    else {
        var mailingaddress_check=0;
    }
    if(req.body.previousemployment_check==true){
        var previousemployment_check=1;
    }
    else {
        var previousemployment_check=0;
    }


    var collection = db.collection('customer');
    collection.update({username: req.body.username}, {$set: {fname:req.body.fname,
        mname:req.body.mname,
        lname:req.body.lname,
        email:req.body.email,
        phone:req.body.phone,
        fax:req.body.fax,
        dob:req.body.dob,
        mother_maiden_name:req.body.mother_maiden_name,
        social_security:req.body.social_security,
        address:req.body.address,
        addressline2:req.body.addressline2,
        city:req.body.city,
        state:req.body.state,
        zip:req.body.zip,
        previousresidence_check:previousresidence_check,
        primary_residence_year:req.body.primary_residence_year,
        primary_residence_month:req.body.primary_residence_month,
        primary_residence_type:req.body.primary_residence_type,
        primary_residence_monthly_payment:req.body.primary_residence_monthly_payment,
        primary_year_homeowner:req.body.primary_year_homeowner,
        previous_address:req.body.previous_address,
        previous_addressline2:req.body.previous_addressline2,
        previous_residence_year:req.body.previous_residence_year,
        previous_residence_month:req.body.previous_residence_month,
        previous_zip:req.body.previous_zip,
        previous_state:req.body.previous_state,
        previous_city:req.body.previous_city,
        mailingaddress_check:mailingaddress_check,
        mailing_address:req.body.mailing_address,
        mailing_addressline2:req.body.mailing_addressline2,
        mailing_state:req.body.mailing_state,
        mailing_city:req.body.mailing_city,
        mailing_zip:req.body.mailing_zip,
        occupation:req.body.occupation,
        employer:req.body.employer,
        payment_type:req.body.payment_type,
        hire_date:req.body.hire_date,
        work_phone:req.body.work_phone,
        self_employed:req.body.self_employed,
        gross_monthly_income:req.body.gross_monthly_income,
        employment_year:req.body.employment_year,
        employment_month:req.body.employment_month,
        employment_address:req.body.employment_address,
        employment_addressline2:req.body.employment_addressline2,
        employment_city:req.body.employment_city,
        employment_state:req.body.employment_state,
        employment_zip:req.body.employment_zip,
        previousemployment_check:previousemployment_check,
        previous_employer:req.body.previous_employer,
        previous_employment_year:req.body.previous_employment_year,
        previous_employment_month:req.body.previous_employment_month,
        previous_employment_address:req.body.previous_employment_address,
        previous_employment_addressline2:req.body.previous_employment_addressline2,
        previous_employment_city:req.body.previous_employment_city,
        previous_employment_state:req.body.previous_employment_state,
        previous_employment_zip:req.body.previous_employment_zip,
        other_monthly_income:req.body.other_monthly_income,
        checking_account:req.body.checking_account,
        checking_account_balance:req.body.checking_account_balance,
        saving_account:req.body.saving_account,
        saving_account_balnace:req.body.saving_account_balnace,
        other_bank_name:req.body.other_bank_name,
        other_income_source:req.body.other_income_source,
        other_liquid_asset:req.body.other_liquid_asset,
        other_liquid_asset_source:req.body.other_liquid_asset_source,
        application_info_check:application_info_check,
        co_applicant:req.body.co_applicant,
        vehicle_trade:req.body.vehicle_trade,
        loan_check:loan_check,
        listing_id:req.body.listing_id,
        location_id:req.body.location_id,
        license_number:req.body.license_number,
        //vin:req.body.vin,
        // mileage:req.body.mileage,
        // make:req.body.make,
        //model:req.body.model,
        // model_year:req.body.model_year,
        loan_down_payment:req.body.loan_down_payment,
        loan_vehicle_cost:req.body.loan_vehicle_cost,
        loan_payment_amount:req.body.loan_payment_amount,
        loan_repayment_term:req.body.loan_repayment_term,
        loan_month:req.body.loan_month,
        comment:req.body.comment}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            collection.find({username: req.body.username}).toArray(function(err, items) {

                console.log(items[0].email);
                //resp.send(JSON.stringify(req.body.id));
                mailsend('finance',items[0].email,items[0].added_on,items,'','');
                //db.close();
                ///dbresults.push(items);
            });


            resp.send("success");
            //db.close();

        }
    });

});
app.post('/updatecustomerstep3',function (req,resp) {
    if(req.body.term==true){
        var term=1;
    }
    else {
        var term=0;
    }
    var application_info_check=0;
    if(req.body.application_info_check==true){
        var application_info_check=1;
    }
    else {
        var application_info_check=0;
    }

    var loan_check=0
    if(req.body.loan_check==true){
        var loan_check=1;
    }
    else {
        var loan_check=0;
    }
    if(req.body.previousresidence_check==true){
        var previousresidence_check=1;
    }
    else {
        var previousresidence_check=0;
    }
    if(req.body.mailingaddress_check==true){
        var mailingaddress_check=1;
    }
    else {
        var mailingaddress_check=0;
    }
    if(req.body.previousemployment_check==true){
        var previousemployment_check=1;
    }
    else {
        var previousemployment_check=0;
    }


    var collection = db.collection('customer');
    collection.update({username: req.body.username}, {$set: {fname:req.body.fname,
        mname:req.body.mname,
        lname:req.body.lname,
        email:req.body.email,
        phone:req.body.phone,
        fax:req.body.fax,
        dob:req.body.dob,
        mother_maiden_name:req.body.mother_maiden_name,
        social_security:req.body.social_security,
        address:req.body.address,
        addressline2:req.body.addressline2,
        city:req.body.city,
        state:req.body.state,
        zip:req.body.zip,
        previousresidence_check:previousresidence_check,
        primary_residence_year:req.body.primary_residence_year,
        primary_residence_month:req.body.primary_residence_month,
        primary_residence_type:req.body.primary_residence_type,
        primary_residence_monthly_payment:req.body.primary_residence_monthly_payment,
        primary_year_homeowner:req.body.primary_year_homeowner,
        previous_address:req.body.previous_address,
        previous_addressline2:req.body.previous_addressline2,
        previous_residence_year:req.body.previous_residence_year,
        previous_residence_month:req.body.previous_residence_month,
        previous_zip:req.body.previous_zip,
        previous_state:req.body.previous_state,
        previous_city:req.body.previous_city,
        mailingaddress_check:mailingaddress_check,
        mailing_address:req.body.mailing_address,
        mailing_addressline2:req.body.mailing_addressline2,
        mailing_state:req.body.mailing_state,
        mailing_city:req.body.mailing_city,
        mailing_zip:req.body.mailing_zip,
        occupation:req.body.occupation,
        employer:req.body.employer,
        payment_type:req.body.payment_type,
        hire_date:req.body.hire_date,
        work_phone:req.body.work_phone,
        self_employed:req.body.self_employed,
        gross_monthly_income:req.body.gross_monthly_income,
        employment_year:req.body.employment_year,
        employment_month:req.body.employment_month,
        employment_address:req.body.employment_address,
        employment_addressline2:req.body.employment_addressline2,
        employment_city:req.body.employment_city,
        employment_state:req.body.employment_state,
        employment_zip:req.body.employment_zip,
        previousemployment_check:previousemployment_check,
        previous_employer:req.body.previous_employer,
        previous_employment_year:req.body.previous_employment_year,
        previous_employment_month:req.body.previous_employment_month,
        previous_employment_address:req.body.previous_employment_address,
        previous_employment_addressline2:req.body.previous_employment_addressline2,
        previous_employment_city:req.body.previous_employment_city,
        previous_employment_state:req.body.previous_employment_state,
        previous_employment_zip:req.body.previous_employment_zip,
        other_monthly_income:req.body.other_monthly_income,
        checking_account:req.body.checking_account,
        checking_account_balance:req.body.checking_account_balance,
        saving_account:req.body.saving_account,
        saving_account_balnace:req.body.saving_account_balnace,
        other_bank_name:req.body.other_bank_name,
        other_income_source:req.body.other_income_source,
        other_liquid_asset:req.body.other_liquid_asset,
        other_liquid_asset_source:req.body.other_liquid_asset_source,
        application_info_check:application_info_check,
        co_applicant:req.body.co_applicant,
        vehicle_trade:req.body.vehicle_trade,
        loan_check:loan_check,
        listing_id:req.body.listing_id,
        location_id:req.body.location_id,
        license_number:req.body.license_number,
        //vin:req.body.vin,
        // mileage:req.body.mileage,
        // make:req.body.make,
        //model:req.body.model,
        // model_year:req.body.model_year,
        loan_down_payment:req.body.loan_down_payment,
        loan_vehicle_cost:req.body.loan_vehicle_cost,
        loan_payment_amount:req.body.loan_payment_amount,
        loan_repayment_term:req.body.loan_repayment_term,
        loan_month:req.body.loan_month,
        comment:req.body.comment}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            var added_on=Date.now();
            var activity_content='Customer '+req.body.fname+' '+req.body.lname+' has added finance details';
            var activity_type=3;
            value4={dealerid:req.body.dealerusername,customerid:req.body.username,activity_content:activity_content,activity_type:activity_type,added_on:added_on}
            var collection4=db.collection('customeractivity');
            collection4.insert([value4], function (err4, result4) {
                if (err4) {
                    resp.send(err4);
                } else {

                    collection.find({username: req.body.username}).toArray(function (err, items) {

                        console.log(items[0].email);
                        //resp.send(JSON.stringify(req.body.id));
                        mailsend('finance', items[0].email, items[0].added_on, items, '', '');
                        //db.close();
                        ///dbresults.push(items);
                    });

                }
            });

            resp.send("success");
            //db.close();

        }
    });

});

//let link = this.serverUrl+'adminlist';

app.get('/listexpert', function (req, resp) {

    console.log('00---00');
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


app.get('/listcarautomileage', function (req, resp) {


    var collection = db.collection('carautomilage');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});

app.get('/listcarfeature', function (req, resp) {


    var collection = db.collection('carfeature');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
    });

});


app.post('/usercheck',function(req,resp){
    var collection=db.collection('dealers');
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
app.post('/affiliatelogin',function(req,resp){
    var collection=db.collection('affiliate');
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
app.post('/customercheck',function(req,resp){
    var collection=db.collection('customer');
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
app.get('/customercheckformobile',function(req,resp){
    var collection=db.collection('customer');
    var crypto = require('crypto');

    var secret = req.query.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    collection.find({username:req.query.username,password:hash}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //db.close();
        ///dbresults.push(items);
    });
})
app.get('/getrsvplistbydealerid',function(req,resp){
    /*var collection=db.collection('rsvp');


     collection.find({dealerid: req.body.dealerid}).toArray(function(err, items) {

     resp.send(JSON.stringify(items));

     });*/


    var collection=db.collection('rsvp').aggregate([

        //{$unwind:"$auctionid"},
        //{ $match : { is_active : 1 } },
        { $match : { "dealerid" : req.query.dealerid  } },

        {
            $lookup : {
                from: "car",
                localField: "inventoryid",
                foreignField: "mongoose.Types.ObjectId(_id)",
                as: "cardata"
            },

        },
        /*{
         $match: { "cardata": { $ne: [] }, "dealerid" : req.query.dealerid }
         }*/
        {
            $lookup : {
                from: "customer",
                localField: "customerusername",
                foreignField: "username",
                as: "userdata"
            },

        }


    ]);

    collection.toArray(function(err, items) {

        resp.send(JSON.stringify(items));

    });


})
app.post('/dealercheck',function(req,resp){
    var collection=db.collection('dealers');

    collection.find({username:req.body.username}).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //db.close();
        ///dbresults.push(items);
    });
})


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

function mailsend(type,email,added_on,items,values,invoice){
    //  mailsend('rsvpsend',req.body.customeremail,added_on,req.body.carinfo,req.body.dealername,'');
    var from= 'Admin <samsujdev@gmail.com>';
    if(type=='customerrsvpsend'){
        // from=items+' <'+values.customeremail+'>';
        var link1='http://probidtech.influxiq.com/#/customerlogin';
        var carimg="http://probidbackend.influxiq.com/uploadedfiles/sharelinks/"+values.filename
        //console.log('bvbbbbv');
        var subject=items+' has commited to your rsvp';
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
       <html xmlns="http://www.w3.org/1999/xhtml">\
       <head>\
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
        <title>Mail Page 3</title>\
    </head>\
    <body>\
       <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
       <div style="width:620px;">\
       <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; ">\
       <table width="100%" border="0">\
        <tr>\
        <td align="left" valign="top"><img src="http://probiddealer.influxiq.com/images/logo1.png"  alt="#" style="margin:10px;"/></td>\
        <td align="right" valign="middle"  ><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong  style="color:#fb4a32;"> Date:</strong>'+timeConverter(added_on)+' </span></td>\
    </tr>\
    </table>\
       <div style="width:100%; background:#f9f0e1; border:solid 1px #dbd2c4; margin:5px 0 15px 0; height:40px;">\
        <div style="width:40%; background:#96ff00; height:40px; text-align:center; font-family:Arial, Helvetica, sans-serif; line-height:40px; color:#333; font-size:12px;">29%</div>\
        </div>\
       <img src='+carimg+'  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
       <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#111; margin:15px 0;">\
       <tr>\
       <th align="left" valign="middle" width="50%" style="background:#fb4a32; color:#fff; font-weight:normal; font-size:16px; padding:15px 10px;" >Details </span></th>\
        <th align="right" valign="middle"  width="50%" style="background:#fb4a32; color:#fff; font-weight:normal; font-size:16px; border-left:solid 1px #f9f0e1; padding:15px 10px;">Glossary </span></th>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Make: </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">'+values.make+'</td>\
        </tr>\
        <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Model:   </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">'+values.model+'</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Color:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> '+values.color+'  </td>\
        </tr>\
         <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Mileage:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">'+values.mileage+'</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Est. Retail Value:  </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">'+values.est_retail_value+'</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Year:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> '+values.year+'</td>\
    </tr>\
  </table>\
       <h2 style="background:#fb4a32; margin:0; padding:10px; text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:20px; color:#eee1cb; text-transform:uppercase; font-weight:normal;"><a href="javascript:void(0)" style="font-style:italic; color:#eca463; font-weight:bold; text-decoration:none;">Click Here</a> to get more details about this car.</h2>\
       <h2 style="margin:15px 0 0 0; padding:15px; font-family:Arial, Helvetica, sans-serif; text-align:center; font-weight:normal; font-size:16px; color:#333;"> Please login to your account to learn more about the car and other options.</h2>\
       <a href='+link1+' style="font-style:italic; color:#fff; background:#fb4a32; padding:8px 10px; text-decoration:none; font-family:Arial, Helvetica, sans-serif; display:block; width:100px; margin:0 auto; text-align:center; margin-bottom:20px; text-transform:uppercase; font-weight:bold;">Login</a>\
       </div>\
       <div style="width:100%; padding:10px;">\
       <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#9c9c9c; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
       <div style="display:block; width:100%; text-align:center;">\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
        </div>\
       <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#9c9c9c; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
       </div>\
       </div>\
       </div>\
       </body>\
    </html>';
    }
    if(type=='customerrsvpsenduncommit'){
        // from=items+' <'+values.customeremail+'>';
        var link1='http://probidtech.influxiq.com/#/customerlogin';
        var carimg="http://probidbackend.influxiq.com/uploadedfiles/sharelinks/"+values.filename
        //console.log('bvbbbbv');
        var subject=items+' has declined your rsvp';
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
       <html xmlns="http://www.w3.org/1999/xhtml">\
       <head>\
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
        <title>Mail Page 3</title>\
    </head>\
    <body>\
       <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
       <div style="width:620px;">\
       <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; ">\
       <table width="100%" border="0">\
        <tr>\
        <td align="left" valign="top"><img src="http://probiddealer.influxiq.com/images/logo1.png"  alt="#" style="margin:10px;"/></td>\
        <td align="right" valign="middle"  ><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong  style="color:#fb4a32;"> Date:</strong>'+timeConverter(added_on)+' </span></td>\
    </tr>\
    </table>\
       <div style="width:100%; background:#f9f0e1; border:solid 1px #dbd2c4; margin:5px 0 15px 0; height:40px;">\
        <div style="width:40%; background:#96ff00; height:40px; text-align:center; font-family:Arial, Helvetica, sans-serif; line-height:40px; color:#333; font-size:12px;">29%</div>\
        </div>\
       <img src='+carimg+'  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
       <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#111; margin:15px 0;">\
       <tr>\
       <th align="left" valign="middle" width="50%" style="background:#fb4a32; color:#fff; font-weight:normal; font-size:16px; padding:15px 10px;" >Details </span></th>\
        <th align="right" valign="middle"  width="50%" style="background:#fb4a32; color:#fff; font-weight:normal; font-size:16px; border-left:solid 1px #f9f0e1; padding:15px 10px;">Glossary </span></th>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Make: </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">'+values.make+'</td>\
        </tr>\
        <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Model:   </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">'+values.model+'</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Color:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> '+values.color+'  </td>\
        </tr>\
         <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Mileage:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">'+values.mileage+'</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Est. Retail Value:  </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">'+values.est_retail_value+'</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Year:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> '+values.year+'</td>\
    </tr>\
  </table>\
       <h2 style="background:#fb4a32; margin:0; padding:10px; text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:20px; color:#eee1cb; text-transform:uppercase; font-weight:normal;"><a href="javascript:void(0)" style="font-style:italic; color:#eca463; font-weight:bold; text-decoration:none;">Click Here</a> to get more details about this car.</h2>\
       <h2 style="margin:15px 0 0 0; padding:15px; font-family:Arial, Helvetica, sans-serif; text-align:center; font-weight:normal; font-size:16px; color:#333;"> Please login to your account to learn more about the car and other options.</h2>\
       <a href='+link1+' style="font-style:italic; color:#fff; background:#fb4a32; padding:8px 10px; text-decoration:none; font-family:Arial, Helvetica, sans-serif; display:block; width:100px; margin:0 auto; text-align:center; margin-bottom:20px; text-transform:uppercase; font-weight:bold;">Login</a>\
       </div>\
       <div style="width:100%; padding:10px;">\
       <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#9c9c9c; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
       <div style="display:block; width:100%; text-align:center;">\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
        </div>\
       <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#9c9c9c; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
       </div>\
       </div>\
       </div>\
       </body>\
    </html>';
    }
    if(type=='rsvpsend'){
        var link1='http://probidtech.influxiq.com/#/customerlogin';
        var carimg="http://probidbackend.influxiq.com/uploadedfiles/sharelinks/"+values.filename
        //console.log('bvbbbbv');
        var subject=items+' has sent a new car for you to check out';
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
       <html xmlns="http://www.w3.org/1999/xhtml">\
       <head>\
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
        <title>Mail Page 3</title>\
    </head>\
    <body>\
       <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
       <div style="width:620px;">\
       <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; ">\
       <table width="100%" border="0">\
        <tr>\
        <td align="left" valign="top"><img src="http://probiddealer.influxiq.com/images/logo1.png"  alt="#" style="margin:10px;"/></td>\
        <td align="right" valign="middle"  ><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong  style="color:#fb4a32;"> Date:</strong>'+timeConverter(added_on)+' </span></td>\
    </tr>\
    </table>\
       <div style="width:100%; background:#f9f0e1; border:solid 1px #dbd2c4; margin:5px 0 15px 0; height:40px;">\
        <div style="width:40%; background:#96ff00; height:40px; text-align:center; font-family:Arial, Helvetica, sans-serif; line-height:40px; color:#333; font-size:12px;">'+invoice+'%</div>\
        </div>\
       <img src='+carimg+'  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
       <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#111; margin:15px 0;">\
       <tr>\
       <th align="left" valign="middle" width="50%" style="background:#fb4a32; color:#fff; font-weight:normal; font-size:16px; padding:15px 10px;" >Details </span></th>\
        <th align="right" valign="middle"  width="50%" style="background:#fb4a32; color:#fff; font-weight:normal; font-size:16px; border-left:solid 1px #f9f0e1; padding:15px 10px;">Glossary </span></th>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Doc Type: </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">'+values.doctype+'</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Make: </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">'+values.make+'</td>\
        </tr>\
        <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Model:   </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">'+values.model+'</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Color:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> '+values.color+'  </td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Body Style:  </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">'+values.bodystyle+'</td>\
        </tr>\
         <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Mileage:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">'+values.mileage+'</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Est. Retail Value:  </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">'+values.est_retail_value+'</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">VIN:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> '+values.vin+'</td>\
    </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Engine Type:        </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">'+values.enginetype+'</td>\
    </tr>\
       <tr>\
    <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Drive:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> '+values.drive+'</td>\
    </tr>\
       <tr>\
    <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Cylinder:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> '+values.cylinder+'</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Fuel:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> '+values.fuel+'</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Gear Type:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">   '+values.gear_type+'</td>\
        </tr>\
            </table>\
       <h2 style="background:#fb4a32; margin:0; padding:10px; text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:20px; color:#eee1cb; text-transform:uppercase; font-weight:normal;"><a href="javascript:void(0)" style="font-style:italic; color:#eca463; font-weight:bold; text-decoration:none;">Click Here</a> to get more details about this car.</h2>\
       <h2 style="margin:15px 0 0 0; padding:15px; font-family:Arial, Helvetica, sans-serif; text-align:center; font-weight:normal; font-size:16px; color:#333;"> Please login to your account to learn more about the car and other options.</h2>\
       <a href='+link1+' style="font-style:italic; color:#fff; background:#fb4a32; padding:8px 10px; text-decoration:none; font-family:Arial, Helvetica, sans-serif; display:block; width:100px; margin:0 auto; text-align:center; margin-bottom:20px; text-transform:uppercase; font-weight:bold;">Login</a>\
       </div>\
       <div style="width:100%; padding:10px;">\
       <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#9c9c9c; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
       <div style="display:block; width:100%; text-align:center;">\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
        </div>\
       <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#9c9c9c; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
       </div>\
       </div>\
       </div>\
       </body>\
    </html>';
    }

    if(type=='adminsendjobticket'){
        var link1='http://probiddealer.influxiq.com/#/dealerlogin';
        //console.log('bvbbbbv');
        var subject='Job Ticket Id : '+added_on+' With Subject : '+values+' Updated';
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
                <html xmlns="http://www.w3.org/1999/xhtml">\
                <head>\
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
                </head>\
                <body>\
                '+invoice+'<br/>\
                  <a  href='+link1+'>Click Here to go Login and Reply</a>\
                 </body>\
            </html>';
    }
    if(type=='customersignup'){
        var subject="THANK YOU FOR SIGNING UP WITH PROBIDAUTO.COM";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
                <html xmlns="http://www.w3.org/1999/xhtml">\
                <head>\
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
                <title>Customer Signup</title>\
            </head>\
                <body>\
                <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
                <div style="width:620px;">\
                <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
                <table width="100%" border="0">\
               <tr>\
                <td align="left" valign="top"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" style="margin:10px;"/></td>\
                <td align="right" valign="middle"><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong style="color:#fb4a32;">Date:</strong> '+timeConverter(added_on)+'</span></td>\
           </tr>\
            </table>\
                <img src="http://probiddealer.influxiq.com/images/customersignupstep1.jpg"  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:26px; line-height:30px; text-align:center; padding:0px; margin:30px 10px 15px 10px; color:#333; font-weight:normal; text-transform:uppercase;">Thank you for signing up<br/><span style="color:#fb4a32;"> with ProBidAuto.com</span></h2>\
                <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal; padding: 0px; margin: 0px 0px 10px 0px;">We are very excited to give you access to the biggest inventory of autos in your area.<br />\
            <span style="text-transform:uppercase;">The local auctions!</span><br />You are going to love the experience your dealer has brought to you <br />through with <span style="color:#fb4a32;">ProBidAuto.com</span>\
                </h3>\
                <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal;    padding: 0px; margin: 0px 10px 10px 10px;">If you have not downloaded the <span style="text-transform:uppercase; color:#fb4a32;">ProBidAuto.com</span> phone app yet be sure to do that right away! That way your dealer can RSVP you cars that match your criteria right away.</h3>\
            <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px;     padding: 0px;margin: 0px 10px 10px 10px; color:#333; font-weight:normal;">The ProBidAuto.com Staff</h3> </div>\
                <div style="width:100%; padding:10px;">\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
               <div style="display:block; width:100%; text-align:center;">\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
         </div>\
               <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
                </div>\
                </div>\
                </div>\
        </body>\
            </html>';
    }

    if(type=='freecustomercreditcard'){
        var subject="THANK YOU FOR COMPLETING SIGNING UP WITH PROBIDAUTO.COM";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
                <html xmlns="http://www.w3.org/1999/xhtml">\
                <head>\
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
                <title>Customer Signup</title>\
            </head>\
                <body>\
                <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
                <div style="width:620px;">\
                <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
                <table width="100%" border="0">\
               <tr>\
                <td align="left" valign="top"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" style="margin:10px;"/></td>\
                <td align="right" valign="middle"><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong style="color:#fb4a32;">Date:</strong> '+timeConverter(added_on)+'</span></td>\
           </tr>\
            </table>\
                <img src="http://probiddealer.influxiq.com/images/customersignupstep1.jpg"  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:26px; line-height:30px; text-align:center; padding:0px; margin:30px 10px 15px 10px; color:#333; font-weight:normal; text-transform:uppercase;">Thank you for completing your registration<br/><span style="color:#fb4a32;"> with ProBidAuto.com</span></h2>\
                <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal; padding: 0px; margin: 0px 0px 10px 0px;">We are very excited to give you complete access to the biggest inventory of autos in your area.<br />\
            <span style="text-transform:uppercase;">The local auctions!</span><br />You can now have full access to the inventory details of the cars of your choice\
                </h3>\
                <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal; padding: 0px; margin: 0px 0px 10px 0px;">Please fill out the RETAIL CUSTOMER CONNECT Form to let us better understand your needs and provide the best inventory matches.\
            <h3>\
<h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal;    padding: 0px; margin: 0px 10px 10px 10px;">If you have not downloaded the <span style="text-transform:uppercase; color:#fb4a32;">ProBidAuto.com</span> phone app yet be sure to do that right away! That way your dealer can RSVP you cars that match your criteria right away.</h3>\
            <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px;     padding: 0px;margin: 0px 10px 10px 10px; color:#333; font-weight:normal;">The ProBidAuto.com Staff</h3> </div>\
                <div style="width:100%; padding:10px;">\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
               <div style="display:block; width:100%; text-align:center;">\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
         </div>\
               <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
                </div>\
                </div>\
                </div>\
        </body>\
            </html>';

    }
    if(type=='customerfreesignup'){
        var link=values+'.probidauto.com/#/freecustomercreditcard/'+invoice;
        var subject="DEALER FREE COUPON EMAIL";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
                <html xmlns="http://www.w3.org/1999/xhtml">\
                <head>\
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
                <title>Customer Signup</title>\
            </head>\
                <body>\
                <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
                <div style="width:620px;">\
                <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
                <table width="100%" border="0">\
               <tr>\
                <td align="left" valign="top"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" style="margin:10px;"/></td>\
                <td align="right" valign="middle"><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong style="color:#fb4a32;">Date:</strong> '+timeConverter(added_on)+'</span></td>\
           </tr>\
            </table>\
                <img src="http://probiddealer.influxiq.com/images/customersignupstep1.jpg"  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:26px; line-height:30px; text-align:center; padding:0px; margin:30px 10px 15px 10px; color:#333; font-weight:normal; text-transform:uppercase;"><span style="color:#fb4a32;">Hello, '+items+' </span> Enjoy this free gift from your Dealer.\
            </h2>\
                <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal; padding: 0px; margin: 0px 0px 10px 0px;">We have noticed that you have left without completing the second step of the signup process.\
            <br />\
Your dealer '+values+', has decided to send you a free gift voucher to complete your signup.\
           </h3>\
                <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal;    padding: 0px; margin: 0px 10px 10px 10px;">You can use this code to signup for free. \
                <br/>\
                Your free signup code is : '+invoice+'\
                </h3>\
                 <br/>\
            <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px;     padding: 0px;margin: 0px 10px 10px 10px; color:#333; font-weight:normal;"><a  href='+link+'>Click Here</a> to go back and complete your signup for FREE.</h3> </div>\
                <div style="width:100%; padding:10px;">\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
               <div style="display:block; width:100%; text-align:center;">\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
         </div>\
               <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
                </div>\
                </div>\
                </div>\
        </body>\
            </html>';
    }
    if(type=='dealersignup'){
        var subject="THANK YOU FOR JOINING PROBIDAUTO";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
                <html xmlns="http://www.w3.org/1999/xhtml">\
                <head>\
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
                <title>Customer Signup</title>\
            </head>\
                <body>\
                <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
                <div style="width:620px;">\
                <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
                <table width="100%" border="0">\
               <tr>\
                <td align="left" valign="top"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" style="margin:10px;"/></td>\
                <td align="right" valign="middle"><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong style="color:#fb4a32;">Date:</strong> '+timeConverter(added_on)+'</span></td>\
           </tr>\
            </table>\
                <img src="http://probiddealer.influxiq.com/images/customersignupstep1.jpg"  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:26px; line-height:30px; text-align:center; padding:0px; margin:30px 10px 15px 10px; color:#333; font-weight:normal; text-transform:uppercase;">Thank you for signing up<br/><span style="color:#fb4a32;"> with ProBidAuto.com</span></h2>\
                <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal; padding: 0px; margin: 0px 0px 10px 0px;">We are very excited to give you access to the biggest inventory of autos in your area.<br />\
            <span style="text-transform:uppercase;">The local auctions!</span><br /> You are going to love the experience this incredible system that has brought to you <br />through with <span style="color:#fb4a32;">ProBidAuto.com</span>\
                </h3>\
                <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal;    padding: 0px; margin: 0px 10px 10px 10px;">We also have the <span style="text-transform:uppercase; color:#fb4a32;">ProBidAuto.com</span> phone app for your customers.Make sure to let your customers know about it so that they can check the RSVP of cars you send to them directly from their phone.</h3>\
            <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px;     padding: 0px;margin: 0px 10px 10px 10px; color:#333; font-weight:normal;">The ProBidAuto.com Staff</h3> </div>\
                <div style="width:100%; padding:10px;">\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
               <div style="display:block; width:100%; text-align:center;">\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
         </div>\
               <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
                </div>\
                </div>\
                </div>\
        </body>\
            </html>';
    }
    if(type=='retailcustomerconnect') {
        var subject = "YOU ARE SET";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
            <html xmlns="http://www.w3.org/1999/xhtml">\
            <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
            <title>Retail customer connect</title>\
        </head>\
            <body>\
            <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
            <div style="width:620px;">\
            <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
            <table width="100%" border="0">\
            <tr>\
            <td align="left" valign="top"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" style="margin:10px;"/></td>\
            <td align="right" valign="middle"><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong style="color:#fb4a32;">Date:</strong> '+timeConverter(added_on)+'</span></td>\
        </tr>\
        </table>\
            <img src="http://probiddealer.influxiq.com/images/retailcustomercunnectstep3.jpg"  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
            <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal; padding: 0px; margin: 15px 0px 10px 0px;">Now that we know exactly what your preferences are we can match your desired auto purchase to <span style="text-transform:uppercase;">upcoming auction inventory.</span><br /> Be sure to pay close attention to emails or push notifications from your dealer to RSVP for autos that <span style="text-transform:uppercase;">YOU WANT.</span>\
        </h3>\
        <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal;    padding: 0px; margin: 0px 10px 10px 10px;">If you have not downloaded the <span style="text-transform:uppercase; color:#fb4a32;">ProBidAuto.com</span> phone app yet be sure to do that right away! That way your dealer can RSVP you cars that match your criteria right away.</h3>\
        <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px;     padding: 0px;margin: 0px 10px 10px 10px; color:#333; font-weight:normal;">The ProBidAuto.com Staff</h3>\</div>\
            <div style="width:100%; padding:10px;">\
            <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
            <div style="display:block; width:100%; text-align:center;">\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
            </div>\
            <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
            </div>\
            </div>\
            </div>\
            </body>\
        </html>';
    }
    if(type=='finance') {
        var subject = "THANK YOU FOR APPLYING FOR FINANCING";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
            <html xmlns="http://www.w3.org/1999/xhtml">\
            <head>\
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
            <title>Customer Signup</title>\
        </head>\
            <body>\
            <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
            <div style="width:620px;">\
            <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
            <table width="100%" border="0">\
            <tr>\
            <td align="left" valign="top"><img src="http://www.probidtech.influxiq.com/images/customermaillogo.png"  alt="#" style="margin:10px;"/></td>\
            <td align="right" valign="middle"><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong style="color:#fb4a32;">Date:</strong> '+timeConverter(added_on)+'</span></td>\
        </tr>\
        </table>\
            <img src="http://www.probidtech.influxiq.com/images/financestep4.jpg"  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
            <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:26px; line-height:30px; text-align:center; padding:0px; margin:30px 10px 15px 10px; color:#333; font-weight:normal; text-transform:uppercase;">Thank you for applying<br/> for<span style="color:#fb4a32;"> financing</span></h2>\
            <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal; padding: 0px; margin: 0px 0px 10px 0px;">We have all the information we need to find out what level of vehicle financing <br /><span style="text-transform: uppercase;">you will qualify for</span>.<br />Please give your dealer <span style="color:#fb4a32;">24 to 48 hours</span> to get back to you on the options available to you for<span style="color:#fb4a32;"> financing.</span>\
            </h3>\
            <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal;    padding: 0px; margin: 0px 10px 10px 10px;">To get more information please contact your prefered dealer directly. <br/><span>Log in</span> for further details.</h3>\
        <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px;     padding: 0px;margin: 0px 10px 10px 10px; color:#333; font-weight:normal;">The ProBidAuto.com Staff</h3>\
        </div>\
            <div style="width:100%; padding:10px;">\
            <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
            <div style="display:block; width:100%; text-align:center;"> <a href="javascript:void(0)"><img src="http://www.probidtech.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
           <a href="javascript:void(0)"><img src="http://www.probidtech.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://www.probidtech.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://www.probidtech.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
            </div>\
            <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
    </div>\
            </div>\
            </div>\
            </body>\
        </html>';
    }
    if(type=='customercreditcard') {
        var subject = "PAYMENT SUCCESSFULLY";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
            <html xmlns="http://www.w3.org/1999/xhtml">\
            <head>\
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
            <title>Retail customer connect</title>\
        </head>\
            <body>\
            <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
            <div style="width:620px;">\
            <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#fff; padding:20px; border-bottom:solid 2px #fb4a32;">\
            <tr>\
            <td align="left" valign="middle"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" width="250"/></td>\
            <td align="right" valign="middle" style="font-size:14px; color:#000; line-height:30px;"> <span>455 Lorem Ipsum, AZ 85004, US <img src="http://probiddealer.influxiq.com/images/mail_location.png"  style="margin-left:5px;"/></span><br />\
            <span><a href="mailto:loremIpsum@mail.com" style="color:#000; text-decoration:none;">loremIpsum@mail.com </a><img src="http://probiddealer.influxiq.com/images/mail_mailinfo.png" style="margin-left:5px;"/></span><br />\
            <span><a href="tel:(000) 000-0000" style="color:#000; text-decoration:none;">(000) 000-0000 </a><img src="http://probiddealer.influxiq.com/images/mail_phone.png" style="margin-left:5px;"/></span> </td>\
            </tr>\
            </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody><tr>\
            <td align="center">\
            <div style="margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#fff">\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:40px 0;font-family:Arial,Helvetica,sans-serif">\
            <tbody>\
            <tr>\
            <td align="left" valign="top">\
            <div style="border-left:solid 6px #fb4a32;padding:6px 6px 6px 10px">\
            <h2 style="color:#555;font-size:18px;font-weight:normal;margin:0;padding:0px;display:inline-block">Invoice to:</h2>\
        <br>\
        <h3 style="font-weight:normal;margin:5px 0 8px 0;padding:0px;font-size:22px;color:#fb4a32;display:inline-block">'+items[0].fname+' '+items[0].lname+'</h3>\
        <br>\
        <h4 style="font-weight:normal;margin:0;padding:0;font-size:14px;line-height:20px;color:#555555;display:inline-block; text-decoration:none;">'+items[0].address+' , '+items[0].city+' , '+items[0].state+' , '+items[0].zip+'<br /><a href="mailto:info@loremipsum.com" target="_blank" style="color:#555555; display:inline-block; text-decoration:none;">'+items[0].email+'</a></h4>\
        </div>\
        </td>\
        <td align="right" valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody>\
            <tr>\
            <td align="right" valign="middle" style="padding:0 8px 0 0;color:#fb4a32;font-size:28px;text-transform:uppercase">Invoice No: '+invoice+'</td>\
        </tr>\
        <tr>\
        <td align="right" valign="middle" style="padding:2px 8px 0 0;color:#0f0f0f;font-size:14px">Invoice date:'+timeConverter(items[0].added_on)+'</td>\
        </tr>\
        <tr>\
        <td align="right" valign="middle" style="padding:15px 8px 0 0;color:#111;font-size:20px">Total amount:$19.95 </td>\
        </tr>\
        </tbody>\
        </table>\
        </td>\
        </tr>\
        </tbody>\
        </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family:Arial,Helvetica,sans-serif">\
            <tbody><tr>\
            <th width="2%" align="left" valign="middle" style="background:#8c8c8c">&nbsp;</th>\
        <th width="47%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Item Description</th>\
        <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="9%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"> Price</th>\
            <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="8%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Qty. </th>\
            <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="16%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Total </th>\
            <th width="2%" align="left" valign="middle" style="background:#8c8c8c">&nbsp;</th>\
        </tr>\
            <tr>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="left" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">Customer Registration</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$19.95</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">1</td>\
            <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$19.95</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        </tr>\
        </tbody>\
        </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0px;margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;color:#333">\
            <tbody><tr>\
            <td width="100%"><table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody><tr>\
            <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Subtotal</td>\
            <td align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$19.95</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        </tr>\
            <tr>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Tax</td>\
            <td align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$0.00</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        </tr>\
        <tr>\
        <td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c;font-size:22px!important">Grand Total</td>\
        <td align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c">$19.95</td>\
        <td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td>\
        </tr>\
        </tbody></table>\
        </td>\
        </tr>\
        </tbody>\
        </table>\
        <div style="width:auto;padding:30px;text-align:center;background:#141414;color:#e9e9e9;text-align:center;margin-top:20px">Thank you For Your Purchase Order</div>\
        </div>\
        </td>\
        </tr>\
        </tbody></table>\
            </div>\
            <div style="width:100%; padding:10px;">\
            <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
            <div style="display:block; width:100%; text-align:center;">\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
            </div>\
            <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
            </div>\
            </div>\
            </div>\
            </body>\
        </html>';

    }
    if(type=='dealercreditcard') {
        var subject = "PAYMENT SUCCESSFULLY";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
            <html xmlns="http://www.w3.org/1999/xhtml">\
            <head>\
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
            <title>Dealer Signup</title>\
        </head>\
            <body>\
            <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
            <div style="width:620px;">\
            <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#fff; padding:20px; border-bottom:solid 2px #fb4a32;">\
            <tr>\
            <td align="left" valign="middle"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" width="250"/></td>\
            <td align="right" valign="middle" style="font-size:14px; color:#000; line-height:30px;"> <span>455 Lorem Ipsum, AZ 85004, US <img src="http://probiddealer.influxiq.com/images/mail_location.png"  style="margin-left:5px;"/></span><br />\
            <span><a href="mailto:loremIpsum@mail.com" style="color:#000; text-decoration:none;">loremIpsum@mail.com </a><img src="http://probiddealer.influxiq.com/images/mail_mailinfo.png" style="margin-left:5px;"/></span><br />\
            <span><a href="tel:(000) 000-0000" style="color:#000; text-decoration:none;">(000) 000-0000 </a><img src="http://probiddealer.influxiq.com/images/mail_phone.png" style="margin-left:5px;"/></span> </td>\
            </tr>\
            </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody><tr>\
            <td align="center">\
            <div style="margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#fff">\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:40px 0;font-family:Arial,Helvetica,sans-serif">\
            <tbody>\
            <tr>\
            <td align="left" valign="top">\
            <div style="border-left:solid 6px #fb4a32;padding:6px 6px 6px 10px">\
            <h2 style="color:#555;font-size:18px;font-weight:normal;margin:0;padding:0px;display:inline-block">Invoice to:</h2>\
        <br>\
        <h3 style="font-weight:normal;margin:5px 0 8px 0;padding:0px;font-size:22px;color:#fb4a32;display:inline-block">'+items[0].fname+' '+items[0].lname+'</h3>\
        <br>\
        <h4 style="font-weight:normal;margin:0;padding:0;font-size:14px;line-height:20px;color:#555555;display:inline-block; text-decoration:none;">'+items[0].address+' , '+items[0].city+' , '+items[0].state+' , '+items[0].zip+'<br /><a href="mailto:info@loremipsum.com" target="_blank" style="color:#555555; display:inline-block; text-decoration:none;">'+items[0].email+'</a></h4>\
        </div>\
        </td>\
        <td align="right" valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody>\
            <tr>\
            <td align="right" valign="middle" style="padding:0 8px 0 0;color:#fb4a32;font-size:28px;text-transform:uppercase">Invoice No: '+invoice+'</td>\
        </tr>\
        <tr>\
        <td align="right" valign="middle" style="padding:2px 8px 0 0;color:#0f0f0f;font-size:14px">Invoice date:'+timeConverter(items[0].added_on)+'</td>\
        </tr>\
        <tr>\
        <td align="right" valign="middle" style="padding:15px 8px 0 0;color:#111;font-size:20px">Total amount:$19.95 </td>\
        </tr>\
        </tbody>\
        </table>\
        </td>\
        </tr>\
        </tbody>\
        </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family:Arial,Helvetica,sans-serif">\
            <tbody><tr>\
            <th width="2%" align="left" valign="middle" style="background:#8c8c8c">&nbsp;</th>\
        <th width="47%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Item Description</th>\
        <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="9%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"> Price</th>\
            <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="8%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Qty. </th>\
            <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="16%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Total </th>\
            <th width="2%" align="left" valign="middle" style="background:#8c8c8c">&nbsp;</th>\
        </tr>\
            <tr>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="left" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">ProBid Membership</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$19.95</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">1</td>\
            <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$19.95</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        </tr>\
        </tbody>\
        </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0px;margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;color:#333">\
            <tbody><tr>\
            <td width="100%"><table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody><tr>\
            <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Subtotal</td>\
            <td align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$19.95</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        </tr>\
            <tr>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Tax</td>\
            <td align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$0.00</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        </tr>\
        <tr>\
        <td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c;font-size:22px!important">Grand Total</td>\
        <td align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c">$19.95</td>\
        <td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td>\
        </tr>\
        </tbody></table>\
        </td>\
        </tr>\
        </tbody>\
        </table>\
        <div style="width:auto;padding:30px;text-align:center;background:#141414;color:#e9e9e9;text-align:center;margin-top:20px">Thank you For Your Purchase Order</div>\
        </div>\
        </td>\
        </tr>\
        </tbody></table>\
            </div>\
            <div style="width:100%; padding:10px;">\
            <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
            <div style="display:block; width:100%; text-align:center;">\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
            </div>\
            <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
            </div>\
            </div>\
            </div>\
            </body>\
        </html>';

    }
    if(type=='dealerpackagepurchase') {
        var subject = "DEALER SUBSCRIPTION PURCHASE PAYMENT SUCCESSFUL";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
            <html xmlns="http://www.w3.org/1999/xhtml">\
            <head>\
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
            <title>Retail customer connect</title>\
        </head>\
            <body>\
            <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
            <div style="width:620px;">\
            <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#fff; padding:20px; border-bottom:solid 2px #fb4a32;">\
            <tr>\
            <td align="left" valign="middle"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" width="250"/></td>\
            <td align="right" valign="middle" style="font-size:14px; color:#000; line-height:30px;"> <span>455 Lorem Ipsum, AZ 85004, US <img src="http://probiddealer.influxiq.com/images/mail_location.png"  style="margin-left:5px;"/></span><br />\
            <span><a href="mailto:loremIpsum@mail.com" style="color:#000; text-decoration:none;">loremIpsum@mail.com </a><img src="http://probiddealer.influxiq.com/images/mail_mailinfo.png" style="margin-left:5px;"/></span><br />\
            <span><a href="tel:(000) 000-0000" style="color:#000; text-decoration:none;">(000) 000-0000 </a><img src="http://probiddealer.influxiq.com/images/mail_phone.png" style="margin-left:5px;"/></span> </td>\
            </tr>\
            </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody><tr>\
            <td align="center">\
            <div style="margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#fff">\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:40px 0;font-family:Arial,Helvetica,sans-serif">\
            <tbody>\
            <tr>\
            <td align="left" valign="top">\
            <div style="border-left:solid 6px #fb4a32;padding:6px 6px 6px 10px">\
            <h2 style="color:#555;font-size:18px;font-weight:normal;margin:0;padding:0px;display:inline-block">Invoice to:</h2>\
        <br>\
        <h3 style="font-weight:normal;margin:5px 0 8px 0;padding:0px;font-size:22px;color:#fb4a32;display:inline-block">'+items[0].fname+' '+items[0].lname+'</h3>\
        <br>\
        <h4 style="font-weight:normal;margin:0;padding:0;font-size:14px;line-height:20px;color:#555555;display:inline-block; text-decoration:none;">'+items[0].address+' , '+items[0].city+' , '+items[0].state+' , '+items[0].zip+'<br /><a href="mailto:info@loremipsum.com" target="_blank" style="color:#555555; display:inline-block; text-decoration:none;">'+items[0].email+'</a></h4>\
        </div>\
        </td>\
        <td align="right" valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody>\
            <tr>\
            <td align="right" valign="middle" style="padding:0 8px 0 0;color:#fb4a32;font-size:28px;text-transform:uppercase">Invoice No: '+invoice+'</td>\
        </tr>\
        <tr>\
        <td align="right" valign="middle" style="padding:2px 8px 0 0;color:#0f0f0f;font-size:14px">Invoice date:'+timeConverter(added_on)+'</td>\
        </tr>\
        <tr>\
        <td align="right" valign="middle" style="padding:15px 8px 0 0;color:#111;font-size:20px">Total amount:$'+values.cost_extra_member+'</td>\
        </tr>\
        </tbody>\
        </table>\
        </td>\
        </tr>\
        </tbody>\
        </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family:Arial,Helvetica,sans-serif">\
            <tbody><tr>\
            <th width="2%" align="left" valign="middle" style="background:#8c8c8c">&nbsp;</th>\
        <th width="47%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Package Name</th>\
        <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="9%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"> Price</th>\
            <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="8%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Free Subscription</th>\
            <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="16%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Total </th>\
            <th width="2%" align="left" valign="middle" style="background:#8c8c8c">&nbsp;</th>\
        </tr>\
            <tr>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="left" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">'+values.name+'</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$'+values.cost_extra_member+'</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">'+values.free_member
            +'</td>\
            <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$'+values.cost_extra_member+'</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        </tr>\
        </tbody>\
        </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0px;margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;color:#333">\
            <tbody><tr>\
            <td width="100%"><table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody><tr>\
            <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Subtotal</td>\
            <td align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$'+values.cost_extra_member+'</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        </tr>\
            <tr>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Tax</td>\
            <td align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$0.00</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        </tr>\
        <tr>\
        <td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c;font-size:22px!important">Grand Total</td>\
        <td align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c">$'+values.cost_extra_member+'</td>\
        <td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td>\
        </tr>\
        </tbody></table>\
        </td>\
        </tr>\
        </tbody>\
        </table>\
        <div style="width:auto;padding:30px;text-align:center;background:#141414;color:#e9e9e9;text-align:center;margin-top:20px">Thank you For Your Purchase Order</div>\
        </div>\
        </td>\
        </tr>\
        </tbody></table>\
            </div>\
            <div style="width:100%; padding:10px;">\
            <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
            <div style="display:block; width:100%; text-align:center;">\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
            </div>\
            <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
            </div>\
            </div>\
            </div>\
            </body>\
        </html>';

    }

    var smtpTransport = mailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
            user: "itplcc40@gmail.com",
            pass: "DevelP7@"
        }
    });

    var mail = {
        /*  from: "Admin <samsujdev@gmail.com>",*/
        from: from,
        to: email,
        subject: subject,
        //text: "Node.js New world for me",
        html: html
    }

    smtpTransport.sendMail(mail, function (error, response) {
        //resp.send((response.message));
        smtpTransport.close();
    });

}

app.get('/testemail',function(req,resp){

    var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
       <html xmlns="http://www.w3.org/1999/xhtml">\
       <head>\
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
        <title>Mail Page 3</title>\
    </head>\
    <body>\
       <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
       <div style="width:620px;">\
       <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; ">\
       <table width="100%" border="0">\
        <tr>\
        <td align="left" valign="top"><img src="http://probiddealer.influxiq.com/images/logo1.png"  alt="#" style="margin:10px;"/></td>\
        <td align="right" valign="middle"  ><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong  style="color:#fb4a32;"> Date:</strong> 12.2.2016 </span></td>\
    </tr>\
    </table>\
       <h2 style="text-align:left; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; background:#fb4a32; padding:10px; margin:15px 0 15px 0; color:#fff; font-weight:normal;"><span style="font-weight:bold; font-style:italic;">Subject:</span>  [[Dealership Name]] has sent a new car for you to check out.</h2>\
       <div style="width:100%; background:#f9f0e1; border:solid 1px #dbd2c4; margin:5px 0 15px 0; height:40px;">\
        <div style="width:40%; background:#96ff00; height:40px; text-align:center; font-family:Arial, Helvetica, sans-serif; line-height:40px; color:#333; font-size:12px;">40%</div>\
        </div>\
       <img src="http://probiddealer.influxiq.com/images/cd1_bigcar1.jpg"  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
       <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#111; margin:15px 0; border-top:solid 1px #cdc7bd;">\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Make: </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">Audi</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Model:</td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">A6 2.0T Quattro Premium Plus</td>\
    </tr>\
       <tr>\
    <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Year:</td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">2013</td>\
        </tr>\
        <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Miles:</td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">Under 45,000</td>\
    </tr>\
       <tr>\
    <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Color:</td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">Gray</td>\
        </tr>\
        <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Wholesale:</td> <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">24,493 USD</td>\
    </tr>\
       </table>\
       <h2 style="background:#fb4a32; margin:0; padding:10px; text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:20px; color:#eee1cb; text-transform:uppercase; font-weight:normal;"><a href="javascript:void(0)" style="font-style:italic; color:#eca463; font-weight:bold; text-decoration:none;">Click Here</a> to get more details about this car.</h2>\
       <h2 style="margin:15px 0 0 0; padding:15px; font-family:Arial, Helvetica, sans-serif; text-align:center; font-weight:normal; font-size:16px; color:#333;"> Please login to your account to learn more about the car and other options.</h2>\
       <a href="javascript:void(0)" style="font-style:italic; color:#fff; background:#fb4a32; padding:8px 10px; text-decoration:none; font-family:Arial, Helvetica, sans-serif; display:block; width:100px; margin:0 auto; text-align:center; margin-bottom:20px; text-transform:uppercase; font-weight:bold;">Login</a>\
       </div>\
       <div style="width:100%; padding:10px;">\
       <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#9c9c9c; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
       <div style="display:block; width:100%; text-align:center;">\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
        </div>\
       <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#9c9c9c; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
       </div>\
       </div>\
       </div>\
       </body>\
    </html>';
    var smtpTransport = mailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
            user: "itplcc40@gmail.com",
            pass: "DevelP7@"
        }
    });

    var mail = {
        from: "Admin <samsujdev@gmail.com>",
        to: 'iftekarkta@gmail.com',
        subject: 'test email',
        //text: "Node.js New world for me",
        html: html
    }

    smtpTransport.sendMail(mail, function (error, response) {
        // resp.send((response.message));
        console.log('send');
        smtpTransport.close();
    });
});
app.get('/testemail4',function(req,resp){

    var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
       <html xmlns="http://www.w3.org/1999/xhtml">\
       <head>\
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
        <title>Mail Page 3</title>\
    </head>\
    <body>\
       <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
       <div style="width:620px;">\
       <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; ">\
       <table width="100%" border="0">\
        <tr>\
        <td align="left" valign="top"><img src="http://probiddealer.influxiq.com/images/logo1.png"  alt="#" style="margin:10px;"/></td>\
        <td align="right" valign="middle"  ><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong  style="color:#fb4a32;"> Date:</strong> 12.2.2016 </span></td>\
    </tr>\
    </table>\
       <h2 style="text-align:left; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; background:#fb4a32; padding:10px; margin:15px 0 15px 0; color:#fff; font-weight:normal;"><span style="font-weight:bold; font-style:italic;">Subject:</span>  [[Dealership Name]] has sent a new car for you to check out.</h2>\
       <div style="width:100%; background:#f9f0e1; border:solid 1px #dbd2c4; margin:5px 0 15px 0; height:40px;">\
        <div style="width:40%; background:#96ff00; height:40px; text-align:center; font-family:Arial, Helvetica, sans-serif; line-height:40px; color:#333; font-size:12px;">40%</div>\
        </div>\
       <img src="http://probiddealer.influxiq.com/images/cd1_bigcar1.jpg"  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
       <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#111; margin:15px 0;">\
       <tr>\
       <th align="left" valign="middle" width="50%" style="background:#fb4a32; color:#fff; font-weight:normal; font-size:16px; padding:15px 10px;" >Details </span></th>\
        <th align="right" valign="middle"  width="50%" style="background:#fb4a32; color:#fff; font-weight:normal; font-size:16px; border-left:solid 1px #f9f0e1; padding:15px 10px;">Glossary </span></th>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Doc Type: </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">TX-STORAGE LIEN PAPERS  <img src="img/mailitextcon1.png" /></td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Odometer: </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">126,593 mi. (EXEMPT) <img src="img/mailitextcon1.png" /></td>\
        </tr>\
        <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Highlights:   </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> Run and Drive <img src="img/mailitextcon1.png" /></td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Primary Damage:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> SIDE  </td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Secondary Damage:  </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"></td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Est. Retail Value:  </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"></td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">VIN:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> 1G4HR52K4WH487553 </td>\
    </tr>\
       <tr>\
    <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Body Style:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> SEDAN 4DR </td>\
    </tr>\
       <tr>\
    <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Color:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> TAN</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Engine Type:        </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">      3.8L 6</td>\
    </tr>\
       <tr>\
    <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Drive:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">    FRONT-WHEEL DRIVE</td>\
    </tr>\
       <tr>\
    <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Cylinder:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> 6</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Fuel:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"> GAS</td>\
        </tr>\
       <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Keys:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;">   YES</td>\
        </tr>\
        <tr>\
        <td align="left" valign="middle"  style="background:#f9f0e1; padding: 10px; border:solid 1px #cdc7bd; border-right:none; border-top:none;">Notes:    </td>\
    <td align="right" valign="middle"  style="background:#f9f0e1; padding: 10px;  border:solid 1px #cdc7bd;  border-top:none;"></td>\
        </tr>\
        </table>\
       <h2 style="background:#fb4a32; margin:0; padding:10px; text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:20px; color:#eee1cb; text-transform:uppercase; font-weight:normal;"><a href="javascript:void(0)" style="font-style:italic; color:#eca463; font-weight:bold; text-decoration:none;">Click Here</a> to get more details about this car.</h2>\
       <h2 style="margin:15px 0 0 0; padding:15px; font-family:Arial, Helvetica, sans-serif; text-align:center; font-weight:normal; font-size:16px; color:#333;"> Please login to your account to learn more about the car and other options.</h2>\
       <a href="javascript:void(0)" style="font-style:italic; color:#fff; background:#fb4a32; padding:8px 10px; text-decoration:none; font-family:Arial, Helvetica, sans-serif; display:block; width:100px; margin:0 auto; text-align:center; margin-bottom:20px; text-transform:uppercase; font-weight:bold;">Login</a>\
       </div>\
       <div style="width:100%; padding:10px;">\
       <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#9c9c9c; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
       <div style="display:block; width:100%; text-align:center;">\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
        <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
        </div>\
       <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#9c9c9c; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
       </div>\
       </div>\
       </div>\
       </body>\
    </html>';
    var smtpTransport = mailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
            user: "itplcc40@gmail.com",
            pass: "DevelP7@"
        }
    });

    var mail = {
        from: "Admin <samsujdev@gmail.com>",
        to: 'iftekarkta@gmail.com',
        subject: 'test email',
        //text: "Node.js New world for me",
        html: html
    }

    smtpTransport.sendMail(mail, function (error, response) {
        // resp.send((response.message));
        console.log('send');
        smtpTransport.close();
    });
});

function timeConverter(UNIX_timestamp){
    // var a = new Date(UNIX_timestamp * 1000);
    var a = new Date(UNIX_timestamp);
    // var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    // var month=a.getMonth();
    var month = months[a.getMonth()];
    var date = a.getDate()+1;
    // var date = a.getDate()+1;
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = month + ' ' + date + ',  ' + year ;
    return time;
}

var server = app.listen(port, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})