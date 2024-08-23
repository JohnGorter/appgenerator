import appd from './app.json' with { type:"json"};

export type appDec = typeof appd;
export const app  = appd;

