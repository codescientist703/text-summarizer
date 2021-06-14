const winkNLP = require('wink-nlp');
const model = require('wink-eng-lite-web-model');
const nlp = winkNLP(model);
var nlpu = require('wink-nlp-utils');

var summarizer = Object.create( null );
// ### summarizeText
/**
 *
 * Summarizes the given text to a specified number of sentences
 *
 * @param  {string} text           Text to be summarized
 * @param  {number} countSentences Number of sentences the text should be summarized to
 * @return {array}                 The summarized sentences array
 * @private
*/

summarizer.summarizeText = function (text, countSentences) {
  if ( typeof text !== 'string' ) {
    throw Error( `summarizer: expecting a valid Javascript string, instead found "${typeof text}".`);
  }
  if ( typeof countSentences !== 'number') {
    throw Error( `summarizer: expecting a valid Javascript integer, instead found "${typeof countSentences}".`);
  }
  if ( countSentences < 0 ) {
    throw Error( 'summarizer: expecting a positive integer.');
  }
  // Removing Square Brackets and Extra Spaces
  var queryText = text.replace(/\[[0-9]*\]/gi, ' ');
  queryText = text.replace(/\s+/gi, ' ');

  // Removing special characters and digits
  var formattedText = queryText.replace(/[^a-zA-Z]/gi, ' ');
  formattedText = formattedText.replace(/\s+/gi, ' ');

  // Converting text to list of sentences
  const doc = nlp.readDoc(text);
  var sentencesList = doc.sentences().out();

  // Tokenizing the text
  var tokenizedWords = nlp.readDoc(formattedText).tokens().out();
  tokenizedWords = nlpu.tokens.removeWords(tokenizedWords);

  var wordFrequences = {};

  // The maximum frequency of a word
  var maxFrequency = 0;

  // Finding frequency of occurence of each word
  tokenizedWords.forEach((element) => {
    if (element in wordFrequences) {
      wordFrequences[element] += 1;
    } else {
      wordFrequences[element] = 1;
    }
    maxFrequency = Math.max(wordFrequences[element], maxFrequency);
  });

  // Calculation of weighted frequency for each word
  Object.keys(wordFrequences).forEach((element) => {
    wordFrequences[element] /= maxFrequency;
  });

  var sentenceScores = {};

  // Assigning score to each sentence
  sentencesList.forEach((element) => {
    const elementWords = nlp.readDoc(element).tokens().out();
    elementWords.forEach((word) => {
      if (Object.keys(wordFrequences).includes(word)) {
        if (element in sentenceScores) {
          sentenceScores[element] += wordFrequences[word];
        } else {
          sentenceScores[element] = wordFrequences[word];
        }
      }
    });
  });

  // Converting sentences with score to array and sorting it in descending order
  var items = Object.keys(sentenceScores).map(function (key) {
    return [ key, sentenceScores[key] ];
  });
  items.sort(function (first, second) {
    return second[1] - first[1];
  });
  return items.slice(0, Math.min(items.length, countSentences));
};

module.exports = summarizer;
