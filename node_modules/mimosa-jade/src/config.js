"use strict";

exports.defaults = function() {
  return {
    jade: {
      extensions: [ "jade" ],
      compileOptions: {
        compileDebug: false
      }
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n" +
         "  jade:               # config settings for the Jade compiler module\n" +
         "    lib: undefined    # use this property to provide a specific version of Jade\n" +
         "    extensions: [\"jade\"]  # default extensions for Jade files\n" +
         "    compileOptions:  #default jade compile options\n" +
         "      compileDebug: false\n";
};

exports.validate = function( config, validators ) {
  var errors = [];

  if ( validators.ifExistsIsObject( errors, "jade config", config.jade ) ) {
    validators.ifExistsIsObject( errors, "jade compileOptions", config.jade.compileOptions );

    if ( !config.jade.lib ) {
      config.jade.lib = require( "jade" );
    }

    if ( validators.isArrayOfStringsMustExist( errors, "jade.extensions", config.jade.extensions ) ) {
      if (config.jade.extensions.length === 0) {
        errors.push( "jade.extensions cannot be an empty array");
      }
    }
  }

  return errors;
};
