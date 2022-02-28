interface CookiesApi<W, R> {
  get: (name?: string | undefined | null) => R | undefined | { [property: string]: R };
  remove: (name: string, attributes?: CookieAttributes) => void;
  set: (name: string, value: W, attributes?: CookieAttributes) => string | undefined;
  withAttributes: <Write, Read>(attributes: CookieAttributes) => Cookies<Write, Read>;
  withConverter: <Write, Read>(converter: {
    read?: Decoder<Read>;
    write?: Encoder<Write>;
  }) => Cookies<W, R>;
}

interface CookiesConfig<W, R> {
  readonly attributes: CookieAttributesConfig;
  readonly converter: CookieConverterConfig<W, R>;
}

export interface CookieAttributes {
  [property: string]: any;
  domain?: string;
  expires?: number | Date;
  path?: string;
  sameSite?: 'strict' | 'Strict' | 'lax' | 'Lax' | 'none' | 'None';
  secure?: boolean;
}

export type CookieAttributesConfig = Readonly<CookieAttributes>;

export interface CookieCodecConfig<W, R> {
  readonly decodeName: Decoder<string>;
  readonly decodeValue: Decoder<R>;
  readonly encodeName: Encoder<string>;
  readonly encodeValue: Encoder<W>;
}

export interface CookieConverter<W, R> {
  read: Decoder<R>;
  write: Encoder<W>;
}

export interface CookieDecoding<T> {
  readonly decodeName?: Decoder<string>;
  readonly decodeValue?: Decoder<T>;
}

export interface CookieEncoding<T> {
  readonly encodeName?: Encoder<string>;
  readonly encodeValue?: Encoder<T>;
}

export type CookieConverterConfig<W, R> = Readonly<CookieConverter<W, R>>;

export type Cookies<W, R> = CookiesConfig<W, R> & CookiesApi<W, R>;

export type Decoder<T> = (value: string, name?: string) => T;

export type Encoder<T> = (value: T, name?: string) => string;

export type AnyObject<T = any> = Record<string, T>;
export type PlainObject<T extends AnyObject> = Exclude<
  T,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Array<unknown> | Function | Map<unknown, unknown> | Set<unknown>
>;
