/*eslint-disable */
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    //1) Get checkout session from api
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );

    //console.log(session);
    //2) Create checkout form + charge credit card

    window.location.replace(session.data.session.url);
  } catch (err) {
    showAlert('error', err);
  }
};
