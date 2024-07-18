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
    const errMsg = err.response.data.message.split('.');
    if (err.message === 'Request failed with status code 429') {
      showAlert('error', err.response.data);
    } else if (errMsg[0].startsWith('Duplicate')) {
      const errMsgSplit = errMsg[0].split(':');
      const message =
        errMsgSplit[1] === ' undefined'
          ? 'Email is already in use'
          : `${errMsg[0].split(':')[1]} is already in use.`;
      showAlert('error', message);
    } else if (errMsg[0].startsWith('Invalid')) {
      showAlert('error', err.response.data.message);
    } else showAlert('error', err.response.data.message);
  }
};
