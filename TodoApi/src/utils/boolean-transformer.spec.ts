import { plainToClass } from 'class-transformer';
import { ToBoolean } from './boolean-transformer';
class MyPayload {
  @ToBoolean()
  prop?: boolean;
}

describe('ToBoolean', () => {
  it.each(['true', 'yes', '1', 'on'])(
    'it should return true when passed in a truthy string',
    (value) => {
      const result = plainToClass(MyPayload, { prop: value });
      expect(result).toEqual({ prop: true });
    },
  );

  it.each(['false', 'no', '0', 'off'])(
    'it should return false when passed in a falsy string',
    (value) => {
      const result = plainToClass(MyPayload, { prop: value });
      expect(result).toEqual({ prop: false });
    },
  );

  it.each(['aad', 'tt', '10', 'whateverstring'])(
    'it should return undefined when passed in a neither truthy nor falsy string',
    (value) => {
      const result = plainToClass(MyPayload, { prop: value });
      expect(result).toEqual({ prop: undefined });
    },
  );
});
