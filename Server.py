from datetime import datetime
from json import dump
from random import Random
import re
from time import time
from bson import objectid
import flask
import pymongo

from flask import Flask, request
from pymongo import MongoClient, mongo_client
from bson.json_util import dumps
from bson.objectid import ObjectId
from flask_cors import CORS
from DatabaseConfig import _password_
from Crypto.Cipher import AES

app = Flask(__name__)
CORS(app)
client = MongoClient(
    f'mongodb+srv://Avoded2:{_password_}@cluster0.vwucm.mongodb.net/FinancialDashbord?retryWrites=true&w=majority', tls=True)
db = client["FinancialDashbord"]
users = db["users"]


@app.route("/users/", methods=['GET', 'POST'])
def getUsers():
    if request.method == 'GET':
        res = None
        if "_id" in request.args:
            res = users.find({"_id": ObjectId(request.args.get("_id"))})
        else:
            res = users.find(request.args.to_dict())
        return dumps(res)
    if request.method == 'POST':
        email = request.json["email"]
        users.insert_one(request.json)
        res = users.find_one({'email': email})
        return dumps(res)


@app.route('/users/open-connect/', methods=['GET'])
def OpenConnect():
    email = request.args.get('email')
    password = request.args.get('password')
    user = users.find_one({'email': email, 'password': password})
    return(dumps(user))
    logs = user['logs']
    logs.append({'open': (datetime.now()), 'close': None})
    user = users.find_one_and_update(
        {'email': email, 'password': password}, {'$set': {'logs': logs}})
    return dumps(user)


@app.route('/users/close-connect/<id>', methods=['GET'])
def CloseConnect(id):
    user = users.find_one({'_id': ObjectId(id)})
    print(user.logs)
    logs = user['logs']
    logs[-1]['close'] = datetime.now()
    user2 = users.find_one_and_update(
        {'_id': ObjectId(id)}, {'$set': {'logs': logs}})
    return dumps(user2)


@ app.route("/users/exist-email/", methods=['GET'])
def existEmail():
    user = users.find({"email": request.args.get('email')})
    if user.count() > 0:
        return dumps(True)
    else:
        return dumps(False)


@ app.route("/users/forget/<email>", methods=['GET', 'FATCH'])
def forget(email):
    if request.method == 'FATCH':
        users.find_one_and_update({'email': email}, {'verify': {'code': Random(
            100000), 'expire':  datetime(datetime.now() + 10 * 60 * 1000)}})
        return dumps(True)
    if request.method == 'GET':
        user = users.find_one({'email': email})
        if('passowrd' in request.args and 'code' in request.args):
            if request.args.get('code') == user['verify']['code'] and (datetime.now() - datetime(user['verify']['expire']) <= 10 * 60 * 1000):
                users.find_one_and_update(
                    {'email': email}, {'password': request.args.get('password')})
                return dumps(True)
            else:
                return dumps(False)
        else:
            return dumps('error')


@ app.route('/users/movements/<userId>', methods=['DELETE', 'POST'])
def movements(userId):
    if request.method == 'POST':
        res = users.find_one({"_id": ObjectId(userId)})["movements"]
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


@app.route('/users/delete-all/<adminId>/<adminPassword>', methods=['DELETE'])
def deleteAll(adminId, adminPassword):
    admin = users.find_one({"_id": ObjectId(adminId)})
    if admin["admin"] and adminPassword == admin.password:
        res = users.find({})
        for n in res:
            users.delete_one({"_id": n["_id"]})
        return dumps(True)
    else:
        return dumps(False)


@app.route('/users/delete/<userId>/<userPassword>/<userIdToDelete>', methods=['DELETE'])
def deleteOne(userId, userPassword, userIdToDelete):
    user = users.find_one({"_id": ObjectId(userId)})
    if userId == userIdToDelete and user["password"] == userPassword or user["admin"] and user["password"] == userPassword:
        res = users.find_one_and_delete({"_id": ObjectId(userIdToDelete)})
        return dumps(True)
    return dump(False)


if __name__ == "__main__":
    app.run()
