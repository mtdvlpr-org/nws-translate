export interface BackupFile {
  date: string;
  email: EmailState
  id: 'nws-translate-backup';
  json: JsonState;
  ui: UIState;
  version: number;
}

export type PageLink = {
  label: string;
  to: string;
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
