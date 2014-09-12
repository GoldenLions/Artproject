angular.module('dangerousWrenchApp')
  .factory('Autocomplete', [function() {
    console.log('Autocomplete loaded.');
    var terms,artists,mediums,titles;
    terms = new Bloodhound({
      prefetch: {
        url: '/json/terms-unique-medium-title-artist.json'
      },
      datumTokenizer: function(d) {
        return d.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').split(' ');
      },
      queryTokenizer: function(q) {
        return q.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').split(' ');
      }
    });
    artists = new Bloodhound({
      prefetch: {
        url: '/json/unique-artist.json'
      },
      datumTokenizer: function(d) {
        return d.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').split(' ');
      },
      queryTokenizer: function(q) {
        return q.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').split(' ');
      }
    });
    mediums = new Bloodhound({
      prefetch: {
        url: '/json/unique-medium.json'
      },
      datumTokenizer: function(d) {
        return d.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').split(' ');
      },
      queryTokenizer: function(q) {
        return q.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').split(' ');
      }
    });
    // It would be preferable to do these in the client, but we will run into
    // cache limits if we load all of these --
    //   e.g. Uncaught QuotaExceededError: Failed to execute 'setItem' on 'Storage': 
    //        Setting the value of '__/json/unique-title.json__data' exceeded the quota.
    
    // So we have to delegate some of this to the server. We still use the Bloodhound 
    // engine for each suggestion type, however, because of its convenient utility functions,
    // like handling the request and response, throttling, etc.
    titles = new Bloodhound({
      remote: {
        url: '/api/autocomplete?q=%QUERY'
      },
      datumTokenizer: function(d) {
        return d.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').split(' ');
      },
      queryTokenizer: function(q) {
        return q.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').split(' ');
      }
    });
 
    terms.initialize();
    artists.initialize();
    mediums.initialize();
    titles.initialize();

    return {
      terms: terms,
      titles: titles,
      artists: artists,
      mediums: mediums
     }   
  }])
  .directive('typeahead', ['Autocomplete',function(Autocomplete) {
    console.log('typeahead loaded.')
    return {
      restrict: 'C',
      link: function(scope, element) {
        $(element).typeahead({
          minLength: 3,
          highlight: true,
          local: ['water john']
        },
        {
          name: 'terms',
          source: Autocomplete.terms.ttAdapter(),
          displayKey: function(s) {return s;}
        },
        {
          name: 'artists',
          displayKey: function(s) {return s;},
          source: Autocomplete.artists.ttAdapter(),
          templates: {
            header: '<h3>Artists</h3>'
          }
        },
        {
          name: 'mediums',
          source: Autocomplete.mediums.ttAdapter(),
          displayKey: function(s) {return s;},
          templates : {
            header: '<h3>Mediums</h3>'
          }
        },
        {
          name: 'titles',
          source: Autocomplete.titles.ttAdapter(),
          displayKey: function(s) {return s;},
          templates:{
            header: '<h3>Titles</h3>'
          }
        }
        );
      }
    }
  }])