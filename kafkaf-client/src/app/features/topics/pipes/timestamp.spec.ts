import { TimestampPipe } from '@app/shared';

describe('TimestampPipe', () => {
  it('create an instance', () => {
    const pipe = new TimestampPipe();
    expect(pipe).toBeTruthy();
  });
});
