#!/bin/sh
#
# Sample script to remotely get/set firebase app rules

FIREBASE_SECRET='lAWGcjEpMgHMkwFOCzqchkh95T05uZYthYwl8F5R'
APP_NAME='smartup'

# get app rules
curl "https://$APP_NAME.firebaseio.com/.settings/rules.json?auth=$FIREBASE_SECRET"

# set app rules
#curl -X PUT -d '{ "rules": { ".read": true } }' "https://$APP_NAME.firebaseio.com/.settings/rules.json?auth=$FIREBASE_SECRET"