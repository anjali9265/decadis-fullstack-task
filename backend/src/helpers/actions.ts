export const parseActions = (actions: string): string[] => JSON.parse(actions);
export const serializeActions = (actions: string[]): string => JSON.stringify(actions);