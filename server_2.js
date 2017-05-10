/**
 * Created by iftekar on 24/5/16.
 */
(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();


var CryptoJS = require("crypto");
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var mailer = require("nodemailer");

var app = express();

var port = process.env.PORT || 1239;  				// set the port

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

        //console.log(file);
        filename=file.originalname.split('.')[0].replace(' ','') + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        cb(null, filename);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');


app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json


app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var EventEmitter = require('events').EventEmitter;

const emitter = new EventEmitter()

emitter.setMaxListeners(0)


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



var mysql=require('mysql');

var connection =mysql.createConnection({
    host:'influxiq.com',
   // host:'50.62.161.114',
    user:'influxiq_url',
    password:'P@ss1234',
    database:'influxiq_test'

});

connection.connect(function(error){

    if(!!error){
        console.log('error'+error)
    } else{
        console.log('connected');
    }

});


var mongodb = require('mongodb');
var url = 'mongodb://localhost:27017/urlmanager';

var MongoClient = mongodb.MongoClient;
MongoClient.connect(url, function (err, database) {
    if (err) {
        console.log(err);

    }else{
        db=database;

    }});


app.get('/',function(req,resp){

    connection.query("SELECT * FROM ripoff_urls where full_url!='' and addedinmongo=0  limit 300 ",function(error,rows,fields){

        if(!!error) console.log('error in db call111 '+error);
        else{

            var i=0;
            while(i<rows.length){
                var x=i;
                i++;

                managemongo(rows,x)

            }

            resp.send(JSON.stringify(rows));
        }

    });

});



app.get('/cron',function(req,resp){

    connection.query("SELECT * FROM ripoff_urls where full_url!='' and addedinmongo=0 order by RAND()  limit 300 ",function(error,rows,fields){

        if(!!error) console.log('error in db call '+error);
        else{

            var i=0;
            while(i<rows.length){
                var x=i;
                i++;

                managemongo(rows,x)

            }

            resp.send('success');
        }

    });

});


function managemongo(rows,x) {
    var rows=rows;
    var x=x;

  /*  MongoClient.connect(url, function (err, db) {
        if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
*/
            var collection = db.collection('fullurls');

            collection.find({urlid: rows[x].id}).toArray(function (err, items) {

                if(typeof(items)!='undefined') {

                    if (items.length == 0) {

                        collection.insert([{
                            urlid: rows[x].id,
                            full_url: rows[x].full_url,
                            crawl_count : 0,
                            search_index : 0
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
                        crawl_count : 0,
                        search_index : 0
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

 /*       }
    });
 */
}


//get list of successurls by mysql
app.get('/mysqlfullurls',function(req,resp){
    var searchkey = req.query.searchKey;
    var searchwhere = '';
    if(searchkey  != ''){
        searchwhere = " AND (id='"+searchkey+"' OR full_url LIKE '%"+searchkey+"%')";
    }

    var sql = "SELECT * FROM ripoff_urls where full_url!='' "+searchwhere+" limit "+req.query.offset+","+req.query.pagelimit;

    if(req.query.searchIndex > 0){
        var sql = "SELECT * FROM ripoff_urls where full_url!='' AND seach_index = "+req.query.searchIndex+" "+searchwhere+" limit "+req.query.offset+","+req.query.pagelimit;
    }

    connection.query(sql,function(error,rows,fields){

        if(!!error) console.log('error in db call '+error);
        else{

            resp.send(JSON.stringify(rows));
        }

    });

});

//delete full urls
app.get('/deletefullurls', function (req, resp) {

  /*  MongoClient.connect(url, function (err, db) {
        if (err) {
             console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {*/

            var collection = db.collection('fullurls');

            collection.remove({});

           // db.close();
            resp.send('deleted');
 /*       }
    });
*/
});

//Get all failed urls from mysql
app.get('/failedurls',function(req,resp){
    var searchkey = req.query.searchKey;
    var searchwhere = '';
    if(searchkey  != ''){
        searchwhere = " AND (id='"+searchkey+"' OR url LIKE '%"+searchkey+"%')";
    }

    connection.query("SELECT * FROM ripoff_urls where full_url='' and is_procesed=1 "+searchwhere+" order by id limit "+req.query.offset+","+req.query.pagelimit,function(error,rows,fields){

        if(!!error) console.log('error in db call ');
        else{

            resp.send(JSON.stringify(rows));
        }
    });
});

//get total success urls no from mysql
app.get('/totalsuccess',function(req,resp){
    var searchkey = req.query.searchKey;
    var searchwhere = '';
    if(searchkey  != ''){
        searchwhere = " AND (id='"+searchkey+"' OR full_url LIKE '%"+searchkey+"%')";
    }

    var sql = "SELECT count(*) as count FROM ripoff_urls where full_url!='' and is_procesed=1"+searchwhere;

    if(req.query.searchIndex > 0){
        var sql = "SELECT count(*) as count FROM ripoff_urls where full_url!='' AND is_procesed=1 AND seach_index = "+req.query.searchIndex+searchwhere;
    }

    connection.query(sql,function(error,rows,fields){

        if(!!error) console.log('error in db call '+error);
        else{

            resp.send(JSON.stringify(rows));
        }

    });

});

//Get total failed url no from mysql
app.get('/totalfail',function(req,resp){
    var searchkey = req.query.searchKey;
    var searchwhere = '';
    if(searchkey  != ''){
        searchwhere = " AND (id='"+searchkey+"' OR url LIKE '%"+searchkey+"%')";
    }

    connection.query("SELECT count(*) as count FROM ripoff_urls where full_url='' and is_procesed=1 "+searchwhere,function(error,rows,fields){

        if(!!error) console.log('error in db call ');
        else{

            resp.send(JSON.stringify(rows));
        }

    });

});

//automatic update failed urls by cron
app.get('/autourlupdate',function(req,resp){

    var res12 = [];

    connection.query("SELECT * FROM ripoff_urls WHERE full_url =  '' AND is_procesed =1 AND check_failed_url = 0 ORDER BY id DESC LIMIT 10",function(error,rows,fields){

        if(!!error) {
            resp.send(JSON.stringify(error));
        }
        else{

            var res11 = [];


            if(rows.length == 0){
                connection.query("UPDATE `ripoff_urls` SET `check_failed_url` = '0' WHERE 1",function(error1,rows1,fields1){

                });
            }else{

                for(n in rows){
                    var rowsn = rows[n];
                    res11.push(rowsn.id);

                    var url = 'http://www.ripoffreport.com/r/'+rowsn.full_url+'-'+rowsn.id;
                    var idd = rowsn.id;

                    //send requet to update
                    sendrequest1(url,idd);

                    connection.query("update  ripoff_urls set check_failed_url=1 where id= ? ",[idd],function(error11,rows11,fields11){


                    });

                }

            }
            resp.send(JSON.stringify(res11));
        }

    });

});

//update failed url
function sendrequest1(url,idd){

    request(url, function(error2, response2, html2){


        if(!error2){
            var $ = cheerio.load(html2);

            var title, pagetitle, meta,reportaddress,stats1;
            title=$('title').html();
            pagetitle=$('.pageTitle').html();
            meta=$('.meta').html();
            metalength=$('.meta').length;

            var newurl = response2.request.uri.href;

            console.log('idd : '+idd+'  ====   metalength : '+metalength);

            if(metalength > 0){
                connection.query("update  ripoff_urls set full_url='"+newurl+"' where id= ? ",[idd],function(error1,rows1,fields1){



                });
            }

        }



    });
}



app.get('/hitripoffhome',function(req,resp){
    var url = 'http://www.ripoffreport.com/';

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
    while (i < 8) {

        req.get({
            url: url,
            headers: {
                'User-Agent': '"Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:45.0) Gecko/20100101 Firefox/45.0"' // optional headers
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


            }


        });

        i++;
    }


    resp.send('success');

});


var Horseman = require('node-horseman');

app.get('/crawl',function(req,resp) {

    var horseman = new Horseman();

   /* horseman
        .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
        .open('http://www.google.com')
        .type('input[name="q"]', 'github')
        .click('[name="btnK"]')
        .keyboardEvent('keypress', 16777221)
        .waitForSelector('div.g')
        .count('div.g')
        .log() // prints out the number of results
        .close();*/


    horseman
        .userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0")
        .open("http://www.google.com")
        .type("input[name='q']", "horseman")
        .click("button:contains('Google Search')")
        .keyboardEvent("keypress", 16777221)
        .waitForSelector("div.g")
        .then(scrape)
        .finally(function () {
            console.log(links.length)
            horseman.close();
        });
});

app.get('/tc',function(req,resp) {

    var horseman = new Horseman();
    horseman
        .open('http://www.google.com')
        .count('a')
        .log() // outputs the number of anchor tags
        .click('a')
        .log('clicked the button') //outputs the string
        .close();



});


function scrape(){

    return new Promise( function( resolve, reject ){
        return getLinks()
            .then(function(newLinks){

                links = links.concat(newLinks);

                if ( links.length < 30 ){
                    return hasNextPage()
                        .then(function(hasNext){
                            if (hasNext){
                                return horseman
                                    .click("#pnnext")
                                    .wait(1000)
                                    .then( scrape );
                            }
                        });
                }
            })
            .then( resolve );
    });
}

var links = [];

function getLinks(){
    return horseman.evaluate( function(){
        // This code is executed in the browser.
        var links = [];
        $("div.g h3.r a").each(function( item ){
            var link = {
                title : $(this).text(),
                url : $(this).attr("href")
            };
            links.push(link);
        });
        return links;
    });
}


app.get('/scrape', function(req, res){

    url = req.query.url;

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var title, pagetitle, meta,reportaddress;
            title=$('title').html();
            pagetitle=$('.pageTitle').html();
            meta=$('.meta').html();
            reportaddress=$('.report-address').html();

          var crawlarr=new Array();
            crawlarr['title']=title;

            res.send(({'title':title,'header':pagetitle,'meta':meta,'reportaddress':reportaddress}));
        }

    })
})

app.get('/failurlscrape', function(req, res){
    // Let's scrape Anchorman 2
    url = req.query.url;
    idd = req.query.id;

    request(url, function(error, response, html){
        if(!error){

            var $ = cheerio.load(html);

            var title, pagetitle, meta,reportaddress,stats1;
            title=$('title').html();
            pagetitle=$('.pageTitle').html();
            meta=$('.meta').html();
            metalength=$('.meta').length;

            var newurl = response.request.uri.href;

            if(metalength > 0){
                connection.query("update  ripoff_urls set full_url='"+newurl+"' where id= ? ",[idd],function(error1,rows1,fields1){

                    if(!error1){
                        stats1='success' ;
                    }
                    else{
                        stats1='failure' ;
                    }



                    res.send(({'meta':meta,'metalength':metalength,'stat':stats1}));

                });
            }else{
                res.send(({'meta':'','metalength':0,'stat':'failure'}));
            }



        }else{
            res.send(({'meta':'','metalength':0,'stat':'failure'}));
        }
    })
})


app.get('/cathcescrape', function(req, res){
    // Let's scrape Anchorman 2
    url = req.query.url;

    var idd = req.query.id;

    request(url, function(error, response, html){
        if(!error){
            var htmllength;
          var $ = cheerio.load(html);
            htmllength=$('#google-cache-hdr').length;

            if(htmllength > 0){
                connection.query("update  ripoff_urls set seach_index=1 where id= ? ",[idd],function(error1,rows1,fields1){

                });
            }else{
                connection.query("update  ripoff_urls set seach_index=2 where id= ? ",[idd],function(error1,rows1,fields1){

                });
            }



            res.send(({'numbercount':htmllength}));
        }else{


            res.send(({'numbercount':0}));
        }

    })
});

//Update auto google search index
app.get('/autoGSearchIndex', function(req, resp){

    var res12 = [];

    connection.query("SELECT `id`,`full_url` FROM `ripoff_urls` WHERE `seach_index` = 0 AND `full_url` != '' AND `is_procesed`=1 ORDER BY RAND() LIMIT 1",function(error11,rows,fields){

        if(!!error11) {
            console.log(error11);
        }
        else{
            var res11 = [];

            var idd = rows[0].id;
            var url = rows[0].full_url;

            url = 'http://webcache.googleusercontent.com/search?q=cache:'+url;

            request(url, function(error, response, html){
                if(!error){
                    var htmllength;
                    var $ = cheerio.load(html);
                    htmllength=$('#google-cache-hdr').length;

                    if(htmllength > 0){
                        connection.query("update  ripoff_urls set seach_index=1 where id= ? ",[idd],function(error1,rows1,fields1){

                        });
                    }else{
                        connection.query("update  ripoff_urls set seach_index=2 where id= ? ",[idd],function(error1,rows1,fields1){

                        });
                    }
                    console.log(htmllength);
                }

                resp.send({'sdfssd':1});

            });


            resp.send({'sdfssd':1});
        }

    });

});


//Get all failed urls from mysql
app.get('/test',function(req,resp){

    connection.query("SELECT * FROM ripoff_urls where `full_url` LIKE  '%http://www.ripoffreport.com/r/-%' limit "+req.query.offset+","+req.query.pagelimit,function(error,rows,fields){

        if(!!error) console.log('error in db call ');
        else{

            resp.send(JSON.stringify(rows));
        }
    });
});

app.get('/testupdate',function(req,resp){

    var sql = "UPDATE `ripoff_urls` SET  `full_url` =  '',`seach_index` =  '0' WHERE `id` IN ("+req.query.ids+")";

    connection.query(sql,function(error,rows,fields){

        if(!!error){
            console.log('error in db call ');
            resp.send({'status':sql});
        }
        else{

            console.log('success full query');
            resp.send({'status':'success full query'});

        }

    });

});

app.get('/crawlbygoogle', function(req, res){
    // Let's scrape Anchorman 2
    var url = req.query.url;

    var idd = req.query.id;

    var furl = 'https://www.google.com/search?q='+url;

    request(furl, function(error, response, html){
        if(!error){
            var htmllength;
            var $ = cheerio.load(html);
            htmllength=$('h3.r').length;



            if(htmllength > 0){
                connection.query("update  ripoff_urls set seach_index=3 where id= ? ",[idd],function(error1,rows1,fields1){

                });
            }

            res.send(({'numbercount':htmllength}));

        }else{

            res.send(({'numbercount':0}));

        }

    })
})

//automatic update failed urls by cron
app.get('/autogoogleseachupdate',function(req,resp){

    var res12 = [];

    connection.query("SELECT * FROM ripoff_urls WHERE seach_index = 2 ORDER BY RAND() LIMIT 1",function(error,rows,fields){

        if(!!error) {
            resp.send(JSON.stringify(error));
        }
        else{

            var res11 = [];

            for(n in rows){
                var rowsn = rows[n];

                var idd = rowsn.id;

                var furl = 'https://www.google.com/search?q='+rowsn.full_url;

                //send requet to update
                sendrequest2(furl,idd);

            }

            resp.send(JSON.stringify(res12));
        }

    });

});

//update google serach url
function sendrequest2(url,idd){

    request(url, function(error2, response2, html2){


        if(!error2){
            var $ = cheerio.load(html2);
            htmllength=$('h3.r').length;

            if(htmllength > 0){
                connection.query("update  ripoff_urls set seach_index=3 where id= ?  ",[idd],function(error1,rows1,fields1){

                });
            }
        }

    });
}

//update search index
app.get('/updatesearchindex',function(req,resp){

    connection.query("update  ripoff_urls set seach_index=? where id= ?  ",[req.query.sindex,req.query.id],function(error1,rows1,fields1){
        if(error1){
            resp.send(({'status':0}));
        }else {
            resp.send(({'status':1}));
        }

    });

});

app.listen(port);
 console.log("App listening on port " + port);

