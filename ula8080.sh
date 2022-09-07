#!/bin/bash

ip="0.0.0.0"
port=8080

echo "${ip}   ${port}"
./ulaserver.py -i "${ip}" -p  ${port} -r /u/narnireport 
