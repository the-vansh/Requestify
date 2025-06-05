const WebSocket = require("ws");

let wss; 

function setWSS(serverInstance) {
  wss = serverInstance;
}

function broadcast(data) {
  if (!wss) {
    return;
  }

  const message = JSON.stringify(data);

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
      } catch (err) {
      }
    }
  });
}

module.exports = { broadcast, setWSS };