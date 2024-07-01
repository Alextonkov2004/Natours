/*eslint-disable */

import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    if ((err.response.data.error.code = 11000)) {
      const message = `${Object.keys(err.response.data.error.keyValue)} is already in use.`;
      showAlert('error', message);
    } else if ((err.response.data.error.name = 'ValidationError')) {
      const errors = Object.values(err.response.data.error.errors).map(
        (el) => el.message,
      );
      const message = `Invalid input data. ${errors.join('. ')}`;
      showAlert('error', message);
    } else showAlert('error', err.response.data.message);
  }
};
