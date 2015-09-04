'use strict'

var test = require('tape')
var fs = require('fs')
var path = require('path')
var tmp = require('tmp')
var xunitJunit = require('./')
var vynilFs = require('vinyl-fs')
var glob = require('glob')

test('convert xunit into a multiple dir structure', function (t) {
  var dir = tmp.dirSync()
  var instance = xunitJunit()

  fs.createReadStream(path.join(__dirname, './fixture.xml'))
    .pipe(instance)
    .pipe(vynilFs.dest(dir.name))
    .on('finish', function () {
      glob('*.xml', {
        cwd: dir.name
      }, function (err, files) {
        t.error(err, 'no error')
        t.deepEqual([
          'can-issue-a-request.xml',
          'can-pass-through-an-object.xml',
          'can-pass-from-receiver-to-sender-an-object-readable-stream.xml',
          'can-pass-from-receiver-to-sender-a-writable-stream.xml',
          'can-pass-from-receiver-to-sender-a-transform-stream-as-a-writable.xml',
          'can-pass-from-receiver-to-sender-a-transform-stream-as-a-readable-streams.xml',
          'can-pass-from-sender-to-receiver-an-object-readable-stream.xml',
          'can-pass-from-sender-to-receiver-an-object-writable-stream.xml',
          'supports-custom-encodings.xml'
        ].sort(), files, 'files matches')

        var file = fs.readFileSync(path.join(dir.name, 'can-issue-a-request.xml'), 'utf8')
        var expected = fs.readFileSync(path.join(__dirname, 'expected.xml'), 'utf8')

        t.equal(file, expected, 'content matches')

        t.end()
      })
    })
})
