/**
 * Centralize constant values through the application
 */
const constants = {
  regex: {
    password: {
      general:
        /^(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/])(?=.*\d)(?=.*[A-Z]).{12,}$/,
      length: /^.{12,}$/,
      uppercase: /[A-Z]/,
      number: /\d/,
      specialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
    },
    email: /\S+@\S+\.\S+/,
  },
  password: {
    saltRounds: 10,
  },
};

export default constants;
