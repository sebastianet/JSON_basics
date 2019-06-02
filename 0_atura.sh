#!/bin/bash

if [ `id -u`  -ne 0 ]
then
    echo "--- Must be running as root"
    exit 1
fi

strID='my_server.js'

echo "+++ (1) abans"
ps -ef | grep $strID | grep -v grep

toKILL=$(ps -ef | grep $strID | grep -v grep | awk '{print $2}')
echo ">>> (2) to stop ($strID) we want to kill ($toKILL)."

if [[ -n $toKILL ]]
then
    kill $toKILL
fi

echo "+++ (3) despres"
ps -ef | grep $strID | grep   -v grep

exit 0
