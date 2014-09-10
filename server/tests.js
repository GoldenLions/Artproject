var fs = require('fs');
var _ = require('lodash');
var engine = require('./engine.js');
var Engine = engine.Engine;
var Trie = engine.Trie;

var convertToUnique = function(file, key) {
  var objs = JSON.parse(fs.readFileSync(file));
  var uniques = {};
  var result = [];
  for (var i = 0, len = objs.length; i < len; i++) {
    uniques[objs[i][key]] = true;
  }
  for (var artist in uniques) {
    result.push(artist);
  }
  fs.writeFile('unique-'+file, JSON.stringify(result), function() {
    console.log(file +' convert finished.')
  });
};

var composeTrie = function (file,write) {
  var array = JSON.parse(fs.readFileSync(file));
  var trie = new Trie();
  trie.add(array);

  if (write) {
    fs.writeFile('trie-'+file, trie.serialize(), function() {
      console.log(file + ' file finished.');
    })
  }

  return trie;
};

var testTrie = function(file,write) {
  var start = Date.now();
  var trie = composeTrie(file,write);
  console.log(Date.now() - start);
};


composeEngine = function(file,write) {
  var array = JSON.parse(fs.readFileSync(file));
  var engine = new Engine();
  engine.add(array);

  if (write) {
    fs.writeFile('engine-'+file, JSON.stringify(engine), function() {
      console.log(file + ' file finished.');
    })
  }

  return engine;
};

var testEngine = function(file,write) {
  var start = Date.now();
  var engine = composeEngine(file,write);
  console.log('Initialization took:',(Date.now() - start)+'ms.');

  start = Date.now();
  console.log(engine.match(['bur','sta','looki', 'west']))
  console.log('.match took:',(Date.now() - start)+'ms.');
};

// convertToUnique('title.json','title');
// convertToUnique('artist.json','artist');
// convertToUnique('medium.json','medium');

// testTrie('unique-title.json');
testEngine('unique-title.json');

// composeEngine('unique-title.json', true);
// composeEngine('unique-artist.json', true);
// composeEngine('unique-medium.json', true);

