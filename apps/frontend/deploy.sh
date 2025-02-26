
#!/bin/sh
ssh root@prod.testbox.build-release.com<<EOF
   cd ~/testbox
   git pull origin master
   npm install
   pm2 restart all
   exit
EOF
