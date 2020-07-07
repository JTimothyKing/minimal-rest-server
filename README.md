# minimal-rest-server

A tiny Node package providing a simple REST server intended as a
test double for integration testing REST clients.

**Note:** This package uses ESM ("import") modules and does not
yet support CommonJS ("require") module syntax.

## Synopsis

    // An example using Jest.

    import {newRestServer} from "minimal-rest-server";
    import {jest} from "@jest/globals";
    import express from "express";

    let testData, postData, httpServer;
    let getTestData = jest.fn(() => testData);
    let setPostData = jest.fn((data) => {
        postData.push(data);
        return data;
    });

    beforeEach(async () => {
        let server = newRestServer(); // returns an express app

        // Use express middleware as usual.
        server.use(express.json());

        // Configure routes as usual.
        server.get('/data.json', (req, res) => res.json(getTestData()));
        server.post('/data.json', (req, res) => res.json(setPostData(req.body)));

        // Start the server and return a listening HTTP server.
        httpServer = await server.startServer();

        postData = [];
    });

    test('client echoes back test data to server', async () => {
        testData = {'foo': 'bar'};

        // Use the base URL of the running fake service.
        await runClient(httpServer.baseUrl);

        expect(getTestData).toHaveBeenCalled();
        expect(postData).toEqual([testData]);
    });

    afterEach(async () => {
        await httpServer.destroy();
    });

