# generator-d365 [![NPM version][npm-image]][npm-url]

> Templates for Dynamics CRM/365 C# development using Visual Studio or Visual Studio Code.

## Installation

First, install [Yeoman](http://yeoman.io) and generator-d365 using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).  
Second, make sure the [.NET Core SDK](https://www.microsoft.com/net/core#windowscmd) is installed.  
Third, if using Visual Studio Code make sure the [C#](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) extension is installed.

```bash
npm install -g yo
npm install -g generator-d365
```

Then generate your new project or file:

```bash
yo d365
```

### You can choose from:

* Console 2016+ Project (CrmServiceClient)
* Console 2011-2015 Project (CrmConnection)
* Plug-in Project
* Plug-in Class
* Custom Workflow Project
* Custom Workflow Class

Console projects can be run and debugged from Visual Studio or Visual Studio Code (with [C#](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) extension). Included in the project will be an appsettings.json file with connection strings ready to be updated. 

Plug-in and workflow projects with have a new strong name key file generated and assigned to the project. 

When creating projects, the latest SDK version for each major/minor version combination will be available from NuGet to choose from. The 2016+ console project will install the latest major/minor version combination of the XrmTooling.CoreAssembly for the chosen SDK version (which will be 8.0+). The 2011-2015 console project will install the latest major/minor version combination of the CrmSdk.Extensions for the chosen SDK version (which will be <8.0).

You will also have the option to create a Visual Studio solution file.

### Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [Jason Lattimer](https://jlattimer.blogspot.com/)

[npm-image]: https://badge.fury.io/js/generator-d365.svg
[npm-url]: https://npmjs.org/package/generator-d365