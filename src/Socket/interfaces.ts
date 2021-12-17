export interface resultFormat {
	message: string,
	statusCode: number,
};

export interface Mic {
	micName: string,
	micKind: string,
	unversionedmicKind: string,
	value: number,
	isActive: boolean,
};

export interface AllMics {
	message: string,
	length: number,
	mics: [Mic],
	statusCode: number,
};

export interface TimeRange {
	timeRange: number,
	ref: 'seconds' | 'minutes' | 'ad vitam aeternam'
};

export interface Event {
	id: number,
	sources: [String],
	keywords: [String],
	time: TimeRange,
};

export interface AllEvents {
	message: string,
	length: number,
	events: [Event],
	statusCode: number,
};
