import chai from 'chai'
import React from 'react'
import ReactDOM from 'react-dom'
import sinon from 'sinon'
import ReactTestUtils from 'react-addons-test-utils'
import MaskedTextInput from '../src/MaskedTextInput.jsx'

const expect = chai.expect

describe('MaskedTextInput', () => {
  it('does not throw when instantiated', () => {
    expect(() => ReactTestUtils.renderIntoDocument(
      <MaskedTextInput mask="111-111"/>
    )).not.to.throw()
  })

  it('renders a single input element', () => {
    const maskedTextInput = ReactTestUtils.renderIntoDocument(
      <MaskedTextInput mask="111-111"/>
    )

    expect(
      () => ReactTestUtils.findRenderedDOMComponentWithTag(maskedTextInput, 'input')
    ).not.to.throw()
  })

  describe('input change', () => {
    it('calls user provided `onChange` if it exists', () => {
      const userOnChange = sinon.spy()
      const maskedTextInput = ReactTestUtils.renderIntoDocument(
        <MaskedTextInput mask="111-111" onChange={userOnChange}/>
      )
      const input = ReactTestUtils.findRenderedDOMComponentWithTag(maskedTextInput, 'input')

      input.value = '2___-___'
      input.selectionStart = 1
      input.selectionEnd = 1

      ReactTestUtils.Simulate.change(input)

      expect(userOnChange.called).to.equal(true)
    })

    it('adjusts the position of the caret correctly when it updates', () => {
      const maskedTextInput = ReactTestUtils.renderIntoDocument(
        <MaskedTextInput mask="(11)"/>
      )
      const input = ReactTestUtils.findRenderedDOMComponentWithTag(maskedTextInput, 'input')

      input.value = '(2_)'
      input.selectionStart = 1
      input.selectionEnd = 1

      maskedTextInput.refs.inputElement.focus()

      ReactTestUtils.Simulate.change(input)

      expect([
        maskedTextInput.refs.inputElement.selectionStart,
        maskedTextInput.refs.inputElement.selectionEnd
      ]).to.deep.equal([2,2])
    })

    it('does not attempt to update the position of the caret when the input is not focused', () => {
      const maskedTextInput = ReactTestUtils.renderIntoDocument(
        <MaskedTextInput mask="(11)"/>
      )
      const input = ReactTestUtils.findRenderedDOMComponentWithTag(maskedTextInput, 'input')

      input.value = '(2_)'
      input.selectionStart = 1
      input.selectionEnd = 1

      ReactTestUtils.Simulate.change(input)

      expect([
        maskedTextInput.refs.inputElement.selectionStart,
        maskedTextInput.refs.inputElement.selectionEnd
      ]).to.deep.equal([1, 1])
    })
  })

  it('never sets the value of the input to empty mask', () => {
    const maskedTextInput = ReactTestUtils.renderIntoDocument(<MaskedTextInput mask="(11)"/>)

    const input = ReactTestUtils.findRenderedDOMComponentWithTag(maskedTextInput, 'input')

    input.value = '(__)'

    ReactTestUtils.Simulate.change(input)

    expect(input.value).to.equal('')
  })
})