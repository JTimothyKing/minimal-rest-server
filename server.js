import express from "express";
import enableDestroy from "server-destroy";

/**
 * Instantiates a new server.
 *
 * The server object is actually an express app that has been augmented with
 * a {@link startServer} method.
 *
 * @returns an express app
 */
export function newRestServer() {
    let server = express();
    server.startServer = startServer;
    return server;
}

/**
 * Starts an HTTP server listening.
 *
 * This method starts an HTTP server listening on localhost
 * on an auto-allocated port, and it returns the listening server.
 *
 * The returned http.Server object has been augmented with a baseUrl
 * property that contains the base URL of the listening server.
 * It has also been augmented with a destroy() function that can
 * be called to forcibly close all open sockets and close the server.
 *
 * @async
 * @returns {http.Server} the listening HTTP server
 */
async function startServer() {
    let httpServer = this.listen({port: 0, host: "localhost"});

    enableDestroy(httpServer);

    let httpAddress = await new Promise(resolve =>
        httpServer.once('listening', () => resolve(httpServer.address()))
    );

    let baseUrl = new URL("http://host/");
    baseUrl.hostname = httpAddress.address;
    baseUrl.port = httpAddress.port;
    httpServer.baseUrl = baseUrl.href;

    return httpServer;
}
