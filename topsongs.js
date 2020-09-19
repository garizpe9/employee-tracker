var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "NUxy6>cAoH",
  database: "top_songsdb",
});

connection.connect(function (err, res) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
});

function artist() {
  connection.query("SELECT * FROM top_songsdb.top5000", function (err, res) {
    if (err) throw err;
    //inquirer to use - see if you can just narrow down artists
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].artist);
    }
    console.log("-----------------------------------");
  });
}
artist();

function start() {
  inquirer
    .prompt({
      name: "Search",
      type: "input",
      message: "Enter Artist Name",
    })
    .then(function (answer) {
      connection.query(
      "SELECT artist,LOCATE('at', artist) " +
      "FROM top_songsdb " +
      "WHERE locate('at',artist)>="+answer.Search

      )}
    });
}


