export type UploadConfig = {
  createValidRows: (rows: any[]) => Promise<(any & { error?: string })[]>;
};
