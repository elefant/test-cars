function Searcher(aStringArray) {
  this._stringArray = aStringArray;
}

Searcher.prototype = {
  search: function(aNeedle) {
    var matches = [];
    this._stringArray.forEach(function(aCandidate) {
      if (aCandidate.toLowerCase().indexOf(aNeedle) >= 0) {
        matches.push(aCandidate);
      }
    });
    return matches;
  }
};

module.exports = Searcher;