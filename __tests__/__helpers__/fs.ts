import mockFs, { Config } from 'mock-fs';

let logsTemp: any[] = [];
let logMock: any;

export function mockFileSystem(config: Config) {
  logMock = jest.spyOn(console, 'log').mockImplementation((...args) => {
    logsTemp.push(args);
  });

  mockFs(config);
}

export function restoreFileSystem() {
  logMock.mockRestore();
  mockFs.restore();
  logsTemp.map((el) => console.info(...el));
  logsTemp = [];
}
