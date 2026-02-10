export const typedKeys = <T extends object>(obj: T) =>
  Object.keys(obj) as (keyof T)[];

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
