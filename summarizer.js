const winkNLP = require('wink-nlp');
const model = require('wink-eng-lite-web-model');
const nlp = winkNLP(model);
var nlpu = require('wink-nlp-utils');

function summarizeText(text, countSentences) {
	// Removing Square Brackets and Extra Spaces
	text = text.replace(/\[[0-9]*\]/gi, ' ');
	text = text.replace(/\s+/gi, ' ');

	// Removing special characters and digits
	let formatted_text = text.replace(/[^a-zA-Z]/gi, ' ');
	formatted_text = formatted_text.replace(/\s+/gi, ' ');

	// Converting text to list of sentences
	const doc = nlp.readDoc(text);
	sentences_list = doc.sentences().out();

	// Tokenizing the text
	let tokenized_words = nlp.readDoc(formatted_text).tokens().out();
	tokenized_words = nlpu.tokens.removeWords(tokenized_words);

	word_frequences = {};

	// The maximum frequency of a word
	let max_frequency = 0;

	// Finding frequency of occurence of each word
	tokenized_words.forEach((element) => {
		if (element in word_frequences) {
			word_frequences[element] += 1;
		} else {
			word_frequences[element] = 1;
		}
		max_frequency = Math.max(word_frequences[element], max_frequency);
	});

	// Calculation of weighted frequency for each word
	Object.keys(word_frequences).forEach((element) => {
		word_frequences[element] = word_frequences[element] / max_frequency;
	});

	sentences_scores = {};

	// Assigning score to each sentence
	sentences_list.forEach((element) => {
		let elementWords = nlp.readDoc(element).tokens().out();
		elementWords.forEach((word) => {
			if (Object.keys(word_frequences).includes(word)) {
				if (element in sentences_scores) {
					sentences_scores[element] += word_frequences[word];
				} else {
					sentences_scores[element] = word_frequences[word];
				}
			}
		});
	});

	// Converting sentences with score to array and sorting it in descending order
	let items = Object.keys(sentences_scores).map(function (key) {
		return [key, sentences_scores[key]];
	});
	items.sort(function (first, second) {
		return second[1] - first[1];
	});
	return items.slice(0, Math.min(items.length, countSentences));
}

document.getElementById('submit').addEventListener('click', function () {
	const countSentences = document.getElementById('sentences-count').value;
	const text = document.getElementById('text').value;
	const ans = summarizeText(text, countSentences);
	let resultHtml = `<h2>Result:</h2>`;

	for (let i = 0; i < ans.length; i++) {
		resultHtml += `<p>${ans[i][0]}</p>`;
	}
	document.querySelector('.result').innerHTML = resultHtml;
});
