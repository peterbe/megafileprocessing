const fs = require("fs");

for (let x = 0; x < 20; x++) {
  const largeFile = fs.readFileSync("/users/peterbe/Downloads/Keybase.dmg");
  console.log(`File size#${x}: ${Math.round(largeFile.length / 1e6)} MB`);
}

const data = fs.readFileSync("./file.txt", "utf-8"); // blocks here until file is read
console.log("file.txt data: ", data.trim());
