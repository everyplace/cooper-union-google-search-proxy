var request = require('request');

exports.json = function(req, res, next) {
  res.set({
    'Content-Type':'application/json',
    'Access-Control-Allow-Origin':'*'
  });

  next();
};

exports.index = function(req, res){
  var path = 'about';
  res.render('template', {
    title: 'Google Images API Proxy',
    name: path,
    description:'Sample links for the Google Custom Image Search API',
    examples:[{
      url:"/search?q=cats",
      title:"Search for cats, because that's what the internet is made of"
    }]
  });
};

exports.search = function(req, res){

  var google = require('googleapis');

  var customsearch = google.customsearch('v1');
  var CX = process.env.CX;
  var API_KEY = process.env.API_KEY;

  var searchParams = req.query;
      searchParams.cx = CX;
      searchParams.auth = API_KEY;
      searchParams.searchType = 'image'

  customsearch.cse.list(searchParams, function(err, resp) {
    if (err) {
      console.log('An error occured', err);
      res.end(JSON.stringify(err));
      return;
    }
    // Got the response from custom search
    console.log('Result: ' + resp.searchInformation.formattedTotalResults);

    res.end(JSON.stringify(resp.items));
  });
};


exports.template = function(req, res){
  var path = (req.url.substring(1));
  var config = {
    title: (req.title) ? req.title : path,
    name: (req.name) ? req.name : path,
    page: (req.page) ? req.page : ""
  };

  for (i in attributes) {
    if(req[attributes[i]] !== undefined) {
      config[attributes[i]] = req[attributes[i]];
    }
  }
  console.log(config)
  res.render('template', config);
};
