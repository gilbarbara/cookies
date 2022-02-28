import {
  decodeName as defaultNameDecoder,
  decodeValue as defaultValueDecoder,
  encodeName as defaultNameEncoder,
  encodeValue as defaultValueEncoder,
} from './codec';
import { CookieAttributesConfig, CookieCodecConfig } from './types';

export const DEFAULT_ATTRIBUTES: CookieAttributesConfig = {
  expires: 30,
  path: '/',
};

export const DEFAULT_CODEC: CookieCodecConfig<
  string | number | boolean | undefined | null,
  string
> = {
  decodeName: defaultNameDecoder,
  decodeValue: defaultValueDecoder,
  encodeName: defaultNameEncoder,
  encodeValue: defaultValueEncoder,
};
