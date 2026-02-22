/**
 * Lieutenant Dashboard Logic
 */

(function() {
    const session = Auth.requireRole(['Lieutenant']);
    if (!session) return;

    DataStorage.init();
    App.setupDashboardCommon();

    document.getElementById('sideMenuRank').textContent = session.rank;
    document.getElementById('sideMenuServiceId').textContent = session.serviceId;

    document.getElementById('hamburgerBtn')?.addEventListener('click', () => App.toggleSideMenu());

    initCommonModals(session);

    const soldiers = () => DataStorage.getUsers().filter(u => u.reportsTo === session.id || (u.rank === 'Soldier' && u.battalion === session.battalion));
    const battalion = () => DataStorage.getBattalions().find(b => b.id === session.battalion) || {};

    function showModal(title, content) {
        const id = 'ltModal';
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

    // Battalion Overview - Officers list
    const battalionContent = () => {
        const bat = StaticData.getBattalionById(session.battalion);
        const batsoldiers = StaticData.getSoldiersByBattalion(session.battalion);
        let html = `
            <div style="margin-bottom: 2rem;">
                <h4>${bat?.name || session.battalion}</h4>
                <p><strong>Location:</strong> ${bat?.location || '-'}</p>
                <p><strong>Headquarters:</strong> ${bat?.headquarters || '-'}</p>
                <p><strong>Commanding Officer:</strong> ${bat?.commandingOfficer || '-'}</p>
                <p><strong>Total Strength:</strong> ${bat?.totalStrength || '-'} personnel</p>
                <p><strong>Established:</strong> ${bat?.established || '-'}</p>
                <p><strong>Operational Area:</strong> ${bat?.operationalArea || '-'}</p>
            </div>
            <h4>Soldiers in Battalion</h4>
            <table class="data-table"><thead><tr><th>Service ID</th><th>Name</th><th>Position</th><th>Joining Date</th><th>Experience</th></tr></thead><tbody>
        `;
        batsoldiers.forEach(s => { 
            html += `<tr><td>${s.serviceId}</td><td>${s.name}</td><td>${s.position}</td><td>${s.joiningDate}</td><td>${s.experience}</td></tr>`; 
        });
        return html + '</tbody></table>';
    };

    // Leave Management - A: from soldiers, B: request to colonel
    const leaveContent = () => {
        const fromSoldiers = DataStorage.getLeaves().filter(l => l.status === 'Pending' && l.approvedBy === session.id);
        const bat = DataStorage.getBattalions().find(b => b.id === session.battalion);
        const colId = bat?.coId || DataStorage.getUsers().find(u => u.rank === 'Colonel')?.id;
        let html = `<h4>Requests from Soldiers</h4>`;
        if (fromSoldiers.length === 0) html += '<p>No pending requests.</p>';
        else {
            html += '<table class="data-table"><thead><tr><th>Service ID</th><th>Type</th><th>Reason</th><th>Days</th><th>Action</th></tr></thead><tbody>';
            fromSoldiers.forEach(l => {
                const user = DataStorage.getUser(l.userId);
                html += `<tr>
                    <td>${l.serviceId}</td><td>${l.type}</td><td>${l.reason}</td><td>${l.days}</td>
                    <td><button class="btn btn-success btn-sm" data-leave-id="${l.id}" data-action="approve">Approve</button>
                    <button class="btn btn-danger btn-sm" data-leave-id="${l.id}" data-action="reject">Reject</button></td>
                </tr>`;
            });
            html += '</tbody></table>';
        }
        html += `<h4 style="margin-top:1rem;">Request Leave to Colonel</h4>
            <form id="ltLeaveForm">
                <div class="form-group"><label>Leave Type</label><select id="ltType"><option>Casual</option><option>Sick</option><option>Earned</option></select></div>
                <div class="form-group"><label>Reason</label><input type="text" id="ltReason" required></div>
                <div class="form-row">
                    <div class="form-group"><label>Start</label><input type="date" id="ltStart" required></div>
                    <div class="form-group"><label>End</label><input type="date" id="ltEnd" required></div>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>`;
        window._ltColId = colId;
        return html;
    };

    // Transfer Order
    const transferOrderContent = () => {
        const sols = soldiers();
        const bats = DataStorage.getBattalions();
        const cols = DataStorage.getUsers().filter(u => u.rank === 'Colonel');
        let html = `<form id="transferForm">
            <div class="form-group"><label>Soldier</label>
            <select id="trSoldier" required><option value="">-- Select --</option>`;
        sols.forEach(s => { html += `<option value="${s.id}" data-sid="${s.serviceId}">${s.name} (${s.serviceId})</option>`; });
        html += `</select></div>
            <div class="form-group"><label>Service ID</label><input type="text" id="trServiceId" readonly></div>
            <div class="form-group"><label>Reason</label><input type="text" id="trReason" required></div>
            <div class="form-group"><label>Transfer To Battalion</label>
            <select id="trToBat"><option value="">-- Select --</option>`;
        bats.forEach(b => { if (b.id !== session.battalion) html += `<option value="${b.id}">${b.name} - ${b.location}</option>`; });
        html += `</select></div>
            <div class="form-group"><label>Commanding Officer</label>
            <select id="trCO"><option value="">-- Select --</option>`;
        cols.forEach(c => { html += `<option value="${c.id}">${c.name}</option>`; });
        html += `</select></div>
            <button type="submit" class="btn btn-primary">Submit Transfer Request</button>
        </form>`;
        return html;
    };

    const transferHistoryContent = () => {
        const transfers = StaticData.getTransfersByLieutenant(session.id);
        if (transfers.length === 0) return '<p>No transfers in your record.</p>';
        let table = '<table class="data-table"><thead><tr><th>From</th><th>To</th><th>Reason</th><th>Date</th><th>Status</th></tr></thead><tbody>';
        transfers.forEach(t => {
            table += `<tr><td>${t.from || '-'}</td><td>${t.to || '-'}</td><td>${t.reason || '-'}</td><td>${t.date || '-'}</td><td><span class="badge badge-${t.status === 'Approved' ? 'success' : t.status === 'Rejected' ? 'danger' : 'warning'}">${t.status || 'Pending'}</span></td></tr>`;
        });
        return table + '</tbody></table>';
    };

    const salaryContent = () => {
        const salaries = StaticData.getSalariesByLieutenant(session.id);
        if (salaries.length === 0) return '<p>No salary records.</p>';
        let table = '<table class="data-table"><thead><tr><th>Month</th><th>Amount</th><th>Status</th></tr></thead><tbody>';
        salaries.forEach(s => {
            table += `<tr><td>${s.month}</td><td>₹${(s.total || 0).toLocaleString()}</td><td><span class="badge badge-${s.status === 'Paid' ? 'success' : 'warning'}">${s.status}</span></td></tr>`;
        });
        return table + '</tbody></table>';
    };

    document.querySelectorAll('.action-card[data-modal]').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const m = card.dataset.modal;
            if (m === 'battalionOverview') showModal('Battalion Overview', battalionContent());
            else if (m === 'leaveManagement') {
                showModal('Leave Management', leaveContent());
                document.querySelectorAll('[data-action="approve"]').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const lid = this.dataset.leaveId;
                        const leave = DataStorage.getLeaves().find(l => l.id === lid);
                        if (leave) {
                            DataStorage.updateLeave(lid, { status: 'Approved', approvedAt: new Date().toISOString() });
                            DataStorage.addNotification(leave.userId, 'Leave Approved', 'Leave Approved', `Your leave request has been approved`);
                        }
                        showModal('Leave Management', leaveContent());
                    });
                });
                document.querySelectorAll('[data-action="reject"]').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const lid = this.dataset.leaveId;
                        const leave = DataStorage.getLeaves().find(l => l.id === lid);
                        if (leave) {
                            DataStorage.updateLeave(lid, { status: 'Rejected' });
                            DataStorage.addNotification(leave.userId, 'Leave Rejected', 'Leave Rejected', `Your leave request has been rejected`);
                        }
                        showModal('Leave Management', leaveContent());
                    });
                });
                document.getElementById('ltLeaveForm')?.addEventListener('submit', (ev) => {
                    ev.preventDefault();
                    const colId = window._ltColId || DataStorage.getUsers().find(u => u.rank === 'Colonel')?.id;
                    const start = document.getElementById('ltStart').value;
                    const end = document.getElementById('ltEnd').value;
                    const days = Math.max(1, Math.ceil((new Date(end) - new Date(start)) / 86400000) + 1);
                    DataStorage.addLeave({
                        userId: session.id,
                        serviceId: session.serviceId,
                        rank: session.rank,
                        type: document.getElementById('ltType').value,
                        reason: document.getElementById('ltReason').value,
                        startDate: start,
                        endDate: end,
                        days: days,
                        status: 'Pending',
                        approvedBy: colId
                    });
                    DataStorage.addNotification(colId, 'Leave', 'Lieutenant Leave Request', `${session.name} requested leave`);
                    alert('Leave request submitted.');
                    document.querySelector('.modal-overlay.active')?.classList.remove('active');
                });
            } else if (m === 'salaryOverview') showModal('Salary Overview', salaryContent());
            else if (m === 'transferOrder') {
                showModal('Transfer Order', transferOrderContent());
                document.getElementById('trSoldier')?.addEventListener('change', function() {
                    const opt = this.options[this.selectedIndex];
                    document.getElementById('trServiceId').value = opt?.dataset?.sid || '';
                });
                document.getElementById('transferForm')?.addEventListener('submit', (ev) => {
                    ev.preventDefault();
                    const sel = document.getElementById('trSoldier').value;
                    const soldier = DataStorage.getUser(sel);
                    const toBat = document.getElementById('trToBat').value;
                    const bat = DataStorage.getBattalions().find(b => b.id === toBat);
                    DataStorage.addTransfer({
                        soldierId: soldier?.id,
                        soldierName: soldier?.name,
                        serviceId: soldier?.serviceId,
                        from: session.battalion,
                        to: toBat,
                        toLocation: bat?.location,
                        reason: document.getElementById('trReason').value,
                        commandingOfficer: document.getElementById('trCO').value,
                        initiatedBy: session.id,
                        lieutenantId: session.id,
                        status: 'Pending',
                        date: new Date().toISOString().split('T')[0]
                    });
                    DataStorage.addNotification(document.getElementById('trCO').value, 'Transfer', 'Transfer Order', `Transfer request for ${soldier?.name}`);
                    DataStorage.addNotification(soldier?.id, 'Transfer Ordered', 'Transfer Ordered', `You have been assigned for transfer`);
                    alert('Transfer request submitted.');
                    document.querySelector('.modal-overlay.active')?.classList.remove('active');
                });
            } else if (m === 'transferHistory') showModal('Transfer History', transferHistoryContent());
        });
    });

    })();
