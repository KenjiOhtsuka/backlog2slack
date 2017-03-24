function issueUrl(projectKey, issueId) {
  return 'https://' + BACKLOG_DOMAIN + '/view/' + projectKey + '-' + issueId;
}

function gitCommitUrl(projectKey, repositoryName, revision) {
  return 'https://' + BACKLOG_DOMAIN + '/git/' + projectKey + '/' + repositoryName + '/commit/' + revision;
}

function issueLinkedTitle(projectKey, issueJson) {
  var title = '<' + issueUrl(projectKey, issueJson["key_id"]) + '|' + projectKey + "-" + issueJson["key_id"] + " ";
  title += issueJson["summary"] + ">";
  return title;
}
