const fs = require("fs");

for (let x = 0; x < 20; x++) {
  fs.readFile("/users/peterbe/Downloads/Keybase.dmg", (err, data) => {
    if (err) throw err;
    console.log(`File size#${x}: ${Math.round(data.length / 1e6)} MB`);
  });
}

// fs.readFile("./file.txt", "utf-8", (err, data) => {
//   if (err) throw err;
//   console.log("file.txt data: ", data.trim());
// });
