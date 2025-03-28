import sys
import requests
import json

def get_positions():
    url = "https://api.upstox.com/v2/portfolio/short-term-positions"
    payload = {}
    headers = {
        "Authorization": f"Bearer {access_token}",
        'Accept': 'application/json'
    }

    response = requests.request("GET", url, headers = headers, data = payload).json()
    try:
        print(json.dumps(response['data'])) #This will be captured by Flask and sent to front-end
    except:
        print("Error in script")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        access_token = sys.argv[1]
        get_positions()
    else:
        print("Usage: python positions_script.py access_token")