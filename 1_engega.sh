#!/bin/bash 

mydate=`date +"y%Y/m%m/d%d"`
mytime=`date +"h%H:m%M"`

myhn=$HOSTNAME

# Odin
# my_path="/home/pi/min_web_server"
# logFN="/home/pi/logs/min_web_server.log"

# T60 
# my_path="/home/sebas/node_projects/min_web_server"
# logFN="/home/sebas/node_projects/logs/min_web_server.log"

# Punt Omnia
# my_path="/home/mate/nodejs-projects/min_web_server"
# logFN="/home/mate/logs/min_web_server.log"

mLog="min_web_server.log"

if [ $myhn = "odin" ]
then
  my_path="/home/pi/min_web_server"
  logFN="/home/pi/logs/"$mLog
elif [ $myhn = "t60" ]
then
  my_path="/home/sebas/node_projects/min_web_server"
  logFN="/home/sebas/node_projects/logs/"$mLog
elif [ $myhn = "punt-omnia" ]
then
  my_path="/home/mate/nodejs-projects/min_web_server"
  logFN="/home/mate/logs/"$mLog
else
  my_path="/tmp"
  logFN="/tmp/"$mLog
fi

# posem linia a syslog - visible amb "cat /var/log/syslog | grep +++"
szTxt="("$mydate"-"$mytime") +++ min Web Server, log ("$logFN")."
logger  -i   -p user.info  $szTxt

echo "+++ [`date -R`] +++ {$0} +++ node Minimal Web Server app running on ("$myhn")." >> $logFN

/usr/bin/node  $my_path/my_server.js   >>  $logFN   2>&1   &

exit 22
