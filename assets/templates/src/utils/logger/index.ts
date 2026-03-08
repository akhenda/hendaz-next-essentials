/** biome-ignore-all lint/suspicious/noConsole: allowed in this context */
import type { ReactNode } from 'react';

import type { Logger as LogtailLogger } from '@logtail/next'; // For Prod
import { log as logtail } from '@logtail/next'; // For Prod
import * as Sentry from '@sentry/nextjs'; // Use Sentry namespace
import type { ConsolaInstance } from 'consola'; // For Dev
import { consola } from 'consola'; // For Dev
import type { ExternalToast } from 'sonner'; // Rename to avoid conflict
import { toast as sonnerToast } from 'sonner'; // Rename to avoid conflict

import type { AnyValue } from '@/types';

import type {
  ExternalToast as LoggerExternalToast,
  LogFunctionMap,
  LoggerConfig,
  LogLevel,
  LogLevelMap,
  LogResult,
} from './types';

// Re-export types for consumers
export type {
  ExternalToast,
  LogFunctionMap,
  LoggerConfig,
  LogLevel,
  LogLevelMap,
  LogResult,
} from './types';

// --- Configuration ---

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';
const isClient = typeof window !== 'undefined';
const isEdge = typeof EdgeRuntime !== 'undefined';

// --- Sentry Reporting Helper ---

/**
 * Reports errors to Sentry for error and fatal log levels
 *
 * @param level - The log level
 * @param message - The log message
 * @param optionalParams - Additional parameters to log
 */
function reportErrorToSentry(level: LogLevel, message: string, optionalParams: AnyValue[]): void {
  // Only proceed for error or fatal levels
  if (level !== 'error' && level !== 'fatal') return;

  // Find the first Error object in the optional parameters
  const errorInstance = optionalParams.find((param): param is Error => param instanceof Error);

  if (errorInstance) {
    try {
      // Capture the exception with additional context if available
      const sentryId = Sentry.captureException(errorInstance, {
        level, // Sentry understands 'error' and 'fatal'
        extra: {
          logMessage: message,
          // Add non-Error optionalParams as extra context
          optionalParams: optionalParams.filter((param) => !(param instanceof Error)),
        },
      });

      consola.info(`Sentry Error Event ID [${level}]: ${sentryId}`);
    } catch (captureError) {
      consola.error('Failed to capture exception with Sentry:', captureError);
    }
  } else if (message) {
    // If no Error object, capture the message itself for errors/fatals
    try {
      Sentry.captureMessage(message, {
        level,
        extra: { optionalParams },
      });
      consola.info(`Sentry Message Event -> level: [${level}]`);
    } catch (captureError) {
      consola.error('Failed to capture message with Sentry:', captureError);
    }
  }
}

// --- Core Logging Logic ---

/**
 * Helper to create bound function maps for different logger backends
 *
 * @param loggerInstance - The logger instance to bind to
 * @param levelMap - Map of log levels to method names
 * @returns A map of bound log functions
 */
function createBoundMap<T extends object>(
  loggerInstance: T,
  levelMap: LogLevelMap<T>,
): LogFunctionMap {
  const boundMap: LogFunctionMap = {};

  for (const [level, methodName] of Object.entries(levelMap)) {
    if (
      methodName &&
      typeof (loggerInstance as Record<string, unknown>)[methodName] === 'function'
    ) {
      boundMap[level as LogLevel] = (
        (loggerInstance as Record<string, unknown>)[methodName] as (...args: AnyValue[]) => void
      ).bind(loggerInstance);
    }
  }

  // Add a default .log if possible
  if (typeof (loggerInstance as Record<string, unknown>).log === 'function') {
    boundMap.log = (
      (loggerInstance as Record<string, unknown>).log as (...args: AnyValue[]) => void
    ).bind(loggerInstance);
  }

  return boundMap;
}

// Define mappings from our LogLevel to specific backend functions

// Logtail method mappings
const logtailMethodsMap: LogLevelMap<LogtailLogger> = {
  trace: 'debug', // Map trace to debug for Logtail
  debug: 'debug',
  info: 'info',
  done: 'info', // Map done/success to info
  success: 'info',
  notice: 'warn', // Map notice to warn
  warn: 'warn',
  error: 'error',
  fatal: 'error', // Map fatal to error
};

// Consola method mappings
const consolaMethodsMap: LogLevelMap<ConsolaInstance> = {
  trace: 'trace',
  debug: 'debug',
  info: 'info',
  done: 'success', // Map done to success
  success: 'success',
  notice: 'warn', // Map notice to warn
  warn: 'warn',
  error: 'error',
  fatal: 'fatal',
};

