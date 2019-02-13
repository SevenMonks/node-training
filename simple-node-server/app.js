const http = require('http'); // Import the http module. See more at https://nodejs.org/dist/latest-v10.x/docs/api/http.html

const hostname = '127.0.0.1',
  port = 3000;

const server = http.createServer((request, response) => {
  const responseData = {
    greetingMessage: 'Hello!! Developers from ShieldWatch!',
    greeter: 'Saptarshi Mandal'
  };

  response.writeHead(
    200,
    '200 OK',
    {
      'Content-Type': 'application/json'
    }
  );

  response.end(JSON.stringify(responseData));
});

server.listen(port, hostname, () => {
  console.log(`A simple node server is spinning at ${hostname}:${port}.`);
});
