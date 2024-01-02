export interface resultFormat {
  statusCode: number;
  message: string;
}

export interface actionReactionFormat {
  message: string;
  statusCode: number;
  data: {
    actionId: number;
    reactionId: number;
    actReactId: number;
  };
}

interface actionInterface {
  actionId: number;
  type: string;
  params: any;
}

interface reactionInterface {
  name: string;
  reactionId: number;
  type: string;
  params?: any;
}

export interface removeActReactAnswer {
  statusCode: number;
  message: string;
  data: {
    actReactId: number;
  };
}

export interface actReactInterface {
  actReactId: number;
  isActive: boolean;
  action: actionInterface;
  reaction: reactionInterface;
}

export interface getActReactCouplesFormat {
  statusCode: number;
  message: string;
  data: {
    length: number;
    actReacts: actReactInterface[];
  };
}

export interface Mic {
  micName: string;
  level: number;
  uuid: string;
  isActive: boolean;
}

export interface AllMics {
  statusCode: number;
  message: string;
  data: {
    length: number;
    mics: [Mic];
  };
}

export interface Scene {
  name: string;
  uuid: string;
}

export interface AllScenes {
  statusCode: number;
  messages: string;
  data: {
    length: number;
    scenes: [Scene];
  };
}

export interface TextFieldSimple {
  name: string;
  uuid: string;
  linked_mics: string[];
}

export interface TextFieldDetailed {
  name: string;
  uuid: string;
  parent_scene: string;
}

export interface AllSubtitlesSettings {
  statusCode: number;
  messages: string;
  data: {
    length: number;
    text_fields: [TextFieldSimple];
  };
}

export interface AllTextFields {
  statusCode: number;
  messages: string;
  data: {
    length: number;
    text_fields: [TextFieldDetailed];
  }
}

export interface TimeRange {
  timeRange: number;
  ref: "seconds" | "minutes" | "ad vitam aeternam";
}

export interface Event {
  id: number;
  sources: [String];
  keywords: [String];
  time: TimeRange;
}

export interface AllEvents {
  length: number;
  events: [Event];
}

export interface DisplaySource {
  name: string;
  uuid: string;
  parent_scene: string;
}

export interface AllDisplaySources {
  length: number;
  display_sources: DisplaySource[];
}

export interface AllDisplaySourcesResult {
  statusCode: number;
  message: string;
  data: AllDisplaySources;
}


// getAllLinksMicsToVideoSource
export interface linkMicsToVideoSource {
  display_source_ids: [string];
  mic_id: string;
}

export interface AllLinksMicsToVideoSource {
  length: number;
  links: [linkMicsToVideoSource];
}

export interface AllLinksMicsToVideoSourceResult {
  statusCode: number;
  message: string;
  data: AllLinksMicsToVideoSource;
}