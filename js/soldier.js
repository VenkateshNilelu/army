/**
 * Soldier Dashboard Logic
 */

(function() {
    const session = Auth.requireRole(['Soldier']);
    if (!session) return;

    DataStorage.init();
    App.setupDashboardCommon();

    document.getElementById('sideMenuRank').textContent = session.rank;
    document.getElementById('sideMenuServiceId').textContent = session.serviceId;

    document.getElementById('hamburgerBtn')?.addEventListener('click', () => App.toggleSideMenu());

    initCommonModals(session);

    // Battalion Overview
    const battalionContent = () => {
        const bat = DataStorage.getBattalions().find(b => b.id === session.battalion) || { name: session.battalion, location: '-' };
        return `
            <h4>${bat.name || session.battalion}</h4>
            <p><strong>Location:</strong> ${bat.location || '-'}</p>
            <p><strong>Your Battalion ID:</strong> ${session.battalion}</p>
        `;
    };

    // Leave Request
    const leaveContent = () => {
        const leaves = DataStorage.getLeaves().filter(l => l.userId === session.id && l.status === 'Pending');
        return `
            <h4>Apply Leave</h4>
            <form id="leaveForm">
                <div class="form-group">
                    <label>Leave Type</label>
                    <select id="leaveType" required>
                        <option value="Casual">Casual</option>
                        <option value="Sick">Sick</option>
                        <option value="Earned">Earned</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Reason</label>
                    <input type="text" id="leaveReason" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="date" id="leaveStart" required>
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="date" id="leaveEnd" required>
                    </div>
                </div>
                <p id="leaveDays" style="font-weight:600;">Days: 0</p>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        `;
    };

    function calcDays(start, end) {
        if (!start || !end) return 0;
        const a = new Date(start), b = new Date(end);
        return Math.max(0, Math.ceil((b - a) / (24 * 60 * 60 * 1000)) + 1);
    }

    // Salary Details
    const salaryContent = () => {
        const salaries = DataStorage.getSalaries().filter(s => s.userId === session.id);
        const d = new Date();
        const working = 25;
        const total = 31;
        const tillDate = salaries.reduce((sum, s) => sum + (s.total || 0), 0);
        let table = `
            <p><strong>Current month:</strong> ${working}/${total} working days</p>
            <p><strong>Salary till date:</strong> ₹${tillDate.toLocaleString()}</p>
            <table class="data-table"><thead><tr>
                <th>Month</th><th>Working Days</th><th>Overtime</th><th>Leaves</th>
                <th>Basic</th><th>Allowances</th><th>Deductions</th><th>Total</th><th>Status</th><th></th>
            </tr></thead><tbody>
        `;
        salaries.slice(0, 12).forEach(s => {
            table += `<tr>
                <td>${s.month || '-'}</td><td>${s.workingDays || '-'}</td><td>${s.overtime || 0}</td><td>${s.leaves || 0}</td>
                <td>₹${(s.basic || 0).toLocaleString()}</td><td>₹${(s.allowances || 0).toLocaleString()}</td>
                <td>₹${(s.deductions || 0).toLocaleString()}</td><td>₹${(s.total || 0).toLocaleString()}</td>
                <td><span class="badge badge-${s.status === 'Paid' ? 'success' : s.status === 'Pending' ? 'warning' : 'danger'}">${s.status || 'Pending'}</span></td>
                <td><button class="btn btn-primary btn-sm" onclick="downloadSalaryReceipt('${s.id}')">Receipt</button></td>
            </tr>`;
        });
        table += '</tbody></table>';
        return table;
    };

    window.downloadSalaryReceipt = function(id) {
        const s = DataStorage.getSalaries().find(x => x.id === id);
        if (!s) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Salary Receipt', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Month: ${s.month}`, 20, 35);
        doc.text(`Total: ₹${(s.total || 0).toLocaleString()}`, 20, 42);
        doc.text(`Status: ${s.status}`, 20, 49);
        doc.save(`salary-${s.month}-${session.serviceId}.pdf`);
    };

    // Transfer History
    const transferContent = () => {
        const transfers = StaticData.getTransfersBySoldier(session.id);
        if (transfers.length === 0) return '<p>No transfer history.</p>';
        let table = '<table class="data-table"><thead><tr><th>From</th><th>To</th><th>Date</th><th>Status</th></tr></thead><tbody>';
        transfers.forEach(t => {
            table += `<tr><td>${t.from || '-'}</td><td>${t.to || '-'}</td><td>${t.date || '-'}</td><td><span class="badge badge-${t.status === 'Approved' ? 'success' : t.status === 'Pending' ? 'warning' : 'danger'}">${t.status || 'Pending'}</span></td></tr>`;
        });
        return table + '</tbody></table>';
    };

    function showModal(title, content) {
        const id = 'soldierModal';
        const overlay = document.getElementById(id + 'Overlay');
        if (overlay) {
            overlay.querySelector('.modal-header h3').textContent = title;
            overlay.querySelector('.modal-body').innerHTML = content;
            overlay.classList.add('active');
        } else {
            const div = document.createElement('div');
            div.className = 'modal-overlay active';
            div.id = id + 'Overlay';
            div.innerHTML = `<div class="modal"><div class="modal-header"><h3>${title}</h3><button class="modal-close">&times;</button></div><div class="modal-body">${content}</div></div>`;
            div.querySelector('.modal-close').onclick = () => div.classList.remove('active');
            div.onclick = (e) => { if (e.target === div) div.classList.remove('active'); };
            document.body.appendChild(div);
        }
    }

    function bindModals() {
        document.querySelectorAll('.action-card[data-modal]').forEach(card => {
            const modal = card.dataset.modal;
            card.addEventListener('click', (e) => {
                e.preventDefault();
                if (modal === 'battalionOverview') showModal('Battalion Overview', battalionContent());
                else if (modal === 'leaveRequest') {
                    showModal('Leave Request', leaveContent());
                    const start = document.getElementById('leaveStart');
                    const end = document.getElementById('leaveEnd');
                    const daysEl = document.getElementById('leaveDays');
                    const updateDays = () => { daysEl.textContent = 'Days: ' + calcDays(start?.value, end?.value); };
                    start?.addEventListener('change', updateDays);
                    end?.addEventListener('change', updateDays);
                    document.getElementById('leaveForm')?.addEventListener('submit', (ev) => {
                        ev.preventDefault();
                        const days = calcDays(document.getElementById('leaveStart').value, document.getElementById('leaveEnd').value);
                        const lt = DataStorage.getLeaves().filter(l => l.userId === session.id && l.status === 'Pending').length;
                        if (lt >= 12) { alert('Max pending leaves reached'); return; }
                        DataStorage.addLeave({
                            userId: session.id,
                            serviceId: session.serviceId,
                            rank: session.rank,
                            type: document.getElementById('leaveType').value,
                            reason: document.getElementById('leaveReason').value,
                            startDate: document.getElementById('leaveStart').value,
                            endDate: document.getElementById('leaveEnd').value,
                            days,
                            status: 'Pending',
                            approvedBy: session.reportsTo || null
                        });
                        DataStorage.addNotification(session.reportsTo || 'LIE001', 'Leave', 'New Leave Request', `${session.name} requested ${days} days leave`);
                        alert('Leave submitted.');
                        document.querySelector('.modal-overlay.active')?.classList.remove('active');
                        loadCounts();
                    });
                } else if (modal === 'salaryDetails') showModal('Salary Details', salaryContent());
                else if (modal === 'transferHistory') showModal('Transfer History', transferContent());
            });
        });
    }

    function loadCounts() {
        const pending = DataStorage.getLeaves().filter(l => l.userId === session.id && l.status === 'Pending').length;
        const el = document.getElementById('pendingLeaves');
        if (el) el.textContent = pending;
    }

    loadCounts();
    bindModals();
})();
