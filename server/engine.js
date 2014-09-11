

// Trie:
// An uncompressed prefix tree implementation. The underlying data structure for the 
// autocomplete engine.
// --------------------------------------------------------------------------------------
var Trie = function() {
  this.children = {};
  this.isWordEnd = false;
};
Trie.prototype.add = function(words) {
  words = words instanceof Array ? words : [words];
  var word, token, currentNode;
  for (var i = 0, len_i = words.length; i < len_i; i++) {
    word = words[i];
    currentNode = this;
    for (var j = 0, len_j = word.length; j < len_j; j++) {
      token = word[j];
      currentNode = currentNode.children[token] || (currentNode.children[token] = new Trie());
    }
    currentNode.isWordEnd = true;  
  }
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
    return bottom.isWordEnd;
  } else {
    return false;
  }
};
Trie.prototype.complete = function(partial) {
  var results = [];
  var suffixes;
  var bottom = this.traverse(partial);
  if (bottom) {
    if (bottom.isWordEnd) results.push(partial);
    for (var token in bottom.children) {
      suffixes = bottom.children[token].print();
      for (var i = 0, len = suffixes.length; i < len; i++) {
        results.push(partial + token + suffixes[i]);
      }     
    }
  }
  return results;
};
Trie.prototype.print = function() {
  return this.complete('');
};
// --------------------------------------------------------------------------------------


// Engine:
// Used to associate autocompleted words with input data. .add() parses the input sentence 
// into words, storing the sentence in .data with each word as a key. .match() hands a 
// partial (or completed) word to the .trie a retrieves the data stored at the autocompleted 
// words stored in .data.
// --------------------------------------------------------------------------------------
var Engine = function(data) {
  this.data = [];
  this._map = {};
  this.trie = new Trie();
  if (data) this.add(data);
};
Engine.prototype.add = function(data) {
  data = data instanceof Array ? data : [data];
  var datum, id;
  var word, words;
  for (var i = 0,len_i = data.length; i < len_i; i++) {
    datum = data[i];
    id = this.data.push(datum) - 1;
    words = datum.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').split(' ');
    for (var j = 0, len_j = words.length; j < len_j; j++) {
      word = words[j];
      if (word.length > 2 || parseInt(word)) {
        word = word.toLowerCase();
        this._map[word] = this._map[word] || [];
        this._map[word].push(id);
        this.trie.add(word);
      }
    }
  }
};
Engine.prototype.match = function(partials) {
  partials = partials instanceof Array ? partials : [partials];
  var partial, completes;
  var ids, matchIds, matchUnion = [];
  for (var i = 0, len_i = partials.length; i < len_i; i++) {
    matchIds = {};
    partial = partials[i].toLowerCase();
    completes = this.trie.complete(partial);
    for (var j = 0, len_j = completes.length; j < len_j; j++) {
      ids = this._map[completes[j]];
      for (var k = 0, len_k = ids.length; k < len_k; k++) {
        matchIds[ids[k]] = true;
      }
    }
    matchUnion.push(matchIds);
  }
  var intersects, matchIntersection = [];
  for (var id in matchUnion[0]) {
    intersects = true;
    for (var l = 1, len_l = matchUnion.length; l < len_l; l++) {
      if (!(intersects = id in matchUnion[l])) break;
    }
    if (intersects) matchIntersection.push(this.data[id]);
  }
  return matchIntersection;
};
// --------------------------------------------------------------------------------------


module.exports.Engine = Engine;
module.exports.Trie = Trie;

