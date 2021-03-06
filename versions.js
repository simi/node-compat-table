const semver = require('semver');
const https = require('https');
const error = e=> { console.log(e); process.exit(1); };

var chunks = [];
https.get("https://nodejs.org/dist/index.json", function(res) {
  res.on('data', chunk=>chunks.push(chunk));
  res.on('close', error);
  res.on('end', function() {
    if(res.statusCode!==200)
      return error(new Error(res.statusCode+' '+res.statusMessage));

    var body = Buffer.concat(chunks).toString();
    var published_versions = JSON.parse(body).map(v=>v.version);
    filter(published_versions);
  });
})
.on('error', error);

function filter(published) {
  function max(version) {
    var v = semver.maxSatisfying(published, version);
    if(v) return v.substr(1);
  }

  var desired = [];
  var last = ()=>desired[desired.length-1];
  var add = v=>v && desired.push(v);
  add(max('6'));
  add(max('<'+last()));
  add(max('<'+last()));
  add(max('5'));
  add(max('<'+last()));
  add(max('<'+last()));
  add(max('4'));
  add(max('<'+last()));
  add(max('<'+last()));
  add(max("0"));

  console.log(desired.join('\n'));
}

