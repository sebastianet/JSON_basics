#!/usr/bin/env node

// minimal web server on pomnia PC
// so, scan_tron.sh does not give a false error on this IP
//
// test it by accessing http://10.139.238.194
//   http://83.38.148.213:7080/ if router has port forwarding (7080->192.168.1.254:80)
//
// versions :
//  20190121 : 1.1 - code start
//  20190122 : 1.2 - use full time and date format
//             1.3 - sudo : npm install morgan --save
//             1.4 - w500 : npm link express, npm link morgan
//             1.5 - from Windows use http://localhost:133/ or http://localhost:133/go
//             1.6 - npm link body-parser
//             2.0 - app.listen, no http
//             2.0.b - use port 80, so we start with sudo
//             2.1 - show current dir in /lsof
//             2.1.b - show filename
//             2.1.c - usr ENV
//             2.1.d - use github :
//                       npm init : package.json
//                       git init : /home/mate/nodejs-projects/min_web_server/.git/
//                       github : https://github.com/sebastianet/JSON_basics.git
//                       git remote add origin https://github.com/sebastianet/JSON_basics.git
//                       create .gitignore
//                       git add .
//                       git commit -am 'v 1.0 - first commit' 
//                       git push -u origin master
//             2.1.e - use .env - https://www.npmjs.com/package/dotenv
//             2.1.f - read nodes from text file
//

var myVersion = "2.1.f" ;

var express = require( 'express' ) ;
var morgan  = require( 'morgan' ) ;          // log requests to the console (express4)

var app = express() ;                        // instantiate Express and assign our app variable to it.
var bodyParser = require( 'body-parser' ) ;

const os = require( 'os' ) ;                 // https://nodejs.org/api/os.html
const dotenv = require('dotenv') ;           // sudo apt-get install dotenv
const fs = require('fs');
const path = require('path');

app.use( bodyParser.json() ) ;
app.use( morgan('dev') ) ;                   // log every request to the console

// serve static files from ...
app.use( express.static( path.join( __dirname, 'client' ) ) ) ;

// my variables

var szHostName = os.hostname() ;             // https://nodejs.org/api/os.html

const myEnv = dotenv.config();               //  read .env file, parse the contents, assign it to process.env
if ( myEnv.error ) {
    throw myEnv.error
} ;
console.log( myEnv.parsed ) ;
app.set( 'mPort', process.env.PORT || 81 ) ; // need 80 for wget

var myNodesText ;
var myNodesJS ;

// Date() prototypes - use as
// var szOut = (new Date).yyyymmdd() + '-' + (new Date).hhmmss() + ' ' + szIn + '<br>' ;

Date.prototype.yyyymmdd = function ( ) {

     var yyyy = this.getFullYear().toString();
     var mm   = (this.getMonth()+1).toString(); // getMonth() is zero-based
     var dd   = this.getDate().toString();
     return yyyy + '/' + (mm[1]?mm:'0'+mm[0]) + '/' + (dd[1]?dd:'0'+dd[0]);

}; // yyyymmdd()

Date.prototype.hhmmss = function () {

     function fixTime(i) {
          return (i < 10) ? "0" + i : i;
     }
     var today = new Date(),
          hh = fixTime( today.getHours() ),
          mm = fixTime( today.getMinutes() ),
          ss = fixTime( today.getSeconds() ) ;
     var myHHMMSS = hh + ':' + mm + ':' + ss ;
     return myHHMMSS ;

} ; // hhmmss()

function genTimeStamp ( arg ) {

    var szOut = "# " + (new Date).yyyymmdd() + ' - ' + (new Date).hhmmss() + " #" ;
//    console.log( 'gen a TimeStamp {' + szOut + '}' ) ;
    return szOut ;

} ; // genTimeStamp()

 
// +++ lets set some routes

app.use( function ( req, res, next ) {
//  console.log( '### common TimeStamp:', Date.now() ) ;
    console.log( '### [' + szHostName + '] common TimeStamp: ' + (new Date).yyyymmdd() + '-' + (new Date).hhmmss() + ' ###' ) ;
    next() ;
} ) ; // timestamp all

app.get( '/', function( req, res ) {
//
// mind the text "WebSrv" is detected by scan_list.rexx tool !
//
    var szTime = genTimeStamp() ;
    res.writeHead( 200, {'Content-Type': 'text/plain'} ) ;
    res.write( '\n*** host (' + szHostName + ') *** timestamp (' + szTime + ') *** MinWebSrv v [' + myVersion + '] *** \n' ) ;
    res.end( ) ;
    console.log( '* {' + szTime + '} * GET / method ' ) ;
 } ) ; // get /

 app.get( '/lsof', function( req, res ) {
   var szTime = genTimeStamp() ;
   res.writeHead( 200, {'Content-Type': 'text/plain'} ) ;
   res.write( '\n*** host (' + szHostName + ') *** timestamp (' + szTime + ') **** prog [' + __filename + '] *** \n' ) ;
   res.end( ) ;
   console.log( '* {' + szTime + '} * GET /lsof method' ) ;
 } ) ; // get /lsof

app.get( '/info', function (req, res) {
    res.send(serverInfo);
});
    
app.get( '/nodes', function (req, res) {
    res.send(nodes);
}); 

// +++ start the server
app.listen( app.get( 'mPort' ), () => {
    console.log( '*** MinWebSrv listening on port {' + app.get( 'mPort' ) + '}, host {' + szHostName + '} ...' )
} ) ;

