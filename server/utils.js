var fs = require('fs');
var engine = require('./engine.js');
var Engine = engine.Engine;

var artistEngine = new Engine( JSON.parse(fs.readFileSync('./server/lists/unique-artist.json')) );
var mediumEngine = new Engine( JSON.parse(fs.readFileSync('./server/lists/unique-medium.json')) );
var titleEngine = new Engine( JSON.parse(fs.readFileSync('./server/lists/unique-title.json')) );

var engineMap = {
  artist: artistEngine,
  medium: mediumEngine,
  title: titleEngine
}

exports.autocomplete = function(queryObj, callback) {
  var query = queryObj.q;
  var type = queryObj.type;
  var partials = query.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').split(' ');
  var result = engineMap[type].match(partials);
  callback(result);
};

exports.makeData = function(data, key){
  if(!data || !(data.length)){
    return false;
  } else {
    var results = [];
    for(var i = 0; i < data.length; i++){
      var current = data[i][key];
      var id = current.id;
      var current = current._data.data;
      current.id = id;
      results.push(current);
    }
  }
  return results;
}