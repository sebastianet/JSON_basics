#!/usr/bin/env node

// minimal web server on pomnia PC
// so, scan_tron.sh does not give a false error on this IP
//
// test it by accessing http://10.139.238.194
//   http://83.38.148.213:7080/ if router has port forwarding (7080->192.168.1.254:80)
//
// required modules :
//   // https://nodejs.org/api/os.html
//
// good URLs :
//   https://www.w3schools.com/js/default.asp
//
// versions :
//   20190121 : 1.1 - code start
//   20190122 : 1.2 - use full time and date format
//              1.3 - sudo : npm install morgan --save
//              1.4 - w500 : npm link express, npm link morgan
//              1.5 - from Windows use http://localhost:133/ or http://localhost:133/go
//              1.6 - npm link body-parser
//              2.0 - app.listen, no http
//              2.0.b - use port 80, so we start with sudo
//              2.1 - show current dir in /lsof
//              2.1.b - show filename
//              2.1.c - usr ENV
//              2.1.d - use github :
//                        npm init : package.json
//                        git init : /home/mate/nodejs-projects/min_web_server/.git/
//                        github : https://github.com/sebastianet/JSON_basics.git
//                        git remote add origin https://github.com/sebastianet/JSON_basics.git
//                        create .gitignore
//                        git add .
//                        git commit -am 'v 1.0 - first commit' 
//                        git push -u origin master
//              2.1.e - use .env - https://www.npmjs.com/package/dotenv
//              2.1.f - catch port busy
//              2.1.g - read nodes from text file
//              2.1.h - display port in ID message
//              2.1.i - wide menu
//

var myVersion = "2.1.i" ;

var express = require( 'express' ) ;
var morgan  = require( 'morgan' ) ;          // log requests to the console (express4)

var app = express() ;                        // instantiate Express and assign our app variable to it.
var bodyParser = require( 'body-parser' ) ;

const os = require( 'os' ) ;
const dotenv = require('dotenv') ;           // sudo apt-get install dotenv
const fs = require('fs');
const path = require('path');

app.use( bodyParser.json() ) ;
app.use( morgan('dev') ) ;                   // log every request to the console

// serve static files from ...
app.use( express.static( path.join( __dirname, 'client' ) ) ) ; // send index.html to "/" request

// my variables

const myEnv = dotenv.config();               //  read .env file, parse the contents, assign it to process.env
if ( myEnv.error ) {
    throw myEnv.error                        //  return an object with a parsed key containing the loaded content or an error key if it failed
} ;
console.log( myEnv.parsed ) ;                // display .env file contents

// app.set( 'mPort', process.env.PORT || 81 ) ; // need 80 for wget
let serverInfo = {
    started     : Date.now() ,
    nodesJsonFn : process.argv[2] || process.env.NODESJSON || path.join(os.homedir(),'nodes.json'), 
    hostName    : os.hostname() , 
    myPort      : process.env.PORT || 81 ,      // need 80 for wget from monitor
    myPid       : process.pid                   // prid
} ;

var szHostName = serverInfo.hostName ;

let szStartLine = '*** MinWebSrv listening on port {' + serverInfo.myPort + '}, host {' + szHostName + '} ...' ;

var myNodesText = {} ;
var myNodesJS   = {} ;

var Detalls = 1 ;                  // control de la trassa que generem via "mConsole"

// verify we have input file
if ( !fs.existsSync( serverInfo.nodesJsonFn ) ) return console.error( '---' + serverInfo.nodesJsonFn + ' not found ---' ) ;

// +++ definim algunes funcions

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


function mConsole ( szIn ) {

    if ( Detalls == 1 ) {
        console.log( genTimeStamp() + ' - ' + szIn ) ;
    } ;

} ; // mConsole()


function llegirFitxerJSON( config ) {

var szRet = "---" ;

    myNodesText = fs.readFileSync( config.nodesJsonFn, "utf-8" ) ;
    if ( ! myNodesText ) return console.error( "--- can't read "+config.nodesJsonFn ) ;
    myNodesJS = JSON.parse( myNodesText ) ;
    if ( ! Array.isArray( myNodesJS.list ) ) return console.error( '--- invalid '+config.nodesJsonFn ) ; // has to have "list"
    szRet = myNodesJS.desc ;
    return szRet ;

} ; // llegirFitxerJSON()

 
// +++ lets set some routes

app.use( function ( req, res, next ) {
//    console.log( '### [' + szHostName + '] common TimeStamp: ' + (new Date).yyyymmdd() + '-' + (new Date).hhmmss() + ' ###' ) ;
    console.log( '### common TimeStamp {' + genTimeStamp() + '} ### [' + szHostName + '] ###' ) ;
    next() ;
} ) ; // timestamp all


app.get( '/ts', function( req, res ) {
//
// mind the text "WebSrv" is detected by scan_list.rexx tool !
//
    var szTime = genTimeStamp() ;

    let szId = '\n*** timestamp (' + szTime + ') ' ;
    szId    += '*** host (' + szHostName + ') ' ;
    szId    += '*** port (' + serverInfo.myPort + ') ' ;
    szId    += '*** MinWebSrv v [' + myVersion + '] *** \n' ;

    res.writeHead( 200, {'Content-Type': 'text/plain'} ) ;
    res.write( szId ) ;
    res.end( ) ;
    mConsole( `'* {` + szTime + `} * GET /ts method '` ) ;
} ) ; // get /

app.get( '/sysinfo_JSON', function ( req, res ) { // serverinfo they call it 
    res.send( serverInfo ) ; // enviem un JSON !
});

app.get( '/whoami', function( req, res ) {

    var szTime = genTimeStamp() ;

    let szId = '\n*** timestamp (' + szTime + ') ' ;
    szId    += '*** host (' + szHostName + ') ' ;
    szId    += '*** port (' + serverInfo.myPort + ') ' ;
    szId    += '**** prog (' + __filename + ') ' ;
    szId    += '*** MinWebSrv v [' + myVersion + '] *** \n' ;

    res.writeHead( 200, {'Content-Type': 'text/plain'} ) ;
    res.write( szId ) ;
    res.end( ) ;
    mConsole( `* {` + szTime + `} * GET /whoami method` ) ;
} ) ; // get /whoami

app.get( '/veurejson', function ( req, res ) {
    res.send( myNodesJS ) ;
}); 

app.get( '/llegirjson', function ( req, res ) {
    var szTxt = llegirFitxerJSON( serverInfo ) ;
    res.writeHead( 200, {'Content-Type': 'text/plain'} ) ;
    res.write( '\n*** json id (' + szTxt + ') *** \n' ) ;
    res.end( ) ;
}); 

// +++ start the server
app.listen( serverInfo.myPort, () => {
    console.log( szStartLine ) ;
} ).on( 'error', function( err ) {
    if ( err.errno === 'EADDRINUSE' ) { // catch port in use error
        console.error( '--- port busy ---' ); 
    } else { 
        console.log( err ) ; 
    } ;
} ) ;


