import * as core from '@actions/core'
import * as github from '@actions/github'
// import {wait} from './wait'

async function run(): Promise<void> {
  try {
    // const ms: string = core.getInput('milliseconds')
    core.debug(new Date().toTimeString());
	
     // The pull_request exists on payload when a pull_request event is triggered.
    // Sets action status to failed when pull_request does not exist on payload.
    const pr = github.context.payload.pull_request;
    if (!pr) {
      core.setFailed('github.context.payload.pull_request does not exist');
      return;
    }

    // Get input parameters.
    const githubToken = core.getInput('repo-token');
    const message = core.getInput('message');
    core.debug(`message: ${message}`);

    // Create a GitHub client.
    // The Octokit is a helper, to interact with
    // the github REST interface.
    // You can look up the REST interface
    // here: https://octokit.github.io/rest.js/v18
    const octokit = github.getOctokit(githubToken);

    // Get owner and repo from context
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;

    // Create a comment on PR
    const response = await octokit.issues.createComment({
      owner,
      repo,
      // eslint-disable-next-line @typescript-eslint/camelcase
      issue_number: pr.number,
      body: message
    });

    core.debug(`created comment URL: ${response.data.html_url}`);

    core.setOutput('comment-url', response.data.html_url);

    core.debug(new Date().toTimeString());

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function sendReaction() {
  // local GITHUB_ISSUE_NUMBER="$1"

  //   curl -sSL \
  //        -H "Authorization: token ${GITHUB_TOKEN}" \
  //        -H "Accept: application/vnd.github.squirrel-girl-preview+json" \
  //        -X POST \
  //        -H "Content-Type: application/json" \
  //        -d "{\"content\":\"heart\"}" \
  //           "https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${GITHUB_ISSUE_NUMBER}/reactions"
}

async function sendComment() {
  // local GITHUB_ISSUE_NUMBER="$1"
  // local GITHUB_ISSUE_COMMENT="$2"

  // curl -sSL \
  //      -H "Authorization: token ${GITHUB_TOKEN}" \
  //      -H "Accept: application/vnd.github.v3+json" \
  //      -X POST \
  //      -H "Content-Type: application/json" \
  //      -d "{\"body\":\"${GITHUB_ISSUE_COMMENT}\"}" \
  //         "https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${GITHUB_ISSUE_NUMBER}/comments"
}

async function closeIssue() {
  // local GITHUB_ISSUE_NUMBER="$1"

  // curl -sSL \
  //      -H "Authorization: token ${GITHUB_TOKEN}" \
  //      -H "Accept: application/vnd.github.v3+json" \
  //      -X POST \
  //      -H "Content-Type: application/json" \
  //      -d "{\"state\":\"closed\"}" \
  //         "https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${GITHUB_ISSUE_NUMBER}"
}

run()
