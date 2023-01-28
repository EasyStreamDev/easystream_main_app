export interface resultFormat {
	statusCode: number,
	message: string,
};

export interface actionReactionFormat {
	message: string,
    statusCode: number,
    data: {
      actionId: number,
      reactionId: number,
      actReactId: number,
    }
}

interface actionInterface {
	actionId: number,
	type: string,
	params: any
}

interface reactionInterface {
	name: string,
	reactionId: number,
	type: string,
	params?: any
}

export interface removeActReactAnswer {
	statusCode: number,
	message: string,
	data: {
		actReactId: number
	}
}

export interface actReactInterface {
	actReactId: number,
	isActive: boolean,
	action: actionInterface
	reaction: reactionInterface
}

export interface getActReactCouplesFormat {
	statusCode: number,
    message: string,
	data: {
		length: number,
		actReacts: actReactInterface[]
	}
}

export interface Mic {
	micName: string,
	level: number,
	isActive: boolean,
};

export interface AllMics {
	statusCode: number,
	message: string,
	data: {
		length: number,
		mics: [Mic],
	}
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
