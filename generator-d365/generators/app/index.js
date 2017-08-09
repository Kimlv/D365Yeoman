'use strict';
const Generator = require('yeoman-generator');
const nuget = require('./nuget');
const util = require('./util');

var folderName;
var projectFilePath;
var fullProjectPath;
var projectFolderName;
var isFile;
var executeablePath;
var xrmToolingResults;
var coreResults;
var workflowResults;
var extensionsResults;

module.exports = class extends Generator {
  initializing() {
    return Promise.all([
      nuget.getVersions('Microsoft.CrmSdk.XrmTooling.CoreAssembly'),
      nuget.getVersions('Microsoft.CrmSdk.CoreAssemblies'),
      nuget.getVersions('Microsoft.CrmSdk.Workflow'),
      nuget.getVersions('Microsoft.CrmSdk.Extensions')])
      .then(function (values) {
        xrmToolingResults = values[0];
        coreResults = values[1];
        workflowResults = values[2];
        extensionsResults = values[3];
      })
      .catch(function (error) {
        this.log('Error retrieving package listings from NuGet: ' + error);
      });
  }

  prompting() {
    this.log(util.getPromptImage());

    const prompts = [{
      type: 'list',
      name: 'projectType',
      message: 'What type of CRM/D365 C# project / file?',
      choices: ['Console 2016+ Project', 'Console 2011-2015 Project', 'Plug-in Project', 'Plug-in Class',
        'Custom Workflow Project', 'Custom Workflow Class', 'Nevermind'],
      default: 'Console 2016+ Project'
    }, {
      when: function (props) {
        isFile = props.projectType === 'Plug-in Class' || props.projectType === 'Custom Workflow Class';
        return (props.projectType !== 'Nevermind' && !isFile);
      },
      type: 'list',
      name: 'sdkVersion',
      message: 'Which Core SDK version?',
      choices: function (props) {
        switch (props.projectType) {
          case 'Console 2016+ Project':
            return nuget.getTargetedVersions(coreResults, '>=', '8.0.0.0');
          case 'Console 2011-2015 Project':
            return nuget.getTargetedVersions(coreResults, '<', '8.0.0.0');
          default:
            return coreResults;
        }
      },
      default: coreResults[coreResults.length - 1]
    }, {
      when: function (props) {
        return (props.projectType !== 'Nevermind' && !isFile);
      },
      type: 'list',
      name: 'useSolution',
      message: 'Include in solution?',
      choices: ['No', 'Yes'],
      default: 'No'
    }];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    folderName = this.determineAppname();
    projectFilePath = folderName + '.csproj';
    if (this.props.useSolution === 'Yes') {
      projectFilePath = folderName + '/' + projectFilePath;
      projectFolderName = folderName + '/';
      fullProjectPath = this.destinationPath() + '\\' + folderName + '\\' + folderName + '.csproj';
      executeablePath = this.destinationPath() + '\\' + folderName + '\\bin\\Debug\\net452\\' + folderName + '.exe';
      executeablePath = executeablePath.replace(/\\/g, '\\\\');
    } else {
      projectFolderName = '';
      fullProjectPath = this.destinationPath() + '\\' + folderName + '.csproj';
      executeablePath = this.destinationPath() + '\\bin\\Debug\\net452\\' + folderName + '.exe';
      executeablePath = executeablePath.replace(/\\/g, '\\\\');
    }

    switch (this.props.projectType) {
      case 'Console 2016+ Project':
        util.copyCscProj(this, projectFilePath);
        util.copyCscProg(this, projectFolderName, folderName);
        util.copyCscAppSet(this, projectFolderName);
        util.copyVscode(this, projectFolderName, fullProjectPath, executeablePath);
        break;

      case 'Console 2011-2015 Project':
        util.copyCcProj(this, projectFilePath);
        util.copyCcProg(this, projectFolderName, folderName);
        util.copyCcAppSet(this, projectFolderName);
        util.copyVscode(this, projectFolderName, fullProjectPath, executeablePath);
        break;

      case 'Plug-in Project':
        util.copyPlugProj(this, projectFilePath, folderName);
        util.copyPlugClass(this, projectFolderName, folderName);
        break;

      case 'Plug-in Class':
        util.copyPlugClass(this, projectFolderName, folderName);
        break;

      case 'Custom Workflow Project':
        util.copyWfProj(this, projectFilePath, folderName);
        util.copyWfClass(this, projectFolderName, folderName);
        break;

      case 'Custom Workflow Class':
        util.copyWfClass(this, projectFolderName, folderName);
        break;

      default:
        this.log('See ya!');
        process.exit();
        break;
    }
  }

  install() {
    if (this.props.useSolution === 'Yes' && !isFile) {
      this.spawnCommandSync('dotnet', ['new', 'sln']);
      this.spawnCommandSync('dotnet', ['sln', 'add', projectFilePath]);
    }

    switch (this.props.projectType) {
      case 'Console 2016+ Project':
        nuget.installCore(this, fullProjectPath);
        nuget.installXrmTooling(this, fullProjectPath, xrmToolingResults);
        nuget.installExConfigs(this, fullProjectPath);
        break;
      case 'Console 2011-2015 Project':
        nuget.installCore(this, fullProjectPath);
        nuget.installExtenstions(this, fullProjectPath, extensionsResults);
        nuget.installExConfigs(this, fullProjectPath);
        break;
      case 'Plug-in Project':
        nuget.installCore(this, fullProjectPath);
        break;
      case 'Custom Workflow Project':
        nuget.installCore(this, fullProjectPath);
        nuget.installWorkflow(this, fullProjectPath, workflowResults);
        break;
      default:
        break;
    }

    if (!isFile) {
      this.spawnCommandSync('dotnet', ['restore']);

      if (this.props.projectType === 'Plug-in Project' || this.props.projectType === 'Custom Workflow Project') {
        this.spawnCommand('dotnet', [this.templatePath('Tools/SnkGenerator.dll'), projectFolderName, folderName]);
      }
    }
  }
};
