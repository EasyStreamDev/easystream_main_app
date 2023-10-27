import QRCodeReact from "qrcode.react";
import React, { ReactNode } from "react";
import styled from "styled-components";
const CryptoJS = require("crypto-js");

var JsonFormatter = {
  stringify: (cipherParams: any) => {
    // create json object with ciphertext
    var jsonObj = {
      ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64),
      iv: cipherParams.iv.toString(),
    };

    // stringify json object
    return JSON.stringify(jsonObj);
  },
  parse: (jsonStr: any) => {
    // parse json string
    var jsonObj = JSON.parse(jsonStr);

    // extract ciphertext from json object, and create cipher params object
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct),
    });

    // optionally extract iv or salt

    if (jsonObj.iv) {
      cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
    }

    return cipherParams;
  },
};

const ResponsiveSvgWrapper = styled.div`
  & > svg {
    display: block; /* svg is "inline" by default */
    height: auto; /* reset height */
    width: 100%; /* reset width */
  }
`;

interface Props {
  value: string;
  className?: string;
  children?: ReactNode;
}

export const encrypt = (
  message: string,
  password: string = "EasyStream"
): string => {
  // Encrypt the message
  const encrypted = CryptoJS.AES.encrypt(message, password, {
    format: JsonFormatter,
  });

  const res = {
    key: CryptoJS.enc.Base64.stringify(encrypted.key),
    iv: CryptoJS.enc.Base64.stringify(encrypted.iv),
    encrypted: CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
  };

  const resStr = JSON.stringify(res);
  console.log(resStr);
  console.log("BLOP");
  return resStr;
};

export const QRCode = ({ value, className }: any) => (
  <ResponsiveSvgWrapper>
    <QRCodeReact
      className={className}
      includeMargin={true}
      fgColor={"#ffffff"}
      bgColor={"#393E46"}
      renderAs="svg"
      value={value}
    />
  </ResponsiveSvgWrapper>
);
