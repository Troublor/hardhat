import { BigIntError } from "./errors/bigint.js";
import { isBNBigInt, isBigNumberBigInt } from "./internal/bigint.js";
import { unreachable } from "./errors/catch-utils.js";
import { bytesToNumber } from "./number.js";

/**
 * Returns the minimum of two bigints.
 *
 * @param x The first number to compare.
 * @param y The second number to compare.
 * @returns The smaller of the two numbers.
 */
export function min(x: bigint, y: bigint): bigint {
  return x < y ? x : y;
}

/**
 * Returns the maximum of two bigints.
 *
 * @param x The first number to compare.
 * @param y The second number to compare.
 * @returns The larger of the two numbers.
 */
export function max(x: bigint, y: bigint): bigint {
  return x > y ? x : y;
}

/**
 * Converts a value to a bigint.
 *
 * This function supports several types of input:
 * - `number`: Must be an integer and a safe integer. If it's not, an error is thrown.
 * - `bigint`: Returned as is.
 * - `string`: Converted to a bigint using the BigInt constructor.
 * - `object`: Must be an instance of BN or BigNumber. If it's not, an error is thrown.
 *
 * If the input is of an unsupported type, an error is thrown.
 *
 * @param x The value to convert to a bigint.
 * @returns The input value converted to a bigint.
 * @throws BigIntError If the input value cannot be converted to a bigint.
 */
export async function toBigInt(
  x: number | string | bigint | object,
): Promise<bigint> {
  switch (typeof x) {
    case "number":
      if (!Number.isInteger(x)) {
        throw new BigIntError(`${x} is not an integer`);
      }
      if (!Number.isSafeInteger(x)) {
        throw new BigIntError(
          `Integer ${x} is unsafe. Consider using ${x}n instead. For more details, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger`,
        );
      }
    // `break;` intentionally omitted. fallthrough desired.
    case "string":
    case "bigint":
      return BigInt(x);
    case "object":
      if (await isLibraryBigInt(x)) {
        return BigInt(x.toString());
      } else {
        throw new BigIntError(
          `Value ${JSON.stringify(x)} is of type "object" but is not an instanceof one of the known big number object types.`,
        );
      }
    default:
      unreachable(x, new BigIntError(`Unsupported type ${typeof x}`));
  }
}

/**
 * Checks if the given value is a bigint. This function should only be used
 * when the value may be a bigint from a third-party library, like `bn.js` or
 * `bignumber.js`. To check if a value is a native JavaScript bigint, use
 * `typeof x === "bigint"`.
 *
 * @param x The value to check.
 * @returns `true` if the value is a bigint, `false` otherwise.
 */
export async function isLibraryBigInt(x: unknown): Promise<boolean> {
  const [isBNBigIntResult, isBigNumberBigIntResult] = await Promise.all([
    isBNBigInt(x),
    isBigNumberBigInt(x),
  ]);

  return isBNBigIntResult || isBigNumberBigIntResult;
}

/**
 * Converts a Uint8Array to a bigint, interpreting the array as a two's
 * complement signed integer.
 * The Uint8Array is expected to represent a 256-bit number, which corresponds
 * to a length of 32.
 * If the Uint8Array has a different length, the function will still work, but
 * the most significant bit of the 32nd byte will be interpreted as the sign bit.
 *
 * @param num The Uint8Array of signed bytes to convert.
 * @returns The converted bigint.
 */
export const signedBytesToBigInt = (num: Uint8Array): bigint => {
  return BigInt.asIntN(256, BigInt(bytesToNumber(num)));
};
