# Getting Started

## Setting up local environment

You might need to setup an local environment file for developement. Please
create `.env.development` file and set variables with corresponding values

```properties
REACT_APP_API_URL="http://localhost:3001/v1"
REACT_APP_VERSION="1.0.0"
```
### Setting using yarn

If you don't have `yarn` installed, do

```bash
$ npm install --global yarn
```
Install all dependencies

```bash
$ yarn install
```

Run the development server:

```bash
$ yarn run dev
```

### Setting using bun

If you don't have `bun` installed, do

```bash
$ npm install --global bun
```
Install all dependencies

```bash
$ bun install
```

Run the development server:

```bash
$ bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

<hr>

## Create & verify an account on your local machine

### Pre-requisite :

- Make sure you have access of both front-end and backend codebase
- Install dependencies using `yarn install`
- Start both the frontend and backend using `yarn start`

### Steps :

1. Signup with a valid email id.
2. You should recieve a verification email.
3. Once you open the link to verify, you will be redirected to
   `https://dev.testbox.build-release.com/verify?token=***`
4. Replace the domain with `localhost:3000` so it resembles
   `localhost:3000/verify?token=***`
5. Hit <kbd>Enter</kbd> and your account should be verified.

<hr>

## Run End-to-End tests on your local machine

### Setup :

Create a `cypress.env.json` file in project root and replace each key with
correct value.

```json
{
  "api_baseUrl": "http://localhost:3001/v1",
  "email": "id@domain.com",
  "pwd": "password",
  "newPwd": "newPassword",
  "hideXHR": false,
  "jiraOrgAddress": "https://<orgName>.atlassian.net/",
  "jiraUserEmail": "id@domain.com", // Email Id registered with JIRA
  "jiraApiTokenOne": "<apiToken_1>",
  "jiraApiTokenTwo": "<apiToken_2>"
}
```

- `newPwd` is for only testing purpose, account password will always be `pwd`.

- `api_baseUrl` is set to default.

  > Update only if you have changed the backend server port.

- `jiraApiToken` can be created from here
  https://id.atlassian.com/manage-profile/security/api-tokens
  > More info about managing Jira tokens here:
  > https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/
- Optional: Set `hideXHR` to `true`, hides XHR logs in Cypress **Command Log**.

### Run scripts :

```bash
# To run the tests in headless mode, (hides the browser)
$ yarn test-run

# To run the tests in browser
$ yarn test-open
```

### Release build on staging :

- checkout to staging branch
- make sure staging branch has the latest changes
- install dependencies again if there is newely added by run `yarn` in terminal
- run the project on your localhost `yarn start` and make sure everything is
  working fine
- commit your code with latest changes `git add .` and then
  `git commit -m "your latest changes title here "`
- push your code on staging `git push origin staging`
- after code pushed on staging the auto deployment will start work and changes
  will go on stating.



### Contribution Guidelines
  Please make sure to follow the contribution guidelines before making a pull request. Quality contributions are what make the open-source community an amazing place to learn, inspire, and create.
  Find the full list of guidelines in the CONTRIBUTING.md file.

### License
  This repository is licensed under the MIT License.
  Let's start contributing and make the open-source community a better place for everyone!