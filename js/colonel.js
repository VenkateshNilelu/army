/**
 * Colonel Dashboard Logic
 */

(function() {
    const session = Auth.requireRole(['Colonel']);
    if (!session) return;

    DataStorage.init();
    App.setupDashboardCommon();

    document.getElementById('sideMenuRank').textContent = session.rank;
    document.getElementById('sideMenuServiceId').textContent = session.serviceId;

    document.getElementById('hamburgerBtn')?.addEventListener('click', () => App.toggleSideMenu());

    initCommonModals(session);

    const battalions = () => DataStorage.getBattalions().filter(b => b.coId === session.id);
    const lieutenants = () => DataStorage.getUsers().filter(u => u.rank === 'Lieutenant' && battalions().some(b => b.id === u.battalion));

    function showModal(title, content) {
        const id = 'colModal';
        let overlay = document.getElementById(id + 'Overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.id = id + 'Overlay';
            overlay.innerHTML = `<div class="modal"><div class="modal-header"><h3></h3><button class="modal-close">&times;</button></div><div class="modal-body"></div></div>`;
            overlay.querySelector('.modal-close').onclick = () => overlay.classList.remove('active');
            overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove('active'); };
            document.body.appendChild(overlay);
        }
        overlay.querySelector('.modal-header h3').textContent = title;
        overlay.querySelector('.modal-body').innerHTML = content;
        overlay.classList.add('active');
    }

    const battalionsContent = () => {
        const bats = battalions();
        if (bats.length === 0) return '<p>No battalions under your command.</p>';
        let html = '<table class="data-table"><thead><tr><th>Battalion</th><th>Location</th><th>Lieutenant</th></tr></thead><tbody>';
        bats.forEach(b => {
            const lt = DataStorage.getUsers().find(u => u.battalion === b.id && u.rank === 'Lieutenant');
            html += `<tr><td>${b.name}</td><td>${b.location}</td><td>${lt?.name || '-'}</td></tr>`;
        });
        return html + '</tbody></table>';
    };

    const lieutenantOverviewContent = () => {
        const lts = lieutenants();
        let html = '<table class="data-table"><thead><tr><th>Lieutenant</th><th>Battalion</th><th>Soldiers</th><th>View</th></tr></thead><tbody>';
        lts.forEach(lt => {
            const count = DataStorage.getUsers().filter(u => u.reportsTo === lt.id || (u.rank === 'Soldier' && u.battalion === lt.battalion)).length;
            html += `<tr><td>${lt.name}</td><td>${lt.battalion}</td><td>${count}</td><td><button class="btn btn-primary btn-sm" data-lt-id="${lt.id}">View Soldiers</button></td></tr>`;
        });
        html += '</tbody></table>';
        return html;
    };

    const transferRequestsContent = () => {
        const transfers = DataStorage.getTransfers().filter(t => t.status === 'Pending' && (t.commandingOfficer === session.id || t.to && DataStorage.getBattalions().find(b => b.id === t.to)?.coId === session.id));
        if (transfers.length === 0) return '<p>No pending transfer requests.</p>';
        let html = '<table class="data-table"><thead><tr><th>Soldier</th><th>From</th><th>To</th><th>Reason</th><th>Action</th></tr></thead><tbody>';
        transfers.forEach(t => {
            html += `<tr>
                <td>${t.soldierName || t.soldierId}</td><td>${t.from}</td><td>${t.to}</td><td>${t.reason}</td>
                <td><button class="btn btn-success btn-sm" data-tr-id="${t.id}" data-action="approve">Approve</button>
                <button class="btn btn-danger btn-sm" data-tr-id="${t.id}" data-action="reject">Reject</button></td>
            </tr>`;
        });
        return html + '</tbody></table>';
    };

    const transferOrderContent = () => {
        const lts = lieutenants();
        const bats = DataStorage.getBattalions();
        let html = `<form id="colTransferForm">
            <div class="form-group"><label>Lieutenant</label>
            <select id="colLt" required><option value="">-- Select --</option>`;
        lts.forEach(l => { html += `<option value="${l.id}">${l.name} (${l.battalion})</option>`; });
        html += `</select></div>
            <div class="form-group"><label>Reason</label><input type="text" id="colTrReason" required></div>
            <div class="form-group"><label>Transfer To Battalion</label>
            <select id="colTrTo"><option value="">-- Select --</option>`;
        bats.forEach(b => { html += `<option value="${b.id}">${b.name}</option>`; });
        html += `</select></div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>`;
        return html;
    };

    const transferHistoryContent = () => {
        const transfers = StaticData.getTransfersByColonel(session.id);
        if (transfers.length === 0) return '<p>No transfer history.</p>';
        let table = '<table class="data-table"><thead><tr><th>From</th><th>To</th><th>Reason</th><th>Date</th><th>Status</th></tr></thead><tbody>';
        transfers.forEach(t => {
            table += `<tr><td>${t.from}</td><td>${t.to}</td><td>${t.reason}</td><td>${t.date}</td><td><span class="badge badge-${t.status === 'Approved' ? 'success' : t.status === 'Rejected' ? 'danger' : 'warning'}">${t.status}</span></td></tr>`;
        });
        return table + '</tbody></table>';
    };

    const salaryContent = () => {
        const salaries = StaticData.getSalariesByColonel(session.id);
        if (salaries.length === 0) return '<p>No salary information available.</p>';
        let html = '<table class="data-table"><thead><tr><th>Month</th><th>Amount</th><th>Status</th></tr></thead><tbody>';
        salaries.forEach(s => {
            const monthDate = new Date(s.month + '-01');
            const monthStr = monthDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });
            html += `<tr><td>${monthStr}</td><td>₹${s.total.toLocaleString('en-IN')}</td><td><span class="badge badge-${s.status === 'Paid' ? 'success' : 'warning'}">${s.status}</span></td></tr>`;
        });
        return html + '</tbody></table>';
    };

    document.querySelectorAll('.action-card[data-modal]').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const m = card.dataset.modal;
            if (m === 'battalions') showModal('Battalions', battalionsContent());
            else if (m === 'lieutenantOverview') {
                showModal('Lieutenant Overview', lieutenantOverviewContent());
                document.querySelectorAll('[data-lt-id]').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const ltId = this.dataset.ltId;
                        const soldiers = DataStorage.getUsers().filter(u => u.reportsTo === ltId || (u.rank === 'Soldier' && u.battalion === DataStorage.getUser(ltId)?.battalion));
                        let tbl = '<table class="data-table"><thead><tr><th>Service ID</th><th>Name</th></tr></thead><tbody>';
                        soldiers.forEach(s => { tbl += `<tr><td>${s.serviceId}</td><td>${s.name}</td></tr>`; });
                        showModal('Soldiers', tbl + '</tbody></table>');
                    });
                });
            } else if (m === 'transferRequests') {
                showModal('Transfer Requests', transferRequestsContent());
                document.querySelectorAll('[data-action="approve"]').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const tid = this.dataset.trId;
                        const tr = DataStorage.getTransfers().find(t => t.id === tid);
                        if (tr) {
                            DataStorage.updateTransfer(tid, { status: 'Approved' });
                            DataStorage.addNotification(tr.soldierId, 'Transfer Ordered', 'Transfer Approved', `Your transfer has been approved`);
                        }
                        showModal('Transfer Requests', transferRequestsContent());
                    });
                });
                document.querySelectorAll('[data-action="reject"]').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const tid = this.dataset.trId;
                        DataStorage.updateTransfer(tid, { status: 'Rejected' });
                        showModal('Transfer Requests', transferRequestsContent());
                    });
                });
            } else if (m === 'salaryOverview') showModal('Salary Overview', salaryContent());
            else if (m === 'transferOrder') {
                showModal('Transfer Order', transferOrderContent());
                document.getElementById('colTransferForm')?.addEventListener('submit', (ev) => {
                    ev.preventDefault();
                    const lt = DataStorage.getUser(document.getElementById('colLt').value);
                    if (!lt) return;
                    DataStorage.addTransfer({
                        soldierId: lt.id,
                        soldierName: lt.name,
                        lieutenantId: lt.id,
                        from: lt.battalion,
                        to: document.getElementById('colTrTo').value,
                        reason: document.getElementById('colTrReason').value,
                        commandingOfficer: session.id,
                        status: 'Approved',
                        date: new Date().toISOString().split('T')[0]
                    });
                    DataStorage.addNotification(lt.id, 'Transfer Ordered', 'Transfer Order', `You have been transferred`);
                    alert('Transfer order created.');
                    document.querySelector('.modal-overlay.active')?.classList.remove('active');
                });
            } else if (m === 'transferHistory') showModal('Transfer History', transferHistoryContent());
        });
    });
})();
