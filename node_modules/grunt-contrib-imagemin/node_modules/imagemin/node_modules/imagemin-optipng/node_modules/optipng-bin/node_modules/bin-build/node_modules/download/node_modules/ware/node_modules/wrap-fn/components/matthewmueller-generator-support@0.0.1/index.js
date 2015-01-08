try {
  eval('(function* () {})()');
  module.exports = true;
} catch (e) {
  module.exports = false;
}
