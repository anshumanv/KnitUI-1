import React from "react"
import Extractor from "../"
// import { ThemeProvider } from "../../../common/styles"
import { cleanup, fireEvent, render } from "../../../common/TestUtil"
import { functions, staticValues } from "../helpers"

afterEach(cleanup)

// functions for the extractor
const options = [...functions, ...staticValues]

const onUpdate = editorState => {
  return editorState.buildExpression()
}

const extractorProps = {
  onChangeFn: onUpdate,
  options: options,
}

describe("Extractor renders properly", () => {
  it("Renders correctly", () => {
    const { asFragment } = render(<Extractor {...extractorProps} />)

    // Get the options list which should be shown by default
    const optionsList = document.querySelector('[data-type="expression-list"]')
    expect(optionsList).toBeInTheDocument()

    // Check initial focus on render
    const { activeElement } = document
    expect(activeElement!.parentElement).toHaveAttribute(
      "data-type",
      "expression-input-root"
    )

    // Input field should how focus initially
    expect(asFragment()).toMatchSnapshot()
  })
  it("Scaffolds an expression on typing one", () => {
    const { asFragment } = render(<Extractor {...extractorProps} />)
    // Get the root input element
    const { activeElement } = document
    fireEvent.input(activeElement as any, { target: { value: "extract" } })

    // Check that all params are scaffolded properly
    const expressionInputRoots = document.querySelectorAll(
      '[data-type="expression-input-root"]'
    )
    expect(expressionInputRoots).toHaveLength(3)

    // Check that the expression root is created
    const expressionRoots = document.querySelectorAll(
      '[data-type="expression-root"]'
    )
    expect(expressionRoots).toHaveLength(1)

    expect(asFragment()).toMatchSnapshot()
  })
  it("Hides options list on blur", () => {
    const { asFragment } = render(<Extractor {...extractorProps} />)
    // Initially the input has focus
    // Get the options list which should be shown by default
    const optionsList = document.querySelector('[data-type="expression-list"]')
    expect(optionsList).toBeInTheDocument()

    // create a new element and transfer focus
    const newInput = document.createElement("input")
    newInput.focus()

    expect(optionsList).not.toBeInTheDocument()

    expect(asFragment()).toMatchSnapshot()
  })
  it("Applies correct data attributes", () => {
    const { asFragment } = render(<Extractor {...extractorProps} />)

    // Get the root input element
    const { activeElement } = document
    fireEvent.input(activeElement as any, { target: { value: "Ad" } })

    // Check for attributes
    expect(activeElement).toHaveAttribute("data-value-type", "dimension")
    expect(activeElement).toHaveStyle("background-color: #fdedce")

    expect(asFragment()).toMatchSnapshot()
  })
})

describe("Extractor builds data structure properly", () => {
  it("Fires the onChange function", () => {
    const onChangeFn = jest.fn()
    const { asFragment } = render(
      <Extractor {...extractorProps} onChangeFn={onChangeFn} />
    )

    // Get the root input element
    const { activeElement } = document
    fireEvent.change(activeElement as any, { target: { value: "Ad" } })

    expect(onChangeFn).toHaveBeenCalled()

    expect(asFragment()).toMatchSnapshot()
  })

  it("Builds correct string on input", () => {
    const onChangeFn = jest.fn(editorState => editorState.buildExpression())
    const { asFragment } = render(
      <Extractor {...extractorProps} onChangeFn={onChangeFn} />
    )

    // Scaffold and expression
    const { activeElement } = document
    fireEvent.change(activeElement as any, { target: { value: "concat" } })

    // Get scaffolded params
    const expressionParamsInput = document.querySelectorAll(
      '[data-type="expression-input-root"] input'
    )
    expect(expressionParamsInput).toHaveLength(2)
    fireEvent.change(expressionParamsInput[0], { target: { value: "Ad" } })
    fireEvent.change(expressionParamsInput[1], { target: { value: '"_"' } })

    expect(onChangeFn).toHaveBeenCalledTimes(3)
    expect(onChangeFn.mock.results[2].value).toEqual('CONCAT (Ad, "_")')

    expect(asFragment()).toMatchSnapshot()
  })
})