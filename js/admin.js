/**
 * Admin Dashboard Logic
 */

(function() {
    const session = Auth.requireRole(['Admin']);
    if (!session) return;

    DataStorage.init();
    App.setupDashboardCommon();

    document.getElementById('sideMenuRank').textContent = session.rank;
    document.getElementById('sideMenuServiceId').textContent = session.serviceId;

    document.getElementById('hamburgerBtn')?.addEventListener('click', () => App.toggleSideMenu());

    initCommonModals(session);

    function loadAnalytics() {
        const users = DataStorage.getUsers();
        const byRole = {};
        users.forEach(u => {
            byRole[u.rank] = (byRole[u.rank] || 0) + 1;
        });
        const leaves = DataStorage.getLeaves();
        const thisMonth = new Date().toISOString().slice(0, 7);
        const monthlyLeaves = leaves.filter(l => (l.startDate || '').slice(0, 7) === thisMonth).length;
        const salaries = DataStorage.getSalaries();
        const paidCount = salaries.filter(s => s.status === 'Paid').length;

        document.getElementById('statTotalUsers').textContent = users.length;
        document.getElementById('statByRole').textContent = Object.entries(byRole).map(([r, c]) => `${r}: ${c}`).join(', ');
        document.getElementById('statLeaves').textContent = monthlyLeaves;
        document.getElementById('statSalary').textContent = paidCount;
    }

    loadAnalytics();

    function showModal(title, content) {
        const id = 'adminModal';
        let overlay = document.getElementById(id + 'Overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.id = id + 'Overlay';
            overlay.innerHTML = `<div class="modal" style="max-width:1100px; width:95%;"><div class="modal-header"><h3></h3><button class="modal-close">&times;</button></div><div class="modal-body"></div></div>`;
            overlay.querySelector('.modal-close').onclick = () => overlay.classList.remove('active');
            overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove('active'); };
            document.body.appendChild(overlay);
        }
        overlay.querySelector('.modal-header h3').textContent = title;
        overlay.querySelector('.modal-body').innerHTML = content;
        overlay.classList.add('active');
    }

    const viewUsersContent = () => {
        const users = DataStorage.getUsers();
        const search = document.getElementById('userSearch')?.value || '';
        const filtered = users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.serviceId.toLowerCase().includes(search.toLowerCase()));
        return `
            <div class="form-group" style="margin-bottom:1rem;">
                <input type="text" id="userSearch" placeholder="Search by name or service ID" style="width:100%;">
            </div>
            <table class="data-table">
                <thead><tr><th>Service ID</th><th>Name</th><th>Rank</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                ${filtered.map(u => `
                    <tr>
                        <td>${u.serviceId}</td><td>${u.name}</td><td>${u.rank}</td><td>${u.email}</td>
                        <td><span class="badge badge-${u.blocked ? 'danger' : 'success'}">${u.blocked ? 'Blocked' : 'Active'}</span></td>
                        <td>
                            <button class="btn btn-sm ${u.blocked ? 'btn-success' : 'btn-danger'}" data-user-id="${u.id}" data-action="${u.blocked ? 'unblock' : 'block'}">${u.blocked ? 'Unblock' : 'Block'}</button>
                            <button class="btn btn-sm btn-primary" data-user-id="${u.id}" data-action="reset">Reset Password</button>
                        </td>
                    </tr>
                `).join('')}
                </tbody>
            </table>
        `;
    };

    const systemLogsContent = () => {
        const logs = StaticData.getLogs().slice(0, 100);
        if (logs.length === 0) return '<p>No system logs available.</p>';
        return `
            <div class="table-container" style="max-height:500px;overflow:auto;">
                <table class="data-table">
                    <thead><tr><th>Time</th><th>Action</th><th>Details</th></tr></thead>
                    <tbody>
                    ${logs.map(l => `<tr><td>${new Date(l.timestamp).toLocaleString('en-IN')}</td><td><span class="badge badge-info" style="background:#4a90e2; color:white; padding:0.25rem 0.5rem; border-radius:4px;">${l.action}</span></td><td>${l.details}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
    };

    const dashboardAnalyticsContent = () => {
        loadAnalytics();
        return `<p>See analytics overview above.</p><p>Total Users: ${DataStorage.getUsers().length}</p><p>Total Leaves: ${DataStorage.getLeaves().length}</p><p>Total Transfers: ${DataStorage.getTransfers().length}</p>`;
    };

    document.querySelectorAll('.action-card[data-modal]').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const m = card.dataset.modal;
            if (m === 'viewUsers') {
                showModal('All Users', viewUsersContent());
                document.getElementById('userSearch')?.addEventListener('input', () => {
                    showModal('All Users', viewUsersContent());
                    bindUserActions();
                });
                bindUserActions();
            } else if (m === 'systemLogs') showModal('System Logs', systemLogsContent());
            else if (m === 'dashboardAnalytics') showModal('Analytics', dashboardAnalyticsContent());
        });
    });

    function bindUserActions() {
        document.querySelectorAll('[data-action="block"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const uid = this.dataset.userId;
                DataStorage.updateUser(uid, { blocked: true });
                DataStorage.addLog('USER_BLOCK', `User ${uid} blocked`);
                showModal('All Users', viewUsersContent());
                bindUserActions();
            });
        });
        document.querySelectorAll('[data-action="unblock"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const uid = this.dataset.userId;
                DataStorage.updateUser(uid, { blocked: false });
                DataStorage.addLog('USER_UNBLOCK', `User ${uid} unblocked`);
                showModal('All Users', viewUsersContent());
                bindUserActions();
            });
        });
        document.querySelectorAll('[data-action="reset"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const uid = this.dataset.userId;
                const newPass = 'reset123';
                DataStorage.updateUser(uid, { password: newPass });
                DataStorage.addLog('PASSWORD_RESET', `Password reset for ${uid}`);
                alert(`Password reset to: ${newPass}`);
            });
        });
    }
})();
