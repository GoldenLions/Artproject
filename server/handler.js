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
    var query = req.query.q
    utils.autocomplete(query, function(result) {
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




  //needs s3
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
  app.post('/generateArtistRecommendations', function(req, res) {
    console.log('generateArtistRecommendations');
    var recommendations = [];
    var results = [];

    // get the top artist that the user likes 
    var params = {username: req.body.username};
    // console.log(params)
    var cypher ="MATCH (user:User)-[:`LIKES`]->(work:Work)<-[:CREATED_WORK] - (artist:Artist) RETURN user,work.artist as artist, count(artist) as count ORDER BY count DESC LIMIT 1";
   
    db.query(cypher, params, function(err, artists){
      if(err) console.log(err);
      // console.log(artists);

      // for each artist, get 5 paintings for that artist
      for(var i = 0; i < artists.length; i++) {
        var targetArtist = artists[i].artist;
        // console.log(targetArtist);

        var params2 = {targetArtist: targetArtist};
        var cypher2 ="MATCH (artist:Artist {name: ({targetArtist})} )-[:`CREATED_WORK`]->(work:Work) RETURN work  LIMIT 20";

        db.query(cypher2, params2, function(err, works){
          if(err) console.log(err);

          var temp = utils.makeData(works, 'work') ;

          for(var j = 0; j < temp.length; j++) {
            results.push(temp[j])
          }

          results = JSON.stringify(results);

          // console.log(i, artists.length)
          // console.log('results1' ,results)

          res.end(results)

        })
      }
    })
  })


  // Fetches all items that the user likes
  app.post('/generateUserLikes', function(req, res) {
    console.log('POST show user likes')

    //may have to change names, etc., based on db format
    //'like' here = edge between usernode and artwork node

    var params = {username: req.body.username}; 
    console.log(params)
    db.query('MATCH (n:User {username: ({username}) })-[:LIKES]->(m:Work)\nRETURN m limit 1000', params, function(err, data) {
      if (err) console.log(err);
      var likesObj = utils.makeData(data, 'm');
      // console.log(likesObj)
      likesObj = JSON.stringify({results: likesObj});
      res.end(likesObj);
    })
  });

  // Searched  painting's title, artist, and medium for a keyword
  app.post('/KeywordSearch', function(req, res) {
    var searchterms = req.body.searchterms;
    var searchterms = searchterms.split(' ');
    var query = [];
    query.push('MATCH (n:Work) WHERE ');

    console.log('SEARCHTERMS=', searchterms);
    for (var i = 0; i < searchterms.length; i++) {

      query.push(
        '(n.title =~ ".*\\b'+ searchterms[i] + '\\b.*"' +
        ' OR n.medium =~ ".*\\b'+ searchterms[i] + '\\b.*"' +
        ' OR n.artist =~ ".*\\b'+ searchterms[i] +'\\b.*" )'
      );  

      if (i < searchterms.length - 1) {
        query.push(' AND ');
      }
    }
    query.push(' return distinct n limit 1000');
    query = query.join('');
    console.log(query)
    db.query(query, function(err, data) {

      if (err) console.log(err);
      var searchResult = utils.makeData(data, 'n');
      searchResult = JSON.stringify(searchResult);

      res.end(searchResult);
    })
  });

  // when user clicks like, add like relationship between user and painting
  app.post('/like', function(req, res){
    console.log('POST create likes')

    var params = { url: req.body.url, username: req.body.username };

    db.query('MATCH (n:User {username: ({username}) }),(b:Work {url: ({url}) })\nCREATE (n)-[:LIKES {rating:1}]->(b)', params, function(err){

      if (err) console.log(err);
      console.log('like created!');
      // console.log(params);
      res.end();
      console.log(res.end())
    })
  });


};