// Console method mappings
const consoleMethodsMap: LogLevelMap<Console> = {
  trace: 'debug', // Map trace to debug
  debug: 'debug',
  info: 'info',
  done: 'info', // Map done/success to info
  success: 'info',
  notice: 'warn', // Map notice to warn
  warn: 'warn',
  error: 'error',
  fatal: 'error', // Map fatal to error
};

// Pre-create maps (only if instances are guaranteed available)
const logtailMap: LogFunctionMap = logtail ? createBoundMap(logtail, logtailMethodsMap) : {};

const consolaMap = createBoundMap(consola, consolaMethodsMap);
const consoleMap = createBoundMap(console, consoleMethodsMap);

/**
 * Central function to handle actual logging and Sentry reporting
 *
 * @param level - The log level
 * @param message - The log message
 * @param optionalParams - Additional parameters to log
 */
function logInternal(level: LogLevel, message: string, optionalParams: AnyValue[]): void {
  // 1. Choose Logger Backend and Map
  let selectedMap: LogFunctionMap;

  if (isProduction && logtail) {
    selectedMap = logtailMap;
  } else if (isProduction) {
    selectedMap = consoleMap; // Fallback if prod but logtail failed
  } else {
    selectedMap = consolaMap;
  }

  // 2. Get the appropriate log function from the map
  // Fallback to a generic 'log' method if specific level is not in map, or default console.log
  const logFn = selectedMap[level] || selectedMap.log || console.log;

  // 3. Perform Logging
  try {
    logFn(message, ...optionalParams);
  } catch (logError) {
    // If the chosen logger fails, fallback to console.error
    consola.error('Logging backend failed:', logError);
    consola.error('Original log:', { level, message, optionalParams });
  }

  // 4. Report Errors to Sentry (using the extracted function)
  reportErrorToSentry(level, message, optionalParams);
}

// --- Public API ---

/**
 * Creates a log method for a specific log level
 *
 * @param level - The log level to create a method for
 * @returns A log function that accepts a message and optional parameters
 */
function createLogMethod(level: LogLevel) {
  return (message: string, ...optionalParams: AnyValue[]): LogResult => {
    // Perform the core logging action
    logInternal(level, message, optionalParams);

    // Return object for chaining, conditionally adding .toast
    const result: LogResult = { toast: () => null };

    if (isClient) {
      // Only add the toast method if we are on the client-side
      result.toast = (toastMessage?: string | ReactNode, options?: LoggerExternalToast): void => {
        try {
          // Use the provided toast message, or fallback to the original log message
          const displayMessage = toastMessage ?? message;

          // Map log level to sonner toast type (optional, customize as needed)
          switch (level) {
            case 'error':
            case 'fatal':
              sonnerToast.error(displayMessage, options as ExternalToast);
              break;
            case 'warn':
            case 'notice':
              sonnerToast.warning(displayMessage, options as ExternalToast);
              break;
            case 'info':
              sonnerToast.info(displayMessage, options as ExternalToast);
              break;
            case 'done':
            case 'success':
              sonnerToast.success(displayMessage, options as ExternalToast);
              break;
            default:
              sonnerToast(displayMessage, options as ExternalToast); // Default toast
          }
        } catch (toastError) {
          consola.error('Failed to show toast:', toastError);
        }
      };
    }

    return result; // Return the object (with or without .toast)
  };
}

/**
 * Logger object with methods for different log levels
 *
 * @example
 * ```ts
 * // Server-side or Client-side (basic logging)
 * logger.info('User logged in', { userId: 123 });
 * logger.warn('API response slow', { duration: 2500 });
 * logger.error('Failed to process payment', new Error('Insufficient funds'), {
 *   transactionId: 'xyz',
 * });
 * ```
 *
 * @example
 * ```ts
 * // Client-side (logging with toast)
 * function handleClientAction() {
 *   // This works because logger.info returns an object with .toast on the client
 *   logger.info('Settings saved successfully').toast();
 *
 *   // With custom message and options
 *   logger
 *     .error('Could not connect to server', new Error('Network Error'))
 *     .toast('Connection failed. Please try again.', { duration: 5000 });
 * }
 * ```
 */
export const logger = {
  trace: createLogMethod('trace'),
  debug: createLogMethod('debug'),
  done: createLogMethod('done'),
  success: createLogMethod('success'),
  info: createLogMethod('info'),
  notice: createLogMethod('notice'),
  warn: createLogMethod('warn'),
  error: createLogMethod('error'),
  fatal: createLogMethod('fatal'),
};

/**
 * Logger configuration
 */
export const config: LoggerConfig = {
  isProduction,
  isClient,
  isEdge,
};
