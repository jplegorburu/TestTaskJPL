# TestTaskJPL
Test Task QA Automation

The solution was made with GlaceJS framework.

I made some assumptions when making the test cases, which are the following:
  - When the balance is 0 the Spin button should be blocked
  - If the input is invalid, either if its longer than 5 characters or has letters or symbols. It should not add coins in case of success, should not consume coins and should show a message of Invalid Input.
  - As this last thing is not implemented I left the lines where I make this assertion commented so the tests run at a faster pace because it would wait 5 seconds looking for the element that is not present.

There are 2 JSON files with the different test cases.

### Install node packages
```sh
npm install
```
### To run the tests

```sh
glace test-task.js --web --web-url file:///path/to/file/Test_Task.html
```
