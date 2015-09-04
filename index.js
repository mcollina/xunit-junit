'use strict'

var duplexify = require('duplexify')
var through = require('through2')
var File = require('vinyl')
var bl = require('bl')
var xml2js = require('xml2js')
var minimist = require('minimist')
var fs = require('vinyl-fs')
var mkdirp = require('mkdirp')

function xunitJunit () {
  var source = through.obj()
  var parser = bl(function (err, data) {
    if (err) {
      instance.emit('error', err)
      return
    }

    xml2js.parseString(data.toString(), function (err, xml) {
      if (err) {
        instance.emit('error', err)
        return
      }

      xml.testsuites.testsuite.forEach(function (testsuite) {
        var builder = new xml2js.Builder()

        var file = new File({
          cwd: '/',
          base: '/',
          path: '/' + testsuite.$.name.replace(/ /g, '-') + '.xml',
          contents: new Buffer(builder.buildObject({
            testsuite: testsuite
          }) + '\n')
        })

        source.push(file)
      })

      source.push(null)
    })
  })

  var instance = duplexify.obj(parser, source)

  return instance
}

module.exports = xunitJunit

function run () {
  var argv = minimist(process.argv.slice(2))
  var dir = argv._[0]

  if (!dir || argv.help) {
    console.log('Usage: xunit-junit DIR')
    process.exit(1)
  }

  mkdirp.sync(dir)

  process.stdin
    .pipe(xunitJunit())
    .pipe(fs.dest(dir))
}

if (require.main === module) {
  run()
}
