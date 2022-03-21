import { mapFromDto, mapToDto } from './mapping-helper';

describe('mapping helper', () => {
  it('should return expected object when calling mapFromDto', () => {
    const source = {
      todoId: '1234',
      taskName: 'test',
      isCompleted: true,
    };

    const target = {
      TodoId: '1234',
      TaskName: 'test',
      IsCompleted: true,
    };

    expect(mapFromDto(source)).toEqual(target);
  });

  it('should return expected object when calling mapToDto', () => {
    const source = {
      TodoId: '1234',
      TaskName: 'test',
      IsCompleted: true,
    };

    const target = {
      todoId: '1234',
      taskName: 'test',
      isCompleted: true,
    };

    expect(mapToDto(source)).toEqual(target);
  });
});
