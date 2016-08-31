var currentSquad, hand, squad = {};

function dealNewHand() {
  if (squad !== undefined) {
    // Have to load the squad first
    currentSquad = getSquadList();
    utils.shuffle(currentSquad);
    hand = currentSquad.slice(0, 5);
    currentSquad = currentSquad.slice(5, currentSquad.length);
    return hand;
  }
}

function resetSquad() {
  currentSquad = getSquadList();
  utils.shuffle(currentSquad);
}

function mulligan(cardIDs) {
  if (currentSquad == undefined) return; // Have to read the squad first
  var newCards = currentSquad.slice(0, cardIDs.length);
  currentSquad = currentSquad.slice(cardIDs.length, currentSquad.length);
  var id = 0;
  cardIDs.forEach((x) => {
    hand[x] = newCards[id++];
  });

  return hand;
}

function getCurve(types){
  var card, minionCurve = [];
  for(var i = 0; i < 10; i++){
    minionCurve[i] = 0;
  }
  for(var id in squad){
    card = squad[id];
    if(types.indexOf(card.type) != -1){
      minionCurve[card.cost] += card.count;
    }
  }
  console.log("Getting curve: " + minionCurve);
  return minionCurve;
}

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
      name: cards[u[1]].name,
      cost: cards[u[1]].cost,
      type: cards[u[1]].type
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
    for (var i = 0; i < squad[unit_id].count; i++) {
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
