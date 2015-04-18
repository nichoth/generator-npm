'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var slug = require('slug');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the stellar ' + chalk.red('npm') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'appName',
      message: 'Project name: ',
      default: this.appname
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description: '
    },
    { type: 'input',
      name: 'mainFile',
      message: 'Main file: ',
      default: 'index.js'
    },
    {
      type: 'checkbox',
      name: 'devServer',
      message: 'Dev Server?',
      choices: [{
        name: 'ecstatic',
        value: 'includeEcstatic',
        checked: false
      }]
    },
    {
      type: 'confirm',
      name: 'tape',
      message: 'Include tape?',
      default: false
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      this.description = props.description;
      this.mainFile = props.mainFile;
      this.appNameSlug = slug(props.appName);
      this.includeEcstatic = props.devServer.indexOf('includeEcstatic') !== -1;
      this.includeServer = this.includeEcstatic;
      this.includeTape = props.tape;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('example/_index.html'),
        this.destinationPath('example/index.html'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('example/_example.js'),
        this.destinationPath('example/example.js'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('_readme.md'),
        this.destinationPath('readme.md'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('_server.js'),
        this.destinationPath('server.js'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('_index.js'),
        this.destinationPath(this.mainFile),
        this
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    }
  },

  install: function () {
    // this.installDependencies({
    //   skipInstall: this.options['skip-install']
    // });
    if (this.includeEcstatic) {
      this.npmInstall(['ecstatic'], {saveDev: true});
    }
    if (this.includeTape) {
      this.npmInstall(['tape'], {saveDev: true});
    }
  }
});
