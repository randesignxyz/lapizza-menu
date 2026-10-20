export function initCarousel({ onCategorySelect }) {
  const hero = document.querySelector('.hero');
  const copy = hero.querySelector('.hero-copy');
  const art = hero.querySelector('.hero-art');
  const originalArt = art.innerHTML;
  const plate = (inside) =>
    `<div class="art-ring"></div><svg viewBox="0 0 400 400" aria-hidden="true"><ellipse cx="204" cy="215" rx="165" ry="151" fill="#6b4524" opacity=".09"/><circle cx="195" cy="193" r="159" fill="#e8dcc5"/><circle cx="195" cy="193" r="142" fill="#fff9ec" stroke="#d4c3a7" stroke-width="2"/>${inside}</svg><span class="art-label">Made for sharing.<br>Remembered with love.</span><span class="hero-stamp">LA PIZZA<br>✦<br>CUCINA ITALIANA</span>`;
  const pastaArt = plate(
    `<g fill="none" stroke="#dbaa53" stroke-width="13" stroke-linecap="round"><path d="M119 139c130-80 165 93 33 114s-54-163 59-116 45 157-42 120-48-122 47-100 25 105-35 65 25-59 64-13"/><path d="M110 180c-30 85 157 140 172 21s-113-119-141-52 105 135 112 53-81-85-80-32 55 67 59 31"/></g><g fill="#a64730"><ellipse cx="126" cy="164" rx="17" ry="12"/><ellipse cx="245" cy="251" rx="17" ry="13"/><ellipse cx="240" cy="136" rx="13" ry="17"/></g><g fill="#52744b"><path d="M188 123q-37-47-42-5 12 33 42 5"/><path d="M194 125q3-50 37-23-3 30-37 23"/><path d="M125 251q-34-33-44-3 10 27 44 3"/></g><g fill="#fbf4dc"><path d="m160 171 24-5-7 17z"/><path d="m222 239 24-5-7 17z"/><path d="m212 150 24-5-7 17z"/></g>`,
  );
  const dessertArt = plate(
    `<ellipse cx="195" cy="253" rx="100" ry="35" fill="#d9c7ac" opacity=".5"/><path d="m112 163 134-20 42 42-130 25z" fill="#57382b"/><path d="m112 163 46 47v76l-46-39z" fill="#b7855a"/><path d="m158 210 130-25v73l-130 28z" fill="#e4c49b"/><path d="m158 229 130-25v13l-130 28zm0 34 130-25v13l-130 28z" fill="#6f4832"/><path d="m158 210 130-25v11l-130 27z" fill="#593629"/><g fill="#77513b" opacity=".7"><circle cx="151" cy="174" r="3"/><circle cx="195" cy="168" r="2"/><circle cx="221" cy="180" r="3"/><circle cx="245" cy="162" r="2"/></g><path d="M281 256q-35-37-47-5 13 23 47 5" fill="#56744a"/>`,
  );
  const slides = [
    {
      category: 'Pizza',
      eyebrow: 'BUON APPETITO',
      heading: 'A little taste<br>of <span>Italy.</span>',
      description:
        'Good food. Great company.<br>Find your next favourite at La Pizza.',
      link: 'Explore our pizza',
      art: originalArt,
    },
    {
      category: 'Pasta',
      eyebrow: 'PASTA FATTA IN CASA',
      heading: 'Twirl into<br><span>something good.</span>',
      description:
        'From tagliolini to tortelloni.<br>Explore our homemade pasta favourites.',
      link: 'Explore our pasta',
      art: pastaArt,
    },
    {
      category: 'Desserts',
      eyebrow: 'THE SWEETEST FINISH',
      heading: 'Save room<br>for <span>dolci.</span>',
      description:
        'Tiramisu, panna cotta or chocolate fondant.<br>A sweet ending to your Italian meal.',
      link: 'Explore our desserts',
      art: dessertArt,
    },
  ];
  let slideIndex = 0;
  function showSlide(index) {
    slideIndex = (index + slides.length) % slides.length;
    const slide = slides[slideIndex];
    copy.querySelector('.eyebrow').textContent = slide.eyebrow;
    copy.querySelector('h1').innerHTML = slide.heading;
    copy.querySelector('p:not(.eyebrow)').innerHTML = slide.description;
    copy.querySelector('.hero-link').innerHTML = `${slide.link} <span>↓</span>`;
    art.innerHTML = slide.art;
    hero.dataset.category = slide.category;
    document.getElementById('slideStatus').textContent =
      `0${slideIndex + 1} / 03 · ${slide.category}`;
    hero.querySelectorAll('[data-slide]').forEach((button, i) => {
      if (i === slideIndex) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  }
  document.getElementById('previousSlide').onclick = () =>
    showSlide(slideIndex - 1);
  document.getElementById('nextSlide').onclick = () =>
    showSlide(slideIndex + 1);
  hero
    .querySelectorAll('[data-slide]')
    .forEach(
      (button) =>
        (button.onclick = () => showSlide(Number(button.dataset.slide))),
    );
  hero.addEventListener('keydown', (event) => {
    if (event.target !== hero) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(slideIndex + 1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showSlide(slideIndex - 1);
    }
  });
  let touchStart = null;
  hero.addEventListener(
    'touchstart',
    (event) => {
      const t = event.changedTouches[0];
      touchStart = { x: t.clientX, y: t.clientY };
    },
    { passive: true },
  );
  hero.addEventListener(
    'touchend',
    (event) => {
      if (!touchStart) return;
      const t = event.changedTouches[0],
        dx = t.clientX - touchStart.x,
        dy = t.clientY - touchStart.y;
      if (
        Math.abs(dx) > 55 &&
        Math.abs(dx) > Math.abs(dy) * 1.5 &&
        !event.target.closest('button,a')
      )
        showSlide(slideIndex + (dx < 0 ? 1 : -1));
      touchStart = null;
    },
    { passive: true },
  );
  copy.querySelector('.hero-link').addEventListener('click', () => {
    onCategorySelect(slides[slideIndex].category);
  });
  showSlide(0);
}
