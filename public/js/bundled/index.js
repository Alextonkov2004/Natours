/*eslint-disable */
(() => {
  let e = () => {
      let e = document.querySelector('.alert');
      e && e.parentElement.removeChild(e);
    },
    t = (t, a) => {
      e();
      let s = `<div class="alert alert--${t}">${a}</div`;
      document.querySelector('body').insertAdjacentHTML('afterbegin', s),
        window.setTimeout(e, 5e3);
    },
    a = async (e, a) => {
      try {
        let s = await axios({
          method: 'POST',
          url: '/api/v1/users/login',
          data: { email: e, password: a },
        });
        'success' === s.data.status &&
          (t('success', 'Logged in successfully!'),
          window.setTimeout(() => {
            location.assign('/');
          }, 1500));
      } catch (e) {
        t('error', e.response.data.message);
      }
    },
    s = async () => {
      try {
        let e = await axios({ method: 'GET', url: '/api/v1/users/logout' });
        'success' === e.data.status &&
          window.setTimeout(() => {
            location.assign('/');
          }, 1500);
      } catch (e) {
        t('error', 'Error logging out! Try again!');
      }
    },
    o = async (e, a) => {
      try {
        let s =
            'password' === a
              ? '/api/v1/users/updateMyPassword'
              : '/api/v1/users/updateMe',
          o = await axios({ method: 'PATCH', url: s, data: e });
        'success' === o.data.status &&
          t('success', `${a.toUpperCase()} updated succesfully!`);
      } catch (e) {
        t('error', e.response.data.message);
      }
    },
    n = async (e) => {
      try {
        let t = await axios(`/api/v1/bookings/checkout-session/${e}`);
        window.location.replace(t.data.session.url);
      } catch (e) {
        t('error', e);
      }
    },
    r = async (e, a, s, o) => {
      try {
        let n = await axios({
          method: 'POST',
          url: '/api/v1/users/signup',
          data: { name: e, email: a, password: s, passwordConfirm: o },
        });
        'success' === n.data.status &&
          (t('success', 'Signed up successfully'),
          window.setTimeout(() => {
            location.assign('/');
          }, 1500));
      } catch (e) {
        console.log(e),
          (e.response.data.error.code = 11e3),
          t(
            'error',
            `${Object.keys(e.response.data.error.keyValue)} is already in use.`,
          );
      }
    },
    d = document.getElementById('map'),
    l = document.querySelector('form.form--login'),
    u = document.querySelector('.nav__el--logout'),
    c = document.querySelector('.form.form-user-password'),
    m = document.querySelector('.form.form-user-data'),
    i = document.getElementById('book-tour'),
    p = document.querySelector('form.form--signup');
  d &&
    ((e, t, a) => {
      e.push(t), (mapboxgl.accessToken = a);
      var s = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/alextonkov2004/cly05dy6g003a01qp56vu0fxt',
        scrollZoom: !1,
      });
      s.on('style.load', () => {
        s.setFog({});
      });
      let o = new mapboxgl.LngLatBounds();
      e.forEach((e) => {
        let t;
        let [a, n] = e.coordinates,
          r = document.createElement('div');
        void 0 === e.day
          ? (r.className = 'marker-orange')
          : (r.className = 'marker'),
          (t =
            void 0 === e.day
              ? `<p>Start: ${e.address}</p>`
              : `<p>Day ${e.day}: ${e.description}</p>`);
        let d = new mapboxgl.Popup({
            offset: 30,
            closeButton: !1,
            closeOnClick: !1,
          }).setHTML(t),
          l = new mapboxgl.Marker({ element: r, anchor: 'bottom' })
            .setLngLat(e.coordinates)
            .setPopup(d)
            .addTo(s),
          u = l.getElement();
        u.addEventListener('mouseenter', () => l.togglePopup()),
          u.addEventListener('mouseleave', () => l.togglePopup()),
          o.extend([a, n]);
      }),
        s.fitBounds(o, {
          padding: { top: 200, bottom: 200, left: 100, right: 100 },
        });
    })(
      JSON.parse(d.dataset.locations),
      JSON.parse(d.dataset.startLocation),
      d.dataset.mapToken,
    ),
    l &&
      l.addEventListener('submit', (e) => {
        e.preventDefault(),
          a(
            document.getElementById('email').value,
            document.getElementById('password').value,
          );
      }),
    p &&
      p.addEventListener('submit', (e) => {
        e.preventDefault();
        let t = document.getElementById('name').value;
        r(
          t,
          document.getElementById('email').value,
          document.getElementById('password').value,
          document.getElementById('password-confirm').value,
        );
      }),
    u && u.addEventListener('click', s),
    m &&
      m.addEventListener('submit', (e) => {
        e.preventDefault();
        let t = new FormData();
        t.append('name', document.getElementById('name').value),
          t.append('email', document.getElementById('email').value),
          t.append('photo', document.getElementById('photo').files[0]),
          o(t, 'data');
      }),
    c &&
      c.addEventListener('submit', async (e) => {
        e.preventDefault(),
          (document.querySelector('.btn--save-password').textContent =
            'Updating...');
        let t = document.getElementById('password-current').value,
          a = document.getElementById('password').value,
          s = document.getElementById('password-confirm').value;
        await o(
          { currentPassword: t, password: a, passwordConfirm: s },
          'password',
        ),
          (document.querySelector('.btn--save-password').textContent =
            'Save password'),
          (document.getElementById('password-current').value = ''),
          (document.getElementById('password').value = ''),
          (document.getElementById('password-confirm').value = '');
      }),
    i &&
      i.addEventListener('click', (e) => {
        e.target.textContent = 'Processing...';
        let { tourId: t } = e.target.dataset;
        n(t);
      });
})();
//# sourceMappingURL=index.js.map
