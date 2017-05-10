/**
 * Created by iftekar on 24/5/16.
 */

var CryptoJS = require("crypto");
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

var port = process.env.PORT || 1238; 				// set the port

var http = require('http').Server(app);

var bodyParser = require('body-parser');
app.use(bodyParser.json({ parameterLimit: 1000000,
    limit: 1024 * 1024 * 10}));
app.use(bodyParser.urlencoded({ parameterLimit: 1000000,
    limit: 1024 * 1024 * 10, extended: false}));
var multer  = require('multer');
var datetimestamp='';
var filename='';
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {

        filename=file.originalname.split('.')[0].replace(' ','') + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        cb(null, filename);
    }
});

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var db;

var mongodb = require('mongodb');
var url = 'mongodb://localhost:27017/urlmanager';

var MongoClient = mongodb.MongoClient;

MongoClient.connect(url, function (err, database) {
    if (err) {
        console.log('err : '+err);

    }else{
        console.log('connected');
        db=database;

    }});

function managemongo(rows,x) {
    var rows=rows;
    var x=x;


            var collection = db.collection('fullurls');

            collection.find({urlid: rows[x].id}).toArray(function (err, items) {

                if(typeof(items)!='undefined') {

                    if (items.length == 0) {

                        collection.insert([{
                            urlid: rows[x].id,
                            full_url: rows[x].full_url,
                            crawl_count : 0
                        }], function (err, result) {
                            if (err) {
                                   console.log(err);
                            } else {

                                connection.query("update  ripoff_urls set addedinmongo=1 where id= ? ",[rows[x].id],function(error,rows,fields){

                                    if(!!error) console.log('error in db call ');
                                    else{

                                        console.log('success full query');

                                    }

                                });

                            }
                        });

                    }

                }
                else{

                    collection.insert([{
                        urlid: rows[x].id,
                        full_url: rows[x].full_url,
                        crawl_count : 0
                    }], function (err, result) {
                        if (err) {
                               console.log(err);
                        } else {

                            connection.query("update  ripoff_urls set addedinmongo=1 where id= ? ",[rows[x].id],function(error,rows,fields){

                                if(!!error) console.log('error in db call ');
                                else{

                                    console.log('success full query');

                                }

                            });

                        }
                    });
                }

            });


}

app.get('/',function (req,resp) {
    var collection = db.collection('fullurls');

    collection.find().toArray(function(err, items) {

        console.log('err : '+err);
        console.log('items : '+JSON.stringify(items.length));

        resp.send(JSON.stringify(items));

    });
})

//get all success url from mongo db
app.get('/fullurls',function(req,resp){
    var searchkey = req.query.searchKey;
    var searchwhere = {};
    if(searchkey  != ''){
        searchwhere = { $or: [ { full_url: { $regex: searchkey, $options: "x" } }, { urlid: searchkey } ] };
    }



    var collection = db.collection('fullurls');

    collection.find(searchwhere).skip(parseInt(req.query.offset)).sort( { crawl_count: -1 } ).limit(parseInt(req.query.pagelimit)).toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //  db.close();

    });


});

//get total no url of mongo
app.get('/totalmongofullurlls',function(req,resp){
    var searchkey = req.query.searchKey;
    var searchwhere = {};
    if(searchkey  != ''){
        searchwhere = { $or: [ { full_url: { $regex: searchkey, $options: "x" } }, { urlid: searchkey } ] };
    }


    var collection = db.collection('fullurls');

    
    
    var rescount = db.collection('fullurls').count(searchwhere, function(error, numOfDocs){
            if (error) throw error;
            resp.send(JSON.stringify(numOfDocs));


        });



});

app.get('/autocrawl',function(req,resp){

    var collection = db.collection('fullurls');
    
    
    collection.count({}, function(error, numOfDocs){
            if (error) throw error;
            var r = Math.floor(Math.random() * numOfDocs);
            
            collection.find().skip(r).limit(5).forEach( function(item) {
        	//mongocrawl(item);
        	phantomcrawl(item);
        	//console.log(item);
        });

    });
    
    resp.send(JSON.stringify('success'));

      //


});

function phantomcrawl(item) {

    console.log('In Phantom Crawl');
    //console.log(item.length);
    //console.log(item);
    console.log(item.full_url);

    var url = 'http://phantom.influxiq.com/run.php?url='+item.full_url;

    var j = request.jar();
    var cookie = request.cookie('i_b=true');
    //var url = 'http://www.google.com';
    j.setCookie(cookie, url);

    req = request.defaults({
        jar: j,                 // save cookies to jar
        rejectUnauthorized: false,
        followAllRedirects: true   // allow redirections
    });
    req.get({
        url: url,
        headers: {
            'User-Agent': '"Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:45.0) Gecko/20100101 Firefox/45.0 RRTA"' // optional headers
        }
    },  function(error2, response2, html2){




        if(!error2){
            var $ = cheerio.load(html2);

            var title, pagetitle, meta,reportaddress,stats1;
            title=$('title').html();
            pagetitle=$('.pageTitle').html();
            meta=$('.meta').html();
            console.log(url);
            console.log('In cheerio Call !!');
            console.log(html2);
            console.log('In cheerio Call Printed !!!');


        }
        else{
            console.log('call failed !!');
        }



    });



    console.log('Phantom Crawl Finishes !!!');



}

