/*eslint-disable */
import { showAlert } from './alerts';
/* 
const Stripe = require('stripe');


const stripe = Stripe(
  'pk_test_51PIFCQJZmlCdbHpvJk0X6vdlO8cpRhv5EZRaBu5VYn6GuColiTW3BhskfC7w2jfZUh3M58oarekbLXEATD8QMABy00eouOF3ia',
);
*/
export const bookTour = async (tourId) => {
  try {
    //1) Get checkout session from api
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    );

    console.log(session);
    //2) Create checkout form + charge credit card
    //await stripe.redirectToCheckout({
    //sessionId: session.data.session.id,
    //});
    window.location.replace(session.data.session.url);
  } catch (err) {
    showAlert('error', err);
  }
};
