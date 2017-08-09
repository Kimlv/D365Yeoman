'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
// Var os = require('os');

describe('generator-d365:app', () => {
  beforeAll(() => {
    // Var options = {
    //   testPath: path.join(os.tmpdir(), 'crmtest')
    // };

    // var tmpDir = path.join(os.tmpdir(), 'crmtest');
    // helpers.testDirectory(tmpDir, function (err) {
    //   if (err) {
    //     // Done(err);
    //   }
    // });

    return helpers.run(path.join(__dirname, '../generators/app'))
      // .withOptions(options)
      .withPrompts({
        projectType: 'Console 2016+ Project',
        sdkVersion: '8.2.0.2',
        useSolution: 'No'
      });
  });

  it('creates files', () => {
    assert.file([
      'Program.cs'
      // ,
      // 'crmtest.csproj'
    ]);
  });
});
