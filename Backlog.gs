function backlogUrl() {
  return 'https://' + BACKLOG_DOMAIN;
}

function issueUrl(projectKey, issueId) {
  return backlogUrl() + '/view/' + projectKey + '-' + issueId;
}

function wikiUrl(projectKey, wikiName) {
  return backlogUrl() + '/wiki/' + projectKey + '/' + encodeURIComponent(wikiName);
}

function gitCommitUrl(projectKey, repositoryName, revision) {
  return backlogUrl() + '/git/' + projectKey + '/' + repositoryName + '/commit/' + revision;
}

function gitPrUrl(projectKey, repositoryName, number) {
  return backlogUrl() + '/git/' + projectKey + '/' + repositoryName + '/pullRequests/' + number;
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

function gitPrLinkedTitle(projectKey, gitPrJson) {
  var title = '<' + gitPrUrl(projectKey, gitPrJson['repository']['name'], gitPrJson['number']) + '|';
  title += '#' + gitPrJson['number'] + ' ' + gitPrJson['summary'] + '>';
  return title;
}

function slackUserName(userJson) {
  if (Users[userJson["id"]] != null) return Users[userJson["id"]];
  return userJson["name"];
}
