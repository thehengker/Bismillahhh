// ============================================================
// 🧺 LAUNDRY FLOP — Admin Page
// ============================================================

const AdminPage = (() => {
  let currentTab = 'dashboard';
  let cachedData = {
    pelanggan: [],
    layanan: [],
    transaksi: []
  };

  // ======================== MAIN RENDER ========================

  function renderLogin(container) {
    container.innerHTML = `
      <div style="display:flex; justify-content:center; align-items:center; min-height:100vh; background:var(--bg-secondary);">
        <div class="card" style="width: 100%; max-width: 400px; padding: var(--space-6);">
          <div style="text-align:center; margin-bottom: var(--space-6);">
            <div style="font-size: 3rem; margin-bottom: var(--space-2);">🔐</div>
            <h2 style="margin:0; color:var(--text-primary);">Admin Login</h2>
            <p style="color:var(--text-secondary); margin-top: var(--space-2);">Silakan masukkan kredensial Anda</p>
          </div>
          <form id="admin-login-form">
            <div class="form-group">
              <label class="form-label">Username</label>
              <input type="text" class="form-input" id="login-username" required placeholder="Masukkan username">
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" id="login-password" required placeholder="Masukkan password">
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%; margin-top: var(--space-4);">Login</button>
          </form>
        </div>
      </div>
    `;

    document.getElementById('admin-login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('login-username').value;
      const pass = document.getElementById('login-password').value;
      
      if (user === 'Monkey D. Luffy' && pass === 'Goldlabubu24') {
        sessionStorage.setItem('admin_authenticated', 'true');
        Components.toast('Login berhasil', 'success');
        render(); // Re-render the admin page
      } else {
        Components.toast('Username atau password salah', 'error');
      }
    });
  }

  function render() {
    const app = document.getElementById('app');

    // Check authentication
    if (!sessionStorage.getItem('admin_authenticated')) {
      renderLogin(app);
      return;
    }

    app.innerHTML = `
      ${renderSidebar()}
      <div class="admin-content" id="admin-content">
        <!-- Dynamic content loaded here -->
      </div>
      <button class="mobile-sidebar-toggle" id="mobile-toggle" onclick="AdminPage.toggleSidebar()">☰</button>
      <div class="mobile-overlay" id="mobile-overlay" onclick="AdminPage.toggleSidebar()"></div>`;

    // Load the default or current tab
    const path = Router.getCurrentPath();
    if (path.includes('/admin/orders')) switchTab('orders');
    else if (path.includes('/admin/customers')) switchTab('customers');
    else if (path.includes('/admin/services')) switchTab('services');
    else if (path.includes('/admin/revenue')) switchTab('revenue');
    else if (path.includes('/admin/expenses')) switchTab('expenses');
    else if (path.includes('/admin/settings')) switchTab('settings');
    else switchTab('dashboard');
  }

  // ======================== SIDEBAR ========================

  function renderSidebar() {
    return `
      <aside class="sidebar" id="admin-sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">🧺</div>
          <div class="sidebar-brand">
            Laundry Flop
            <span>Admin Panel</span>
          </div>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-section">
            <div class="nav-section-title">Menu</div>
            <a class="nav-item ${currentTab === 'dashboard' ? 'active' : ''}" onclick="AdminPage.switchTab('dashboard')" data-tab="dashboard">
              <span class="nav-item-icon">📊</span> Dashboard
            </a>
            <a class="nav-item ${currentTab === 'orders' ? 'active' : ''}" onclick="AdminPage.switchTab('orders')" data-tab="orders">
              <span class="nav-item-icon">📋</span> Transaksi
            </a>
            <a class="nav-item ${currentTab === 'customers' ? 'active' : ''}" onclick="AdminPage.switchTab('customers')" data-tab="customers">
              <span class="nav-item-icon">👥</span> Pelanggan
            </a>
            <a class="nav-item ${currentTab === 'services' ? 'active' : ''}" onclick="AdminPage.switchTab('services')" data-tab="services">
              <span class="nav-item-icon">👕</span> Layanan
            </a>
            <a class="nav-item ${currentTab === 'revenue' ? 'active' : ''}" onclick="AdminPage.switchTab('revenue')" data-tab="revenue">
              <span class="nav-item-icon">💰</span> Pendapatan
            </a>
            <a class="nav-item ${currentTab === 'expenses' ? 'active' : ''}" onclick="AdminPage.switchTab('expenses')" data-tab="expenses">
              <span class="nav-item-icon">💸</span> Biaya
            </a>
          </div>
          <div class="nav-section">
            <div class="nav-section-title">Sistem</div>
            <a class="nav-item ${currentTab === 'settings' ? 'active' : ''}" onclick="AdminPage.switchTab('settings')" data-tab="settings">
              <span class="nav-item-icon">⚙️</span> Pengaturan
            </a>
          </div>
        </nav>
        <div class="sidebar-footer">
          <a class="nav-item" href="#/user">
            <span class="nav-item-icon">🔙</span> Halaman User
          </a>
          <a class="nav-item" style="cursor:pointer;" onclick="AdminPage.logout()">
            <span class="nav-item-icon">🚪</span> Logout
          </a>
        </div>
      </aside>`;
  }

  function updateSidebarActive() {
    document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
      item.classList.toggle('active', item.dataset.tab === currentTab);
    });
  }

  function toggleSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('mobile-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  }

  // ======================== TAB SWITCHING ========================

  function switchTab(tab) {
    currentTab = tab;
    updateSidebarActive();

    // Close mobile sidebar
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('mobile-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');

    const content = document.getElementById('admin-content');
    switch (tab) {
      case 'dashboard': renderDashboard(content); break;
      case 'orders': renderOrders(content); break;
      case 'customers': renderCustomers(content); break;
      case 'services': renderServices(content); break;
      case 'revenue': renderRevenue(content); break;
      case 'expenses': renderExpenses(content); break;
      case 'settings': renderSettings(content); break;
    }
  }

  // ======================== DASHBOARD ========================

  async function renderDashboard(container) {
    container.innerHTML = `
      <div class="admin-page-header">
        <div>
          <h1 class="admin-page-title">Dashboard</h1>
          <p class="admin-page-subtitle">Ringkasan aktivitas laundry hari ini</p>
        </div>
      </div>
      <div class="stats-grid stagger-children" id="stats-grid">
        ${Components.skeletonStats(4)}
      </div>
      <div class="admin-section">
        <div class="section-header">
          <h2 class="section-title">Transaksi Terbaru</h2>
        </div>
        <div class="card" id="recent-table">
          ${Components.skeletonTable(5)}
        </div>
      </div>`;

    if (!API.isConfigured()) {
      container.querySelector('#stats-grid').innerHTML = `
        <div class="card" style="grid-column: 1/-1; text-align:center; padding: var(--space-8)">
          <p style="color:var(--accent-warning); font-size:var(--text-lg); margin-bottom:var(--space-4)">⚠️ API belum dikonfigurasi</p>
          <p style="color:var(--text-tertiary); margin-bottom:var(--space-6)">Masukkan URL Google Apps Script Web App di menu Pengaturan</p>
          <button class="btn btn-primary" onclick="AdminPage.switchTab('settings')">Buka Pengaturan</button>
        </div>`;
      container.querySelector('#recent-table').innerHTML = '';
      return;
    }

    try {
      const result = await API.Dashboard.get();
      if (result.success) {
        const d = result.data;
        document.getElementById('stats-grid').innerHTML = `
          ${Components.statsCard('📦', d.totalOrder, 'Total Order', 'stat-orders')}
          ${Components.statsCard('🔄', d.proses, 'Sedang Proses', 'stat-process')}
          ${Components.statsCard('✅', d.selesai, 'Siap Diambil', 'stat-done')}
          ${Components.statsCard('💰', Components.formatCurrency(d.totalPendapatan), 'Total Pendapatan', 'stat-revenue')}
        `;

        if (d.recentTransaksi && d.recentTransaksi.length > 0) {
          document.getElementById('recent-table').innerHTML = renderTransaksiTable(d.recentTransaksi);
        } else {
          document.getElementById('recent-table').innerHTML = Components.emptyState('📋', 'Belum Ada Transaksi', 'Transaksi baru akan muncul di sini');
        }
      }
    } catch (error) {
      Components.toast('Gagal memuat dashboard: ' + error.message, 'error');
    }
  }

  // ======================== TRANSAKSI (ORDERS) ========================

  async function renderOrders(container) {
    container.innerHTML = `
      <div class="admin-page-header">
        <div>
          <h1 class="admin-page-title">Manajemen Transaksi</h1>
          <p class="admin-page-subtitle">Kelola semua order laundry</p>
        </div>
        <button class="btn btn-primary" onclick="AdminPage.showAddTransaksi()">
          + Tambah Order
        </button>
      </div>
      <div class="card">
        <div class="table-toolbar">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input type="text" class="form-input" placeholder="Cari nama atau ID..." id="search-orders" oninput="AdminPage.filterOrders(this.value)">
          </div>
          <div class="filter-group" id="status-filters">
            <button class="filter-btn active" data-filter="all" onclick="AdminPage.filterByStatus('all', this)">Semua</button>
            <button class="filter-btn" data-filter="Antrian" onclick="AdminPage.filterByStatus('Antrian', this)">Antrian</button>
            <button class="filter-btn" data-filter="Proses" onclick="AdminPage.filterByStatus('Proses', this)">Proses</button>
            <button class="filter-btn" data-filter="Selesai" onclick="AdminPage.filterByStatus('Selesai', this)">Selesai</button>
            <button class="filter-btn" data-filter="Diambil" onclick="AdminPage.filterByStatus('Diambil', this)">Diambil</button>
          </div>
        </div>
        <div id="orders-table">
          ${Components.skeletonTable(8)}
        </div>
      </div>`;

    await loadOrders();
  }

  let activeStatusFilter = 'all';
  let activeSearchQuery = '';

  async function loadOrders() {
    if (!API.isConfigured()) return;

    // Tampilkan data dari cache instan jika sudah ada
    if (cachedData.transaksi && cachedData.transaksi.length > 0) {
      displayFilteredOrders();
    }

    try {
      const result = await API.Transaksi.getAll();
      if (result.success) {
        cachedData.transaksi = result.data;
        displayFilteredOrders(); // Perbarui di belakang layar
      }
    } catch (error) {
      // Hanya tampilkan error jika cache kosong (artinya benar-benar gagal ambil data pertama kali)
      if (cachedData.transaksi.length === 0) {
        Components.toast('Gagal memuat transaksi', 'error');
      }
    }
  }

  function filterOrders(query) {
    activeSearchQuery = query.toLowerCase();
    displayFilteredOrders();
  }

  function filterByStatus(status, btnEl) {
    activeStatusFilter = status;
    document.querySelectorAll('#status-filters .filter-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    displayFilteredOrders();
  }

  function displayFilteredOrders() {
    let data = [...cachedData.transaksi];

    if (activeStatusFilter !== 'all') {
      data = data.filter(t => t.status === activeStatusFilter);
    }

    if (activeSearchQuery) {
      data = data.filter(t =>
        (t.nama_pelanggan || '').toLowerCase().includes(activeSearchQuery) ||
        (t.id_transaksi || '').toLowerCase().includes(activeSearchQuery) ||
        (t.no_hp || '').includes(activeSearchQuery)
      );
    }

    // Sort newest first
    data.sort((a, b) => new Date(b.tanggal_masuk) - new Date(a.tanggal_masuk));

    const el = document.getElementById('orders-table');
    if (!el) return;

    if (data.length === 0) {
      el.innerHTML = Components.emptyState('📋', 'Tidak Ada Data', 'Tidak ada transaksi yang sesuai filter');
      return;
    }

    el.innerHTML = renderTransaksiTable(data);
  }

  function renderTransaksiTable(data) {
    let html = `
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pelanggan</th>
              <th>Layanan</th>
              <th>Berat</th>
              <th>Total</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>`;

    data.forEach(t => {
      html += `
        <tr>
          <td><span class="table-id">${t.id_transaksi}</span></td>
          <td>
            <div style="color:var(--text-primary);font-weight:500">${t.nama_pelanggan}</div>
            <div style="font-size:var(--text-xs);color:var(--text-tertiary)">${Components.formatPhone(t.no_hp)}</div>
          </td>
          <td>${t.nama_layanan}</td>
          <td>${t.berat_kg} kg</td>
          <td style="font-weight:600;color:var(--text-primary)">${Components.formatCurrency(t.total_harga)}</td>
          <td>${Components.statusSelect(t.status, t.id_transaksi)}</td>
          <td style="font-size:var(--text-xs)">${Components.formatDate(t.tanggal_masuk)}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-ghost btn-icon" title="Hapus" onclick="AdminPage.confirmDeleteTransaksi('${t.id_transaksi}')">🗑️</button>
            </div>
          </td>
        </tr>`;
    });

    html += '</tbody></table></div>';
    return html;
  }

  async function handleStatusChange(selectEl) {
    const id = selectEl.dataset.id;
    const newStatus = selectEl.value;

    try {
      const result = await API.Transaksi.updateStatus(id, newStatus);
      if (result.success) {
        Components.toast(`Status berhasil diubah ke "${newStatus}"`, 'success');
        // Update cache
        const item = cachedData.transaksi.find(t => t.id_transaksi === id);
        if (item) item.status = newStatus;
      } else {
        Components.toast(result.message || 'Gagal update status', 'error');
      }
    } catch (error) {
      Components.toast('Gagal update status', 'error');
    }
  }

  function confirmDeleteTransaksi(id) {
    Components.confirm(`Yakin ingin menghapus transaksi <strong>#${id}</strong>?`, async () => {
      try {
        const result = await API.Transaksi.delete(id);
        if (result.success) {
          Components.toast('Transaksi berhasil dihapus', 'success');
          cachedData.transaksi = cachedData.transaksi.filter(t => t.id_transaksi !== id);
          displayFilteredOrders();
        } else {
          Components.toast(result.message || 'Gagal menghapus', 'error');
        }
      } catch (error) {
        Components.toast('Gagal menghapus transaksi', 'error');
      }
    });
  }

  // ======================== ADD TRANSAKSI MODAL ========================

  async function showAddTransaksi() {
    // Load pelanggan & layanan for dropdowns
    try {
      if (cachedData.pelanggan.length === 0) {
        const p = await API.Pelanggan.getAll();
        if (p.success) cachedData.pelanggan = p.data;
      }
      if (cachedData.layanan.length === 0) {
        const l = await API.Layanan.getAll();
        if (l.success) cachedData.layanan = l.data;
      }
    } catch (e) {
      Components.toast('Gagal memuat data', 'error');
      return;
    }

    const pelangganOptions = cachedData.pelanggan.map(p =>
      `<option value="${p.id_pelanggan}">${p.nama} (${Components.formatPhone(p.no_hp)})</option>`
    ).join('');

    const layananOptions = cachedData.layanan.map(l =>
      `<option value="${l.id_layanan}">${l.nama_layanan} — ${Components.formatCurrency(l.harga_per_kg)} (${l.estimasi_hari})</option>`
    ).join('');

    const body = `
      <form id="form-add-transaksi">
        <div class="form-group">
          <label class="form-label">Pelanggan</label>
          <select class="form-select" id="tx-pelanggan" required>
            <option value="">Pilih pelanggan...</option>
            ${pelangganOptions}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Layanan</label>
          <select class="form-select" id="tx-layanan" required>
            <option value="">Pilih layanan...</option>
            ${layananOptions}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Berat (kg)</label>
          <input type="number" class="form-input" id="tx-berat" step="0.1" min="0.1" required placeholder="Contoh: 3.5">
        </div>
        <div class="form-group">
          <label class="form-label">Catatan (opsional)</label>
          <textarea class="form-input" id="tx-catatan" rows="2" placeholder="Catatan khusus..."></textarea>
        </div>
      </form>`;

    const footer = `
      <button class="btn btn-secondary" onclick="Components.closeModal()">Batal</button>
      <button class="btn btn-primary" id="btn-submit-transaksi" onclick="AdminPage.submitTransaksi()">Simpan</button>`;

    Components.showModal('Tambah Order Baru', body, footer);
  }

  async function submitTransaksi() {
    const pelanggan = document.getElementById('tx-pelanggan').value;
    const layanan = document.getElementById('tx-layanan').value;
    const berat = document.getElementById('tx-berat').value;
    const catatan = document.getElementById('tx-catatan').value;

    if (!pelanggan || !layanan || !berat) {
      Components.toast('Mohon lengkapi semua field', 'warning');
      return;
    }

    const btn = document.getElementById('btn-submit-transaksi');
    btn.disabled = true;
    btn.innerHTML = '<span class="btn-spinner"></span> Menyimpan...';

    try {
      const result = await API.Transaksi.add({
        id_pelanggan: pelanggan,
        id_layanan: layanan,
        berat_kg: parseFloat(berat),
        catatan: catatan
      });

      if (result.success) {
        Components.toast('Order berhasil ditambahkan!', 'success');
        Components.closeModal();
        await loadOrders();
      } else {
        Components.toast(result.message || 'Gagal menambahkan order', 'error');
      }
    } catch (error) {
      Components.toast('Gagal menambahkan order', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Simpan';
    }
  }

  // ======================== PELANGGAN (CUSTOMERS) ========================

  async function renderCustomers(container) {
    container.innerHTML = `
      <div class="admin-page-header">
        <div>
          <h1 class="admin-page-title">Manajemen Pelanggan</h1>
          <p class="admin-page-subtitle">Kelola data pelanggan laundry</p>
        </div>
        <button class="btn btn-primary" onclick="AdminPage.showAddPelanggan()">+ Tambah Pelanggan</button>
      </div>
      <div class="card">
        <div class="table-toolbar">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input type="text" class="form-input" placeholder="Cari nama atau HP..." id="search-customers" oninput="AdminPage.filterCustomers(this.value)">
          </div>
        </div>
        <div id="customers-table">
          ${Components.skeletonTable(5)}
        </div>
      </div>`;

    await loadCustomers();
  }

  async function loadCustomers() {
    if (!API.isConfigured()) return;

    // Tampilkan data dari cache instan jika sudah ada
    if (cachedData.pelanggan && cachedData.pelanggan.length > 0) {
      displayCustomers(cachedData.pelanggan);
    }

    try {
      const result = await API.Pelanggan.getAll();
      if (result.success) {
        cachedData.pelanggan = result.data;
        displayCustomers(result.data); // Perbarui di belakang layar
      }
    } catch (error) {
      if (cachedData.pelanggan.length === 0) {
        Components.toast('Gagal memuat pelanggan', 'error');
      }
    }
  }

  function filterCustomers(query) {
    const q = query.toLowerCase();
    const filtered = cachedData.pelanggan.filter(p =>
      (p.nama || '').toLowerCase().includes(q) ||
      (p.no_hp || '').includes(q)
    );
    displayCustomers(filtered);
  }

  function displayCustomers(data) {
    const el = document.getElementById('customers-table');
    if (!el) return;

    if (data.length === 0) {
      el.innerHTML = Components.emptyState('👥', 'Belum Ada Pelanggan', 'Tambahkan pelanggan baru untuk memulai');
      return;
    }

    let html = `
      <div class="table-container">
        <table class="data-table">
          <thead><tr><th>ID</th><th>Nama</th><th>No. HP</th><th>Alamat</th><th>Terdaftar</th><th>Aksi</th></tr></thead>
          <tbody>`;

    data.forEach(p => {
      html += `
        <tr>
          <td><span class="table-id">${p.id_pelanggan}</span></td>
          <td style="color:var(--text-primary);font-weight:500">${p.nama}</td>
          <td>${Components.formatPhone(p.no_hp)}</td>
          <td>${p.alamat || '-'}</td>
          <td style="font-size:var(--text-xs)">${Components.formatDate(p.created_at)}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-ghost btn-icon" title="Edit" onclick="AdminPage.showEditPelanggan('${p.id_pelanggan}')">✏️</button>
              <button class="btn btn-ghost btn-icon" title="Hapus" onclick="AdminPage.confirmDeletePelanggan('${p.id_pelanggan}', '${p.nama}')">🗑️</button>
            </div>
          </td>
        </tr>`;
    });

    html += '</tbody></table></div>';
    el.innerHTML = html;
  }

  function showAddPelanggan() {
    const body = `
      <form id="form-pelanggan">
        <div class="form-group">
          <label class="form-label">Nama Lengkap</label>
          <input type="text" class="form-input" id="pel-nama" required placeholder="Nama pelanggan">
        </div>
        <div class="form-group">
          <label class="form-label">Nomor HP</label>
          <input type="tel" class="form-input" id="pel-hp" required placeholder="08xxxxxxxxxx">
        </div>
        <div class="form-group">
          <label class="form-label">Alamat (opsional)</label>
          <textarea class="form-input" id="pel-alamat" rows="2" placeholder="Alamat pelanggan"></textarea>
        </div>
      </form>`;

    const footer = `
      <button class="btn btn-secondary" onclick="Components.closeModal()">Batal</button>
      <button class="btn btn-primary" id="btn-submit-pel" onclick="AdminPage.submitPelanggan()">Simpan</button>`;

    Components.showModal('Tambah Pelanggan Baru', body, footer);
  }

  async function submitPelanggan() {
    const nama = document.getElementById('pel-nama').value.trim();
    const hp = document.getElementById('pel-hp').value.trim();
    const alamat = document.getElementById('pel-alamat').value.trim();

    if (!nama || !hp) {
      Components.toast('Nama dan No. HP wajib diisi', 'warning');
      return;
    }

    const btn = document.getElementById('btn-submit-pel');
    btn.disabled = true;
    btn.innerHTML = '<span class="btn-spinner"></span> Menyimpan...';

    try {
      const result = await API.Pelanggan.add({ nama, no_hp: hp, alamat });
      if (result.success) {
        Components.toast('Pelanggan berhasil ditambahkan!', 'success');
        Components.closeModal();
        await loadCustomers();
      } else {
        Components.toast(result.message || 'Gagal', 'error');
      }
    } catch (error) {
      Components.toast('Gagal menambahkan pelanggan', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Simpan';
    }
  }

  function showEditPelanggan(id) {
    const p = cachedData.pelanggan.find(x => x.id_pelanggan === id);
    if (!p) return;

    const body = `
      <form>
        <div class="form-group">
          <label class="form-label">Nama Lengkap</label>
          <input type="text" class="form-input" id="edit-pel-nama" value="${p.nama}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Nomor HP</label>
          <input type="tel" class="form-input" id="edit-pel-hp" value="${p.no_hp}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Alamat</label>
          <textarea class="form-input" id="edit-pel-alamat" rows="2">${p.alamat || ''}</textarea>
        </div>
      </form>`;

    const footer = `
      <button class="btn btn-secondary" onclick="Components.closeModal()">Batal</button>
      <button class="btn btn-primary" id="btn-update-pel" onclick="AdminPage.updatePelanggan('${id}')">Update</button>`;

    Components.showModal('Edit Pelanggan', body, footer);
  }

  async function updatePelanggan(id) {
    const nama = document.getElementById('edit-pel-nama').value.trim();
    const hp = document.getElementById('edit-pel-hp').value.trim();
    const alamat = document.getElementById('edit-pel-alamat').value.trim();

    if (!nama || !hp) {
      Components.toast('Nama dan No. HP wajib diisi', 'warning');
      return;
    }

    try {
      const result = await API.Pelanggan.update({ id_pelanggan: id, nama, no_hp: hp, alamat });
      if (result.success) {
        Components.toast('Pelanggan berhasil diupdate!', 'success');
        Components.closeModal();
        await loadCustomers();
      } else {
        Components.toast(result.message || 'Gagal', 'error');
      }
    } catch (error) {
      Components.toast('Gagal update pelanggan', 'error');
    }
  }

  function confirmDeletePelanggan(id, nama) {
    Components.confirm(`Yakin ingin menghapus pelanggan <strong>${nama}</strong>?`, async () => {
      try {
        const result = await API.Pelanggan.delete(id);
        if (result.success) {
          Components.toast('Pelanggan berhasil dihapus', 'success');
          await loadCustomers();
        } else {
          Components.toast(result.message || 'Gagal', 'error');
        }
      } catch (error) {
        Components.toast('Gagal menghapus pelanggan', 'error');
      }
    });
  }

  // ======================== LAYANAN (SERVICES) ========================

  async function renderServices(container) {
    container.innerHTML = `
      <div class="admin-page-header">
        <div>
          <h1 class="admin-page-title">Manajemen Layanan</h1>
          <p class="admin-page-subtitle">Atur jenis layanan dan harga</p>
        </div>
        <button class="btn btn-primary" onclick="AdminPage.showAddLayanan()">+ Tambah Layanan</button>
      </div>
      <div class="card">
        <div id="services-table">
          ${Components.skeletonTable(4)}
        </div>
      </div>`;

    await loadServices();
  }

  async function loadServices() {
    if (!API.isConfigured()) return;

    // Tampilkan data dari cache instan jika sudah ada
    if (cachedData.layanan && cachedData.layanan.length > 0) {
      displayServices(cachedData.layanan);
    }

    try {
      const result = await API.Layanan.getAll();
      if (result.success) {
        cachedData.layanan = result.data;
        displayServices(result.data); // Perbarui di belakang layar
      }
    } catch (error) {
      if (cachedData.layanan.length === 0) {
        Components.toast('Gagal memuat layanan', 'error');
      }
    }
  }

  function displayServices(data) {
    const el = document.getElementById('services-table');
    if (!el) return;

    if (data.length === 0) {
      el.innerHTML = Components.emptyState('👕', 'Belum Ada Layanan', 'Tambahkan layanan untuk memulai');
      return;
    }

    let html = `
      <div class="table-container">
        <table class="data-table">
          <thead><tr><th>ID</th><th>Nama Layanan</th><th>Harga</th><th>Keterangan</th><th>Aksi</th></tr></thead>
          <tbody>`;

    data.forEach(l => {
      html += `
        <tr>
          <td><span class="table-id">${l.id_layanan}</span></td>
          <td style="color:var(--text-primary);font-weight:500">${l.nama_layanan}</td>
          <td style="font-weight:600;color:var(--accent-primary)">${Components.formatCurrency(l.harga_per_kg)}</td>
          <td>${l.estimasi_hari}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-ghost btn-icon" title="Edit" onclick="AdminPage.showEditLayanan('${l.id_layanan}')">✏️</button>
              <button class="btn btn-ghost btn-icon" title="Hapus" onclick="AdminPage.confirmDeleteLayanan('${l.id_layanan}', '${l.nama_layanan}')">🗑️</button>
            </div>
          </td>
        </tr>`;
    });

    html += '</tbody></table></div>';
    el.innerHTML = html;
  }

  function showAddLayanan() {
    const body = `
      <form>
        <div class="form-group">
          <label class="form-label">Nama Layanan</label>
          <input type="text" class="form-input" id="lay-nama" required placeholder="Contoh: Cuci Setrika">
        </div>
        <div class="form-group">
          <label class="form-label">Harga per KG (Rp)</label>
          <input type="number" class="form-input" id="lay-harga" required placeholder="10000" min="0">
        </div>
        <div class="form-group">
          <label class="form-label">Keterangan</label>
          <input type="text" class="form-input" id="lay-hari" required placeholder="Contoh: Estimasi 2-3 hari / Harga per Pcs">
        </div>
      </form>`;

    const footer = `
      <button class="btn btn-secondary" onclick="Components.closeModal()">Batal</button>
      <button class="btn btn-primary" id="btn-submit-lay" onclick="AdminPage.submitLayanan()">Simpan</button>`;

    Components.showModal('Tambah Layanan Baru', body, footer);
  }

  async function submitLayanan() {
    const nama = document.getElementById('lay-nama').value.trim();
    const harga = document.getElementById('lay-harga').value;
    const hari = document.getElementById('lay-hari').value;

    if (!nama || !harga || !hari) {
      Components.toast('Semua field wajib diisi', 'warning');
      return;
    }

    const btn = document.getElementById('btn-submit-lay');
    btn.disabled = true;
    btn.innerHTML = '<span class="btn-spinner"></span> Menyimpan...';

    try {
      const result = await API.Layanan.add({
        nama_layanan: nama,
        harga_per_kg: parseInt(harga),
        estimasi_hari: hari
      });
      if (result.success) {
        Components.toast('Layanan berhasil ditambahkan!', 'success');
        Components.closeModal();
        await loadServices();
      } else {
        Components.toast(result.message || 'Gagal', 'error');
      }
    } catch (error) {
      Components.toast('Gagal menambahkan layanan', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Simpan';
    }
  }

  function showEditLayanan(id) {
    const l = cachedData.layanan.find(x => x.id_layanan === id);
    if (!l) return;

    const body = `
      <form>
        <div class="form-group">
          <label class="form-label">Nama Layanan</label>
          <input type="text" class="form-input" id="edit-lay-nama" value="${l.nama_layanan}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Harga per KG (Rp)</label>
          <input type="number" class="form-input" id="edit-lay-harga" value="${l.harga_per_kg}" required min="0">
        </div>
        <div class="form-group">
          <label class="form-label">Keterangan</label>
          <input type="text" class="form-input" id="edit-lay-hari" value="${l.estimasi_hari}" required>
        </div>
      </form>`;

    const footer = `
      <button class="btn btn-secondary" onclick="Components.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="AdminPage.updateLayanan('${id}')">Update</button>`;

    Components.showModal('Edit Layanan', body, footer);
  }

  async function updateLayanan(id) {
    const nama = document.getElementById('edit-lay-nama').value.trim();
    const harga = document.getElementById('edit-lay-harga').value;
    const hari = document.getElementById('edit-lay-hari').value;

    try {
      const result = await API.Layanan.update({
        id_layanan: id,
        nama_layanan: nama,
        harga_per_kg: parseInt(harga),
        estimasi_hari: hari
      });
      if (result.success) {
        Components.toast('Layanan berhasil diupdate!', 'success');
        Components.closeModal();
        await loadServices();
      } else {
        Components.toast(result.message || 'Gagal', 'error');
      }
    } catch (error) {
      Components.toast('Gagal update layanan', 'error');
    }
  }

  function confirmDeleteLayanan(id, nama) {
    Components.confirm(`Yakin ingin menghapus layanan <strong>${nama}</strong>?`, async () => {
      try {
        const result = await API.Layanan.delete(id);
        if (result.success) {
          Components.toast('Layanan berhasil dihapus', 'success');
          await loadServices();
        } else {
          Components.toast(result.message || 'Gagal', 'error');
        }
      } catch (error) {
        Components.toast('Gagal menghapus layanan', 'error');
      }
    });
  }

  // ======================== PENDAPATAN (REVENUE) ========================

  async function renderRevenue(container) {
    container.innerHTML = `
      <div class="admin-page-header">
        <div>
          <h1 class="admin-page-title">Laporan Pendapatan</h1>
          <p class="admin-page-subtitle">Ringkasan total pendapatan dari transaksi</p>
        </div>
      </div>
      <div class="stats-grid stagger-children" id="revenue-stats" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
        ${Components.skeletonStats(3)}
      </div>
      <div class="card" style="margin-top: var(--space-6);">
        <div class="card-header">
          <h3 class="card-title">Riwayat Pendapatan</h3>
        </div>
        <div id="revenue-table">
          ${Components.skeletonTable(5)}
        </div>
      </div>`;

    await loadRevenue();
  }

  async function loadRevenue() {
    if (!API.isConfigured()) return;

    try {
      let data = [];
      if (cachedData.transaksi && cachedData.transaksi.length > 0) {
        data = cachedData.transaksi;
      } else {
        const result = await API.Transaksi.getAll();
        if (result.success) {
          cachedData.transaksi = result.data;
          data = result.data;
        }
      }

      displayRevenue(data);
    } catch (error) {
      Components.toast('Gagal memuat data pendapatan', 'error');
    }
  }

  function displayRevenue(data) {
    let totalRevenue = 0;
    let thisMonthRevenue = 0;
    let todayRevenue = 0;
    
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const today = now.toDateString();

    const revenueList = [];

    data.forEach(t => {
      const amount = parseFloat(t.total_harga) || 0;
      if (amount > 0) {
        totalRevenue += amount;
        
        const tDate = new Date(t.tanggal_masuk);
        if (tDate.getMonth() === thisMonth && tDate.getFullYear() === thisYear) {
          thisMonthRevenue += amount;
        }
        if (tDate.toDateString() === today) {
          todayRevenue += amount;
        }

        revenueList.push({
          id: t.id_transaksi,
          pelanggan: t.nama_pelanggan,
          tanggal: t.tanggal_masuk,
          jumlah: amount,
          status: t.status
        });
      }
    });

    revenueList.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    const statsEl = document.getElementById('revenue-stats');
    if (statsEl) {
      statsEl.innerHTML = `
        ${Components.statsCard('💰', Components.formatCurrency(totalRevenue), 'Total Keseluruhan', 'stat-total-rev')}
        ${Components.statsCard('📅', Components.formatCurrency(thisMonthRevenue), 'Bulan Ini', 'stat-month-rev')}
        ${Components.statsCard('📈', Components.formatCurrency(todayRevenue), 'Hari Ini', 'stat-today-rev')}
      `;
    }

    const tableEl = document.getElementById('revenue-table');
    if (tableEl) {
      if (revenueList.length === 0) {
        tableEl.innerHTML = Components.emptyState('📉', 'Belum Ada Pendapatan', 'Belum ada transaksi yang menghasilkan pendapatan');
      } else {
        let html = `
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID Transaksi</th>
                  <th>Tanggal</th>
                  <th>Pelanggan</th>
                  <th>Status</th>
                  <th>Jumlah Pendapatan</th>
                </tr>
              </thead>
              <tbody>`;
        
        revenueList.forEach(r => {
          let statusColor = 'var(--text-secondary)';
          if (r.status === 'Selesai' || r.status === 'Diambil') statusColor = 'var(--accent-success)';
          if (r.status === 'Proses') statusColor = 'var(--accent-warning)';
          
          html += `
            <tr>
              <td><span class="table-id">${r.id}</span></td>
              <td style="font-size:var(--text-xs)">${Components.formatDate(r.tanggal)}</td>
              <td style="font-weight:500;">${r.pelanggan}</td>
              <td><span style="color:${statusColor}; font-weight:bold;">${r.status}</span></td>
              <td style="font-weight:600;color:var(--text-primary)">${Components.formatCurrency(r.jumlah)}</td>
            </tr>`;
        });
        
        html += `</tbody></table></div>`;
        tableEl.innerHTML = html;
      }
    }
  }

  // ======================== BIAYA (EXPENSES) ========================

  async function renderExpenses(container) {
    container.innerHTML = `
      <div class="admin-page-header">
        <div>
          <h1 class="admin-page-title">Manajemen Biaya</h1>
          <p class="admin-page-subtitle">Pencatatan pengeluaran operasional laundry</p>
        </div>
        <button class="btn btn-primary" onclick="AdminPage.showAddExpense()">+ Catat Biaya</button>
      </div>
      <div class="stats-grid stagger-children" id="expense-stats" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
        ${Components.skeletonStats(3)}
      </div>
      <div class="card" style="margin-top: var(--space-6);">
        <div class="card-header">
          <h3 class="card-title">Riwayat Pengeluaran</h3>
        </div>
        <div id="expense-table">
          ${Components.skeletonTable(5)}
        </div>
      </div>`;

    await loadExpenses();
  }

  async function loadExpenses() {
    try {
      const expensesJson = localStorage.getItem('laundry_expenses') || '[]';
      const expensesData = JSON.parse(expensesJson);
      displayExpenses(expensesData);
    } catch (error) {
      Components.toast('Gagal memuat data biaya', 'error');
    }
  }

  function displayExpenses(data) {
    let totalExpense = 0;
    let thisMonthExpense = 0;
    let todayExpense = 0;
    
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const today = now.toDateString();

    data.forEach(e => {
      const amount = parseFloat(e.jumlah) || 0;
      totalExpense += amount;
      
      const eDate = new Date(e.tanggal);
      if (eDate.getMonth() === thisMonth && eDate.getFullYear() === thisYear) {
        thisMonthExpense += amount;
      }
      if (eDate.toDateString() === today) {
        todayExpense += amount;
      }
    });

    data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    const statsEl = document.getElementById('expense-stats');
    if (statsEl) {
      statsEl.innerHTML = `
        ${Components.statsCard('💸', Components.formatCurrency(totalExpense), 'Total Keseluruhan', 'stat-total-exp')}
        ${Components.statsCard('📅', Components.formatCurrency(thisMonthExpense), 'Bulan Ini', 'stat-month-exp')}
        ${Components.statsCard('📈', Components.formatCurrency(todayExpense), 'Hari Ini', 'stat-today-exp')}
      `;
    }

    const tableEl = document.getElementById('expense-table');
    if (tableEl) {
      if (data.length === 0) {
        tableEl.innerHTML = Components.emptyState('📉', 'Belum Ada Pengeluaran', 'Klik tombol Catat Biaya untuk menambahkan pengeluaran');
      } else {
        let html = `
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th>Kategori</th>
                  <th>Jumlah</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>`;
        
        data.forEach(e => {
          html += `
            <tr>
              <td style="font-size:var(--text-xs)">${Components.formatDate(e.tanggal)}</td>
              <td style="font-weight:500;">${e.keterangan}</td>
              <td><span class="status-badge" style="background:var(--bg-secondary);color:var(--text-secondary)">${e.kategori}</span></td>
              <td style="font-weight:600;color:var(--accent-warning)">${Components.formatCurrency(e.jumlah)}</td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-ghost btn-icon" title="Hapus" onclick="AdminPage.confirmDeleteExpense('${e.id}')">🗑️</button>
                </div>
              </td>
            </tr>`;
        });
        
        html += `</tbody></table></div>`;
        tableEl.innerHTML = html;
      }
    }
  }

  function showAddExpense() {
    const body = `
      <form id="form-add-expense">
        <div class="form-group">
          <label class="form-label">Keterangan</label>
          <input type="text" class="form-input" id="exp-ket" required placeholder="Contoh: Beli deterjen">
        </div>
        <div class="form-group">
          <label class="form-label">Kategori</label>
          <select class="form-select" id="exp-kategori" required>
            <option value="Bahan Baku">Bahan Baku (Deterjen, Pewangi, dll)</option>
            <option value="Operasional">Operasional (Listrik, Air, Internet)</option>
            <option value="Gaji">Gaji Karyawan</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Jumlah (Rp)</label>
          <input type="number" class="form-input" id="exp-jumlah" required min="1" placeholder="Contoh: 50000">
        </div>
      </form>`;

    const footer = `
      <button class="btn btn-secondary" onclick="Components.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="AdminPage.submitExpense()">Simpan</button>`;

    Components.showModal('Catat Biaya Pengeluaran', body, footer);
  }

  function submitExpense() {
    const ket = document.getElementById('exp-ket').value.trim();
    const kategori = document.getElementById('exp-kategori').value;
    const jumlah = document.getElementById('exp-jumlah').value;

    if (!ket || !jumlah) {
      Components.toast('Keterangan dan Jumlah wajib diisi', 'warning');
      return;
    }

    const expensesJson = localStorage.getItem('laundry_expenses') || '[]';
    let expenses = [];
    try { expenses = JSON.parse(expensesJson); } catch(e) {}

    const newExpense = {
      id: 'EXP-' + Date.now(),
      tanggal: new Date().toISOString(),
      keterangan: ket,
      kategori: kategori,
      jumlah: parseFloat(jumlah)
    };

    expenses.push(newExpense);
    localStorage.setItem('laundry_expenses', JSON.stringify(expenses));

    Components.toast('Biaya berhasil dicatat', 'success');
    Components.closeModal();
    loadExpenses();
  }

  function confirmDeleteExpense(id) {
    Components.confirm('Yakin ingin menghapus catatan biaya ini?', () => {
      const expensesJson = localStorage.getItem('laundry_expenses') || '[]';
      let expenses = [];
      try { expenses = JSON.parse(expensesJson); } catch(e) {}

      expenses = expenses.filter(e => e.id !== id);
      localStorage.setItem('laundry_expenses', JSON.stringify(expenses));
      
      Components.toast('Biaya berhasil dihapus', 'success');
      loadExpenses();
    });
  }

  // ======================== PENGATURAN (SETTINGS) ========================

  async function renderSettings(container) {
    container.innerHTML = `
      <div class="admin-page-header">
        <div>
          <h1 class="admin-page-title">Pengaturan</h1>
          <p class="admin-page-subtitle">Konfigurasi sistem dan informasi toko</p>
        </div>
      </div>

      <!-- API Configuration -->
      <div class="card" style="margin-bottom: var(--space-6)">
        <div class="card-header">
          <h3 class="card-title">🔗 Konfigurasi API</h3>
        </div>
        <div class="card-body">
          <p style="color:var(--text-tertiary); margin-bottom:var(--space-4); font-size:var(--text-sm)">
            Masukkan URL Web App dari Google Apps Script yang telah di-deploy.
          </p>
          <div class="form-group">
            <label class="form-label">URL Google Apps Script Web App</label>
            <div class="input-group">
              <input type="url" class="form-input" id="setting-api-url"
                value="${API.getBaseUrl()}"
                placeholder="https://script.google.com/macros/s/.../exec">
              <button class="btn btn-primary" onclick="AdminPage.saveApiUrl()">Simpan</button>
            </div>
          </div>
          <div style="display:flex; gap:var(--space-3); margin-top:var(--space-4)">
            <button class="btn btn-secondary btn-sm" onclick="AdminPage.testApi()">🧪 Test Koneksi</button>
            <button class="btn btn-secondary btn-sm" onclick="AdminPage.initSheets()">📊 Inisialisasi Sheet</button>
          </div>
        </div>
      </div>

      <!-- Store Info -->
      <div class="card" id="store-settings">
        <div class="card-header">
          <h3 class="card-title">🏪 Informasi Toko</h3>
        </div>
        <div class="card-body">
          <div id="store-settings-form">
            ${Components.skeletonTable(3)}
          </div>
        </div>
      </div>`;

    await loadStoreSettings();
  }

  async function loadStoreSettings() {
    if (!API.isConfigured()) {
      const el = document.getElementById('store-settings-form');
      if (el) el.innerHTML = '<p style="color:var(--text-tertiary);text-align:center;padding:var(--space-6)">Konfigurasi API terlebih dahulu</p>';
      return;
    }

    try {
      const result = await API.Pengaturan.get();
      if (result.success) {
        const d = result.data;
        const el = document.getElementById('store-settings-form');
        if (el) {
          el.innerHTML = `
            <div class="form-group">
              <label class="form-label">Nama Toko</label>
              <input type="text" class="form-input" id="set-nama" value="${d.nama_toko || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Alamat</label>
              <input type="text" class="form-input" id="set-alamat" value="${d.alamat_toko || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">No. Telepon</label>
              <input type="text" class="form-input" id="set-telp" value="${d.no_telp || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Jam Buka</label>
              <input type="text" class="form-input" id="set-jam" value="${d.jam_buka || ''}">
            </div>
            <button class="btn btn-primary" onclick="AdminPage.saveStoreSettings()" style="margin-top:var(--space-4)">💾 Simpan Pengaturan</button>`;
        }
      }
    } catch (error) {
      Components.toast('Gagal memuat pengaturan', 'error');
    }
  }

  function saveApiUrl() {
    const url = document.getElementById('setting-api-url').value.trim();
    if (!url) {
      Components.toast('URL tidak boleh kosong', 'warning');
      return;
    }
    API.setBaseUrl(url);
    Components.toast('URL API berhasil disimpan!', 'success');
  }

  async function testApi() {
    if (!API.isConfigured()) {
      Components.toast('Simpan URL API terlebih dahulu', 'warning');
      return;
    }

    try {
      Components.toast('Testing koneksi...', 'info');
      const result = await API.Layanan.getAll();
      if (result.success) {
        Components.toast('✅ Koneksi berhasil! API berfungsi dengan baik.', 'success');
      } else {
        Components.toast('❌ Response error: ' + (result.message || 'Unknown'), 'error');
      }
    } catch (error) {
      Components.toast('❌ Koneksi gagal: ' + error.message, 'error');
    }
  }

  async function initSheets() {
    if (!API.isConfigured()) {
      Components.toast('Simpan URL API terlebih dahulu', 'warning');
      return;
    }

    try {
      Components.toast('Menginisialisasi sheets...', 'info');
      const result = await API.Init.sheets();
      if (result.success) {
        Components.toast('✅ Sheets berhasil diinisialisasi!', 'success');
      } else {
        Components.toast('❌ Gagal: ' + (result.message || 'Unknown'), 'error');
      }
    } catch (error) {
      Components.toast('❌ Gagal inisialisasi: ' + error.message, 'error');
    }
  }

  async function saveStoreSettings() {
    const fields = [
      { key: 'nama_toko', el: 'set-nama' },
      { key: 'alamat_toko', el: 'set-alamat' },
      { key: 'no_telp', el: 'set-telp' },
      { key: 'jam_buka', el: 'set-jam' }
    ];

    try {
      for (const field of fields) {
        const value = document.getElementById(field.el).value.trim();
        await API.Pengaturan.update(field.key, value);
      }
      Components.toast('Pengaturan berhasil disimpan!', 'success');
    } catch (error) {
      Components.toast('Gagal menyimpan pengaturan', 'error');
    }
  }

  function logout() {
    sessionStorage.removeItem('admin_authenticated');
    render();
  }

  // ======================== PUBLIC API ========================

  return {
    render,
    switchTab,
    toggleSidebar,
    handleStatusChange,
    confirmDeleteTransaksi,
    showAddTransaksi,
    submitTransaksi,
    showAddPelanggan,
    submitPelanggan,
    showEditPelanggan,
    updatePelanggan,
    confirmDeletePelanggan,
    showAddLayanan,
    submitLayanan,
    showEditLayanan,
    updateLayanan,
    confirmDeleteLayanan,
    filterOrders,
    filterByStatus,
    filterCustomers,
    saveApiUrl,
    testApi,
    initSheets,
    saveStoreSettings,
    logout,
    showAddExpense,
    submitExpense,
    confirmDeleteExpense
  };
})();
