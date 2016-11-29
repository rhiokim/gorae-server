const keygen = require('ssh-keygen')
const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const mkdirp = require('mkdirp')

const baseDir = process.env.SSH_KEYGEN_DIR || process.cwd()

module.exports = (author, password = '') => {
  let location = path.join(baseDir, '.ssh', author)
  mkdirp.sync(location)

  return new Promise((resolve, reject) => {
    keygen({
      location: path.join(location, 'id_rsa'),
      author: author,
      password: password,
      read: true
    }, (err, out) => {
      if (err) {
        reject(err)
        return;
      }

      resolve(out);
    })
  })
}
