#!/bin/sh
echo "Staring the execution of stage.sh script....."
chmod 400 dev_key.pem
# Creating stage folder in root directory. If stage folder already exists then removing the contents of the stage folder.
echo "Creating/Removing stage folder."
ssh -i "dev_key.pem" $allowSSHFlag $User@$Host "ls -lrt"
