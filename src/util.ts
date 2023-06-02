import { debug } from '@actions/core';

export async function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function retryWait(retryWaitSeconds: number) {
  const waitStart = Date.now();
  await wait(retryWaitSeconds);
  debug(`Waited ${Date.now() - waitStart}ms`);
  debug(`Configured wait: ${retryWaitSeconds}ms`);
}

export function regexFromString(str: string) {
  if (!str.startsWith('/')) return RegExp(str);

  // https://stackoverflow.com/a/68730938
  // see ... [https://regex101.com/r/Ek881d/2]
  const { body, flags } = str.match(/^\/(?<body>.*)\/(?<flags>[gimsuy]*)$/)?.groups || {};

  return RegExp(body, body && flags);
}
