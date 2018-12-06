module.exports = {
	extends: [
		'origami-component',
		'plugin:prettier/recommended',
	],
	env: {
		node: true,
		jest: true,
	},
	parserOptions: {
		ecmaVersion: 2017,
		ecmaFeatures: {
			jsx: true
		},
	},
	globals: {
		expect: true,
		sinon: true,
		tinymce: true
	},
	overrides: [
		{
			files: ['**/*.jsx'],
			settings: {
				react: {
					pragma: 'h'
				}
			},
		}
	],
	rules: {
		'react/prop-types': 0,
		'react/jsx-key': 0,
		'new-cap': 0
	}
};
