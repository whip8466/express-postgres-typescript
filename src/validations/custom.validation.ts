const httpMessages = require("../config/httpMessages");

export const passwordValidation = (value: any, helpers: any) => {
  if (value?.length < 8) {
    return helpers.message(httpMessages.REGISTER.SHORT_PASSWORD);
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      "password must contain at least 1 letter and 1 number!"
    );
  }
  return value;
};

export const phoneValidation = (value: string, helpers: any) => {
  if (!value.match(/^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/)) {
    return helpers.message(httpMessages.REGISTER.INVALID_PHONE);
  }
  return value;
};