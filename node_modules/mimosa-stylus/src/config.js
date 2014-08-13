"use strict";

var path = require( "path" );

exports.defaults = function() {
  return {
    stylus: {
      extensions: [ "styl" ],
      use: [ "nib" ],
      import: [ "nib" ],
      define: {},
      includes: []
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n" +
         "  stylus:                  # config settings for the Stylus compiler module\n" +
         "    lib: undefined         # use this property to provide a specific version of Stylus\n" +
         "    extensions: [\"styl\"] # default extensions for Stylus files\n" +
         "    use:['nib']            # names of libraries to use, should match the npm name for\n" +
         "                           # the desired libraries\n" +
         "    import:['nib']         # Files to import for compilation\n" +
         "    define: {}             # An object containing stylus variable defines\n" +
         "    includes: []           # Files to include for compilation\n";
};

exports.validate = function( config, validators ) {
  var errors = [];

  if ( validators.ifExistsIsObject( errors, "stylus config", config.stylus ) ) {

    if ( !config.stylus.lib ) {
      config.stylus.lib = require( "stylus" );
    }

    if ( validators.isArrayOfStringsMustExist( errors, "stylus.extensions", config.stylus.extensions ) ) {
      if (config.stylus.extensions.length === 0) {
        errors.push( "stylus.extensions cannot be an empty array");
      }
    }

    validators.ifExistsIsObject( errors, "stylus.define", config.stylus.define );
    validators.ifExistsIsArrayOfStrings( errors, "stylus.import", config.stylus.import );
    validators.ifExistsIsArrayOfStrings( errors, "stylus.includes", config.stylus.includes );

    if ( validators.ifExistsIsArrayOfStrings(errors, "stylus.use", config.stylus.use) ) {

      config.stylus.resolvedUse = [];
      var projectNodeModules = path.resolve( process.cwd(), "node_modules" );
      config.stylus.use.forEach( function ( imp ) {
        var lib;
        try {
          lib = require( imp );
        } catch ( err ) {
          try {
            lib = require( path.join( projectNodeModules, imp ) );
          } catch ( err ) {
            config.log.error( err );
          }
        }

        if ( !lib ) {
          errors.push( "Error including stylus use [[ " + imp + " ]]" );
        } else {
          config.stylus.resolvedUse.push( lib() );
        }
      });
    }
  }

  return errors;
};
