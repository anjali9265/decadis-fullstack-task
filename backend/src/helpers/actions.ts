// export const parseActions = (actions: string): string[] => JSON.parse(actions);
// export const serializeActions = (actions: string[]): string => JSON.stringify(actions);
export const parseActions = (actions: string | string[]): string[] => {
  if (Array.isArray(actions)) return actions;
  try {
    return JSON.parse(actions);
  } catch {
    return [];
  }
};

export const serializeActions = (actions: string[]): string => JSON.stringify(actions);
