import React, { SFC, ReactNode, CSSProperties } from "react"
import { StyledRadioRoot } from "./styledRadio"
import RadioWrapper from "./RadioWrapper"
import { RadioProps } from "./Interface"

const Radio: SFC<RadioProps> = props => {
  const { style, className, children, labelStyle, value } = props
  return (
    <label className={className} style={{ display: "flex", ...style }}>
      <RadioWrapper prefixCls="knit-radio" value={value} {...props} />
      {children && <span style={labelStyle}>{children}</span>}
    </label>
  )
}

export default Radio