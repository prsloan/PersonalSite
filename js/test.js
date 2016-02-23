var http = require("https");

var options = {
"method": "GET",
"hostname": "sandbox.payfabric.com",
"port": null,
"path": "/v2/rest/api/token/create",
"headers": {
    "authorization": "144048e9-613a-cd2b-a5f8-89061b374e8b|password1"
}
};

var req = http.request(options, function (res) {
var chunks = [];

res.on("data", function (chunk) {
    chunks.push(chunk);
});

res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
});
});

req.write(JSON.stringify({ SetupId: 'PFP',
Type: 'Sale',
Customer: 'PayFabric',
Amount: 19.99,
Currency: 'USD',
Card: {
    Account: '4111111111111111',
    ExpDate: '0819',
        CardHolder: { FirstName: 'John', LastName: 'Doe' }
} }));
req.end();



req.end();

// Replace Device ID and Password with your unique combination
// JSON Response
// {
//     "Token": "4twdsxsiu9dr"
// }
