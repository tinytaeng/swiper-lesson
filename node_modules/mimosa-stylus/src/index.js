"use strict";

var fs = require( "fs" )
  , path = require( "path" )
  , _ = require( "lodash" )
  , logger = null
  , config = require( "./config" )
  , importRegex = /@(?:import|require)[\s\t]*[\(]?[\s\t]*['"]?([a-zA-Z0-9*\/\.\-\_]*)[\s\t]*[\n;\s'")]?/g
  , getImportFilePath = function ( baseFile, importPath ) {
    return path.join( path.dirname( baseFile ), importPath );
  }
  , getExtensions = function ( mimosaConfig ) {
    logger = mimosaConfig.log;
    return mimosaConfig.stylus.extensions;
  };

var compile = function ( mimosaConfig, file, done ) {
  var stylusSetup
    , text = file.inputFileText
    , fileName = file.inputFileName
    , cb = function ( err, css ) {
      if ( logger.isDebug() ) {
        logger.debug( "Finished Stylus compile for file [[ " + fileName + " ]], errors? " + !!err );
      }
      done( err, css );
    };

  stylusSetup = mimosaConfig.stylus.lib( text )
    .include( path.dirname( fileName ) )
    .include( mimosaConfig.watch.sourceDir )
    .set( "compress", false )
    .set( "filename", fileName )
    .set( "include css", true );
    //.set('firebug', not mimosaConfig.isOptimize)
    //.set('linenos', not mimosaConfig.isOptimize and not mimosaConfig.isBuild)

  if ( mimosaConfig.stylus.url ) {
    stylusSetup.define( "url", mimosaConfig.stylus.lib.url( mimosaConfig.stylus.url ) );
  }

  if ( mimosaConfig.stylus.includes ) {
    mimosaConfig.stylus.includes.forEach( function( inc ) {
      stylusSetup.include( inc );
    });
  }

  if ( mimosaConfig.stylus.resolvedUse ) {
    mimosaConfig.stylus.resolvedUse.forEach( function( ru ) {
      stylusSetup.use( ru );
    });
  }

  if ( mimosaConfig.stylus.import ) {
    mimosaConfig.stylus.import.forEach( function ( imp ) {
      stylusSetup.import( imp );
    });
  }

  Object.keys( mimosaConfig.stylus.define ).forEach( function( define ) {
    stylusSetup.define( define, mimosaConfig.stylus.define[define] );
  });

  if ( logger.isDebug() ) {
    logger.debug( "Compiling Stylus file [[ " + fileName + " ]]" );
  }

  stylusSetup.render( cb );
};


var determineBaseFiles = function ( allFiles ) {
  var imported = []
    , baseFiles;

  allFiles.forEach( function( file ) {
    var imports = fs.readFileSync( file, "utf8" ).match( importRegex );
    if ( imports ) {
      imports.forEach( function( anImport ) {
        importRegex.lastIndex = 0;
        var importPath = importRegex.exec( anImport )[1];
        var fullImportPath = path.join( path.dirname( file ), importPath );
        allFiles.some( function( fullFilePath ) {
          if ( fullFilePath.indexOf( fullImportPath ) === 0 ) {
            fullImportPath += path.extname( fullFilePath );
            return true;
          }
        });
        imported.push( fullImportPath );
      });
    }
  });

  baseFiles = _.difference( allFiles, imported );
  if ( logger.isDebug() ) {
    logger.debug( "Base files for Stylus are:\n" + baseFiles.join( "\n" ) );
  }
  return baseFiles;
};

module.exports = {
  name: "stylus",
  compilerType: "css",
  canFullyImportCSS: true,
  importRegex: importRegex,
  compile: compile,
  determineBaseFiles: determineBaseFiles,
  getImportFilePath: getImportFilePath,
  extensions: getExtensions,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};
