import * as core from '@actions/core';
import * as github from '@actions/github';
import { PrBodyValidationService } from './pr-body-validation.service';

async function run(): Promise<void> {
  try {
    core.debug(new Date().toTimeString());

    // The pull_request exists on payload when a pull_request event is triggered.
    // Sets action status to failed when pull_request does not exist on payload.
    const pr = github.context.payload.pull_request;
    if (!pr) {
      core.setFailed('github.context.payload.pull_request does not exist. Have the correct event triggers been configured?');
      return;
    }

    core.debug(`PR body: ${pr.body}`);

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


    let prBodyValidationService = new PrBodyValidationService();
    var result = await prBodyValidationService.validateBody(pr.Body);

    // Get owner and repo from context
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;

    // Create a comment on PR
    if (result.isPrBodyComplete) {
      const response = await octokit.issues.createComment({
        owner,
        repo,
        issue_number: pr.number,
        body: result.message
      });

      core.debug(`created comment URL: ${response.data.html_url}`);
      core.setOutput('comment-url', response.data.html_url);
      core.setOutput('responseMessage', "✅ All checks passed: " + result.message);
    } else {
      core.setOutput('responseMessage', "🚧 PR Body incomplete: " + result.message);
      core.setFailed(result.message);
    }

    core.debug(new Date().toTimeString());

  } catch (error) {
    core.setFailed(error.message);
  }
}

run()