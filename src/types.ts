export interface initialState {
  currentTab: string;
  reqResArray: Record<string, unknown>[];
  history: Record<string, unknown>[];
  collections: Record<string, unknown>[];
  warningMessage: string;
  newRequestFields: NewRequestFields;
  newRequestHeaders: NewRequestHeaders;
  newRequestStreams: NewRequestStreams;
  newRequestCookies: NewRequestCookies;
  newRequestBody: NewRequestBody;
  newRequestSSE: NewRequestSSE;
}

export interface NewRequestFields {
  protocol: string;
  url: string;
  method: string;
  graphQL: boolean;
  gRPC: boolean;
}

export interface NewRequestHeaders {
  headersArr: Record<string, unknown>[];
  count: number;
}

export interface NewRequestStreams {
  streamsArr: Record<string, unknown>[];
  count: number;
  streamContent: Record<string, unknown>[];
  selectedPackage: string | null;
  selectedRequest: string | null;
  selectedService: string | null;
  selectedStreamingType: string | null;
  initialQuery: unknown | null;
  queryArr: Record<string, unknown>[] | null;
  protoPath: unknown | null;
  services: Record<string, unknown> | null;
  protoContent: string;
}

export interface NewRequestCookies {
  cookiesArr: Record<string, unknown>[];
  count: number;
}

export interface NewRequestBody {
  bodyContent: string;
  bodyVariables: string;
  bodyType: string;
  rawType: string;
  JSONFormatted: boolean;
};

export interface NewRequestSSE {
  isSSE: boolean;
};

export interface Message {
  source: string;
  timeReceived: number;
  data: string;
}
export interface WebSocketWindowProps {
  content: Record<string, unknown>[];
  outgoingMessages: Array<Message>;
  incomingMessages: Array<Message>;
  connection: string;
}
export interface WebSocketMessageProps {
  source: string;
  data: string;
  timeReceived: number;
}
export interface CookieProps {
  cookies: {
    expirationDate: string;
  }
  detail?: string;
  className?: string;
}
