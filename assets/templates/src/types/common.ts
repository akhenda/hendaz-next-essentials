export type Primitives = number | string | boolean | bigint | symbol | null | undefined;

/**
 * A utility type that represents any value. This is intentionally broad and should be used with caution.
 * It can be used in places where you want to allow any type of value, but it should be avoided in most cases
 * to maintain type safety. This will be the only place in the codebase where this type is defined, and it should be used sparingly.
 *
 * Note: This type is not the same as `unknown` or `any` in TypeScript. It is a custom type that can be used
 * to represent any value while still allowing for some level of type checking in certain contexts.
 */
// biome-ignore lint/suspicious/noExplicitAny: intentional
export type AnyValue = any;
export type AnyType = AnyValue;
