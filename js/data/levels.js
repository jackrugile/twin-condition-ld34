/*
	1 - 3 col | 3 tall  | 1 hit kills
	2 - 3 col | 4 tall  | 1 hit kills
	3 - 4 col | 4 tall  | 2 hit kills
	4 - 4 col | 6 tall  | 2 hit kills
	5 - 5 col | 6 tall  | 3 hit kills
	6 - 5 col | 12 tall | 3 hit kills
	7 - 6 col | 12 tall | 4 hit kills
	8 - 6 col | 16 tall | 4 hit kills

	maybe always one hit kills
*/

$.levels = [
	// power level
	/*{
		cols: 5,
		rows: 12,
		hits: 1,
		interval: 50, // ticks or ms?
		intervalDec: 0,
		duration: 100, // might use a duration for this, so I can use a ease/tween
		durationDec: 0,
		colors: {
			left: 200,
			right: 330
		}
	},*/
	// level 1 
	{
		cols: 3,
		rows: 3,
		hits: 1,
		interval: {
			block: 2000,
			enemy: 4000
		},
		duration: {
			block: 4000,
			enemy: 8000
		},
		colors: {
			left: 200,
			right: 330
		}
	}
];