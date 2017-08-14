'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-d365:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        projectType: 'Console 2016+ Project',
        sdkVersion: '8.2.0.2',
        useSolution: 'No'
      });
  });

  it('creates files', () => {
    assert.file([
      'Program.cs'
    ]);
  });
});
