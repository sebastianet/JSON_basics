
// nova funcio yymmdd de Date() - at client
Date.prototype.yyyymmdd = function () {                            
	var yyyy = this.getFullYear().toString() ;                                    
	var mm   = (this.getMonth()+1).toString() ; // getMonth() is zero-based         
	var dd   = this.getDate().toString() ;
	return yyyy + '/' + (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]) ;
} ; // yyyymmd

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
} ; // hhmmss

// get a timestamp at client
function genTimeStamp ( arg ) {

    var szOut = "* " + (new Date).yyyymmdd() + ' - ' + (new Date).hhmmss() + " *" ;
    return szOut ;

} ; // genTimeStamp()

// ====================================================================================================================

// index.htm te
// <p> get <a href="#" class="clk_Timestamp">timestamp</a>
// <p id="id_info_timestamp">new timestamp</p>

$( ".clk_Timestamp" ).click( function() {
    console.log( '*** (' + genTimeStamp() + ') *** click Timestamp.' ) ;
    $.get( '/ts', function( page ) {
        console.log( '**** Demanem al express la branca TIMESTAMP.' ) ;
        $( "#id_info_timestamp" ).html( page ) ; // show received HTML at specific <div>
    } ) ; // get('/ts')
}) ; // clk_Timestamp

// ====================================================================================================================

// index.htm te
// <p> get <a href="#" class="clk_Serverinfo">serverinfo</a>
// <p id="id_info_serverinfo">new server info</p>

$( ".clk_Serverinfo" ).click( function( ) {
    console.log( '*** (' + genTimeStamp() + ') *** click ServerInfo.' ) ;
    $.getJSON( '/sysinfo_JSON', function( my_json ) {
        console.log( '**** Demanem al express la branca SYSINFO JSON.' ) ;
        var szInfo = `>>> (` + genTimeStamp() + `) host (${my_json.hostName}) at port (${my_json.myPort}).` ;
        $( "#id_info_serverinfo" ).text( szInfo ) ;
    } ) ; // get('/sysinfo')
}) ; // clk_Serverinfo

// ====================================================================================================================
// index.htm te
// <p>get <a href="#" class="clk_Serverstatus">status</a>
// <p id="id_info_status">new status</p>

$( ".clk_Serverstatus" ).click( function() {
    console.log( '*** (' + genTimeStamp() + ') *** click Serverstatus.' ) ;
    $.getJSON( '/sysStatus_JSON', function( qjson ) {
        console.log( '**** Demanem al express la branca WHOAMI.' ) ;
        var szStatus = `>>> (` + genTimeStamp() + `) prog(${qjson.ProgId}) at host (${qjson.HostName}) at port (${qjson.PortNum}).` ;
        $( "#id_info_status" ).text( szStatus ) ;
    } ) ; // get('/whoami')
}) ; // clk_Serverstatus

// ====================================================================================================================
// index.htm te
// <p>get <a href="#" class="clk_Ajuda">ajuda i github</a>
// <p id="id_info_ajuda">new ajuda</p>

$( ".clk_Ajuda" ).click( function() {
    console.log( '*** (' + genTimeStamp() + ') *** click Ajuda.' ) ;
    $.get( '/ajuda.htm', function( page ) {
        console.log( '**** Demanem al server la sub-pagina AJUDA.' ) ;
        $( "#id_info_ajuda" ).html( page ) ; // show received HTML at specific <div>
    } ) ; // get('/ajuda.htm')
}) ; // clk_Ajuda

// ====================================================================================================================

function index_ready() {              // DOM ready for index.htm

    console.log( '*** (' + genTimeStamp() + ') *** index DOM ready.' ) ;

// posar la data actual a dalt al mig - aixi diferenciem re-loads
    var szAra = '<center>./client/index.html - now is [' + genTimeStamp() + ']</center>' ;
    $( "#id_info_client_date" ).html( szAra ) ; // show actual date

} ; // index_ready(), DOM ready for INDEX.HTM

// ====================================================================================================================

$( function() {
	
    index_ready() ; // DOM ready event
  
} ) ; // DOM ready event
