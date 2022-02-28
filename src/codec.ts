import { Decoder, Encoder } from './types';

export const encodeName: Encoder<string> = name =>
  encodeURIComponent(name)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape);

export const encodeValue: Encoder<string | number | boolean | undefined | null> = value => {
  return encodeURIComponent(value as string).replace(
    /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[B-D])/g,
    decodeURIComponent,
  );
};

export const decodeName: Decoder<string> = decodeURIComponent;

export const decodeValue: Decoder<string> = value => {
  let nextValue = value;

  if (nextValue[0] === '"') {
    nextValue = nextValue.slice(1, -1);
  }

  // eslint-disable-next-line unicorn/no-unsafe-regex
  return nextValue.replace(/(%[\da-f]{2})+/gi, decodeURIComponent);
};
