const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menú');
  });
});

const bookingForm = document.querySelector('#booking-form');
if (bookingForm) {
  const checkIn = bookingForm.querySelector('[name="checkin"]');
  const checkOut = bookingForm.querySelector('[name="checkout"]');
  const today = new Date();
  const localISO = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };
  checkIn.min = localISO(today);
  checkOut.min = localISO(today);
  checkIn.addEventListener('change', () => {
    checkOut.min = checkIn.value;
    if (checkOut.value && checkOut.value <= checkIn.value) checkOut.value = '';
  });

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(bookingForm);
    const bookingUrl = new URL('https://hotels.cloudbeds.com/es/reservation/0qMAze');
    bookingUrl.searchParams.set('checkin', form.get('checkin'));
    bookingUrl.searchParams.set('checkout', form.get('checkout'));
    bookingUrl.searchParams.set('guests', form.get('guests'));
    window.location.href = bookingUrl.toString();
  });
}

const tourDialog = document.querySelector('#tour-dialog');
const tourVideo = document.querySelector('#tour-video');
const tourPlaceholder = document.querySelector('#tour-placeholder');
// Set to a client-approved local video path or hosted video URL when Henua Iti shares the final tour.
const HENUA_TOUR_VIDEO_URL = '';

document.querySelectorAll('[data-open-tour]').forEach((button) => {
  button.addEventListener('click', () => {
    if (HENUA_TOUR_VIDEO_URL) {
      tourVideo.src = HENUA_TOUR_VIDEO_URL;
      tourVideo.hidden = false;
      tourPlaceholder.hidden = true;
    }
    tourDialog?.showModal();
    if (HENUA_TOUR_VIDEO_URL) tourVideo?.play().catch(() => {});
  });
});

document.querySelector('[data-close-tour]')?.addEventListener('click', () => tourDialog?.close());
tourDialog?.addEventListener('click', (event) => {
  if (event.target === tourDialog) tourDialog.close();
});
tourDialog?.addEventListener('close', () => tourVideo?.pause());
