export const API_PATHS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
  },

  TOP_PAGE: {
    GET: "/top-page",
  },

  COMPETITION_STAGE: {
    ROOT: "/competition-stage",
    DETAIL: (id: string | number = ":id") => `/competition-stage/${id}`,
  },

  COMPETITION: {
    ROOT: "/competition",
    DETAIL: (id: string | number = ":id") => `/competition/${id}`,
  },

  COUNTRY: {
    ROOT: "/country",
    DETAIL: (id: string | number = ":id") => `/country/${id}`,
  },

  FORMATION: {
    ROOT: "/formation",
    DETAIL: (id: string | number = ":id") => `/formation/${id}`,
  },

  INJURY: {
    ROOT: "/injury",
    DETAIL: (id: string | number = ":id") => `/injury/${id}`,
  },

  MATCH_EVENT_TYPE: {
    ROOT: "/match-event-type",
    DETAIL: (id: string | number = ":id") => `/match-event-type/${id}`,
  },

  MATCH_FORMAT: {
    ROOT: "/match-format",
    DETAIL: (id: string | number = ":id") => `/match-format/${id}`,
  },

  MATCH_TEAM_FORMATION: {
    ROOT: "/match-team-formation",
    DETAIL: (id: string | number = ":id") => `/match-team-formation/${id}`,
  },

  MATCH: {
    ROOT: "/match",
    UPLOAD: "/match/upload",
    DETAIL: (id: string | number = ":id") => `/match/${id}`,
  },

  NATIONAL_CALLUP: {
    ROOT: "/national-callup",
    DETAIL: (id: string | number = ":id") => `/national-callup/${id}`,
  },

  NATIONAL_MATCH_SERIES: {
    ROOT: "/national-match-series",
    DOWNLOAD: "/national-match-series/download",
    DETAIL: (id: string | number = ":id") => `/national-match-series/${id}`,
  },

  PLAYER_APPEARANCE: {
    ROOT: "/player-appearance",
    DETAIL: (id: string | number = ":id") => `/player-appearance/${id}`,
  },

  PLAYER_MATCH_EVENT_LOG: {
    ROOT: "/player-match-event-log",
    DETAIL: (id: string | number = ":id") => `/player-match-event-log/${id}`,
  },

  PLAYER_REGISTRATION_HISTORY: {
    ROOT: "/player-registration-history",
    DETAIL: (id: string | number = ":id") =>
      `/player-registration-history/${id}`,
  },

  PLAYER_REGISTRATION: {
    ROOT: "/player-registration",
    DETAIL: (id: string | number = ":id") => `/player-registration/${id}`,
  },

  PLAYER: {
    ROOT: "/player",
    CHECK: "/player/check",
    UPLOAD: "/player/upload",
    DOWNLOAD: "/player/download",
    DETAIL: (id: string | number = ":id") => `/player/${id}`,
  },

  REFEREE: {
    ROOT: "/referee",
    DETAIL: (id: string | number = ":id") => `/referee/${id}`,
  },

  SEASON: {
    ROOT: "/season",
    DETAIL: (id: string | number = ":id") => `/season/${id}`,
  },

  STADIUM: {
    ROOT: "/stadium",
    DETAIL: (id: string | number = ":id") => `/stadium/${id}`,
  },

  STAFF_APPEARANCE: {
    ROOT: "/staff-appearance",
    DETAIL: (id: string | number = ":id") => `/staff-appearance/${id}`,
  },

  STAFF_MATCH_EVENT_LOG: {
    ROOT: "/staff-match-event-log",
    DETAIL: (id: string | number = ":id") => `/staff-match-event-log/${id}`,
  },

  STAFF: {
    ROOT: "/staff",
    UPLOAD: "/staff/upload",
    DOWNLOAD: "/staff/download",
    DETAIL: (id: string | number = ":id") => `/staff/${id}`,
  },

  TEAM_COMPETITION_SEASON: {
    ROOT: "/team-competition-season",
    UPLOAD: "/team-competition-season/upload",
    DOWNLOAD: "/team-competition-season/download",
    DETAIL: (id: string | number = ":id") => `/team-competition-season/${id}`,
  },

  TEAM: {
    ROOT: "/team",
    DOWNLOAD: "/team/download",
    DETAIL: (id: string | number = ":id") => `/team/${id}`,
  },

  TRANSFER: {
    ROOT: "/transfer",
    DETAIL: (id: string | number = ":id") => `/transfer/${id}`,
  },

  AGGREGATE: {
    NATIONAL_CALLUP: {
      ROOT: "/aggregate/national-callup",
      SERIES_COUNT: (id: string | number = ":id") =>
        `/aggregate/national-callup/series-count/${id}`,
    },

    TRANSFER: {
      ROOT: "/aggregate/transfer",
      CURRENT_PLAYERS_BY_TEAM: (id: string | number = ":id") =>
        `/aggregate/transfer/current-players/${id}`,
      CURRENT_LOANS_BY_TEAM: (id: string | number = ":id") =>
        `/aggregate/transfer/current-loans/${id}`,
      NO_NUMBER: "/aggregate/transfer/no-number",
    },
  },
} as const;
