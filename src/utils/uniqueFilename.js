module.exports = function generateShortUniqueFilename() {
    const now = Date.now().toString(36); // Convert current timestamp to base-36 string
    const random = Math.random().toString(36).substring(2, 7); // Short random string
    return `${now}-${random}`;
}
  