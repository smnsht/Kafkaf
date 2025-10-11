import { TimestampPipe } from './timestamp';

describe('TimestampPipe', () => {
  it('create an instance', () => {
    const pipe = new TimestampPipe();
    expect(pipe).toBeTruthy();
  });
});
