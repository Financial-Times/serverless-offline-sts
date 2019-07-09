class OfflineSTS {
	constructor(serverless) {
		this.commands = {
			OfflineSTS: {
				lifecycleEvents: [],
			},
		};

		this.hooks = {
			'before:offline:start:init': this.assumeRole.bind(null, serverless),
		};
	}

	async assumeRole(serverless) {
		const AWS = require('aws-sdk');
		return assumeRole({
			region: serverless.service.provider.region,
			role: serverless.service.provider.role,
			sessionNamespace: serverless.service.service
		})
	}

	static async assumeRole ({
		region,
		role,
		sessionNamespace
	}) {
		const AWS = require('aws-sdk');

		AWS.config.region = region;
		const sts = new AWS.STS({ apiVersion: '2011-06-15' });

		return sts
			.assumeRole({
				RoleArn: role,
				RoleSessionName: `${sessionNamespace}-${process.env.USER ||
					'unknown'}-${Date.now()}`,
			})
			.promise()
			.then(data => {
				AWS.config.update({
					accessKeyId: data.Credentials.AccessKeyId,
					secretAccessKey: data.Credentials.SecretAccessKey,
					sessionToken: data.Credentials.SessionToken,
				});
			})
			.catch(err => {
				console.error(
					`Failed to assume ${serverless.service.provider.role}`,
					err,
				);
				throw err;
			});
	}
}

module.exports = OfflineSTS;
