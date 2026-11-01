document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav-links');

  if (menuButton && navigation) {
    const closeMenu = () => {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = '☰';
    };

    menuButton.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('open');

      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.textContent = isOpen ? '✕' : '☰';
    });

    navigation.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    document.addEventListener('click', event => {
      if (
        navigation.classList.contains('open') &&
        !navigation.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // Preview-only forms
  document.querySelectorAll('[data-preview-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();

      const message = form.querySelector('[data-message]');

      if (message) {
        message.textContent =
          'This account feature is not connected yet. No information was submitted.';
      }
    });
  });
});