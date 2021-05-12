import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    // const ms: string = core.getInput('milliseconds')
    core.debug(new Date().toTimeString())

    // The pull_request exists on payload when a pull_request event is triggered.
    // Sets action status to failed when pull_request does not exist on payload.
    const pr = github.context.payload.pull_request
    if (!pr) {
      core.setFailed('github.context.payload.pull_request does not exist')
      return
    }

    // Get input parameters.
    const githubToken = core.getInput('repo-token')
    const message = core.getInput('message')
    core.debug(`message: ${message}`)

    // Create a GitHub client.
    // The Octokit is a helper, to interact with
    // the github REST interface.
    // You can look up the REST interface
    // here: https://octokit.github.io/rest.js/v18
    const octokit = github.getOctokit(githubToken)

    // Get owner and repo from context
    const owner = github.context.repo.owner
    const repo = github.context.repo.repo

    // Create a comment on PR
    const response = await octokit.issues.createComment({
      owner,
      repo,
      issue_number: pr.number,
      body: message
    })

    core.debug(`created comment URL: ${response.data.html_url}`)

    core.setOutput('comment-url', response.data.html_url)

    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
