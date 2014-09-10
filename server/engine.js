var Trie = function() {
  this.children = {};
};
Trie.prototype.add = function(word) {
  if (word instanceof Array) {
    for (var j = 0, len = word.length; j < len; j++) {
      this.add(word[j]);
    }
    return;
  }
  var token;
  var currentNode = this;
  for (var i = 0, len = word.length; i < len; i++) {
    token = word[i];
    currentNode = currentNode.children[token] || (currentNode.children[token] = new Trie());
  }
  currentNode.children['#END#'] = true;
};
Trie.prototype.traverse = function(partial) {
  var token;
  var currentNode = this;
  for (var i = 0, len = partial.length; i < len; i++) {
    token = partial[i];
    if (!currentNode.children[token]) {
      return null;
    } 
    currentNode = currentNode.children[token];
  }
  return currentNode;
};
Trie.prototype.has = function(word) {
  var bottom = this.traverse(word);
  if (bottom) {
    return !!bottom.children['#END#'];
  } else {
    return false;
  }
};
Trie.prototype.complete = function(partial) {
  var results = [];
  var suffixes;
  
  var bottom = this.traverse(partial);
  if (bottom) {
    for (var token in bottom.children) {
      if (token === '#END#') {
        results.push(partial);
      } else {
        suffixes = bottom.children[token].print();
        for (var i = 0, len = suffixes.length; i < len; i++) {
          results.push(partial + token + suffixes[i]);
        }
      }
    }
  }
  return results;
};
Trie.prototype.print = function() {
  return this.complete('');
};
Trie.prototype.serialize = function(readable) {
  return readable ? JSON.stringify(this,null,2) : JSON.stringify(this);
}; 


var Engine = function() {
  this.data = [];
  this._map = {};
  this.trie = new Trie();
};

Engine.prototype.add = function(datum) {
  if (datum instanceof Array) {
    for (var j = 0,len = datum.length; j < len; j++) {
      this.add(datum[j]);
    }
    return;
  }
  var id = this.data.push(datum) - 1;
  var words = datum.replace(/[,.\!\?;:\[\]\{\}\(\)]/g,'').split(' ');
  var word;
  for (var i = 0, len = words.length; i < len; i++) {
    word = words[i];
    if (word.length > 2 || parseInt(word)) {
      word = word.toLowerCase();
      this._map[word] = this._map[word] || [];
      this._map[word].push(id);
      this.trie.add(word);
    }
  }
};

Engine.prototype.match = function(partial) {
  partial = partial.toLowerCase();
  var completes = this.trie.complete(partial);
  var ids;
  var matchIds = {};
  for (var i = 0, len_i = completes.length; i < len_i; i++) {
    ids = this._map[completes[i]];
    for (var j = 0, len_j = ids.length; j < len_j; j++) {
      matchIds[ids[j]] = true;
    }
  }
  var results = [];
  for (var id in matchIds) {
    results.push(this.data[id]);
  }
  return results;
};



module.exports.Engine = Engine;
module.exports.Trie = Trie;

