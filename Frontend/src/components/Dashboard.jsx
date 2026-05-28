import { useState, useEffect } from 'react';
import { api } from '../api';

const Dashboard = ({ onLogout }) => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;
  const [sortCol, setSortCol] = useState('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [modals, setModals] = useState({
    form: false,
    delete: false,
    view: false,
    logout: false
  });

  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');

  // Theme logic (inherited from App)
  const [isDark, setIsDark] = useState(document.documentElement.getAttribute('data-theme') === 'dark');
  const [isSenior, setIsSenior] = useState(true);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    setIsDark(!isDark);
  };

  const showToast = (msg, type = 'green') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // API Loader
  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const data = await api.fetchSubmissions(searchTerm, statusFilter);
      setContacts(data);
    } catch (err) {
      console.error("Failed to load submissions:", err);
      showToast(err.message || 'Failed to fetch enquiries.', 'red');
      if (err.status === 401) {
        // Redirection on expired/invalid JWT token
        setTimeout(() => onLogout(), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [searchTerm, statusFilter]);

  const formatDate = (d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const initials = (name) => {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  };

  const getFiltered = () => {
    return contacts.filter(c => {
      const q = searchTerm.toLowerCase().trim();
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.whatsapp.includes(q);
      const matchS = statusFilter === 'all' || c.status === statusFilter;
      return matchQ && matchS;
    });
  };

  const getSorted = (arr) => {
    return [...arr].sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
  };

  const filtered = getSorted(getFiltered());
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (col) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
    setCurrentPage(1);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.fName.value.trim();
    const email = form.fEmail.value.trim();
    const whatsapp = form.fWhatsapp.value.trim();
    const desc = form.fDesc.value.trim();
    const status = form.fStatus.value;

    // Field-level input validation matching backend schemas
    if (!name) {
      showToast('Name is required.', 'red');
      return;
    }
    if (name.length < 2 || name.length > 100) {
      showToast('Name must be between 2 and 100 characters.', 'red');
      return;
    }

    if (!email) {
      showToast('Email address is required.', 'red');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'red');
      return;
    }

    if (!whatsapp) {
      showToast('WhatsApp number is required.', 'red');
      return;
    }
    const phonePattern = /^\+?[\d\s\-()]{10,20}$/;
    if (!phonePattern.test(whatsapp)) {
      showToast('WhatsApp number must contain 10-20 valid characters (digits, spaces, -, +, ()).', 'red');
      return;
    }
    const digitCount = whatsapp.replace(/\D/g, '').length;
    if (digitCount < 10) {
      showToast('WhatsApp number must contain at least 10 digits.', 'red');
      return;
    }

    if (!desc) {
      showToast('Description is required.', 'red');
      return;
    }
    if (desc.length < 10 || desc.length > 1000) {
      showToast('Description must be between 10 and 1000 characters.', 'red');
      return;
    }
    if (!/[a-zA-Z]/.test(desc)) {
      showToast('Description must contain descriptive letters/words.', 'red');
      return;
    }

    try {
      if (editData) {
        // Update live database entry
        await api.updateSubmission(editData.id, {
          name,
          email,
          whatsapp,
          description: desc,
          status
        });
        showToast('Entry updated successfully.', 'amber');
      } else {
        // Create new entry
        await api.submitContactForm({
          fName: name,
          fEmail: email,
          fWA: whatsapp,
          fDesc: desc
        });
        showToast('New entry added successfully.', 'green');
      }
      await loadContacts(); // Reload DB list
      setModals({ ...modals, form: false });
      setEditData(null);
    } catch (err) {
      console.error("Operation failed:", err);
      if (err.errors) {
        showToast(Object.values(err.errors).join(' '), 'red');
      } else {
        showToast(err.detail || 'Failed to save entry.', 'red');
      }
    }
  };

  const openEdit = (contact) => {
    setEditData(contact);
    setModals({ ...modals, form: true });
  };

  const openDelete = (id) => {
    setDeleteTarget(contacts.find(c => c.id === id));
    setModals({ ...modals, delete: true });
  };

  const confirmDelete = async () => {
    try {
      await api.deleteSubmission(deleteTarget.id);
      showToast('Entry deleted permanently.', 'red');
      await loadContacts(); // Reload DB list
      setModals({ ...modals, delete: false });
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete operation failed:", err);
      showToast(err.detail || 'Failed to delete entry.', 'red');
    }
  };

  const openView = (contact) => {
    setViewTarget(contact);
    setModals({ ...modals, view: true });
  };

  const openAdd = () => {
    setEditData(null);
    setModals({ ...modals, form: true });
  };

  const words = [
    { lines: ['Get', 'In Touch'], senior: true },
    { lines: ['Full', 'Details'], senior: false }
  ];

  useEffect(() => {
    let wIdx = 0;
    let char = 0;
    let deleting = false;
    let timeoutId;

    const tick = () => {
      const w = words[wIdx];
      const total = w.lines.join('').length;

      if (!deleting) {
        char++;
        let rem = char;
        const newLine1 = rem >= w.lines[0].length ? w.lines[0] : w.lines[0].slice(0, rem);
        rem -= newLine1.length;
        const newLine2 = rem > 0 ? w.lines[1].slice(0, rem) : '';

        setLine1(newLine1);
        setLine2(newLine2);

        if (char === total) {
          timeoutId = setTimeout(() => { deleting = true; tick(); }, 1800);
          return;
        }
        timeoutId = setTimeout(tick, 110);
      } else {
        char--;
        let rem = char;
        const newLine1 = rem >= w.lines[0].length ? w.lines[0] : w.lines[0].slice(0, rem);
        rem -= newLine1.length;
        const newLine2 = rem > 0 ? w.lines[1].slice(0, rem) : '';

        setLine1(newLine1);
        setLine2(newLine2);

        if (char === 0) {
          deleting = false;
          wIdx = (wIdx + 1) % words.length;
          setIsSenior(words[wIdx].senior);
          timeoutId = setTimeout(tick, 400);
          return;
        }
        timeoutId = setTimeout(tick, 60);
      }
    };

    timeoutId = setTimeout(tick, 800);
    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <div className="dashboard-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ===== PAGE HEADER ===== */}
      <div className="page-header">
        <div className="page-header-left">
          <p className="section-label">// Dashboard</p>
          <h1 className="page-title" style={{ minHeight: '2.1em', fontWeight: 'bold' }}>
            <div style={{ display: 'flex', alignItems: 'center', minHeight: '1.1em' }}>
              <span className={isSenior ? 'white-text' : 'accent'}>{line1}</span>
              {line2 === '' && <span className="blink-cursor" style={{ fontWeight: 'normal' }}>|</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', minHeight: '1.1em' }}>
              <span className="accent">{line2}</span>
              {line2 !== '' && <span className="blink-cursor" style={{ fontWeight: 'normal' }}>|</span>}
            </div>
          </h1>
          <p className="page-meta">All enquiries submitted via <em>portfolio contact form</em></p>
        </div>
      </div>

      {/* ===== STATS STRIP ===== */}
      <div className="stats-strip">
        <div className="stat-card">
          <div className="stat-label">total enquiries</div>
          <div className="stat-number">{contacts.length}</div>
          <div className="stat-sub">all time</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">new / unread</div>
          <div className="stat-number green">{contacts.filter(c => c.status === 'new').length}</div>
          <div className="stat-sub">awaiting reply</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">urgent</div>
          <div className="stat-number amber">{contacts.filter(c => c.status === 'urgent').length}</div>
          <div className="stat-sub">high priority</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">read</div>
          <div className="stat-number">{contacts.filter(c => c.status === 'read').length}</div>
          <div className="stat-sub">reviewed</div>
        </div>
      </div>

      {/* ===== DASHBOARD BODY ===== */}
      <div className="dashboard-body" style={{ flex: 1 }}>
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                className="search-input"
                placeholder="search_name, email..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">// all status</option>
              <option value="new">new</option>
              <option value="urgent">urgent</option>
              <option value="read">read</option>
            </select>
          </div>
          <button className="btn-add" onClick={openAdd}>
            <span>+</span> Add Entry
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className={sortCol === 'id' ? 'sorted' : ''}>
                  Id<span className="sort-icon">{sortCol === 'id' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
                </th>
                <th onClick={() => handleSort('name')} className={sortCol === 'name' ? 'sorted' : ''}>
                  Name<span className="sort-icon">{sortCol === 'name' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
                </th>
                <th onClick={() => handleSort('email')} className={`col-hide ${sortCol === 'email' ? 'sorted' : ''}`}>
                  Email ID<span className="sort-icon">{sortCol === 'email' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
                </th>
                <th onClick={() => handleSort('whatsapp')} className={`col-hide ${sortCol === 'whatsapp' ? 'sorted' : ''}`}>
                  WhatsApp<span className="sort-icon">{sortCol === 'whatsapp' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
                </th>
                <th className="col-hide">Description</th>
                <th onClick={() => handleSort('status')} className={sortCol === 'status' ? 'sorted' : ''}>
                  Status<span className="sort-icon">{sortCol === 'status' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
                </th>
                <th onClick={() => handleSort('date')} className={`col-hide ${sortCol === 'date' ? 'sorted' : ''}`}>
                  Date<span className="sort-icon">{sortCol === 'date' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
                </th>
                <th style={{ textAlign: 'center' }}>Update</th>
                <th style={{ textAlign: 'center' }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {slice.map(c => (
                <tr key={c.id} onClick={() => openView(c)} style={{ cursor: 'pointer' }}>
                  <td className="td-id">#{String(c.id).padStart(3, '0')}</td>
                  <td className="td-name">{c.name}</td>
                  <td className="col-hide">{c.email}</td>
                  <td className="col-hide" style={{ fontFamily: "'Fira Code', monospace", fontSize: '12px' }}>{c.whatsapp}</td>
                  <td className="td-desc col-hide" title={c.description}>{c.description || '—'}</td>
                  <td>
                    <span className={`badge ${c.status === 'new' ? 'new' : c.status === 'urgent' ? 'urgent' : 'read'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="col-hide" style={{ fontFamily: "'Fira Code', monospace", fontSize: '11px', color: 'var(--text-mid)' }}>
                    {formatDate(c.date)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="btn-action-update" onClick={(e) => { e.stopPropagation(); openEdit(c); }}>✎ Update</button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="btn-action-delete" onClick={(e) => { e.stopPropagation(); openDelete(c.id); }}>⌫ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {slice.length === 0 && (
            <div className="empty-state show">
              <div className="empty-icon">📭</div>
              <p className="empty-title">// no_entries_found</p>
              <p className="empty-sub">No enquiries match your filter or search.</p>
            </div>
          )}

          {slice.length > 0 && (
            <div className="pagination">
              <span className="page-info">
                // showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="page-btns">
                <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>←</button>
                {Array.from({ length: pages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button className="page-btn" disabled={currentPage === pages} onClick={() => setCurrentPage(prev => prev + 1)}>→</button>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* ===== ADD / EDIT MODAL ===== */}
      {modals.form && (
        <div className="modal-overlay open" onClick={(e) => e.target.classList.contains('modal-overlay') && setModals({ ...modals, form: false })}>
          <div className="modal-box">
            <div className="modal-header">
              <p className="modal-title">{editData ? 'Edit' : 'Add'} <span>entry_</span></p>
              <button className="modal-close" onClick={() => setModals({ ...modals, form: false })}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label" htmlFor="fName">full_name *</label>
                    <input className="field-input" id="fName" name="fName" type="text" defaultValue={editData?.name || ''} required />
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="fStatus">status</label>
                    <select className="field-input filter-select" id="fStatus" name="fStatus" defaultValue={editData?.status || 'new'} style={{ padding: '10px 14px', width: '100%' }}>
                      <option value="new">new</option>
                      <option value="urgent">urgent</option>
                      <option value="read">read</option>
                    </select>
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="fEmail">email_address *</label>
                  <input className="field-input" id="fEmail" name="fEmail" type="email" defaultValue={editData?.email || ''} required />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="fWhatsapp">whatsapp_number *</label>
                  <input className="field-input" id="fWhatsapp" name="fWhatsapp" type="tel" defaultValue={editData?.whatsapp || ''} required />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="fDesc">description</label>
                  <textarea className="field-textarea" id="fDesc" name="fDesc" defaultValue={editData?.description || ''}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setModals({ ...modals, form: false })}>Cancel</button>
                <button type="submit" className="btn-save">Save →</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {modals.delete && (
        <div className="modal-overlay open" onClick={(e) => e.target.classList.contains('modal-overlay') && setModals({ ...modals, delete: false })}>
          <div className="del-modal-box">
            <div className="del-icon">⚠</div>
            <p className="del-title">delete_entry?</p>
            <p className="del-sub">This will permanently remove <strong>{deleteTarget?.name}</strong> from your enquiries. This cannot be undone.</p>
            <div className="del-actions">
              <button className="btn-cancel" onClick={() => setModals({ ...modals, delete: false })}>cancel</button>
              <button className="btn-del-confirm" onClick={confirmDelete}>delete →</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== VIEW MODAL ===== */}
      {modals.view && (
        <div className="modal-overlay open" onClick={(e) => e.target.classList.contains('modal-overlay') && setModals({ ...modals, view: false })}>
          <div className="view-modal-box">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="view-avatar">{initials(viewTarget.name)}</div>
                <div>
                  <p className="modal-title">{viewTarget.name}</p>
                  <p style={{ fontFamily: "'Fira Code',monospace", fontSize: '11px', color: 'var(--text-mid)', marginTop: '2px' }}>// status: {viewTarget.status}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setModals({ ...modals, view: false })}>✕</button>
            </div>
            <div className="view-body">
              <div className="view-row"><span className="view-key">email_address</span><span className="view-val mono">{viewTarget.email}</span></div>
              <div className="view-row"><span className="view-key">whatsapp</span><span className="view-val mono">{viewTarget.whatsapp}</span></div>
              <div className="view-row"><span className="view-key">description</span><span className="view-val">{viewTarget.description || '—'}</span></div>
              <div className="view-row"><span className="view-key">date_received</span><span className="view-val mono">{formatDate(viewTarget.date)}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ===== LOGOUT MODAL ===== */}
      {modals.logout && (
        <div className="modal-overlay open" onClick={(e) => e.target.classList.contains('modal-overlay') && setModals({ ...modals, logout: false })}>
          <div className="logout-modal-box">
            <div className="del-icon" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>⏻</div>
            <p className="del-title">sign_out?</p>
            <p className="del-sub" style={{ marginBottom: '1.75rem' }}>You'll be returned to the portfolio homepage.</p>
            <div className="del-actions">
              <button className="btn-cancel" onClick={() => setModals({ ...modals, logout: false })}>stay</button>
              <button className="btn-save" onClick={() => { onLogout(); setModals({ ...modals, logout: false }); }}>logout →</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== TOAST CONTAINER ===== */}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span className="toast-icon">{t.type === 'green' ? '✓' : t.type === 'red' ? '✕' : '⚡'}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
