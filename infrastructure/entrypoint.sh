#!/bin/bash

if [ -z $REPO_URL ]; then
    echo "missing token"
    exit 1
fi
if [ -z $CONFIG_TOKEN ]; then
    echo "missing token"
    exit 1
fi


if [ ! -e ./initialized ]; 
then
    echo `pwd`
    if [ -z $REPO_URL ]; then
    echo "missing token"
    exit 1
    fi
    if [ -z $CONFIG_TOKEN ]; then
        echo "missing token"
        exit 1
    fi
    ./config.sh --url $REPO_URL --token $CONFIG_TOKEN --unattended --replace
    sudo ./svc.sh install github-runner
    touch initialized
fi 

sudo ./svc.sh status | grep 'active ( running )'
if [ ! $? -eq 0 ]; 
then
    sudo ./svc.sh start
fi 

tail -f /dev/null