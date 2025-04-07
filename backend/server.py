from flask import Flask, jsonify, request
from flask_cors import CORS

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import datetime

app = Flask(__name__)
CORS(app)

@app.route('/save-delay', methods=['POST'])
def save_delay():
    trains = request.get_json()
    trains = [(train["train_no"],train["train_name"]) for train in trains]

    DATA = {}
    for (train_no, train_name) in trains:

        url = f"https://etrain.info/train/{train_no}/history?d=1w"
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        driver = webdriver.Chrome(options=options)

        driver.get(url)
        soup = BeautifulSoup(driver.page_source, "html.parser")
        driver.quit()

        results = {}
        targets = soup.find_all("a", {"class": "runStatStn blocklink rnd5"})

        for div in targets:
            try:
                html = str(div)
                l = html.split("<")
                stn = l[2].split("\n")[1].strip()
                delay = int(l[6].split("/b> ")[1][:-6])
                td = datetime.timedelta(minutes=delay)
                results[stn] = f"{td.seconds//3600}:{(td.seconds//60)%60:02d}"
            except:
                continue
            
        DATA[train_name] = (list(results.items()))
    return jsonify(DATA)

@app.route('/train-delay', methods=['GET'])

def get_delay():
    train_no = request.args.get("train_no")
    period = request.args.get("period")

    url = f"https://etrain.info/train/{train_no}/history?d={period}"

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)

    driver.get(url)
    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    results = {}
    targets = soup.find_all("a", {"class": "runStatStn blocklink rnd5"})

    for div in targets:
        try:
            html = str(div)
            l = html.split("<")
            stn = l[2].split("\n")[1].strip()
            delay = int(l[6].split("/b> ")[1][:-6])
            td = datetime.timedelta(minutes=delay)
            results[stn] = f"{td.seconds//3600}:{(td.seconds//60)%60:02d}"
        except:
            continue
    print(results)
    return jsonify(list(results.items()))

if __name__ == '__main__':
    app.run(port=5000)
