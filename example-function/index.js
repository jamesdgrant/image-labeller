const vision = require('@google-cloud/vision')
const annotator = new vision.ImageAnnotatorClient()

const Firestore = require('@google-cloud/firestore')
const labelStore = new Firestore().collection('image-labels')

function extractTop5Labels(annotatorResult) {
  return annotatorResult[0]
    .labelAnnotations
    .map(label => label.description)
    .slice(0, 5)
}

function storeImageLabels(image, labels) {
  return labelStore
    .doc(image)
    .set({ top5Labels: labels })
    .then(() => `Stored labels (${labels.join(', ')}) for image "${image}"`)
}

exports.detectLabels = event => {
  return annotator
    .labelDetection(`gs://${event.bucket}/${event.name}`)
    .then(extractTop5Labels)
    .then(labels => storeImageLabels(event.name, labels))
}
