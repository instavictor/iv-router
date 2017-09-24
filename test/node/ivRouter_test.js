let chai = require('chai');
let expect = chai.expect;
let path = require('path');

let router = require(path.join(__dirname, '../..', 'src/ivRouter.js'));

describe('IV Router', () => {

  it ('should be 0', () => {
    expect(0).to.equal(0);
  });
});
