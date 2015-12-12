/*
	1 - 2 col | 3 tall  | 1 hit kills
	2 - 2 col | 4 tall  | 1 hit kills
	3 - 3 col | 4 tall  | 2 hit kills
	4 - 3 col | 6 tall  | 2 hit kills
	5 - 4 col | 6 tall  | 3 hit kills
	6 - 4 col | 12 tall | 3 hit kills
	7 - 5 col | 12 tall | 4 hit kills
	8 - 5 col | 16 tall | 4 hit kills
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
		interval: 1000, // ticks or ms?
		intervalDec: 0,
		duration: 3000, // might use a duration for this, so I can use a ease/tween
		durationDec: 0,
		colors: {
			left: 200,
			right: 330
		}
	}
];