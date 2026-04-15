document.addEventListener("DOMContentLoaded", function () {

  // ✅ Initialize AOS safely
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }

  // ✅ Navbar scroll effect
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', function () {
    if (!nav) return;
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ---------- Mock Data ----------
  const hotels = [
    { id: 1, name: 'Grand Plaza', location: 'New York', price: 20000, image: 'assets/images/bg-home.avif'},
    { id: 2, name: 'Sunset Resort', location: 'Miami', price: 15000, image: 'assets/images/room-4.avif' },
    { id: 3, name: 'Mountain Inn', location: 'Denver', price: 12220, image: 'assets/images/room-3.avif' }
  ];

  const restaurants = [
    { id: 1, name: 'Le Jardin', cuisine: 'French', location: 'New York', priceForTwo: 1200, image: 'assets/images/gateway-02.avif' },
    { id: 2, name: 'Sushi Ko', cuisine: 'Japanese', location: 'Los Angeles', priceForTwo: 1500, image: 'assets/images/restraunt06.avif' },
    { id: 3, name: 'La Trattoria', cuisine: 'Italian', location: 'Chicago', priceForTwo: 999, image: 'assets/images/restraunt-05.avif' }
  ];

  // ---------- State ----------
  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  let currentItem = null;

  // ✅ Safe Bootstrap Modal
  let modal = null;
  const modalEl = document.getElementById('bookingModal');
  if (typeof bootstrap !== "undefined" && modalEl) {
    modal = new bootstrap.Modal(modalEl);
  }

  // ---------- Render Functions ----------
  function renderHotels() {
    const container = document.getElementById('hotels-list');
    if (!container) return;

    container.innerHTML = hotels.map(hotel => `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${hotel.image}" class="card-img-top" alt="${hotel.name}">
          <div class="card-body">
            <h5>${hotel.name}</h5>
            <p>${hotel.location}</p>
            <p>₹${hotel.price}/night</p>
            <button class="btn btn-outline-gold w-100 book-btn" data-id="${hotel.id}" data-type="hotel">Book Now</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderRestaurants() {
    const container = document.getElementById('restaurants-list');
    if (!container) return;

    container.innerHTML = restaurants.map(r => `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${r.image}" class="card-img-top" alt="${r.name}">
          <div class="card-body">
            <h5>${r.name}</h5>
            <p>${r.cuisine}</p>
            <p>${r.location}</p>
            <p>₹${r.priceForTwo} for two</p>
            <button class="btn btn-outline-gold w-100 book-btn" data-id="${r.id}" data-type="restaurant">Reserve</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderBookings() {
    const container = document.getElementById('bookings-list');
    if (!container) return;

    if (bookings.length === 0) {
      container.innerHTML = `<div class="alert alert-info">No bookings yet.</div>`;
      return;
    }

    container.innerHTML = bookings.map((b, i) => `
      <div class="booking-item">
        <h5>${b.itemName}</h5>
        <p>${b.name} (${b.guests} guests)</p>
        <button onclick="cancelBooking(${i})" class="btn btn-danger btn-sm">Cancel</button>
      </div>
    `).join('');
  }

  // ---------- Booking ----------
  window.cancelBooking = function (index) {
    bookings.splice(index, 1);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    renderBookings();
  };

  function openBookingModal(item, type) {
    if (!modal) return;

    currentItem = item;
    document.getElementById('modalTitle').innerText = item.name;
    document.getElementById('itemType').value = type;
    modal.show();
  }

  // ---------- Form Submit ----------
  const form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const guests = document.getElementById('guests').value;

      if (!name || !guests) {
        alert("Fill all fields");
        return;
      }

      bookings.push({
        name,
        guests,
        itemName: currentItem?.name || "Unknown"
      });

      localStorage.setItem('bookings', JSON.stringify(bookings));
      form.reset();
      modal?.hide();
      renderBookings();

      alert("Booking Confirmed!");
    });
  }

  // ---------- Click Events ----------
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('book-btn')) {
      const id = parseInt(e.target.dataset.id);
      const type = e.target.dataset.type;

      if (type === 'hotel') {
        const item = hotels.find(h => h.id === id);
        if (item) openBookingModal(item, 'hotel');
      } else {
        const item = restaurants.find(r => r.id === id);
        if (item) openBookingModal(item, 'restaurant');
      }
    }
  });

  // ---------- Mobile Menu ----------
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // ---------- CUSTOM CURSOR ----------
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');

  if (cursor && ring && window.innerWidth > 768) {

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    }

    animateRing();

    document.querySelectorAll('a, button, .card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '6px';
        cursor.style.height = '6px';
        ring.style.width = '50px';
        ring.style.height = '50px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        ring.style.width = '36px';
        ring.style.height = '36px';
      });
    });

  }

  // ---------- Init ----------
  renderHotels();
  renderRestaurants();
  renderBookings();

});
