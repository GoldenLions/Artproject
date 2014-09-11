var fs = require('fs');
var _ = require('lodash');
var engine = require('../engine.js');
var Engine = engine.Engine;
var Trie = engine.Trie;

var convertToUnique = function(files, keys) {
  files = files instanceof Array ? files : [files];
  keys = keys instanceof Array ? keys : [keys];
  var result = _.uniq(_.reduce(_.map(files, function(file,i) {
    return _.map(JSON.parse(fs.readFileSync(file)),function(obj) {
      return obj[keys[i]];
    });
  }), function(memo, array) {
    return memo.concat(array);
  },[]));
  var filename = 'unique'+_.reduce(files,function(memo,file) {
    return memo + '-' + file.slice(0,file.lastIndexOf('.'))
  },'')+'.json';
  fs.writeFile(filename, JSON.stringify(result,null,2), function() {
    console.log(filename +' convert finished.')
  });
};

var uniqueTerms = function(file) {
  var array = JSON.parse(fs.readFileSync(file));
  var uniques = {};
  var terms;
  _.each(array, function(sentence) {
    terms = sentence.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').toLowerCase().split(' ');
    _.each(terms,function(word) {
      if (word.length > 3) uniques[word] = true;
    })
  })
  var result = [];
  for (var key in uniques) {
    result.push(key);
  }
  fs.writeFile('terms-'+file, JSON.stringify(result,null,2), function() {
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
// convertToUnique(['medium.json','title.json','artist.json'],['medium','title','artist']);
// JSON.parse(fs.)
// uniqueTerms('unique-medium-title-artist.json')

// testTrie('unique-title.json');
// testEngine('unique-title.json');

// composeEngine('unique-title.json', true);
// composeEngine('unique-artist.json', true);
// composeEngine('unique-medium.json', true);

