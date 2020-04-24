#!/bin/bash

rm -rf dist
mkdir dist
export OLDPWD=$(pwd)
cd venv/lib/python3.7/site-packages
zip -r9 ${OLDPWD}/dist/lambda.zip .
cd $OLDPWD
zip -g ./dist/lambda.zip main.py