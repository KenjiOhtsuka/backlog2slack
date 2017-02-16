function buildUrl(baseUrl, parameters) {
}

function post(url, payload) {
  //var payload = 'XXXXX'; // Replace with raw video data.
  var headers = {
    //
  };
  var options = {
    'method': 'post',
    //'headers': headers,
    'payload': payload
  };
  var response = UrlFetchApp.fetch(url, options);
}

function get(url) {
//  var headers = {
//  };
  var options = {
    'method': 'get',
    //'headers': headers,
  };
  var response = UrlFetchApp.fetch(url, options);
  return response;
}


function myFunction() {
  // get backlog data
  var backlogUrl = 'https://' + BACKLOG_DOMAIN + '/' + BACKLOG_API_PATHS["issue"]["count"] + '?apiKey=' + BACKLOG_API_KEY;
  var response = get(backlogUrl);
  var json = JSON.parse(response.getContentText());
  
  // post data to slack
  var slackUrl = SLACK_INCOMING_HOOK_URL;
  var payload = {
    "text": response.getContentText(),
    "channel" : "@somebody"
  };
  post(slackUrl, JSON.stringify(payload));
}


// Backlog

var BACKLOG_API_PATHS = {
  "issue" : {
    "count" : "/api/v2/issues/count"
  }
};

// Slack

// we want to post burning issue
