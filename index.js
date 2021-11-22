const https = require('https');
//const http = require('http');
 const fs = require('fs');
 
const options = {
  key: fs.readFileSync('testkey.pem'),
  cert: fs.readFileSync('test.crt')//cert.pem
};

 var port = 22222;
 var ip= "127.0.0.1";
 
 
 require('dns').lookup(require('os').hostname(), function (err, add, fam) {
 // console.log('addr: '+add);
  ip = add; // if netwerk allows it - Windows  Firewall - https://stackoverflow.com/questions/5489956/how-could-others-on-a-local-network-access-my-nodejs-app-while-its-running-on/5490033
 	console.log("HTTPS server started at https://"+ip+":" + port.toString());
	
	launchServer();
	
});

function launchServer(){
https.createServer(options, function (req, res) { 

var feedbackUrl = req.url;
  if (feedbackUrl.trim() === '/') {//REF: https://stackoverflow.com/questions/4720343/loading-basic-html-in-node-js
        res.writeHead(200, {'Content-Type': 'text/html'});
              fs.createReadStream('synth.html').pipe(res);//  fs.createReadStream('selectionMenu.html').pipe(res);
    }  
 else   if (feedbackUrl.trim() === '/po') {
		    res.writeHead(302, {
      location: "/static/PocketOperator555LF0/index.html",
    });
    res.end();
    } 	
	 else   if (feedbackUrl.trim() === '/drum') {
		    res.writeHead(302, {
      location: "/static/drumMachine/index.html",
    });
    res.end();
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
  fs.readFile(__dirname + feedbackUrl, function (err,data) {//REF:https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
  
  }
  
}).listen(port,"0.0.0.0");

 


}
