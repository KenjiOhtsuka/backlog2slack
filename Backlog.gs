function issueUrl(projectKey, issueId) {
  return 'https://' + BACKLOG_DOMAIN + '/view/' + projectKey + '-' + issueId;
}

function wikiUrl(projectKey, wikiName) {
  return 'https://' + BACKLOG_DOMAIN + '/wiki/' + projectKey + '/' + encodeURIComponent(wikiName);
}

function gitCommitUrl(projectKey, repositoryName, revision) {
  return 'https://' + BACKLOG_DOMAIN + '/git/' + projectKey + '/' + repositoryName + '/commit/' + revision;
}

function issueLinkedTitle(projectKey, issueJson) {
  var title = '<' + issueUrl(projectKey, issueJson["key_id"]) + '|' + projectKey + "-" + issueJson["key_id"] + " ";
  title += issueJson["summary"] + ">";
  return title;
}

function wikiLinkedTitle(projectKey, wikiJson) {
  var title = '<' + wikiUrl(projectKey, wikiJson["name"]) + '|' + projectKey + ' : ' + wikiJson["name"] + ">";
}

function slackLinkedUserName(userJson) {
  if (Users[userJson["id"]] != null) return '<@' + Users[userJson["id"]] + '>';
  return userJson["name"];
}

function slackUserName(userJson) {
  if (Users[userJson["id"]] != null) return Users[userJson["id"]];
  return userJson["name"];
}
