import { parseCustomColor, parseColorPreset } from "../../common/_utils"
import { LabelPropTypes, InlineLabelProps } from "./types"
import { IStyled } from "../../common/types"

type IStyledLabel = IStyled<LabelPropTypes>
type IStyledInlineLabel = IStyled<InlineLabelProps>
type GenericLabelProps = IStyledLabel | IStyledInlineLabel

export const parseColorTheme = (props: GenericLabelProps) => {
  const {
    customProps: { customColor, colorPreset },
    theme: { knitui: theme },
  } = props
  return customColor
    ? parseCustomColor(theme, customColor)
    : parseColorPreset(theme, colorPreset!)
}
export const getBackgroundColor = (props: GenericLabelProps) =>
  parseColorTheme(props).background

export const getFontColor = (props: GenericLabelProps) => {
  const {
    customProps: { customFontColor },
  } = props
  return customFontColor || parseColorTheme(props).font
}
