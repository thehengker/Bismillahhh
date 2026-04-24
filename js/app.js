// ============================================================
// 🧺 LAUNDRY FLOP — App Initialization
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Register routes
  Router.register('/user', () => {
    UserPage.render();
  });

  Router.register('/admin', () => {
    if (!sessionStorage.getItem('admin_auth')) {
      const username = prompt('Masukkan Username Admin:');
      if (username === null) {
        Router.navigate('/user');
        return;
      }
      
      const password = prompt('Masukkan Password Admin:');
      if (password === null) {
        Router.navigate('/user');
        return;
      }

      if (username === 'Monkey D. Luffy' && password === 'Goldlabubu24') {
        sessionStorage.setItem('admin_auth', 'true');
        AdminPage.render();
      } else {
        alert('Username atau Password salah!');
        Router.navigate('/user');
      }
    } else {
      AdminPage.render();
    }
  });

  // Initialize router
  Router.init();

  // Set default hash if none
  if (!window.location.hash) {
    window.location.hash = '/user';
  }
});
