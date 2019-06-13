#!/bin/bash
clear
echo ">>> (1) engegar WMS al POMNIA"
cd   /home/mate/nodejs-projects/min_web_server
sudo ./1_engega.sh
rv=$?
echo "RV = "$rv

echo ">>> (2) start TAIL if you want"
echo "    tail -f  /home/mate/logs/min_web_server.log    &  "

echo ">>> (3) hi es o no ?"
ps -ef | grep -v grep | grep my_server.js

echo "dew"
exit 0
