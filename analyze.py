import requests
import json

url = "https://cs536.escglobal.co/v1/message/all/http"

headers = {}
payload = {}

protocol = "WEBSOCKET"
# protocol = "HTTP"

print(requests.request("GET", url, headers=headers, data=payload).json())

diff_arr = []

def import_data():
    """
    returns data in json object formats
    """
    with open('sample.json', 'r') as file:
        data = json.load(file)

    return data

def calc_diff_per_msg(msg):
    """
    returns difference in time between request and response
    """

    # check if stamps from CLIENT_SENT_TO_SERVER and SERVER_RECEIVED_FROM_CLIENT are present
    client_sent_to_server = False
    server_received_from_client = False

    a, b = 0, 0

    # 1701998340000
    if(int(msg['stamps'][0]['timestamp']) > 1701999180000):
        return None


    for stamp in msg['stamps']:
        if stamp['source'] == 'CLIENT_SENT_TO_SERVER':
            client_sent_to_server = True
            a = int(stamp['timestamp'])
        elif stamp['source'] == 'SERVER_RECEIVED_FROM_CLIENT':
            server_received_from_client = True
            b = int(stamp['timestamp'])

    if client_sent_to_server == False or server_received_from_client == False:
        return None


    diff = abs(a - b)

    diff_arr.append(diff)

    return diff

def calc_avg_diff_per_sess_id(sess_id_list):
    """
    returns average difference in time per session id
    """

    # get avg diff per message
    avg_diff_per_msg = 0
    for msg in sess_id_list['messages']:
        diff_per_msg = calc_diff_per_msg(msg)

        if diff_per_msg is not None:
            avg_diff_per_msg += diff_per_msg

    return avg_diff_per_msg / len(sess_id_list['messages'])

def calculate_average_RTT():
    # import data
    data = requests.request("GET", url, headers=headers, data=payload).json()

    avg_RTT = 0

    for sess_id in data[protocol]:
        # calculate average round trip time per session id
        diff = calc_avg_diff_per_sess_id(sess_id)
        avg_RTT += diff

    return avg_RTT / len(data[protocol])

# print("Average RTT:", calculate_average_RTT())
# print(diff_arr)
# print("Maximum RTT", max(diff_arr))
# print("Minimum RTT", min(diff_arr))