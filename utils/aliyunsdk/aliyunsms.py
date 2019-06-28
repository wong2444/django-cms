#!/usr/bin/env python
# coding=utf-8
import os
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import CommonRequest

ACCESS_KEY_ID = "LTAIXBRbGtoRJGem"
ACCESS_KEY_SECRET = "K7imQE95LsNIFBnQHSMmlE529nf3Mb"

client = AcsClient(ACCESS_KEY_ID, ACCESS_KEY_SECRET, 'ap-southeast-1')
request = CommonRequest()
request.set_accept_format('json')
request.set_domain('dysmsapi.ap-southeast-1.aliyuncs.com')
request.set_method('POST')
request.set_version('2018-05-01')
request.set_action_name('SendMessageToGlobe')


def send_sms(phone_numbers, message):
    request.add_query_param('To', phone_numbers)
    request.add_query_param('From', 'xfz')
    request.add_query_param('Message', message)
    response = client.do_action(request)
    return (str(response, encoding='utf-8'))
