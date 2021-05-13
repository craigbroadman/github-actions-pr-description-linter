import * as core from '@actions/core'
import * as github from '@actions/github'
import {PrBodyValidationService} from './pr-body-validation.service'

const repoTokenInput = core.getInput('repo-token', {required: true})
const githubClient = github.getOctokit(repoTokenInput)

async function run(): Promise<void> {
  try {
    core.debug(new Date().toTimeString())

    // The pull_request exists on payload when a pull_request event is triggered.
    // Sets action status to failed when pull_request does not exist on payload.
    const pr = github.context.payload.pull_request
    if (!pr) {
      core.setFailed(
        `github.context.payload.pull_request does not exist. Have the correct event triggers been configured?`
      )
      return
    }

    core.debug(`PR body: ${pr.body}`)

    const message = core.getInput(`message`)
    core.debug(`message: ${message}`)

    const prBodyValidationService = new PrBodyValidationService()
    const result = await prBodyValidationService.validateBody(pr.body)

    // Get owner and repo from context
    const owner = github.context.repo.owner
    const repo = github.context.repo.repo
    const pullRequest = github.context.issue

    // Create a comment on PR
    if (result.isPrBodyComplete) {
      const response = await githubClient.issues.createComment({
        owner,
        repo,
        issue_number: pr.number,
        body: result.message
      })

      core.debug(`created comment URL: ${response.data.html_url}`)
      core.setOutput(`comment-url`, response.data.html_url)
      core.setOutput(
        `responseMessage`,
        `✅ All checks passed: ${result.message}`
      )
    } else {
      core.setOutput(
        `responseMessage`,
        `🚧 PR Body incomplete: ${result.message}`
      )
      createReview(result.message, pullRequest)
    }

    core.debug(new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

function createReview(
  comment: string,
  pullRequest: {owner: string; repo: string; number: number}
): void {
  void githubClient.pulls.createReview({
    owner: pullRequest.owner,
    repo: pullRequest.repo,
    pull_number: pullRequest.number,
    body: comment,
    event: 'REQUEST_CHANGES' // Could use "COMMENT"
  })
}

run()
