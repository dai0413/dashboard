export type MetaData = {
  identifiers: string[];
  data:
    | {
        cardId: string[];
      }
    | {
        url: string[];
      };
};
