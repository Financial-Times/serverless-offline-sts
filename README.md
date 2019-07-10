# serverless-offline-sts

Use AWS STS to assume a role when using serverless-offline

## Usage

Add `serverless-offline-sts` to your plugins list in `serverless.yaml` (after `serverless-offline`)

It requires that your `serverless.yaml`'s `provider` section contains a `region` and a `role`, and that you have ([via a method of your choice](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/configuring-the-jssdk.html)) AWS credentials that allow assuming that role.


### Usage in tests
If you have integration tests that do not use serverless directly, you may use a static method exported by the library to explictly pass in the same settings as serverless would. This offers very little over and above using sts directly, but reduces boilerplate a little.

#### With Jest
```js

const {assumeRole} = require('serverless-offline-sts');

const rolePromise = assumeRole();

describe('My integration tests', () => {
  beforeAll(() => rolePromise);
});

```


#### With Mocha

Use the following options `--delay --require ./sts.js`

sts.js
```js

const {assumeRole} = require('serverless-offline-sts');

assumeRole()
  .then(() => {
    // need to wrap run() as it is not defined on require() - mocha adds it globally
    // at some later point
    run();
  })

```
