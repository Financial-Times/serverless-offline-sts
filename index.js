const execa = require('execa');
const yaml = require('js-yaml');

const readServerless = async () => {
	const serverlessYaml = await execa('serverless', ['print']);
	return yaml.load(serverlessYaml.stdout);
};

const assumeRole = async config => {
	const AWS = require('aws-sdk'); // eslint-disable-line global-require
	AWS.config.region = config.provider.region;
	const sts = new AWS.STS({ apiVersion: '2011-06-15' });
	console.log(`Attempting to assume AWS role ${config.provider.iam.role}`);
	return sts
		.assumeRole({
			RoleArn: config.provider.iam.role,
			RoleSessionName: `${config.provider.service}-${
				process.env.USER || 'unknown'
			}-${Date.now()}`,
		})
		.promise()
		.then(data => {
			AWS.config.update({
				accessKeyId: data.Credentials.AccessKeyId,
				secretAccessKey: data.Credentials.SecretAccessKey,
				sessionToken: data.Credentials.SessionToken,
			});
			console.log(
				`Assumed AWS role ${config.provider.iam.role} successfully`,
			);
		})
		.catch(err => {
			console.error(`Failed to assume ${config.provider.iam.role}`, err);
			throw err;
		});
};

class OfflineSTS {
	constructor(serverless) {
		this.hooks = {
			'before:offline:start': () => this.assumeRole(serverless),
		};
	}

	async assumeRole(serverless) {
		return assumeRole(serverless.service);
	}

	static async assumeRole() {
		const serverlessYaml = await readServerless();
		return assumeRole(serverlessYaml);
	}
}

module.exports = OfflineSTS;
