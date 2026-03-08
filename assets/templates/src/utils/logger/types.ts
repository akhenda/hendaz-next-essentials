import type { ReactNode } from 'react';

import type { AnyValue } from '@/types';

/**
 * Log levels supported by the logger utility
 *
 * - `trace`: Very detailed logging, typically for debugging
 * - `debug`: Debugging information
 * - `info`: General informational messages
 * - `done`: Operation completed successfully
 * - `success`: Alias for done - operation completed successfully
 * - `notice`: Notice messages, less severe than warnings
 * - `warn`: Warning messages
 * - `error`: Error messages
 * - `fatal`: Fatal error messages that may cause application failure
 */
export type LogLevel =
  | 'trace'
  | 'debug'
  | 'info'
  | 'done'
  | 'success'
  | 'notice'
  | 'warn'
  | 'error'
  | 'fatal';

/**
 * Log function signature - accepts a message and optional parameters
 */
export type LogFunction = (message: string, ...optionalParams: AnyValue[]) => LogResult;

/**
 * Result type returned by log functions, enabling chaining
 *
 * @property {Function} toast - Optional toast function for client-side notifications
 */
export interface LogResult {
  toast: (message?: string | ReactNode, options?: ExternalToast) => void;
}

/**
 * Toast options compatible with sonner library
 */
export interface ExternalToast {
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
  classNames?: {
    toast?: string;
    title?: string;
    description?: string;
    actionButton?: string;
    cancelButton?: string;
    closeButton?: string;
  };
  description?: string | ReactNode;
  duration?: number;
  id?: string;
  important?: boolean;
  onAutoClose?: () => void;
  onClose?: () => void;
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';
  promise?: Promise<unknown>;
}

/**
 * Log function map - maps log levels to backend-specific functions
 * Includes a 'log' key for fallback logging
 */
export type LogFunctionMap = Partial<Record<LogLevel, (...args: AnyValue[]) => void>> & {
  log?: (...args: AnyValue[]) => void;
};

/**
 * Environment configuration for the logger
 */
export interface LoggerConfig {
  isClient: boolean;
  isEdge: boolean;
  isProduction: boolean;
}

/**
 * Log level mappings for different backends
 */
export interface LogLevelMap<T> {
  debug?: keyof T;
  done?: keyof T;
  error?: keyof T;
  fatal?: keyof T;
  info?: keyof T;
  notice?: keyof T;
  success?: keyof T;
  trace?: keyof T;
  warn?: keyof T;
}
