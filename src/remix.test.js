const oneBusRoute = [
	{
		"routeId": "Cross-Town Express",
		"stopIds": [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" ],
		"departureTimes": [ 0, 5 ]
	}
];

const multiBusRoute = [
  {
    "routeId": "H1",
    "stopIds": ["E", "F", "G", "H", "I", "J", "K", "J", "I", "H", "G", "F", "E"],
    "departureTimes": [0, 10]
  },
  {
    "routeId": "H2",
    "stopIds": ["T", "S", "R", "Q", "P", "O", "N", "O", "P", "Q", "R", "S", "T"],
    "departureTimes": [0, 10]
  },
  {
    "routeId": "V1",
    "stopIds": ["A", "C", "G", "L", "P", "U", "W", "U", "P", "L", "G", "C", "A"],
    "departureTimes": [5, 15]
  },
  {
    "routeId": "V2",
    "stopIds": ["X", "V", "R", "M", "I", "D", "B", "D", "I", "M", "R", "V", "X"],
    "departureTimes": [5, 15]
  }
];

function calcIsochrone(busRoute, startPoint, startTime, endTime) {
	let mapRoute = {};
	for (let route of busRoute) {
		let departureTimes = route.departureTimes;
		for (let i = 1; i < route.stopIds.length; i++) {
			let from = route.stopIds[i - 1];
			let to = route.stopIds[i];
			if (mapRoute[from] === undefined) {
				mapRoute[from] = [];
			}
			mapRoute[from] = mapRoute[from].concat(departureTimes.map(t => ({'departs': t, 'to': to})));
			departureTimes = departureTimes.map(a => a + 1);
		}
	}

	let queue = [];
	for (let nextStop of mapRoute[startPoint]) {
		if (nextStop.departs >= startTime && nextStop.departs < endTime)
		queue.push(nextStop);
	}

	let result = [startPoint];
	while (queue.length > 0) {
		let currStop = queue.shift();
		if (!result.includes(currStop.to))
			result.push(currStop.to);

		for (let nextStop of mapRoute[currStop.to]) {
			if (nextStop.departs >= (currStop.departs + 1) && nextStop.departs < endTime)
				queue.push(nextStop);
		}	
	}

	result.sort();
	return result;
}

it('For One Bus Route, Jane is at stop A at time 0. She should be able to reach A, B, C, D, E, and F by time 5', () => {
	expect(calcIsochrone(oneBusRoute, 'A', 0, 5)).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
})

it('For One Bus Route, Jane is at stop C at time 3. She should be able to reach C and D by time 8', () => {
	expect(calcIsochrone(oneBusRoute, 'C', 3, 8)).toEqual(['C', 'D']);
})

it('For Multiple Bus Route, Jane is at stop E at time 0. She should be able to reach E, F, G, H, I, J, K, and L by time 8', () => {
	expect(calcIsochrone(multiBusRoute, 'E', 0, 8)).toEqual(['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);
})

it('For Multiple Bus Route, Jane is at stop G at time 3. She should be able to reach E, F, G, H, I, J, L, O, P, U, and W by time 15', () => {
	expect(calcIsochrone(multiBusRoute, 'G', 3, 15)).toEqual(['E', 'F', 'G', 'H', 'I', 'J', 'L', 'O', 'P', 'U', 'W']);
})

it('For Multiple Bus Route, Jane is at stop L at time 0. She should be able to reach A, C, G, L, N, O, P, Q, R, U, and W by time 20', () => {
	expect(calcIsochrone(multiBusRoute, 'L', 0, 20)).toEqual(['A', 'C', 'G', 'L', 'N', 'O', 'P', 'Q', 'R', 'U', 'W']);
})

it('For Multiple Bus Route, Jane is at stop Q at time 5. She should be able to reach M, N, O, P, Q, R, S, T, V, and X by time 18', () => {
	expect(calcIsochrone(multiBusRoute, 'Q', 5, 18)).toEqual(['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'V', 'X']);
})
