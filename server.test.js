/**
 * Run the server through an integration test in which it starts up,
 * serves a GET request, and can be destroyed.
 *
 * Note that if something goes wrong with the HTTP server,
 * it may leave open handles, which may keep the test process from
 * ending. In this case, Jest will output an appropriate error.
 */

import {jest} from '@jest/globals';
import fetch from "node-fetch";
import {newRestServer} from "./server";

test('server lifecycle', async () => {
    let server = newRestServer();
    expect(server).toBeDefined();

    let testData = 'TEST DATA';
    let getTestData = jest.fn(() => testData);
    server.get('/data.txt', (req, res) => res.send(getTestData()));

    let httpServer = await server.startServer();
    expect(httpServer).toBeDefined();

    expect(httpServer.baseUrl).toBeDefined();

    const response = await fetch(httpServer.baseUrl + 'data.txt');
    await expect(response.text()).resolves.toEqual(testData);

    expect(httpServer.destroy).toBeDefined();
    await expect(httpServer.destroy()).resolves;
});
