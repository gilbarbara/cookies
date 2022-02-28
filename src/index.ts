import {
  decodeName as defaultNameDecoder,
  decodeValue as defaultValueDecoder,
  encodeName as defaultNameEncoder,
  encodeValue as defaultValueEncoder,
} from './codec';
import { DEFAULT_ATTRIBUTES } from './config';
import { CookieAttributes, CookieDecoding, CookieEncoding, Decoder, PlainObject } from './types';

type GetReturn<T, R> = [T] extends [undefined] ? { [property: string]: R } : R | undefined;

function stringifyAttributes(attributes: CookieAttributes & { expires?: any }): string {
  const nextAttributes = { ...attributes };

  if (typeof nextAttributes.expires === 'number') {
    nextAttributes.expires = new Date(Date.now() + nextAttributes.expires * 864e5);
  }

  if (nextAttributes.expires) {
    nextAttributes.expires = nextAttributes.expires.toUTCString();
  }

  return Object.entries(nextAttributes)
    .filter(([, value]: [string, any]) => value != null && value !== false)
    .map(([key, value]: [string, string | true]) =>
      value === true ? `; ${key}` : `; ${key}=${value.split(';')[0]}`,
    )
    .join('');
}

function get<T extends string | undefined, U>(
  name: T,
  decodeValue: Decoder<U>,
  decodeName: Decoder<string>,
): GetReturn<T, U> {
  const scan = /(?:^|; )([^=]*)=([^;]*)/g;
  const jar: any = {};
  let match = scan.exec(document.cookie);

  while (match) {
    try {
      const found = decodeName(match[1]);

      jar[found] = decodeValue(match[2], found);

      if (name === found) {
        break;
      }
    } catch {
      // noop
    }

    match = scan.exec(document.cookie);
  }

  return name != null ? jar[name] : jar;
}

export function getCookie(name: string): string | undefined;

export function getCookie<T extends PlainObject<any>>(
  name: string,
  { decodeName, decodeValue }: CookieDecoding<T>,
): T | undefined;

export function getCookie(
  name: string,
  {
    decodeValue = defaultValueDecoder,
    decodeName = defaultNameDecoder,
  }: CookieDecoding<string> = {},
): string | undefined {
  return get(name, decodeValue, decodeName);
}

export function getCookies(): {
  [property: string]: string;
};

export function getCookies<T extends PlainObject<any>>({
  decodeName,
  decodeValue,
}: CookieDecoding<T>): {
  [property: string]: T;
};

export function getCookies({
  decodeValue = defaultValueDecoder,
  decodeName = defaultNameDecoder,
}: CookieDecoding<string> = {}): {
  [property: string]: string;
} {
  return get(undefined, decodeValue, decodeName);
}

export function removeCookie(
  name: string,
  attributes: CookieAttributes = DEFAULT_ATTRIBUTES,
): void {
  setCookie(name, '', { ...attributes, expires: -1 });
}

// The following overloads are necessary as to make the type of `value`
// and encoder dependent and achieve type safety along with default encoder
// in the destructured argument of `setCookie()`:
// These types are all ok and default encoder deals with them:
// setCookie('c', 'foo')
// setCookie('c', 1234)
// setCookie('c', true)
// setCookie('c', undefined)
// setCookie('c', null)
// Objects are not supported by the default encoder and require
// an encoder that operates on the given type..
// setCookie('c', {}) // Argument of type '{}' is not assignable to parameter of type 'string | number | boolean'.
// setCookie('c', {}, undefined, { encodeValue: (v) => v as string }) // Ok!
// setCookie('c', new Date()) // Argument of type 'Date' is not assignable to parameter of type 'string | number | boolean'.
// setCookie('c', new Date(), undefined, { encodeValue: (v) => v.toISOString() }) // Ok!
export function setCookie<T extends string | number | boolean | undefined | null>(
  name: string,
  value: T,
): string;

export function setCookie<T extends string | number | boolean | undefined | null>(
  name: string,
  value: T,
  attributes: CookieAttributes,
): string;

export function setCookie<T extends PlainObject<any>>(
  name: string,
  value: T,
  attributes: CookieAttributes | undefined,
  options: CookieEncoding<T>,
): string;

export function setCookie(
  name: string,
  value: string | number | boolean | undefined | null,
  attributes: CookieAttributes = DEFAULT_ATTRIBUTES,
  options: CookieEncoding<string | number | boolean | undefined | null> = {},
): string {
  const { encodeValue = defaultValueEncoder, encodeName = defaultNameEncoder } = options;
  const cookie = `${encodeName(name)}=${encodeValue(value, name)}${stringifyAttributes(
    attributes,
  )}`;

  document.cookie = cookie;

  return cookie;
}

export * as Types from './types';
