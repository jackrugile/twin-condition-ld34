/*
	1 - 3 col | 3 tall  | 1 hit kills
	2 - 3 col | 3 tall  | 1 hit kills
	3 - 4 col | 4 tall  | 2 hit kills
	4 - 4 col | 4 tall  | 2 hit kills
	5 - 5 col | 6 tall  | 3 hit kills
	6 - 5 col | 6 tall  | 3 hit kills
	7 - 6 col | 12 tall | 4 hit kills
	8 - 6 col | 12 tall | 4 hit kills
	9 - 6 col | 16 tall | 4 hit kills

	maybe always one hit kills
	send two enemies at a time?
*/

$.levels = [
	// level 1
	{
		cols: 3,
		rows: 3,
		hits: 1,
		interval: {
			block: 2000,
			enemy: 2000
		},
		duration: {
			block: 4000,
			enemy: 12000
		},
		color: 220
	},
	// level 2
	{
		cols: 3,
		rows: 3,
		hits: 1,
		interval: {
			block: 1500,
			enemy: 1500
		},
		duration: {
			block: 3000,
			enemy: 9000
		},
		color: 260
	},
	// level 3
	{
		cols: 4,
		rows: 4,
		hits: 1,
		interval: {
			block: 2000,
			enemy: 2000
		},
		duration: {
			block: 4000,
			enemy: 12000
		},
		color: 300
	},
	// level 4
	{
		cols: 4,
		rows: 4,
		hits: 1,
		interval: {
			block: 2000,
			enemy: 2000
		},
		duration: {
			block: 4000,
			enemy: 12000
		},
		color: 340
	},
	// level 5
	{
		cols: 5,
		rows: 6,
		hits: 1,
		interval: {
			block: 2000,
			enemy: 2000
		},
		duration: {
			block: 4000,
			enemy: 12000
		},
		color: 20
	},
	// level 6
	{
		cols: 5,
		rows: 6,
		hits: 1,
		interval: {
			block: 2000,
			enemy: 2000
		},
		duration: {
			block: 4000,
			enemy: 12000
		},
		color: 60
	},
	// level 7
	{
		cols: 6,
		rows: 12,
		hits: 1,
		interval: {
			block: 2000,
			enemy: 2000
		},
		duration: {
			block: 4000,
			enemy: 12000
		},
		color: 100
	},
	// level 8
	{
		cols: 6,
		rows: 12,
		hits: 1,
		interval: {
			block: 2000,
			enemy: 2000
		},
		duration: {
			block: 4000,
			enemy: 12000
		},
		color: 140
	},
	// level 9
	{
		cols: 3,
		rows: 3,
		hits: 1,
		interval: {
			block: 2000,
			enemy: 2000
		},
		duration: {
			block: 4000,
			enemy: 12000
		},
		color: 180
	}
];