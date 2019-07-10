# serverless-offline-sts

Use AWS STS to assume a role when using serverless-offline

## Why does this package exist
It's common practice in a lot of teams at the FT to keep credential mangement local to a project, i.e. no global environment variables needed in your development environment to run the project (with perhaps the exception of some global variables used to fetch others, such as vault login tokens).

We also try to follow best practice of least privilege when managing IAM resources. Our deploy _users_ (for which we mint access keys) have access to create and modify resources' configuration, whereas our application _roles_ have access to interact with (read, write etc) those resources once created.

However, AWS/serverless have a credentials model where allowing a user to assume a role in local dev involves storing keys and role assumption config in a global `~/.aws` directory which a) menas we have credentials living outside of the project root and b) we have another source of truth for the relation between roles and users, which must be kept in sync.

This package gets around that by providing a serverless plugin that assumes the application role before starting serverless/integration tests, thus removing the need to maintain any credentials/config outside the project.

## Usage

Add `serverless-offline-sts` to your plugins list in `serverless.yaml` (after `serverless-offline`)

It requires that your `serverless.yaml`'s `provider` section contains a `region` and a `role`, and that you have ([via a method of your choice](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/configuring-the-jssdk.html)) AWS credentials that allow assuming that role.

### Usage in tests

If you have integration tests that do not use serverless directly, you may use a static method exported by the library to explictly pass in the same settings as serverless would. This offers very little over and above using sts directly, but reduces boilerplate a little.

#### With Jest

```js
const { assumeRole } = require('serverless-offline-sts');

const rolePromise = assumeRole();

describe('My integration tests', () => {
	beforeAll(() => rolePromise);
});
```

#### With Mocha

Use the following options `--delay --require ./sts.js`

sts.js

```js
const { assumeRole } = require('serverless-offline-sts');

assumeRole().then(() => {
	// need to wrap run() as it is not defined on require() - mocha adds it globally
	// at some later point
	run();
});
```
