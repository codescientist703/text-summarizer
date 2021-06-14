/* eslint-disable no-console */

var chai = require( 'chai' );
var mocha = require( 'mocha' );
var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;
const summarizer = require('../summarizer');

var text = `An intuitive API lets you get started quick and get the results you’re looking for.
Quickly access the document's entities, sentences and tokens.
Use familiar functions like each and filter, or output to native JavaScript data types.
Built-in visualization support with markup.`;

describe( 'Summarizer basic tests', function () {
  it('result returned should be of type array', function () {
    expect(summarizer.summarizeText( text, 2 )).to.be.an('array');
  } );

  it('length of resulting array should be equal to passed value', function () {
    expect(summarizer.summarizeText( text, 2).length ).to.equal(2);
  } );

  it( 'should return array with size as minimum of number of sentences and passed value', function () {
    expect(summarizer.summarizeText( text, 100).length ).to.equal(4);
  } );

  it( 'should throw error if the passed text is not string', function () {
    expect(() => summarizer.summarizeText( [], 100 )).to.throw( /summarizer: expecting a valid Javascript string, instead found "object"./ );
  } );

  it( 'should throw error if the passed countSentences is not number', function () {
    expect(() => summarizer.summarizeText( text, [] )).to.throw( /summarizer: expecting a valid Javascript integer, instead found "object"./ );
  } );

  it( 'should throw error if the passed countSentences is negative', function () {
    expect(() => summarizer.summarizeText( text, -1 )).to.throw( /summarizer: expecting a positive integer./ );
  } );
} );