function mongocrawl(item){
    var collection = db.collection('fullurls');

    var timearr = [];

    if(typeof (item.crawl_count) == 'undefined'){
        collection.update({_id:item._id}, {$set: {crawl_count: 0}}, true, true);
    }

    if(typeof (item.search_index) == 'undefined'){
        collection.update({_id:item._id}, {$set: {search_index: 0}}, true, true);
    }

    var url = item.full_url;

    var j = request.jar();
    var cookie = request.cookie('i_b=true');
    //var url = 'http://www.google.com';
    j.setCookie(cookie, url);

    req = request.defaults({
        jar: j,                 // save cookies to jar
        rejectUnauthorized: false,
        followAllRedirects: true   // allow redirections
    });



    req.get({
        url: url,
        headers: {
            'User-Agent': '"Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:45.0) Gecko/20100101 Firefox/45.0 RRTA"' // optional headers
        }
    },  function(error2, response2, html2){
    
    


        if(!error2){
            var $ = cheerio.load(html2);

            var title, pagetitle, meta,reportaddress,stats1;
            title=$('title').html();
            pagetitle=$('.pageTitle').html();
            meta=$('.meta').html();
            metalength=$('.meta').length;

            if(isNaN(item.crawl_count)){
                var total_crawl_count = 0;
            }else{
                var total_crawl_count = parseInt(item.crawl_count);
            }
            
            console.log('title : '+title);

            var is_search_index = 2;

            if(metalength > 0){
                total_crawl_count = total_crawl_count+1;
                var is_search_index = 1;
            }

            collection.update({_id:item._id}, {$set: {crawl_count: total_crawl_count}}, true, true);
            collection.update({_id:item._id}, {$set: {search_index:is_search_index}}, true, true);

            if(typeof (item.hittime) != 'undefined'){
                timestr = item.hittime;
                timearr = JSON.parse(timestr);
            }

            var curdate = new Date().toLocaleString();
            timearr.push(curdate);
            collection.update({_id:item._id}, {$set: {hittime: JSON.stringify(timearr)}}, true, true);

        }



    });
}


//get total no hit
app.get('/taotalhit',function(req,resp){
    var type1 = req.query.type;

    var searchwhere = {};
    if(type1 == 0){
        searchwhere = { crawl_count : {$gt: 0} };
    }else{
        searchwhere = { search_index : parseInt(type1)};
    }

    var collection = db.collection('fullurls');

    var rescount = db.collection('fullurls').count(searchwhere, function(error, numOfDocs){
            if (error) throw error;
            resp.send(JSON.stringify(numOfDocs));


        });
    
    

});




app.get('/hitwebdev',function(req,resp){
    var url = 'http://the-webdevelopers.com/';

    var j = request.jar();
    var cookie = request.cookie('i_b=true');
    //var url = 'http://www.google.com';
    j.setCookie(cookie, url);

    req = request.defaults({
        jar: j,                 // save cookies to jar
        rejectUnauthorized: false,
        followAllRedirects: true   // allow redirections
    });

    req.get({
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.63 Safari/534.3' // optional headers
        }
    },  function(error2, response2, html2) {


        if (!error2) {
            var $ = cheerio.load(html2);
            resp.send($('title').html());



        }

    });



});


app.get('/hitripoffhome',function(req,resp){
    var url = 'http://www.ripoffreport.com/ads/zone_6.php';

    var j = request.jar();
    var cookie = request.cookie('i_b=true');
    //var url = 'http://www.google.com';
    j.setCookie(cookie, url);

    req = request.defaults({
        jar: j,                 // save cookies to jar
        rejectUnauthorized: false,
        followAllRedirects: true   // allow redirections
    });

    var i=0;
    while (i < 6) {

        req.get({
            url: url,
            headers: {
                'User-Agent': '"Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:45.0) Gecko/20100101 Firefox/45.0 RRTA"' // optional headers
            }
        }, function (error2, response2, html2) {


            if (!error2) {

                var currentdate = new Date();
                var datetime = "Last Sync: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/"
                    + currentdate.getFullYear() + " @ "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();


                var ck1 = j.getCookies(url);
                console.log('cookie val='+ck1+'time='+datetime);
                var $ = cheerio.load(html2);
                console.log($('title').html());
                resp.send(ck1);


            }


        });

        i++;
    }


    //resp.send('success');

});


app.get('/testf',function(req,resp){

    var phantom2 = require('phantom');
    phantom.create(function(ph) {
        return ph.createPage(function(page) {
            return page.open("http://www.google.com", function(status) {
                console.log("opened google? ", status);
                return page.evaluate((function() {
                    return document.title;
                }), function(result) {
                    console.log('Page title is ' + result);
                    resp.send(99);
                    return ph.exit();
                });
            });
        });
    });

});
app.get('/test',function(req,resp){

    var collection = db.collection('fullurls');

    var timearr = [];
    
    collection.updateMany({}, {$set: {crawl_count: 0}});
    collection.updateMany({}, {$set: {search_index: 0}});


    resp.send(JSON.stringify('success'));

});




app.listen(port);
 console.log("App listening on port " + port);
