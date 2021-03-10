from json import dump
import re
from bson import objectid
import flask
import pymongo

from flask import Flask, request
from pymongo import MongoClient, mongo_client
from bson.json_util import dumps
from bson.objectid import ObjectId
from flask_cors import CORS
from DatabaseConfig import _password_

app = Flask(__name__)
CORS(app)
mainPasscode = 'EDXX4jCQs'

client = MongoClient(
    f'mongodb+srv://Avoded2:{_password_}@cluster0.vwucm.mongodb.net/FinancialDashbord?retryWrites=true&w=majority', tls=True)
db = client["FinancialDashbord"]
users = db["users"]


@app.route("/users/", methods=['GET', 'POST'])
def getUsers(passcode):
    if passcode != mainPasscode:
        return dumps(False)
    if request.method == 'GET':
        res = None
        if "_id" in request.args:
            res = users.find({"_id": ObjectId(request.args.get("_id"))})
        else:
            res = users.find(request.args.to_dict())
        return dumps(res)
    if request.method == 'POST':
        password = request.json["Password"]
        email = request.json["Email"]
        users.insert_one(request.json)
        return dumps(users.find_one({"Password": password, "Email": email}))


@app.route('/users/<passcode>/movements/', methods=['DELETE', 'POST'])
def movements(passcode):
    if passcode != mainPasscode or not "_id" in request.args:
        return dumps(False)
    if request.method == 'POST':
        print("hello")
        res = users.find_one({"_id": ObjectId(request.args.get("_id"))})[
            "Movements"]
        data = request.json
        data["_id"] = ObjectId()
        res.append(data)
        user = users.find_one_and_update({"_id": ObjectId(request.args.get("_id"))}, {
            '$set': {"Movements": res}})
        return dumps(user)
    if request.method == 'DELETE':
        res = users.find_one({"_id": ObjectId(request.args.get("_id"))})[
            "Movements"]
        uuid = request.args.get("uuid")
        for n in res:
            if str(n["_id"]) == str(uuid):
                res.remove(n)
                break
        users.find_one_and_update({"_id": ObjectId(request.args.get("_id"))}, {
                                  '$set': {"Movements": res}})
        user = users.find_one({"_id": ObjectId(request.args.get("_id"))})
        return dumps(user)
    return dumps({})


@app.route('/users/<passcode>/delete-all/<adminPassword>', methods=['DELETE'])
def deleteAll(passcode, adminPassword):
    if passcode == mainPasscode and adminPassword == 'Avoded2082':
        res = users.find({})
        for n in res:
            users.delete_one({"_id": n["_id"]})
        return dumps(True)
    else:
        return dumps(False)


@app.route('/users/<passcode>/delete-one/<ID>', methods=['DELETE'])
def deleteOne(passcode, ID):
    if passcode == mainPasscode:
        res = users.find_one_and_delete({"_id": ObjectId(ID)})
        return dumps(res)
    else:
        return dumps(False)


if __name__ == "__main__":
    app.run()
