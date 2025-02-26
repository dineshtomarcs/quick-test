#!/bin/sh
ssh root@143.244.141.196<<EOF
   cd ~/testbox-backend
   git pull origin main
   yarn install
   pm2 restart all
   exit
EOF
