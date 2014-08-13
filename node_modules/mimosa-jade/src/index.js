"use strict";

var path = require( "path" )
  , config = require( "./config" )
  , getExtensions = function ( mimosaConfig ) {
    return mimosaConfig.jade.extensions;
  };

var prefix = function ( mimosaConfig, libraryPath ) {
  if ( mimosaConfig.template.wrapType === "amd" ) {
    return "define(['" + libraryPath + "'], function (jade){ var templates = {};\n";
  } else {
    if ( mimosaConfig.template.wrapType === "common" ) {
      return "var jade = require('" + mimosaConfig.template.commonLibPath + "');\nvar templates = {};\n";
    }
  }

  return "var templates = {};\n";
};

var suffix = function ( mimosaConfig ) {
  if ( mimosaConfig.template.wrapType === "amd" ) {
    return "return templates; });";
  } else {
    if ( mimosaConfig.template.wrapType === "common" ) {
      return "\nmodule.exports = templates;";
    }
  }

  return "";
};

var compile = function ( mimosaConfig, file, cb ) {
  var error, output;

  try {
    var opts = mimosaConfig.jade.compileOptions;
    opts.filename = file.inputFileName;

    output = mimosaConfig.jade.lib.compileClient( file.inputFileText, opts);
  } catch ( err ) {
    error = err;
  }

  cb( error, output );
};

module.exports = {
  name: "jade",
  compilerType: "template",
  clientLibrary: path.join( __dirname, "client", "jade-runtime.js" ),
  compile: compile,
  suffix: suffix,
  prefix: prefix,
  extensions: getExtensions,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};
