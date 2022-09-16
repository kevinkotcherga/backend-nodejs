const typeorm = require('typeorm');
const EntitySchema = typeorm.EntitySchema;

const SkillEntity = new EntitySchema({
	name: 'Skill',
	columns: {
		id: {
			primary: true,
			type: 'int',
			generated: true,
		},
		name: {
			type: 'text',
			unique: true,
		},
	},
	relations: {
		upvotes: {
			type: 'one-to-many',
			inverseSide: 'skill',
			target: 'Upvote',
		},
	},
});

module.exports = SkillEntity;
