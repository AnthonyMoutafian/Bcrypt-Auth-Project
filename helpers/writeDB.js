const fs = require("fs/promises");
const path = require("path");

async function writeDB(data) {
  const dbPath = path.join(__dirname, "../db/users.json");

  await fs.writeFile(
    dbPath,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

module.exports = {
  writeDB,
};