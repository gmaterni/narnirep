#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from datetime import datetime
import time
import sys

import requests
import os
#from ulalib.ualog import Log

# logerr = Log("a")
# logerr.open("log/server.err", 0)


def send_request(ip, p):
    url = f'http://{ip}:{p}/status'
    try:
        r = requests.get(url)
        if r.status_code != 200:
            raise Exception(r.status_code)
    except Exception as e:
        print(e)
        sys.exit()
        #logerr.log(e)
        #os.system("systemctl restart ulaserver.service")


if __name__ == '__main__':
    port=sys.argv[1]
    # send_request("0.0.0.0", port)
# 
if __name__ == '__main__':
    msg=sys.argv[1]
    t0 = datetime.now()
    send_request("0.0.0.0", 8080)
    for x in range(5000):
        send_request("0.0.0.0", 8080)
    t1 = datetime.now()
    print(f"{msg}   {t1-t0}")
