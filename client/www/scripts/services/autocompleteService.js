angular.module('dangerousWrenchApp')
  .factory('Autocomplete', [function() {
    // console.log('Autocomplete loaded.');
    var terms,artists,mediums,titles;
    terms = new Bloodhound({
      prefetch: {
        url: '/json/terms-unique-medium-title-artist.json'
      },
      limit: 3,
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
    artists = new Bloodhound({
      remote: {
        url: '/api/autocomplete?type=artist&q=%QUERY'
      },
      limit: 3,
      datumTokenizer: function(d) {
        return d.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').split(' ');
      },
      queryTokenizer: function(q) {
        return q.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').split(' ');
      }
    });
    mediums = new Bloodhound({
      remote: {
        url: '/api/autocomplete?type=medium&q=%QUERY'
      },
      limit: 3,
      datumTokenizer: function(d) {
        return d.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').split(' ');
      },
      queryTokenizer: function(q) {
        return q.replace(/[,.\!\?;:\[\]\{\}\(\)'"_�]/g,'').split(' ');
      }
    });
    titles = new Bloodhound({
      remote: {
        url: '/api/autocomplete?type=title&q=%QUERY'
      },
      limit: 3,
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
    // console.log('typeahead loaded.')
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        var searchbar = $(element);
        searchbar.typeahead({
          minLength: 3,
          highlight: true,
          hint: true
        },
        {
          name: 'terms',
          source: Autocomplete.terms.ttAdapter(),
          displayKey: function(s) {return s;}
        },
        {
          name: 'artists',
          displayKey: function(s) {return '"'+s+'"';},
          source: Autocomplete.artists.ttAdapter(),
          templates: {
            header: '<h4>Artists</h4>'
          }
        },
        {
          name: 'media',
          source: Autocomplete.mediums.ttAdapter(),
          displayKey: function(s) {return '"'+s+'"';},
          templates : {
            header: '<h4>Media</h4>'
          }
        },
        {
          name: 'titles',
          source: Autocomplete.titles.ttAdapter(),
          displayKey: function(s) {return '"'+s+'"';},
          templates:{
            header: '<h4>Titles</h4>'
          }
        }
        );

        searchbar.on('typeahead:autocompleted typeahead:selected',function(e) {
          angular.element(this).controller( 'ngModel' ).$setViewValue( searchbar.typeahead('val') );
          searchbar.typeahead('close');
        });
      }
    }
  }])