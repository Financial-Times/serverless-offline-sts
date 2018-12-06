# serverless-offline-sts

Use AWS STS to assume a role when using serverless-offline

## Usage

Add `serverless-offline-sts` to your plugins list in `serverless.yaml` (after `serverless-offline`)

It requires that your `serverless.yaml`'s `provider` section contains a `region` and a `role`, and that you have ([via a method of your choice](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/configuring-the-jssdk.html)) AWS credentials that allow assuming that role.
