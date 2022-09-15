const typeorm = require('typeorm');
const EntitySchema = typeorm.EntitySchema;

const WilderEntity = new EntitySchema({
	name: 'Wilder',
	columns: {
		id: {
			primary: true,
			type: 'int',
			generated: true,
		},
		name: {
			type: 'text',
		},
		city: {
			type: 'text',
		},
	},
	relations: {
		skills: {
			target: 'Skill',
			type: 'many-to-many',
			joinTable: true,
			eager: true,
		},
	},
});

module.exports = WilderEntity;
