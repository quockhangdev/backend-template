import WebSocket from "ws";
import queryString from "query-string";
import log from "../utils/logger";
import http from "http";

export default (server: http.Server) => {
  const ws = new WebSocket.Server({
    port: 8080,
    noServer: true,
    path: "/ws",
  });
  return ws;
};
