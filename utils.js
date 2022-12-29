async function regex(url) {
  try {
    const regex = /https:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/;
    const result = url.match(regex);
    return result[1]
  } catch {
    return false
  }
}

module.exports = regex;