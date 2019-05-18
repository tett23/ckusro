import mock, { Config } from 'mock-fs';

let logsTemp: any[] = [];
let logMock: any;

export function mockFileSystem(config: Config) {
  logMock = jest.spyOn(console, 'log').mockImplementation((...args) => {
    logsTemp.push(args);
  });

  mock(config);
}

export function restoreFileSystem() {
  logMock.mockRestore();
  mock.restore();
  logsTemp.map((el) => console.info(...el));
  logsTemp = [];
}
