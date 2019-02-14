const fs = require('fs'),
  path = require('path');

setTimeout(() => console.log(`Standalone: setTimeout callback executed at: ${new Date().getTime()}`), 0);

setImmediate(() => console.log(`Standalone: setImmediate callback executed at: ${new Date().getTime()}`));

console.log(`Standalone: file reading initiated at: ${new Date().getTime()}`);

fs.readFile(path.resolve('./', 'assets', 'lipsum-input.txt'), (fileReadError, fileData) => {
  console.log(`File reading completed at: ${new Date().getTime()}`);
  if (fileReadError) {
    console.log(fileReadError);
  } else {
    console.log(fileData);

    console.log(`Inside readFile callback: file writing started at: ${new Date().getTime()}`);

    fs.writeFile(
      path.resolve('./', 'assets', 'lipsum-output.txt'),
      fileData,
      {
        flag: 'a+'
      },
      (fileWriteError) => {
        console.log(`File writing completed at: ${new Date().getTime()}`);
        if (fileWriteError) {
          console.log(fileWriteError);
        } else {
          setTimeout(() => console.log(`Inside writeFile callback: setTimeout callback executed at: ${new Date().getTime()}`), 0);
          setImmediate(() => console.log(`Inside writeFile callback: setImmediate callback executed at: ${new Date().getTime()}`));
        }
      }
    );

    setTimeout(() => console.log(`Inside readFile callback: setTimeout callback executed at: ${new Date().getTime()}`), 0);
    setImmediate(() => console.log(`Inside readFile callback: setImmediate callback executed at: ${new Date().getTime()}`));
  }
});
