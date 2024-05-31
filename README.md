# README #

This README document contains necessary steps to get the application up and running.

### What is this repository for? ###

* Storage bucket list 
* Version 1.0 
* Last modified 31.05.2024

### How do I get set up? ###

* Node vesrion 20.13.1
* NPM version 10.8.0
* The projects consists of an backend (backend/beApp.js) and frontend (src/App.js) application.
  The backend server is set to run on port 3001 (if it's not please correct Config.js accordingly),
  while the frontend runs on port 3000. Both applications get started concurrently.
* The database is contained in backend/bucketList.json.
* Steps to compile and start the application:
    - npm install
    - npm install concurrently --save-dev
    - npm install axios
    - npm start 
    - open we browser (if not opened automatically) and visit http://localhost:3000/

### Who do I talk to? ###

* Repo owner or admin
