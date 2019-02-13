const http = require('http');

const hostname = '127.0.0.1',
  port = 3000;

const users = [
  {
    id: 1,
    firstName: 'Saptarshi',
    middleName: '',
    lastName: 'Mandal',
    sex: 'M',
    jobRole: 'Software Engineer'
  },
  {
    id: 2,
    firstName: 'Suman',
    middleName: 'Gupta',
    lastName: 'Chowdhury',
    sex: 'M',
    jobRole: 'Systems Engineer'
  },
  {
    id: 3,
    firstName: 'Snehasis',
    middleName: '',
    lastName: 'Maity',
    sex: 'M',
    jobRole: 'Test Automation Developer'
  }
];

const fetchData = (userId, callback) => {
  setTimeout(() => {
    const matchedUser = users.find(thisUser => (+userId === thisUser.id));

    if (matchedUser) {
      callback(null, matchedUser);
    } else {
      callback(
        new Error(`User with ID ${userId} doesn't exist.`),
        null
      );
    }
  }, 2000);
};

const fetchDataInPromise = userId => {
  return new Promise((resolve, reject) => {
    const matchedUser = users.find(thisUser => (userId === thisUser.id));

    if (matchedUser) {
      return setTimeout(() => resolve(matchedUser), 2000);
    } else {
      return setTimeout(() => reject(new Error(`User with ID ${userId} doesn't exist.`)), 2000);
    }
  });
};

const fetchDataAsync = async userId => {
  try {
    const matchedUser = await fetchDataInPromise(userId);

    return matchedUser;
  } catch (userFetchError) {
    return userFetchError;
  }
};

const sendResponse = (response, code = 200, message = '200 OK', data = {}) => {
  code = code || 200;
  message = message || '200 OK';
  data = data || {};

  response.writeHead(
    code,
    message,
    {
      'Content-Type': 'application/json'
    }
  );

  response.end(JSON.stringify(data));
};

const server = http.createServer(async (request, response) => {
  const requestUrl = request.url;

  if (-1 === requestUrl.indexOf('users')) {
    sendResponse(
      response,
      404,
      '404 Not Found',
      {
        errorMessage: 'The requested resource was not found!'
      }
    );
  } else {
    let statusCode = 404,
      statusMessage = '404 Not Found',
      responseData = {};

    const userId = requestUrl.substring((requestUrl.lastIndexOf('/') + 1));

    if (!userId) {
      responseData = {
        errorMessage: 'The requested resource was not found!'
      };

      sendResponse(
        response,
        statusCode,
        statusMessage,
        responseData
      );
    } else {
      console.log(`User fetch request sent at: ${new Date().getTime()}`);

      fetchData(+userId, (userFetchError, user) => {
        if (userFetchError) {
          console.log(`Error message received at: ${new Date().getTime()}`);
          console.log(userFetchError.message);

          responseData = {
            errorMessage: userFetchError.message
          };
        } else {
          console.log(`User received at: ${new Date().getTime()}`);
          console.log(user);

          statusCode = 200;
          statusMessage = '200 OK';
          responseData = user;
        }

        sendResponse(
          response,
          statusCode,
          statusMessage,
          responseData
        );
      });

      // fetchDataInPromise(+userId)
      //   .then(user => {
      //     console.log(`User received at: ${new Date().getTime()}`);
      //     console.log(user);

      //     sendResponse(
      //       response,
      //       null,
      //       null,
      //       user
      //     );
      //   })
      //   .catch(userFetchError => {
      //     console.log(`Error message received at: ${new Date().getTime()}`);
      //     console.log(userFetchError.message);

      //     sendResponse(
      //       response,
      //       404,
      //       '404 Not Found',
      //       {
      //         errorMessage: userFetchError.message
      //       }
      //     );
      //   });

      // try {
      //   const user = await fetchDataAsync(+userId);

      //   console.log(`User received at: ${new Date().getTime()}`);
      //   console.log(user);

      //   sendResponse(
      //     response,
      //     null,
      //     null,
      //     user
      //   );
      // } catch (userFetchError) {
      //   console.log(`Error message received at: ${new Date().getTime()}`);
      //   console.log(userFetchError.message);

      //   sendResponse(
      //     response,
      //     404,
      //     '404 Not Found',
      //     {
      //       errorMessage: userFetchError.message
      //     }
      //   );
      // }
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Node server spinning at http://${hostname}/${port}.`);
});
