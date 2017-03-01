var http = require('http');
var fs = require('fs');
var url = require('url') ;

// My modules.
var Searcher = require('./searcher');

// Known car brands.
const BRANDS = ['Acura', 'Alfa Romeo', 'AMC', 'Aston Martin', 'Audi',
                'Avanti', 'Bentley', 'BMW', 'Buick', 'Cadillac', 'Chevrolet',
                'Chrysler', 'Daewoo', 'Daihatsu', 'Datsun', 'DeLorean', 'Dodge',
                'Eagle', 'Ferrari', 'FIAT', 'Fisker', 'Ford', 'Freightliner', 'Geo',
                'GMC', 'Honda', 'HUMMER', 'Hyundai', 'Infiniti', 'Isuzu', 'Jaguar',
                'Jeep', 'Kia', 'Lamborghini', 'Lancia', 'Land Rover', 'Lexus',
                'Lincoln', 'Lotus', 'Maserati', 'Maybach', 'Mazda', 'McLaren',
                'Mercedes­Benz', 'Mercury', 'Merkur', 'MINI', 'Mitsubishi', 'Nissan',
                'Oldsmobile', 'Peugeot', 'Plymouth', 'Pontiac', 'Porsche', 'RAM',
                'Renault', 'Rolls­Royce', 'Saab', 'Saturn', 'Scion', 'smart', 'SRT',
                'Sterling', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Triumph',
                'Volkswagen', 'Volvo', 'Yugo'];

var searcher = new Searcher(BRANDS);

var index = fs.readFileSync('index.html');

http.createServer(function (req, res) {
  var urlObject = url.parse(req.url, true);

  // TODO: Build a path mapper to route paths to their handler.

  // Check if the path is known.
  if (-1 === ['/', '/cars'].indexOf(urlObject.pathname)) {
    res.writeHead(404);
    res.end();
    return;
  }

  // Asking for root page.
  if ('/' === urlObject.pathname) {
    res.writeHead(200, {'Content­Type': 'text/html'});
    res.end(index);
    return;
  }

  // Asking for 'cars' API.

  // Process the query and respond invalid one immediately.
  function respondBadRequest(aReason, aResponse) {
    aResponse.writeHead(400, {'Content­Type': 'text/plain'});
    aResponse.end(aReason);
  }
  var queryKeys = Object.keys(urlObject.query);
  if (0 === queryKeys.length) {
    return respondBadRequest("No query at all.", res);
  }
  if (queryKeys.length > 1) {
    return respondBadRequest("Too much query keys.", res);
  }

  // We've got the one and the only query key. Do it!
  var key = queryKeys[0];
  var matches = searcher.search(key);

  // Write out the result.
  res.writeHead(200, {'Content­Type': 'application/json'});
  res.write(JSON.stringify(matches));

  res.end();
}).listen(2000);
