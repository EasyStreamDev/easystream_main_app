import QRCodeReact from 'qrcode.react'
import React, { ReactNode } from 'react'
import styled from 'styled-components'

const ResponsiveSvgWrapper = styled.div`
  & > svg {
    display: block; /* svg is "inline" by default */
    height: auto; /* reset height */
    width: 100%; /* reset width */
  }
`

interface Props {
    value: string;
    className?: string;
    children?: ReactNode;
}

const QRCode = ({ value, className }: Props) => (
  <ResponsiveSvgWrapper>
    <QRCodeReact className={className} level="H" renderAs="svg" value={value}/>
  </ResponsiveSvgWrapper>
)

export default QRCode