'use strict';
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

module.exports = {
  getVersions: function (pkg) {
    return new Promise(function (resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', 'https://api-v2v3search-0.nuget.org/query?q=packageid:' + pkg, true);
      req.setRequestHeader('Accept', 'application/json');
      req.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
      req.onreadystatechange = function () {
        if (req.readyState === 4) {
          if (req.status === 200) {
            var retrieved = JSON.parse(req.responseText);
            var v = retrieved.data[0].versions;

            var list = [];
            for (var i = 0; i < v.length; i++) {
              list.push(v[i].version);
            }
            list = filterLatestVersions(list);
            resolve(list);
          } else {
            reject(this.statusText);
          }
        }
      };
      req.send();
    });
  },
  getTargetedVersions: function (list, op, version) {
    var newList = [];
    var targetVersion = parseVersionString(version);

    for (var i = 0; i < list.length; i++) {
      var ver = parseVersionString(list[i]);

      if (variableCompare(op, ver.major, targetVersion.major)) {
        newList.push(list[i]);
        continue;
      }

      if (ver.major === targetVersion.major &&
        variableCompare(op, ver.minor, targetVersion.minor)) {
        newList.push(list[i]);
        continue;
      }

      if (ver.major === targetVersion.major &&
        ver.minor === targetVersion.minor &&
        variableCompare(op, ver.patch, targetVersion.patch)) {
        newList.push(list[i]);
        continue;
      }

      if (ver.major === targetVersion.major &&
        ver.minor === targetVersion.minor &&
        ver.patch === targetVersion.patch &&
        variableCompare(op, ver.build, targetVersion.build)) {
        newList.push(list[i]);
      }
    }

    return newList;
  },
  getMatchingVersion: function (list, version) {
    var targetVersion = parseVersionString(version);
    var returnVersion = null;

    for (var i = 0; i < list.length; i++) {
      var ver = parseVersionString(list[i]);

      if (ver.major === targetVersion.major && ver.minor === targetVersion.minor) {
        returnVersion = list[i];
        break;
      }
    }

    if (returnVersion === null) {
      targetVersion.minor--;
      returnVersion = this.getMatchingVersion(list,
        targetVersion.major + '.' +
        targetVersion.minor + '.' +
        targetVersion.patch + '.' +
        targetVersion.build);
    }

    return returnVersion;
  },
  installCore: function (main, fullProjectPath) {
    main.spawnCommandSync('dotnet', ['add', fullProjectPath, 'package', 'Microsoft.CrmSdk.CoreAssemblies',
      '-v', main.props.sdkVersion]);
  },
  installXrmTooling: function (main, fullProjectPath, xrmToolingResults) {
    main.spawnCommandSync('dotnet', ['add', fullProjectPath, 'package', 'Microsoft.CrmSdk.XrmTooling.CoreAssembly',
      '-v', this.getMatchingVersion(xrmToolingResults, main.props.sdkVersion)]);
  },
  installExConfigs: function (main, fullProjectPath) {
    main.spawnCommandSync('dotnet', ['add', fullProjectPath, 'package', 'Microsoft.Extensions.Configuration']);
    main.spawnCommandSync('dotnet', ['add', fullProjectPath, 'package', 'Microsoft.Extensions.Configuration.Json']);
  },
  installExtenstions: function (main, fullProjectPath, extensionsResults) {
    main.spawnCommandSync('dotnet', ['add', fullProjectPath, 'package', 'Microsoft.CrmSdk.Extensions',
      '-v', this.getMatchingVersion(extensionsResults, main.props.sdkVersion)]);
  },
  installWorkflow: function (main, fullProjectPath, workflowResults) {
    main.spawnCommandSync('dotnet', ['add', fullProjectPath, 'package', 'Microsoft.CrmSdk.Workflow',
      '-v', this.getMatchingVersion(workflowResults, main.props.sdkVersion)]);
  }

};

function filterLatestVersions(list) {
  var newList = [];

  var first = parseVersionString(list[0]);
  var currentMajor = first.major;
  var currentMinor = first.minor;
  var currentPatch = first.patch;
  var currentBuild = first.build;
  var currentVersion = list[0];

  for (var i = 0; i < list.length; i++) {
    if (i === (list.length - 1)) {
      newList.push(list[i]);
    }

    var ver = parseVersionString(list[i]);

    if (ver.major > currentMajor) {
      currentMajor = ver.major;
      currentMinor = ver.minor;
      currentPatch = ver.patch;
      currentBuild = ver.build;
      newList.push(currentVersion);
      currentVersion = list[i];
      continue;
    }

    if (ver.minor > currentMinor) {
      currentMinor = ver.minor;
      currentPatch = ver.patch;
      currentBuild = ver.build;
      newList.push(currentVersion);
      currentVersion = list[i];
      continue;
    }

    if (ver.patch > currentPatch) {
      currentBuild = ver.build;
      currentVersion = list[i];
      continue;
    }

    if (ver.build > currentBuild) {
      currentVersion = list[i];
      continue;
    }
  }

  return newList;
}

function variableCompare(op, param1, param2) {
  switch (op) {
    case '>':
      return param1 > param2;
    case '>=':
      return param1 >= param2;
    case '<':
      return param1 < param2;
    case '<=':
      return param1 <= param2;
    default: // =
      return param1 === param2;
  }
}

function parseVersionString(str) {
  if (typeof (str) !== 'string') {
    return false;
  }

  var x = str.split('.');
  var maj = parseInt(x[0], 10) || 0;
  var min = parseInt(x[1], 10) || 0;
  var pat = parseInt(x[2], 10) || 0;
  var bld = parseInt(x[3], 10) || 0;
  return {
    major: maj,
    minor: min,
    patch: pat,
    build: bld
  };
}
