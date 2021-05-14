<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/craigbroadman/github-actions-pr-description-linter/workflows/build-test/badge.svg"></a>
</p>

# Create a JavaScript Action using TypeScript
Use this action to validate the body of your pull requests.
- Use placeholders to ensure the author(s) and reviewer(s) are completing the sections you want completed
- Enforce author(s) and reviewer(s) to sign off against your quality measures such as your definition of done

## Pre-requisites
Use this in-conjunction with a Pull Request Template called "pull_request_template.md" in the docs folder (there's an example in docs/pull_request_template.md of this repo!)

In order to be compatible with this GitHub Action, the PR Template must contain the following values: 
### Placeholders
`{{!!DETAILS GO HERE!!}}`

This is a placeholder to prompt authors/reviewers to complete a given section of the PR Body. The GitHub action will fail until no further placeholders are found. 

`- [] **Author(s):**`
`- [] **Reviewer(s):**`

### Sign off
We describe this as "The Final Checklist" in our pull_request_template. The GitHub action will fail until these checkboxes are found, and accepted. 

## Usage

```yaml
uses: craigbroadman/github-actions-pr-description-linter@main
with:
  repo-token: ${{ secrets.GITHUB_TOKEN }}
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:



