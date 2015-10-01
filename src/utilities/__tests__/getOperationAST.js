/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { parse } from '../../language';
import { getOperationAST } from '../getOperationAST';

describe('getOperationAST', () => {

  it('Gets an operation from a simple document', () => {
    var doc = parse(`{ field }`);
    expect(getOperationAST(doc)).to.equal(doc.definitions[0]);
  });

  it('Gets an operation from a document with named operation', () => {
    var doc = parse(`mutation Test { field }`);
    expect(getOperationAST(doc)).to.equal(doc.definitions[0]);
  });

  it('Does not get missing operation', () => {
    var doc = parse(`type Foo { field: String }`);
    expect(getOperationAST(doc)).to.equal(null);
  });

  it('Does not get ambiguous unnamed operation', () => {
    var doc = parse(`{ field } mutation Test { field }`);
    expect(getOperationAST(doc)).to.equal(null);
  });

  it('Does not get ambiguous named operation', () => {
    var doc = parse(`query TestQ { field } mutation TestM { field }`);
    expect(getOperationAST(doc)).to.equal(null);
  });

  it('Does not get misnamed operation', () => {
    var doc = parse(`query TestQ { field } mutation TestM { field }`);
    expect(getOperationAST(doc, 'Unknown')).to.equal(null);
  });

  it('Gets named operation', () => {
    var doc = parse(`query TestQ { field } mutation TestM { field }`);
    expect(getOperationAST(doc, 'TestQ')).to.equal(doc.definitions[0]);
    expect(getOperationAST(doc, 'TestM')).to.equal(doc.definitions[1]);
  });

});