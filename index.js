exports.detectLabels = event => {
  return `Processed file ${event.name}, from bucket ${event.bucket}`
}
