function isProperName(name) {
  return !((/\W/).test(name) || name.length > 10);
}
