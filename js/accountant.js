/**
 * Accountant Dashboard Logic
 */

(function() {
    const session = Auth.requireRole(['Accountant']);
    if (!session) return;

    DataStorage.init();
    App.setupDashboardCommon();

    document.getElementById('sideMenuRank').textContent = session.rank;
    document.getElementById('sideMenuServiceId').textContent = session.serviceId;

    document.getElementById('hamburgerBtn')?.addEventListener('click', () => App.toggleSideMenu());

    initCommonModals(session);

    const colonels = DataStorage.getUsers().filter(u => u.rank === 'Colonel');
    const battalions = DataStorage.getBattalions();

    const acColonel = document.getElementById('acColonel');
    const acLieutenant = document.getElementById('acLieutenant');
    const acSoldier = document.getElementById('acSoldier');

    colonels.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        acColonel.appendChild(opt);
    });

    acColonel.addEventListener('change', () => {
        acLieutenant.innerHTML = '<option value="">-- Select Lieutenant --</option>';
        acSoldier.innerHTML = '<option value="">-- Select Soldier --</option>';
        const colId = acColonel.value;
        if (!colId) return;
        const colBats = battalions.filter(b => b.coId === colId);
        const lts = DataStorage.getUsers().filter(u => u.rank === 'Lieutenant' && colBats.some(b => b.id === u.battalion));
        lts.forEach(l => {
            const opt = document.createElement('option');
            opt.value = l.id;
            opt.textContent = l.name;
            acLieutenant.appendChild(opt);
        });
    });

    acLieutenant.addEventListener('change', () => {
        acSoldier.innerHTML = '<option value="">-- Select Soldier --</option>';
        const ltId = acLieutenant.value;
        if (!ltId) return;
        const lt = DataStorage.getUser(ltId);
        const soldiers = DataStorage.getUsers().filter(u => u.reportsTo === ltId || (u.rank === 'Soldier' && u.battalion === lt?.battalion));
        soldiers.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name + ' (' + s.serviceId + ')';
            acSoldier.appendChild(opt);
        });
    });

    let currentSearchResults = [];

    document.getElementById('acSearchBtn').addEventListener('click', () => {
        const soldierId = acSoldier.value;
        if (!soldierId) {
            alert('Please select a soldier.');
            return;
        }
        const salaries = DataStorage.getSalaries().filter(s => s.userId === soldierId);
        currentSearchResults = salaries;
        const section = document.getElementById('acResultSection');
        const table = document.getElementById('acSalaryTable');
        section.style.display = 'block';
        table.innerHTML = `
            <thead><tr>
                <th>Month</th><th>Working Days</th><th>Overtime</th><th>Leaves</th>
                <th>Basic</th><th>Allowances</th><th>Deductions</th><th>Total</th><th>Status</th>
            </tr></thead><tbody>
            ${salaries.map(s => `
                <tr>
                    <td>${s.month || '-'}</td><td>${s.workingDays || '-'}</td><td>${s.overtime || 0}</td><td>${s.leaves || 0}</td>
                    <td>₹${(s.basic || 0).toLocaleString()}</td><td>₹${(s.allowances || 0).toLocaleString()}</td>
                    <td>₹${(s.deductions || 0).toLocaleString()}</td><td>₹${(s.total || 0).toLocaleString()}</td>
                    <td><span class="badge badge-${s.status === 'Paid' ? 'success' : s.status === 'Pending' ? 'warning' : 'danger'}">${s.status || 'Pending'}</span></td>
                </tr>
            `).join('')}
            </tbody>
        `;
    });

    document.getElementById('acDownloadPdf').addEventListener('click', () => {
        const soldier = DataStorage.getUser(acSoldier.value);
        if (!soldier) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Salary Report', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Employee: ${soldier.name} (${soldier.serviceId})`, 20, 35);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 42);
        let y = 55;
        doc.setFontSize(10);
        doc.text('Month', 20, y);
        doc.text('Working Days', 50, y);
        doc.text('Basic', 80, y);
        doc.text('Allowances', 110, y);
        doc.text('Deductions', 140, y);
        doc.text('Total', 170, y);
        doc.text('Status', 200, y);
        y += 8;
        currentSearchResults.forEach(s => {
            doc.text(s.month || '-', 20, y);
            doc.text(String(s.workingDays || '-'), 50, y);
            doc.text('₹' + (s.basic || 0), 80, y);
            doc.text('₹' + (s.allowances || 0), 110, y);
            doc.text('₹' + (s.deductions || 0), 140, y);
            doc.text('₹' + (s.total || 0), 170, y);
            doc.text(s.status || '-', 200, y);
            y += 7;
        });
        doc.save(`salary-report-${soldier.serviceId}.pdf`);
    });
})();
