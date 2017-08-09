'use strict';
const chalk = require('chalk');

module.exports = {
  checkFileName: function (fs, filename) {
    while (fs.exists(filename)) {
      var number = filename.replace(/\D+/g, '');
      number = (number === '') ? number = 1 : parseInt(number, 10) + 1;
      var parts = filename.replace(/[0-9]/g, '').split('.');
      filename = parts[0] + number + '.' + parts[1];
    }

    return filename;
  },
  getPromptImage: function () {
    return `
                                        
    DD..                         
    DDDDD..                      
    DDDDDDDD.         ` + chalk.blue.bgWhite(' Dynamics CRM/365     ') + `
    DDDDDDDDDDD.      ` + chalk.blue.bgWhite('   Template Generator ') + `
    DDDDDDDDDDDDDD.              
    ..DDDDDDDDDDDDDDD.           
    DD...8DDDDDDDDDD...          
    DDDD7. .:DDDDD..,D.          
    DDDDDD.   ... .DDD.          
    DDDDD.       ZDDDD.          
    DDDDD      .DDDDDD.          
    DDDD.    .8DDDDDDD.          
    DDD8.   .DDDDDDDD..          
    DDD.  .DDDDDDD .             
    DDO  .DDDDD..                
    DD..DDDD..                   
    D,.DD..                      
    DD .                         
    .                            
                                    
                                    `;
  },
  copyCscProj: function (main, projectFilePath) {
    main.fs.copy(
      main.templatePath('CrmServiceClientConsole/Project.csproj'),
      main.destinationPath(projectFilePath)
    );
  },
  copyCscProg: function (main, projectFolderName, folderName) {
    main.fs.copyTpl(
      main.templatePath('CrmServiceClientConsole/Program.cs'),
      main.destinationPath(projectFolderName + 'Program.cs'),
      {namespace: folderName}
    );
  },
  copyCscAppSet: function (main, projectFolderName) {
    main.fs.copy(
      main.templatePath('CrmServiceClientConsole/appsettings.json'),
      main.destinationPath(projectFolderName + 'appsettings.json')
    );
  },
  copyVscode: function (main, projectFolderName, fullProjectPath, executeablePath) {
    main.fs.copyTpl(
      main.templatePath('.vscode/tasks.json'),
      main.destinationPath(projectFolderName + '.vscode/tasks.json'),
      {projectpath: fullProjectPath.replace(/\\/g, '\\\\')}
    );
    main.fs.copyTpl(
      main.templatePath('.vscode/launch.json'),
      main.destinationPath(projectFolderName + '.vscode/launch.json'),
      {exepath: executeablePath}
    );
  },
  copyCcProj: function (main, projectFilePath) {
    main.fs.copy(
      main.templatePath('CrmConnectionConsole/Project.csproj'),
      main.destinationPath(projectFilePath)
    );
  },
  copyCcProg: function (main, projectFolderName, folderName) {
    main.fs.copyTpl(
      main.templatePath('CrmConnectionConsole/Program.cs'),
      main.destinationPath(projectFolderName + 'Program.cs'),
      {namespace: folderName}
    );
  },
  copyCcAppSet: function (main, projectFolderName) {
    main.fs.copy(
      main.templatePath('CrmConnectionConsole/appsettings.json'),
      main.destinationPath(projectFolderName + 'appsettings.json')
    );
  },
  copyPlugProj: function (main, projectFilePath, folderName) {
    main.fs.copyTpl(
      main.templatePath('Plugin/Project.csproj'),
      main.destinationPath(projectFilePath),
      {snkname: folderName}
    );
  },
  copyPlugClass: function (main, projectFolderName, folderName) {
    main.fs.copyTpl(
      main.templatePath('Plugin/PluginClass.cs'),
      main.destinationPath(this.checkFileName(main.fs, projectFolderName + 'PluginClass.cs')),
      {namespace: folderName}
    );
  },
  copyWfProj: function (main, projectFilePath, folderName) {
    main.fs.copyTpl(
      main.templatePath('Workflow/Project.csproj'),
      main.destinationPath(projectFilePath),
      {snkname: folderName}
    );
  },
  copyWfClass: function (main, projectFolderName, folderName) {
    main.fs.copyTpl(
      main.templatePath('Workflow/WorkflowClass.cs'),
      main.destinationPath(this.checkFileName(main.fs, projectFolderName + 'WorkflowClass.cs')),
      {namespace: folderName}
    );
  }
};
