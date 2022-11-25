export default {
	name: 'comment',
	title: 'Comment',
	type: 'document',
	fields: [
		{ name: 'name', type: 'string' },
		{ name: 'email', type: 'string' },
		{ name: 'comment', type: 'text' },
		{
			title: 'Approved',
			name: 'approved',
			type: 'boolean',
			description: 'Comments needs approval',
		},
		{ name: 'post', type: 'reference', to: { type: 'post' } },
	],
};
