import { getInput } from '@actions/core';
import ms from 'milliseconds';
import { regexFromString } from './util';

export interface Inputs {
  timeout_minutes: number | undefined;
  timeout_seconds: number | undefined;
  max_attempts: number;
  command: string;
  retry_wait_seconds: number;
  shell: string | undefined;
  polling_interval_seconds: number;
  retry_on: string | undefined;
  warning_on_retry: boolean;
  on_retry_command: string | undefined;
  continue_on_error: boolean;
  new_command_on_retry: string | undefined;
  retry_on_exit_code: number | undefined;
  retry_on_pattern: RegExp | undefined;
  retry_pattern_source: 'both' | 'stdout' | 'stderr';
}

export function getInputNumber(id: string, required: boolean): number | undefined {
  const input = getInput(id, { required });
  const num = Number.parseInt(input);

  // empty is ok
  if (!input && !required) {
    return;
  }

  if (!Number.isInteger(num)) {
    throw `Input ${id} only accepts numbers.  Received ${input}`;
  }

  return num;
}

export function getInputBoolean(id: string): boolean {
  const input = getInput(id);

  if (!['true', 'false'].includes(input.toLowerCase())) {
    throw `Input ${id} only accepts boolean values.  Received ${input}`;
  }
  return input.toLowerCase() === 'true';
}

export function getTimeout(inputs: Inputs): number | undefined {
  if (inputs.timeout_minutes) {
    return ms.minutes(inputs.timeout_minutes);
  } else if (inputs.timeout_seconds) {
    return ms.seconds(inputs.timeout_seconds);
  }
  return undefined;
}

export function hasPatternSource(inputs: Inputs, source: 'stdout' | 'stderr') {
  return inputs.retry_pattern_source === 'both' || inputs.retry_pattern_source === source;
}

export function getInputs(): Inputs {
  const timeout_minutes = getInputNumber('timeout_minutes', false);
  const timeout_seconds = getInputNumber('timeout_seconds', false);
  const max_attempts = getInputNumber('max_attempts', false) || 3;
  const command = getInput('command', { required: true });
  const retry_wait_seconds = getInputNumber('retry_wait_seconds', false) || 10;
  const shell = getInput('shell');
  const polling_interval_seconds = getInputNumber('polling_interval_seconds', false) || 1;
  const retry_on = getInput('retry_on') || 'any';
  const warning_on_retry = getInput('warning_on_retry').toLowerCase() === 'true';
  const on_retry_command = getInput('on_retry_command');
  const continue_on_error = getInputBoolean('continue_on_error');
  const new_command_on_retry = getInput('new_command_on_retry');
  const retry_on_exit_code = getInputNumber('retry_on_exit_code', false);
  const retry_on_pattern = (() => {
    const str = getInput('retry_on_pattern');
    if (!str) return undefined;
    try {
      return regexFromString(str);
    } catch {
      return undefined;
    }
  })();
  const retry_pattern_source: Inputs['retry_pattern_source'] = (() => {
    const str = getInput('retry_pattern_source');
    if (!str) return 'both';
    switch (str) {
      case 'stdout':
        return 'stdout';
      case 'stderr':
        return 'stderr';
      case 'both':
        return 'both';
      default:
        throw `Input retry_pattern_source only accepts 'both', 'stdout', or 'stderr'.`;
    }
  })();

  return {
    timeout_minutes,
    timeout_seconds,
    max_attempts,
    command,
    retry_wait_seconds,
    shell,
    polling_interval_seconds,
    retry_on,
    warning_on_retry,
    on_retry_command,
    continue_on_error,
    new_command_on_retry,
    retry_on_exit_code,
    retry_on_pattern,
    retry_pattern_source,
  };
}
