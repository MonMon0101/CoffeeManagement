import { Base64 } from "js-base64";

export const hashPassword = (password = "") => {
  return String(Base64.encode(password));
};

export const comparePassword = (password, hash) => {
  return Base64.decode(password) === hash;
};
