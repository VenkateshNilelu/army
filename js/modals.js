/**
 * Shared Modal Logic for Service Details, Personal Details, Update Password
 */

function createModal(id, title, content) {
    const existing = document.getElementById(id + 'Overlay');
    if (existing) return existing;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = id + 'Overlay';
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" data-close="${id}">&times;</button>
            </div>
            <div class="modal-body">${content}</div>
        </div>
    `;
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.dataset.close) closeModal(id);
    });
    document.body.appendChild(overlay);
    return overlay;
}

function openModal(id) {
    const overlay = document.getElementById(id + 'Overlay') || document.querySelector(`[data-modal="${id}"]`)?.closest('.modal-overlay');
    if (overlay) overlay.classList.add('active');
}

function closeModal(id) {
    const overlay = document.getElementById(id + 'Overlay') || document.querySelector(`.modal-overlay[data-id="${id}"]`);
    document.querySelectorAll('.modal-overlay').forEach(o => {
        if (o.classList.contains('active') && (!id || o.id === id + 'Overlay' || o.dataset.id === id)) o.classList.remove('active');
    });
}

function initCommonModals(session) {
    if (!session) return;

    const serviceDetailsContent = `
        <p><strong>Service ID:</strong> ${session.serviceId}</p>
        <p><strong>Rank:</strong> ${session.rank}</p>
        <p><strong>Battalion:</strong> ${session.battalion || '-'}</p>
        <p><strong>Joining Date:</strong> ${session.joiningDate || '-'}</p>
    `;

    const personalDetailsContent = `
        <form id="personalDetailsForm">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="pdName" value="${session.name || ''}">
            </div>
            <div class="form-group">
                <label>Mobile</label>
                <input type="tel" id="pdMobile" value="${session.mobile || ''}" maxlength="10">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="pdEmail" value="${session.email || ''}">
            </div>
            <div class="form-group">
                <label>Address</label>
                <input type="text" id="pdAddress" value="${session.address || ''}">
            </div>
            <button type="submit" class="btn btn-primary">Save</button>
        </form>
    `;

    const updatePasswordContent = `
        <form id="updatePasswordForm">
            <div class="form-group">
                <label>Current Password</label>
                <input type="password" id="oldPass" required>
            </div>
            <div class="form-group">
                <label>New Password</label>
                <input type="password" id="newPass" required minlength="6">
            </div>
            <div class="form-group">
                <label>Confirm Password</label>
                <input type="password" id="confirmPass" required>
            </div>
            <button type="submit" class="btn btn-primary">Update</button>
        </form>
    `;

    createModal('serviceDetails', 'Service Details', serviceDetailsContent);
    createModal('personalDetails', 'Personal Details', personalDetailsContent);
    createModal('updatePassword', 'Update Password', updatePasswordContent);

    document.querySelectorAll('[data-modal="serviceDetails"]').forEach(el => {
        el.addEventListener('click', (e) => { e.preventDefault(); openModal('serviceDetails'); });
    });
    document.querySelectorAll('[data-modal="personalDetails"]').forEach(el => {
        el.addEventListener('click', (e) => { e.preventDefault(); openModal('personalDetails'); });
    });
    document.querySelectorAll('[data-modal="updatePassword"]').forEach(el => {
        el.addEventListener('click', (e) => { e.preventDefault(); openModal('updatePassword'); });
    });

    document.getElementById('personalDetailsForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const updates = {
            name: document.getElementById('pdName').value,
            mobile: document.getElementById('pdMobile').value,
            email: document.getElementById('pdEmail').value,
            address: document.getElementById('pdAddress').value
        };
        DataStorage.updateUser(session.id, updates);
        DataStorage.setSession({ ...session, ...updates });
        App.setupDashboardCommon?.();
        closeModal('personalDetails');
        alert('Details updated.');
    });

    document.getElementById('updatePasswordForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const old = document.getElementById('oldPass').value;
        const neu = document.getElementById('newPass').value;
        const conf = document.getElementById('confirmPass').value;
        if (session.password !== old) { alert('Current password incorrect'); return; }
        if (neu !== conf) { alert('Passwords do not match'); return; }
        DataStorage.updateUser(session.id, { password: neu });
        DataStorage.setSession({ ...session, password: neu });
        closeModal('updatePassword');
        alert('Password updated.');
    });
}
