import * as https from 'https';

const convertAnyToString = (value: any): string => {
	if (typeof value === 'string' || value instanceof String) {
		return value as string;
	} else {
		return JSON.stringify(value) as string;
	}
};

const padLeft = (value: string, padChar: string, padLength: number): string => {
	// get the pad character
	padChar = padChar[0] || ' ';

	// add the padChar until the length of value is the desired length or bigger
	while (value.length < padLength) {
		value = padChar + value;
	}

	// return the padded result
	return value;
};

const dateToString = (date: Date, includeDate: boolean = true, includeTime: boolean = true): string => {
	// Using this format to avoid UTC changes, using toISOString() and substringing will potentially cause issues with timezones causing the date to be 1 day behind
	let dateString = includeDate
		? padLeft(date.getFullYear() + '', '0', 4) +
		'-' +
		padLeft(date.getMonth() + 1 + '', '0', 2) +
		'-' +
		padLeft(date.getDate() + '', '0', 2)
		: '';

	if (dateString.length && includeTime) dateString += ' ';

	dateString += includeTime
		? padLeft(date.getHours() + '', '0', 2) +
		':' +
		padLeft(date.getMinutes() + '', '0', 2) +
		':' +
		padLeft(date.getSeconds() + '', '0', 2)
		: '';
	return dateString;
};

const convertToBoolean = (value: string | number | boolean | undefined | null) => {
	const valueNumber = Number(value ?? 0);
	return !!(Number.isNaN(valueNumber) ? (value ?? '').toString().toLowerCase() === 'true' : valueNumber);
};

const index = <T, K extends keyof T>(array: T[], indexes: K[]): Map<string | undefined, T[]>[] => {
	// create a map for each index
	const mapsArr: Map<string | undefined, T[]>[] = [];
	// add Map objects to the mapsArr
	for (const i in indexes) {
		mapsArr[i] = new Map<string | undefined, T[]>();
	}
	// loop through the array
	for (const entry of array) {
		// for each index, add to the map at the correct index
		for (const i in indexes) {
			// get the index to use
			const index: K = indexes[i];
			// get the current map to add to
			const currMap: Map<string | undefined, T[]> = mapsArr[i];
			// get the value at that index in the current entry
			const indexValue: string = convertAnyToString(entry[index]);
			// check if need to push or create array
			if (!currMap.has(indexValue)) {
				currMap.set(indexValue, [entry]);
			} else {
				(currMap.get(indexValue) || []).push(entry);
			}
		}
	}
	return mapsArr;
};

// API documentation: https://jsonplaceholder.typicode.com/

https.get('https://jsonplaceholder.typicode.com/posts/1/comments', (response) => {
	var statusCode = response.statusCode ?? 200;
	var rawData = '';

	if (statusCode >= 200 && statusCode <= 299) {
		throw new Error("Status code failed");
	}

	response.on('data', (chunk) => {
		rawData += chunk;
	});

	response.on('end', () => {
		try {
			// TODO:
			var comments: {
				something: string;
			} = JSON.parse(rawData);
			// handle code here

			https.get('https://jsonplaceholder.typicode.com/albums/1/photos', (response) => {
				var statusCode = response.statusCode ?? 200;
				var rawData = '';

				if (statusCode >= 200 && statusCode <= 299) {
					throw new Error("Status code failed");
				}

				response.on('data', (chunk) => {
					rawData += chunk;
				});

				response.on('end', () => {
					try {
						var photos = JSON.parse(rawData);
						// handle code here

						https.get('https://jsonplaceholder.typicode.com/users/1/albums', (response) => {
							var statusCode = response.statusCode ?? 200;
							var rawData = '';

							if (statusCode >= 200 && statusCode <= 299) {
								throw new Error("Status code failed");
							}

							response.on('data', (chunk) => {
								rawData += chunk;
							});

							response.on('end', () => {
								try {
									var albums = JSON.parse(rawData);
									// handle code here

									console.log(comments, photos, albums);

									if (comments.id === 1) {
										console.log(comments.name);
									}

									// combine data

								} catch (e) {
									console.error('This function is a failure');
								}
							});
						});

					} catch (e) {
						console.error('This function is a failure');
					}
				});
			});

		} catch (e) {
			console.error('This function is a failure');
		}
	});
});