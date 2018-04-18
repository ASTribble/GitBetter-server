'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const expect = chai.expect;


// const {dbConnect, dbDisconnect} = require('../db-mongoose');

const {User} = require('../users/models');
const {Question} = require('../questions/models');
const {seedData} = require('../questions/seedData');
const {app, runServer, closeServer} = require('../index');
const {TEST_DATABASE_URL} = require('../config');
// const {dbConnect, dbDisconnect} = require('../db-knex');

chai.use(chaiHttp);

// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

//drops the database so there is a fresh start

before(function() {
    console.log('running server');
    return runServer(TEST_DATABASE_URL);
});

beforeEach(function() {
    console.info('seeding question data');
    return Question.insertMany(seedData);
});

afterEach(function() {
    console.log('dropping database');
    return mongoose.connection.dropDatabase();
});

after(function() {
    return closeServer();
});

//======== Beginning of Tests ==========================

describe('Mocha and Chai', function() {
    it('should be properly setup', function() {
        expect(true).to.be.true;
    });
});

describe('User POST endpoint', function(){

    it('Should create a new User', function(){
        //Strategy:
        // make a new User,
        //see if user is there
        const newUser = {
            firstName: 'Kermit',
            lastName: 'Frog',
            username: 'Kermie',
            password: 'banjoesRock',
            stageName: 'Oscar'
        };

        return chai.request(app)
        .post('/api/users')
        .send(newUser)
        .then(function() {
            return User.find();
        })
        .then( res => {
            expect(res).to.be.an('array');
            const user = res[0];
            expect(user.username).to.deep.equal(newUser.username);
            expect(user.firstName).to.deep.equal(newUser.firstName);
            expect(user.lastName).to.deep.equal(newUser.lastName);
            expect(user.password).to.not.equal(newUser.password);
            expect(user._id).to.exist;
            expect(user._id).to.not.be.empty;
            expect(user.stageName).to.not.exist;
        });
    })
});
