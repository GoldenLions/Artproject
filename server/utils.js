var fs = require('fs');
var engine = require('./engine.js');
var Engine = engine.Engine;

var titleEngine = new Engine( JSON.parse(fs.readFileSync('./server/lists/unique-title.json')) );

exports.autocomplete = function(query, callback) {
  var partials = query.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').split(' ');
  var result = titleEngine.match(partials);
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