const fs = require("fs");

Promise.all(
  [...Array(20).fill()].map((_, x) => {
    return fs.readFile("/users/peterbe/Downloads/Keybase.dmg", (err, data) => {
      if (err) throw err;
      console.log(`File size#${x}: ${Math.round(data.length / 1e6)} MB`);
    });
  })
);
