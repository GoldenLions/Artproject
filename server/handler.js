//establish a connection to the database
var neo4j = require('neo4j');
var passport = require('./passport-config.js');
// var db = new neo4j.GraphDatabase('http://app29028125:ZcUY4iYVR6P8MKPj1Z5c@app29028125.sb02.stations.graphenedb.com:24789');
var db = new neo4j.GraphDatabase('http://goldenlions.cloudapp.net:7474');

var utils = require('./utils.js');



module.exports = function(app) {

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/api/painting', function(req, res) {
    //get painting data
    res.end(data);
  });

  app.post('/loginSignup', function(req, res){
    var params = {username: req.body.username};
    console.log('your userID is: ',req.body.username)
    db.query('MATCH (n:User {username: ({username}) })  RETURN n', params, function(err, results) {
          if(results.length===0){
            db.query('CREATE (n:User { username: ({username})})', params, function(err){
              if(err) { console.log(err); }
              console.log('successfully created',req.body.username);
              // res.redirect('/recommendation');
              // res.end('createdUser');
            })
          } else {
            // res.end(JSON.stringify(['userExists',req.body.username]));
            // res.redirect('/recommendation');

          }
        })
  });

  app.get('/api/autocomplete*', function(req, res) {
    console.log('GET /api/autocomplete',req.query)
    utils.autocomplete(req.query, function(result) {
      res.end(JSON.stringify(result));
    });
  });

  app.post('/signup', function(req, res){
    var params = {username: req.body.signup_username, password: req.body.signup_password};
    db.query('CREATE (n:User { username: ({username}), password: ({password}) })', params, function(err){
      if(err) { console.log(err); }
      res.redirect('/');
    })
  });

  app.post('/login',function(req, res){
    console.log('sending you to homepage/',req.body.username);
    // res.redirect('/#/homepage/' + req.body.username);

  })



  app.post('/generateArtInfo', function(req, res) { 
    // may have to change variable names and refactor based on database formatting
    var pid = parseInt(req.body.painting);
    db.query('MATCH (n:Work) WHERE id(n)='+ pid +' RETURN n', function(err, data) {
      if (err) console.log(err);
      data = utils.makeData(data, 'n');
      data = data[0];
      db.query('MATCH (a:Work)-[r:HAS_FEATURE]->(n:Feature) WHERE id(a)=({id}) RETURN n', data, function(err, features) {
        if (err) console.log(err);
        var features = utils.makeData(features, 'n');
        var dataObject = JSON.stringify({painting: data, features: features});
        res.end(dataObject);
      })
    })
  });

  // Generate recommendations based on the likes of other users who like things that you like.
  // If  there aren't any users or likes, then there there aren't going to be any recommendations.
  app.post('/generateUserRecommendations', function(req, res) {
    console.log('generateUserRecommendations')

    // 'Person' may have to be replaced with whatever we end up labelling user nodes
    db.query('MATCH (p1:User)-[x:LIKES]->(m:Work)<-[y:LIKES]-(p2:User) WITH SUM(x.rating * y.rating) AS xyDotProduct, SQRT(REDUCE(xDot = 0.0, a IN COLLECT(x.rating) | xDot + a^2)) AS xLength, SQRT(REDUCE(yDot = 0.0, b IN COLLECT(y.rating) | yDot + b^2)) AS yLength, p1, p2 MERGE (p1)-[s:SIMILARITY]-(p2) SET s.similarity = xyDotProduct / (xLength * yLength)', function(err, data) {
      if (err) console.log(err);
      var username = req.body.username;
      console.log('username', username)
      // m.name may have to be replaced with whatever we end up calling the name property/identifier of a work
      db.query('MATCH (b:User)-[r:LIKES]->(m:Work), (b)-[s:SIMILARITY]-(a:User {username:"'+ username +'"}) WHERE NOT((a)-[:LIKES]->(m)) WITH m, s.similarity AS similarity, r.rating AS rating ORDER BY m.title, similarity DESC WITH m.title AS work, COLLECT(rating)[0..3] AS ratings WITH work, REDUCE(s = 0, i IN ratings | s + i)*1.0 / LENGTH(ratings) AS reco ORDER BY reco DESC RETURN work AS Work, reco AS Recommendation', username, function(err, data) {
        if (err) console.log(err);
        // these may have to be replaced with the lower-case references
        var works = utils.makeData(data, 'Work');
        var recommendations = utils.makeData(data, 'Recommendation');
        var dataObject = JSON.stringify({works: works, recommendations: recommendations});
        console.log(dataObject);
        res.end(dataObject);
      })
    })
  });


  // Generate reccomendations based on other works that artist created.
  // Mark all the reccomendations as seen.
  app.post('/generateArtistRecommendations', function(req, res) {
    console.log('generateArtistRecommendations');
    var recommendations = [];
    var results = [];

    // get the top artist that the user likes 
    var params = {username: req.body.username, limit: req.body.limit};
    console.log('artist params', params);

    // select all artworks by artists user likes that user has not seen
    var cypher ='Match (me:User {username: ({username}) })-[:LIKES]->(n:Work)<-[:CREATED_WORK]-(a:Artist)-[c:CREATED_WORK]->(other:Work)' +
                'WHERE NOT  me -[:SEEN]-> other ' +
                'RETURN other  ' +
                'ORDER BY other.name  ' +
                'LIMIT  ' + params.limit;
   
    db.query(cypher, params, function(err, data){
      if(err) console.log(err);

      var recommendations = utils.makeData(data, 'other');
      var recommendationsJSON = JSON.stringify({recommendations: recommendations});
      
      console.log('other artist recommendations', recommendations);

      res.end(recommendationsJSON);

      // mark each recommendation as seen.
      for (var i = 0; i < recommendations.length; i++) {

        params = {username: req.body.username, url: recommendations[i].url};
        // console.log('seen', params);

        cypher = "MATCH (w:Work {url: ({url}) }), (u:User {username: ({username}) }) MERGE u -[:SEEN {timestamp: timestamp()} ] ->  w return w.url limit 1";
        db.query(cypher, params, function(err, data){
          if(err) console.log(err);
          // console.log('seen2 ', data);
        });
      }


    });
  });

  
  // Fetches random artwork that the user has not seen 
  app.post('/generateRandomRecommendations', function(req, res) {
    console.log('POST show random recommendation')

    var params = {username: req.body.username, limit: req.body.limit}; 
    console.log('random recommendations params', params);

    db.query('MATCH (w:Work), (u:User {username: ({username})}) '+
      ' WHERE NOT (u) -[:SEEN ]->(w) '+
      'RETURN w   LIMIT ' + params.limit, params, function(err, data) {
      if (err) console.log(err);
      var recommendations = utils.makeData(data, 'w');
      // console.log(recommendations)

      var recommendationsJSON = JSON.stringify({recommendations: recommendations});
      res.end(recommendationsJSON);

      // mark each recommendation as seen.
      for (var i = 0; i < recommendations.length; i++) {

        params = {username: req.body.username, url: recommendations[i].url};
        console.log('seen', params);

        cypher = "MATCH (w:Work {url: ({url}) }), (u:User {username: ({username}) }) MERGE u -[:SEEN {timestamp: timestamp()} ] ->  w return w.url limit 1";
        db.query(cypher, params, function(err, data){
          if(err) console.log(err);
          console.log('seen2 ', data);
        });
      }

    })
  });


  // Fetches all items that the user likes
  app.post('/generateUserLikes', function(req, res) {
    console.log('POST show user likes')

    var params = {username: req.body.username}; 
    console.log('user likes params', params)
    db.query('MATCH (n:User {username: ({username}) })-[:LIKES {rating: 1}]->(m:Work)\nRETURN m limit 1000', params, function(err, data) {
      if (err) console.log(err);
      var likesObj = utils.makeData(data, 'm');
      // console.log(likesObj)
      likesObj = JSON.stringify({results: likesObj});
      res.end(likesObj);
    })
  });

  // Searches  painting's title, artist, and medium for a keyword
  app.post('/KeywordSearch', function(req, res) {
    var searchterms = req.body.searchterms,
      searchterm='',
      params={};
  
    // var propertyKeys = [title, dates, image, name, type, artist, value]
    var query = [];
    query.push('MATCH (n:Work) WHERE ');

    console.log('SEARCHTERMS=', searchterms);

    //if search term has quotes around it, search for the entire phrase
    if(searchterms[0] ==='"' && searchterms[searchterms.length-1] === '"'){

      // remove first and last quotes
      searchterm = searchterms.substring(1, searchterms.length-1);
           params = {searchterm: searchterm};
  
      query.push("(n.title =~ '(?i).*\\\\b({searchterm})\\\\b.*'" +
        ' OR n.artist =~ "(?i).*\\\\b({searchterm})\\\\b.*"' + 
        ' OR n.medium =~ "(?i).*\\\\b({searchterm})\\\\b.*"' +')' )
    
    } else {
      searchterms = searchterms.split(' ');

      for (var i = 0; i < searchterms.length; i++) {
        console.log('single searchterm', searchterms[i])

        searchterm = searchterms[i];
    params = {searchterm: searchterm};

        // for (var k = 0; k < propertyKeys.length; k++)
        // query.push('(n.title =~ "(?i).*'+ searchterms[i] +'.*" OR n.image =~ ".*'+ searchterms[i] +'.*" OR n.artist =~ ".*'+ searchterms[i] +'.*" OR (a.type = "TIMELINE" AND a.value =~ ".*'+ searchterms[i] +'.*") OR (a.type = "TYPE" AND a.value =~ ".*'+ searchterms[i] +'.*") OR (a.type = "FORM" AND a.value =~ ".*'+ searchterms[i] +'.*") OR (a.type = "SCHOOL" AND a.value =~ ".*'+ searchterms[i] +'.*") OR (a.type = "TECHNIQUE" AND a.value =~ ".*'+ searchterms[i] +'.*") OR (a.type = "DATE" AND a.value =~ ".*'+ searchterms[i] +'.*"))');  

        query.push("(n.title =~ '(?i).*\\\\b({searchterm})\\\\b.*'" +
          ' OR n.artist =~ "(?i).*\\\\b({searchterm})\\\\b.*"' + 
          ' OR n.medium =~ "(?i).*\\\\b({searchterm})\\\\b.*"' +')' )

        if (i < searchterms.length - 1) {
          query.push(' AND ');
        }
      }
    }

    params = {searchterm: searchterm};

    query.push(' return distinct n limit 1000');
    query = query.join('');
    console.log(query)
    db.query(query, params, function(err, data) {

      if (err) console.log(err);
      var searchResult = utils.makeData(data, 'n');
      searchResult = JSON.stringify(searchResult);

      res.end(searchResult);
    } )
  })



  // creates/update like relationship between user and work of art
  app.post('/like', function(req, res){
    console.log('POST create likes');
    var params = { url: req.body.url, username: req.body.username, rating: req.body.rating };
    console.log('like params', params);

    // check if there is an existing like relationship between user and artwork
    var cypher = 'MATCH (n:User {username: ({username}) })-[r:LIKES] -> (b:Work {url: ({url}) })\nreturn r';
    db.query(cypher, params, function(err, data){
      if (err) console.log(err);

      // if like relationship exists, set new ratings for like
      if(data.length > 0) {
        console.log('like exists');
        cypher = 'MATCH (n:User {username: ({username}) })-[r:LIKES] -> (b:Work {url: ({url}) })\nSET r.rating = ({rating})';
        db.query( cypher, params, function(err){
          if (err) console.log(err);
          console.log('like rating update!');
        });

      // else if like doesn't exist, create like relationship
      } else {
        console.log('like does not exists');

        cypher = 'MATCH (n:User {username: ({username}) }),(b:Work {url: ({url}) })\nMERGE (n)-[:LIKES {rating: ({rating}) }]->(b)';
        db.query(cypher, params, function(err){
          if (err) console.log(err);
          console.log('like created!');
        });
      }

      res.end();
    });
  });



};