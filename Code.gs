/*
Backlog Event List

	Issue-Related Event
		1 Issue Created
		2 Issue Updated
		3 Issue Commented
		Issue Deleted
		Multiple Issues Updated
		17 Add Noification
	Wiki-Related Event
		Wiki Created
		6 Wiki Updated
		Wiki Deleted
	File-Related Event
		File Added
		File Updated
		File Deleted
	Version Control-Related Event
		Subversion Committed
		12 Git Pushed
		13 Git Repository Created
	Project-Related Event
		Project Member Added
		Project Member Removed
		Version/Milestone Created
		Version/Milestone Updated
		Version/Milestone Deleted
	Pull Request-Related Event
		18 Pull Request Created
		19 Pull Request Updated
		20 Comment on Pull Request
*/
var EventTypes = {
  1: "Issue Created",
  2: "Issue Updated",
  3: "Issue Commented",
  17: "Add Notification",
  5: "Wiki Created",
  6: "Wiki Updated",
  12: "Git Pushed",
  13: "Git Repository Created",
  18: "Pull Request Created",
  19: "Pull Request Updated",
  20: "Comment on Pull Request"
};

function doPost(e) {
  postBacklogToSlack(JSON.parse(e.postData.contents));
}

function postBacklogToSlack(contentJson) {
  var slackUrl = SLACK_INCOMING_HOOK_URL;
  post(slackUrl, composePayload(contentJson));
}

function testPost() {
  var c = '{"created":"2017-03-23T10:17:17Z","project":{"archived":false,"projectKey":"F","name":"t","chartEnabled":true,"id":1,"subtaskingEnabled":true,"textFormattingRule":"markdown"},"id":1,"type":1,"content":{"summary":"This is test","key_id":1,"customFields":[],"dueDate":"","description":"This is test. \\n","priority":{"name":"中","id":3},"resolution":{"name":"","id":null},"actualHours":null,"issueType":{"color":"#666665","name":"質問","displayOrder":0,"id":1,"projectId":1},"milestone":[],"versions":[],"parentIssueId":null,"estimatedHours":null,"id":1,"assignee":{"name":"K","id":74019,"roleType":94,"lang":"null","userId":"K"},"category":[],"startDate":"","status":{"name":"未対応","id":1}},"notifications":[{"reason":1,"resourceAlreadyRead":false,"alreadyRead":false,"id":7378241,"user":{"nulabAccount":null,"name":"K","mailAddress":null,"id":74019,"roleType":2,"userId":null}}],"createdUser":{"nulabAccount":null,"name":"TEST","mailAddress":null,"id":48748,"roleType":2,"lang":"ja","userId":null}}';
  postBacklogToSlack(JSON.parse(c));
}

function composePayload(contentJson) {
  var payload = {
    "username": slackUserName(contentJson["createdUser"]),
    "text": arrangeMessage(contentJson),
    "channel" : "#backlog"
  };
  return JSON.stringify(payload);
}
function arrangeMessage(content) {
  var message = "";
  try {
    // if you arrange the message to post to slack,
    // change this method.
    var eventName = EventTypes[content["type"]];
    if (eventName != null) message += eventName + "\n";
    switch (content["type"]) {
      case 1: // Issue Created
        message += issueLinkedTitle(content["project"]["projectKey"], content["content"]) + "\n";
        message += content["content"]["summary"] + ">\n";
        message += content["content"]["description"] + "\n";
        break;
      case 2: // Issue Updated
        message += issueLinkedTitle(content["project"]["projectKey"], content["content"]) + "\n";
        message += content["content"]["summary"] + ">\n";
        var changes = content["content"]["changes"];
        for (var i = 0; i < changes.length; ++i) {
          message += changes[i]["field"] + "(" + changes[i]["type"] + ") : " + changes[i]["old_value"] + " → " + changes[i]["new_value"] + "\n";
        }
        break;
      case 3: // Issue Commented
        message += issueLinkedTitle(content["project"]["projectKey"], content["content"]) + "\n";
        message += content["content"]["comment"]["content"] + "\n";
        break;
      case 5: // Wiki Created
      case 6: // Wiki Updated
        message += wikiLinkedTitle(content["project"]["projectKey"], content["content"]) + "\n";
        message += "Diff: " + content["content"]["diff"] + "\n";
        break;
      case 12:
        message += content["content"]["ref"] + "\n";
        for (var i = 0; i < content["content"]["revisions"].length; ++i) {
          message += '<' + gitCommitUrl(content["project"]["projectKey"], content["content"]["repository"]["name"], content["content"]["revisions"][i]["rev"]) + '|' + content["content"]["revisions"][i]["rev"] + ">\n";
          message += content["content"]["revisions"][i]["comment"] + "\n";
        }
        break;
      case 18: // Pull Request Created
        message += '#' + content["content"]["number"] + ' ' + content["content"]["summary"] + "\n";
        message += content["content"]["repository"]["name"] + " : " + content["content"]["branch"] + " → " + content["content"]["base"] + "\n";
        message += content["content"]["description"] + "\n";
        message += "Related Issue: " + issueLinkedTitle(content["project"]["projectKey"], content["content"]["issue"]) + "\n";
        message += "Assignee: " + content["content"]["assignee"]["name"] + "\n";
        break;
      case 19: // Pull Request Updated
        message += '#' + content["content"]["number"] + ' ' + content["content"]["summary"] + "\n";
        message += content["content"]["repository"]["name"] + " : " + content["content"]["branch"] + " → " + content["content"]["base"] + "\n";
        for (var i = 0; i < changes.length; ++i) {
          message += changes[i]["field"] + " : " + changes[i]["old_value"] + " → " + changes[i]["new_value"] + "\n";
        }
        break;
      case 20: // Comment on Pull Request
        message += '#' + content["content"]["number"] + ' ' + content["content"]["summary"] + "\n";
        message += content["content"]["repository"]["name"] + " : " + content["content"]["branch"] + " → " + content["content"]["base"] + "\n";
        message += content["content"]["comment"]["content"] + "\n";
        break;
      default:
        message += JSON.stringify(content) + "\n";
        break;
    }
    message += buildNotificationMessage(content["notifications"]);
  } catch (e) {
    message += e.message;
  }
  return message;
}

function buildNotificationMessage(notifications) {
  var message = '';
  for (var i = 0; i < notifications.length; ++i) {
    if (i == 0) message += 'Notify To: ';
    else message += ', ';
    message += slackLinkedUserName(notifications[i]["user"]);
  }
  return message;
}

function post(url, payload) {
  //var payload = 'XXXXX'; // Replace with raw video data.
  var headers = {
    'GData-Version': '2',
    'Slug': 'dog-skateboarding.mpeg'
    // Add any other required parameters for the YouTube API.
  };
  var options = {
    'method': 'post',
    //'headers': headers,
    'payload': payload
  };
  var response = UrlFetchApp.fetch(url, options);
}

function get(url) {
  //var payload = 'XXXXX'; // Replace with raw video data.
//  var headers = {
//    'GData-Version': '2',
//    'Slug': 'dog-skateboarding.mpeg'
//    // Add any other required parameters for the YouTube API.
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
  
  // post ... data
  var slackUrl = SLACK_INCOMING_HOOK_URL;
  var payload = {
    "text": response.getContentText(),
    "channel" : "#backlog"
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

// burning issue

