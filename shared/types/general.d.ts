export type PageLink = {
  label: string;
  to: string;
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
