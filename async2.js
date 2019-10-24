const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

function walk(directory, extension, filepaths = []) {
  const files = fs.readdirSync(directory);
  for (let filename of files) {
    const filepath = path.join(directory, filename);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, extension, filepaths);
    } else if (path.extname(filename) === extension) {
      filepaths.push(filepath);
    }
  }
  return filepaths;
}

const CHAOS_MONKEY = 1 - parseFloat(process.env.CHAOS_MONKEY || "0.001");

async function processDoc(fspath) {
  let totalHtmlLength = 0;
  const content = (await fsPromises.readFile(fspath, "utf8")).trim();
  if (!content) {
    return 0;
  }
  const json = JSON.parse(content);
  if (!json.documentData) {
    return 0;
  }
  const keys = ["quickLinksHTML", "bodyHTML", "tocHTML"];
  Object.keys(json.documentData).map(key => {
    if (keys.includes(key)) {
      const value = json.documentData[key];
      totalHtmlLength += value.length;
    }
  });
  if (Math.random() > CHAOS_MONKEY) {
    throw new Error("Chaos Monkey!");
  }
  return totalHtmlLength;
}

function parseArgs(args) {
  if (args.includes("-h") || args.includes("--help")) {
    console.log(`node ${__filename} [options] directory\n`);
    console.log(`Options:
    -h, --help    print this
    -b, --bail    exit immediately on first possible exception
    -q, --quiet   don't print each successfully processed file
    `);
    process.exit(0);
  }

  let bail = false;
  let quiet = false;
  if (args.includes("-b") || args.includes("--bail")) {
    bail = true;
    args = args.filter(a => !(a === "-b" || a === "--bail"));
  }
  if (args.includes("-q") || args.includes("--quiet")) {
    quiet = true;
    args = args.filter(a => !(a === "-q" || a === "--quiet"));
  }

  const root = args[0];
  return {
    root,
    bail,
    quiet
  };
}

async function main(args) {
  // By default, don't exit if any error happens
  const { bail, quiet, root } = parseArgs(args);
  const files = walk(root, ".json");
  let totalTotal = 0;
  let errors = 0;

  let values = await Promise.all(
    files.map(async file => {
      try {
        let total = await processDoc(file, quiet);
        !quiet && console.log(`${file} is ${total}`);
        return total;
      } catch (err) {
        if (bail) {
          console.error(err);
          process.exit(1);
        } else {
          console.error(err);
          errors++;
        }
      }
    })
  );
  totalTotal = values.filter(n => n).reduce((a, b) => a + b);
  console.log(`Total length for ${files.length} files is ${totalTotal}`);
  if (errors) {
    console.warn(`${errors} files failed.`);
    throw new Error("More than 0 errors");
  }
}

main(process.argv.slice(2)).catch(err => {
  process.exitCode = 1;
});
