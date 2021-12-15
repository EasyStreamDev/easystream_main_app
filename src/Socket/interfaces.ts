export interface Mic {
	micName: string,
	micKind: string,
	unversionedmicKind: string,
	value: number,
	isActive: boolean,
};

export interface AllMics {
	length: number,
	mics: [Mic],
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
	length: number,
	events: [Event],
};
