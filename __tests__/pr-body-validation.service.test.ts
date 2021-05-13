import {PrBodyValidationService} from '../src/pr-body-validation.service'

var prBodyValidationService: PrBodyValidationService

const prBodyEmpty: string = ''
const prBodyJunk: string = `# Summary`

const prBodySignedOffButWithPlaceholders: string = `# Summary
**Describe the changes:**
{{!!DETAILS GO HERE!!}}

# Final checklist
- [x] **Author(s):** I have reviewed the Code Safety Guidelines
- [x] **Reviewer(s):** I am signing off
`

const prBodyNotSignedOffAndNoPlaceholders: string = `# Summary
**Describe the changes:**
This changes X, Y, Z

# Final checklist
- [] **Author(s):** I have reviewed the Code Safety Guidelines
- [] **Reviewer(s):** I am signing off
`

const prBodyComplete: string = `# Summary
**Describe the changes:**
This changes X, Y, Z

# Final checklist
- [x] **Author(s):** I have reviewed the Code Safety Guidelines
- [x] **Reviewer(s):** I am signing off
`

var testCases = [
  {
    title: 'A PR Body that is NULL should fail and return: ',
    expectedMessagePrefix: 'The PR Body is empty',
    body: null,
    isPrBodyCompleteExpected: false
  },
  {
    title: 'A PR Body that is NULL should fail and return: ',
    expectedMessagePrefix: 'The PR Body is empty',
    body: undefined,
    isPrBodyCompleteExpected: false
  },
  {
    title: 'A PR Body with placeholders should fail and return: ',
    expectedMessagePrefix: 'Please complete all placeholders',
    body: prBodySignedOffButWithPlaceholders,
    isPrBodyCompleteExpected: false
  },
  {
    title:
      'A PR Body without placeholders but not signed off should fail and return: ',
    expectedMessagePrefix: 'Please complete the final checklist',
    body: prBodyNotSignedOffAndNoPlaceholders,
    isPrBodyCompleteExpected: false
  },
  {
    title:
      'A PR Body without placeholders that is signed off should pass and return: ',
    expectedMessagePrefix: 'Nice work',
    body: prBodyComplete,
    isPrBodyCompleteExpected: true
  }
]

beforeEach(() => {
  prBodyValidationService = new PrBodyValidationService()
})

testCases.forEach(function (testCase) {
  test(
    testCase.title + '"' + testCase.expectedMessagePrefix + '"',
    async () => {
      var result = await prBodyValidationService.validateBody(testCase.body)

      expect(result.isPrBodyComplete).toBe(testCase.isPrBodyCompleteExpected)
      expect(result.message).toContain(testCase.expectedMessagePrefix)
    }
  )
})

test('Validate PR Body null', async () => {
  var result = await prBodyValidationService.validateBody(null)

  expect(result.isPrBodyComplete).toBe(false)
  expect(result.message).toBe(
    'The PR Body is empty - do you have the pull request template setup (docs -> pull_request_template.md)?'
  )
})

test('Validate PR Body undefined', async () => {
  var result = await prBodyValidationService.validateBody(undefined)

  expect(result.isPrBodyComplete).toBe(false)
  expect(result.message).toBe(
    'The PR Body is empty - do you have the pull request template setup (docs -> pull_request_template.md)?'
  )
})
