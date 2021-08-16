var cluster = require('cluster');

const http = require('http');
 const fs = require('fs');
var os = require( 'os' );
const path = require('path');

const { parse } = require('querystring');
 
 
const directoryPath = path.join(__dirname, 'static');

 var port = process.env.PORT || 8010;;//REF:https://help.heroku.com/P1AVPANS/why-is-my-node-js-app-crashing-with-an-r10-error
  
	if(cluster.isMaster) {//REF: https://www.sitepoint.com/how-to-create-a-node-js-cluster-for-speeding-up-your-apps/ & https://stackoverflow.com/questions/5999373/how-do-i-prevent-node-js-from-crashing-try-catch-doesnt-work
    var numWorkers =process.env.WEB_CONCURRENCY || 1;// require('os').cpus().length; https://stackoverflow.com/questions/28616813/how-to-properly-scale-nodejs-app-on-heroku-using-clusters

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
	
	
} else {
	launchServer();}
	
	process
  .on('unhandledRejection', (reason, p) => {//https://shapeshed.com/uncaught-exceptions-in-node/ & https://stackoverflow.com/questions/40867345/catch-all-uncaughtexception-for-node-js-app
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });
  
	 

 

function launchServer(){
const server = http.createServer((req, res) => {
 var feedbackUrl = req.url;

	feedbackUrl = feedbackUrl.replace(/(.*?) ?fbclid.*/i, "$1").trim(); // handling fb click id
					if(feedbackUrl.slice(-1) =="?"){
			feedbackUrl =feedbackUrl.substring(0, req.url.length - 1).trim();
			}
  if (feedbackUrl.trim() === '/') {//REF: https://stackoverflow.com/questions/4720343/loading-basic-html-in-node-js
        res.writeHead(200, {'Content-Type': 'text/html'});
              fs.createReadStream('synth.html').pipe(res);//  fs.createReadStream('selectionMenu.html').pipe(res);
    }     
 else if (feedbackUrl.split('?')[0] === '/') {//REF: https://stackoverflow.com/questions/4720343/loading-basic-html-in-node-js
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('synth.html').pipe(res);
    }     
 else if (feedbackUrl .includes( '/DIR') )
  {	  var path =__dirname +feedbackUrl.replace("DIR",""); //REF: https://stackoverflow.com/questions/2727167/how-do-you-get-a-list-of-the-names-of-all-files-present-in-a-directory-in-node-j
   fs.readdir(path, (err, files) => {
	       if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
      res.writeHead(200);
    res.end(files.join());

});
  
  }
  else{
	  	  var dir=__dirname + req.url;

  			dir = dir.replace(/(.*?) ?fbclid.*/i, "$1"); // handling fb click id
					if(dir.slice(-1) =="?"){
			dir =dir.substring(0, dir.length - 1);
			}


  fs.readFile(dir, function (err,data) {//REF:https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
  }
  
  
  
}).listen(port, () => {
    console.log("Our app is running on port ${ PORT }. (Default = 8010)");
});}