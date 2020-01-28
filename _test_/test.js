const request = require("supertest");
const express = require("express");
const db = new sqlite3.Database(":memory");
const app = express();

describe('auth route', () => {

    beforeEach(() => [
        
    ])

    it('should work', () => {
        expect(2 + 2).toBe(4);
    });
});