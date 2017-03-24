function issueUrl(projectKey, issueId) {
  return 'https://' + BACKLOG_DOMAIN + '/view/' + projectKey + '-' + issueId;
}

function gitCommitUrl(projectKey, repositoryName, revision) {
  return 'https://' + BACKLOG_DOMAIN + '/git/' + projectKey + '/' + repositoryName + '/commit/' + revision;
}