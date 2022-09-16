const datasource = require('../utils');

module.exports = {
	create: async (req, res) => {
		const repository = datasource.getRepository('Upvote');

		const exitingUpvote = await repository.findOne({
			where: {
				skill: { id: req.body.skillId },
				wilder: { id: req.body.wilderId },
			},
		});

		if (exitingUpvote) {
			res.json(exitingUpvote);
		} else {
			const upvote = await repository.save({
				//upvote: 0,
				wilder: { id: req.body.wilderId },
				skill: { id: req.body.skillId },
			});
			res.json(upvote);
		}
	},
	upvote: async (req, res) => {
		const repository = datasource.getRepository('Upvote');

		const exitingUpvote = await repository.findOne({
			where: {
				id: req.params.upvoteId,
			},
		});

		if (exitingUpvote) {
			exitingUpvote.upvote += 1;

			await repository.save(exitingUpvote);

			res.json(exitingUpvote);
		} else {
			throw new Error('Doest not exist');
		}
	},
};
