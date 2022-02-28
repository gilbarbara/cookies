# @gilbarbara/cookies

[![NPM version](https://badge.fury.io/js/%40gilbarbara%2Fcookies.svg)](https://www.npmjs.com/package/%40gilbarbara%2Fcookies) [![CI](https://github.com/gilbarbara/cookies/actions/workflows/main.yml/badge.svg)](https://github.com/gilbarbara/cookies/actions/workflows/main.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/7e3fb5ad8c4fcbe3c8f2/maintainability)](https://codeclimate.com/github/gilbarbara/cookies/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/7e3fb5ad8c4fcbe3c8f2/test_coverage)](https://codeclimate.com/github/gilbarbara/cookies/test_coverage)

Lightweight cookie client

## Setup

Install it
```shell-script
npm install @gilbarbara/cookies
```

## Usage

Import it:

```typescript
import { getCookie, setCookie } from '@gilbarbara/cookies';
```

Create a cookie, valid across the entire site:

```typescript
setCookie('name', 'value');
```

Create a cookie that expires 7 days from now, valid across the entire site:

```typescript
setCookie('name', 'value', { expires: 7 });
```

Create an expiring cookie, valid to the path of the current page:

```typescript
setCookie('name', 'value', { expires: 7, path: '' });
```

Read a cookie:

```typescript
getCookie('name'); // => 'value'
getCookie('invalid'); // => undefined
```

Read all available cookies:

```typescript
getCookies(); // => { name: 'value' }
```

_Note: It is not possible to read a particular cookie by additionally passing specific cookie attributes. A cookie will only be available if it's visible from where the code is called, visibility being controlled by `path` and `domain` used when setting a cookie._

Delete a cookie:

```typescript
removeCookie('name');
```

Delete a cookie valid to the path of the current page:

```typescript
setCookie('name', 'value', { path: '' });
removeCookie('name'); // fail!
removeCookie('name', { path: '' }); // removed!
```

_IMPORTANT! When deleting a cookie you must pass the exact same path and domain attributes that were used to set the cookie:_

```typescript
removeCookie('name', { path: '', domain: '.yourdomain.com' })
```

_Note: Trying to remove a nonexistent cookie doesn't throw an exception or returns a value._

## Encoding

This project is [RFC 6265](http://tools.ietf.org/html/rfc6265#section-4.1.1) compliant. All special characters that are not allowed in the cookie-name or cookie-value are encoded with each one's UTF-8 Hex equivalent using [percent-encoding](http://en.wikipedia.org/wiki/Percent-encoding).
The only character in cookie-name or cookie-value that is allowed and still encoded is the percent `%` character, it is escaped in order to interpret percent input as literal.
Please note that the default encoding/decoding strategy is meant to be interoperable only between cookies that are read/written by this library. It's possible to [override the default encoding/decoding strategy](#codec).

_Note: According to [RFC 6265](https://tools.ietf.org/html/rfc6265#section-6.1), your cookies may get deleted if they are too big or there are too many cookies in the same domain, [more details here](https://github.com/js-cookie/js-cookie/wiki/Frequently-Asked-Questions#why-are-my-cookies-being-deleted)._

## Cookie Attributes

### expires

Define when the cookie will be removed. It must be a number which will be interpreted as days from time of creation or a Date instance.

**Default:** 30 days

### path

A string indicating the path where the cookie is supposed to be visible.

**Default:** `/`

### domain

A string indicating a valid domain where the cookie should be visible. The cookie will also be visible to all subdomains.

**Default:** Cookie is visible only to the domain or subdomain of the page where the cookie was created.

### secure

A boolean indicating if the cookie transmission requires a secure protocol (https).

**Default:** false

### sameSite

Allowing to control whether the browser is sending a cookie along with cross-site requests.

**Default:** not set.

## Codec

### Decode

All get methods that rely on a proper decoding to work, such as `getCookies()` and `getCookie()`, will run the given decoder for each cookie. The returned value will be used as the cookie value.

Example from reading one of the cookies that can only be decoded using the `escape` function:

```typescript
import { DEFAULT_CODEC, getCookie, getCookies } from 'typescript-cookie'

document.cookie = 'escaped=%u5317'
document.cookie = 'default=%E5%8C%97'

const read: Decoder<string> = (value, name) => {
  if (name === 'escaped') {
    return unescape(value)
  }
  // Fall back to default for all other cookies
  return DEFAULT_CODEC.decodeValue(value, name)
}

getCookie('escaped', read) // => '北'
getCookie('default', read) // => '北'
getCookies(read) // => { escaped: '北', default: '北' }
```

### Encode

Set a cookie with overriding the default encoding implementation:

```typescript
import { setCookie } from 'typescript-cookie'

const write: Encoder<string> = (value) => value.toUpperCase()

setCookie('uppercased', 'foo', undefined, write) // => 'uppercased=FOO; path=/'
```

## Credits

This is a fork from [typescript-cookie](https://github.com/carhartl/typescript-cookie) package. Thanks! ❤️

## License

MIT
