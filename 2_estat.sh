#!/bin/bash

strID='my_server.js'

echo "+++ tenim la APP ($strID) running ? +++"
ps -ef | grep $strID | grep -v grep
rv=$?
echo "RV =" $rv

if [ $rv -eq 0 ]; then
    toKILL=$(ps -ef | grep $strID | grep -v grep | awk '{print $2}')
    echo ">>> app ($strID) has pid ($toKILL)."
fi

exit 0
