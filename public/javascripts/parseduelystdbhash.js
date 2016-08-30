/*var fs = require('fs');
var cards;

fs.readFile('simplifiedcards.json', 'utf8', function (err, data) {
  if (err) throw err; // we'll not consider error handling for now
  cards = JSON.parse(data);
  loadSquad("MToxMDEsMzoxMTAsMzoxMTIsMzoxMTUsMzoxMTYsMzoxMjIsMjoxMTAxMSwyOjIwMDgwLDM6MjAwODUsMzoyMDA4NiwyOjIwMDg3LDM6MjAxMDIsMjoyMDEyOSwyOjIwMTU1LDM6MjAxNjgsMjozMDAwNw==");

  console.log(getSquadTextList());

}); */

// var cards = require('./cardtest.js').cards;

var squad = {};

//loadSquad()

//console.log(loadSquad("MToxMDEsMzoxMTAsMzoxMTIsMzoxMTUsMzoxMTYsMzoxMjIsMjoxMTAxMSwyOjIwMDgwLDM6MjAwODUsMzoyMDA4NiwyOjIwMDg3LDM6MjAxMDIsMjoyMDEyOSwyOjIwMTU1LDM6MjAxNjgsMjozMDAwNw==")); 

//console.log(Object.keys(squad));
//console.log(getSquadTextList());

function loadSquad(squadHash) {
  squad = {}; // delete the old squad
  try {
   // var s = new Buffer(squadHash, 'base64').toString();
      var s = atob(squadHash);
  } catch (e) {
    // TODO Tell the user that the hash is not valid.
    console.log(e);
    return false;
  }
  var sp = s.split(',');
  for (var p in sp) {
    var u = sp[p].split(':');
    if (!cards[u[1]]) {
      continue;
    }
    squad[u[1]] = {
      count: parseInt(u[0]),
      name: cards[u[1]]
        // unit: cards[u[1]]
    };
  }
  //  var generals = getCardsByCardAttr(squad, 'type', 'General');
//  console.log("loaded squad");
//  console.log(squad);
  return true;
}

function getSquadTextList() {
  var out = [];
  for (var unit_id in squad) {
    var cs = (squad[unit_id].count == 0) ? '' : ' x' + squad[unit_id].count;
    out.push(squad[unit_id].name + cs);
  }
  return out;
}

function getSquadList() {
  var out = [];
  for (var unit_id in squad) {
    for (var i = 0; i < squad[unit_id].count; i++){
      out.push(squad[unit_id].name);
    }
  }
  return out;
}


/*function getCardsByCardAttr(squad, attr, val) {
  var o = [];
  for (var s in squad) {
    if (squad[s].unit[attr] == val) {
      o.push(squad[s].unit);
    }
  }
  return o;
} */

