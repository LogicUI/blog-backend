const request = require("supertest");
const app = require("../index");
const express = require("express");

describe('auth route', () => {


    it('should work', async done=> {
        const response = await request(app);
        done();
    });


});