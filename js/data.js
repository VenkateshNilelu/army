/**
 * Indian Army Civilian Staff - LocalStorage Data Layer
 * Simulates backend with LocalStorage
 */

const DataStorage = {
    KEYS: {
        USERS: 'army_users',
        LEAVES: 'army_leaves',
        TRANSFERS: 'army_transfers',
        SALARIES: 'army_salaries',
        NOTIFICATIONS: 'army_notifications',
        LOGS: 'army_logs',
        SESSION: 'army_session',
        BATTALIONS: 'army_battalions'
    },

    init() {
        if (!localStorage.getItem(this.KEYS.USERS)) {
            localStorage.setItem(this.KEYS.USERS, JSON.stringify(this.getDefaultUsers()));
        }
        if (!localStorage.getItem(this.KEYS.LEAVES)) {
            localStorage.setItem(this.KEYS.LEAVES, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.TRANSFERS)) {
            localStorage.setItem(this.KEYS.TRANSFERS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.SALARIES)) {
            localStorage.setItem(this.KEYS.SALARIES, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.NOTIFICATIONS)) {
            localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.LOGS)) {
            localStorage.setItem(this.KEYS.LOGS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.BATTALIONS)) {
            localStorage.setItem(this.KEYS.BATTALIONS, JSON.stringify(this.getDefaultBattalions()));
        }
        this.seedSampleSalaries();
        this.seedSampleTransfers();
    },
    seedSampleTransfers() {
        try {
            const transfers = this.getTransfers();
            if (transfers.length > 0) return;
            const users = this.getUsers();
            const battalions = this.getBattalions();
            users.forEach((u, idx) => {
                if (u.rank === 'Soldier' || u.rank === 'Lieutenant' || u.rank === 'Colonel') {
                    const fromBat = battalions.find(b => b.id === u.battalion) || battalions[0];
                    const toBat = battalions[(battalions.indexOf(fromBat) + 1) % battalions.length];
                    this.addTransfer({
                        userId: u.id,
                        soldierId: u.id,
                        soldierName: u.name,
                        from: fromBat?.name || '-',
                        to: toBat?.name || '-',
                        date: `2025-0${(idx%9)+1}-15`,
                        status: idx % 2 === 0 ? 'Approved' : 'Pending',
                        reason: 'Routine transfer',
                        commandingOfficer: toBat?.coId || null
                    });
                }
            });
        } catch (e) {}
    },

    seedSampleSalaries() {
        try {
        const salaries = this.getSalaries();
        if (salaries.length > 0) return;
        const users = this.getUsers().filter(u => u.rank === 'Soldier' || u.rank === 'Lieutenant');
        const months = ['2025-01', '2025-02', '2024-12'];
        users.forEach(u => {
            months.forEach((m, i) => {
                const basic = 25000 + Math.random() * 10000;
                const allowances = 5000;
                const deductions = 2000;
                this.addSalary({
                    userId: u.id,
                    userServiceId: u.serviceId,
                    userName: u.name,
                    month: m,
                    workingDays: 25,
                    overtime: 2,
                    leaves: 1,
                    basic: Math.round(basic),
                    allowances,
                    deductions,
                    total: Math.round(basic + allowances - deductions),
                    status: i === 0 ? 'Paid' : i === 1 ? 'Pending' : 'Yet to Approve'
                });
            });
        });
        } catch (e) {}
    },

    getDefaultBattalions() {
        return [
            { id: 'B1', name: '1st Battalion', location: 'Delhi', coId: 'COL001' },
            { id: 'B2', name: '2nd Battalion', location: 'Mumbai', coId: 'COL002' },
            { id: 'B3', name: '3rd Battalion', location: 'Kolkata', coId: 'COL001' }
        ];
    },

    getDefaultUsers() {
        return [
            {
                id: 'ADM001',
                serviceId: 'ADM001',
                rank: 'Admin',
                password: 'admin123',
                name: 'System Admin',
                email: 'admin@army.gov.in',
                mobile: '9999999999',
                battalion: '-',
                joiningDate: '2020-01-01',
                fatherName: '-',
                motherName: '-',
                spouseName: '-',
                emergencyContact: '-',
                dob: '1980-01-01',
                address: '-',
                photo: null,
                blocked: false
            },
            {
                id: 'COL002',
                serviceId: 'COL002',
                rank: 'Colonel',
                password: 'col123',
                name: 'Col. Suresh Patel',
                email: 'colonel2@army.gov.in',
                mobile: '9876543209',
                battalion: 'B2',
                joiningDate: '2016-01-10',
                fatherName: '-',
                motherName: '-',
                spouseName: '-',
                emergencyContact: '-',
                dob: '1976-05-12',
                address: 'Mumbai HQ',
                photo: null,
                blocked: false
            },
            {
                id: 'COL001',
                serviceId: 'COL001',
                rank: 'Colonel',
                password: 'col123',
                name: 'Col. Rajesh Kumar',
                email: 'colonel@army.gov.in',
                mobile: '9876543210',
                battalion: 'B1',
                joiningDate: '2015-06-15',
                fatherName: 'S. Kumar',
                motherName: 'R. Devi',
                spouseName: 'P. Kumar',
                emergencyContact: '9123456789',
                dob: '1975-03-20',
                address: 'Defence Colony, Delhi',
                photo: null,
                blocked: false
            },
            {
                id: 'LIE002',
                serviceId: 'LIE002',
                rank: 'Lieutenant',
                password: 'lie123',
                name: 'Lt. Priya Nair',
                email: 'lieutenant2@army.gov.in',
                mobile: '9876543214',
                battalion: 'B2',
                joiningDate: '2019-02-15',
                fatherName: '-',
                motherName: '-',
                spouseName: '-',
                emergencyContact: '-',
                dob: '1991-09-20',
                address: 'Mumbai Cantonment',
                photo: null,
                blocked: false,
                reportsTo: 'COL002'
            },
            {
                id: 'LIE001',
                serviceId: 'LIE001',
                rank: 'Lieutenant',
                password: 'lie123',
                name: 'Lt. Amit Sharma',
                email: 'lieutenant@army.gov.in',
                mobile: '9876543211',
                battalion: 'B1',
                joiningDate: '2018-04-10',
                fatherName: 'R. Sharma',
                motherName: 'S. Sharma',
                spouseName: 'K. Sharma',
                emergencyContact: '9123456790',
                dob: '1990-07-15',
                address: 'Cantonment Area, Delhi',
                photo: null,
                blocked: false,
                reportsTo: 'COL001'
            },
            {
                id: 'SOL001',
                serviceId: 'SOL001',
                rank: 'Soldier',
                password: 'sol123',
                name: 'Soldier Vikram Singh',
                email: 'soldier@army.gov.in',
                mobile: '9876543212',
                battalion: 'B1',
                joiningDate: '2020-01-15',
                fatherName: 'M. Singh',
                motherName: 'L. Kaur',
                spouseName: 'R. Kaur',
                emergencyContact: '9123456791',
                dob: '1995-11-08',
                address: 'Barracks Block A',
                photo: null,
                blocked: false,
                reportsTo: 'LIE001'
            },
            {
                id: 'ACC001',
                serviceId: 'ACC001',
                rank: 'Accountant',
                password: 'acc123',
                name: 'Accountant Priya Mehta',
                email: 'accountant@army.gov.in',
                mobile: '9876543213',
                battalion: '-',
                joiningDate: '2019-03-01',
                fatherName: 'A. Mehta',
                motherName: 'N. Mehta',
                spouseName: '-',
                emergencyContact: '9123456792',
                dob: '1992-05-22',
                address: 'Finance Block, HQ',
                photo: null,
                blocked: false
            }
        ];
    },

    getUsers() {
        return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
    },

    getUser(id) {
        return this.getUsers().find(u => u.id === id || u.serviceId === id);
    },

    getUserByCredentials(serviceId, mobileOrEmail) {
        const users = this.getUsers();
        return users.find(u => 
            (u.serviceId === serviceId || u.id === serviceId) && 
            (u.mobile === mobileOrEmail || u.email === mobileOrEmail) &&
            !u.blocked
        );
    },

    addUser(user) {
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
        this.addLog('USER_REGISTER', `New user registered: ${user.serviceId}`);
        return user;
    },

    updateUser(id, updates) {
        const users = this.getUsers();
        const idx = users.findIndex(u => u.id === id || u.serviceId === id);
        if (idx >= 0) {
            users[idx] = { ...users[idx], ...updates };
            localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
            return users[idx];
        }
        return null;
    },

    getLeaves() {
        return JSON.parse(localStorage.getItem(this.KEYS.LEAVES) || '[]');
    },

    addLeave(leave) {
        const leaves = this.getLeaves();
        leave.id = 'LV' + Date.now();
        leaves.push(leave);
        localStorage.setItem(this.KEYS.LEAVES, JSON.stringify(leaves));
        return leave;
    },

    updateLeave(id, updates) {
        const leaves = this.getLeaves();
        const idx = leaves.findIndex(l => l.id === id);
        if (idx >= 0) {
            leaves[idx] = { ...leaves[idx], ...updates };
            localStorage.setItem(this.KEYS.LEAVES, JSON.stringify(leaves));
            return leaves[idx];
        }
        return null;
    },

    getTransfers() {
        return JSON.parse(localStorage.getItem(this.KEYS.TRANSFERS) || '[]');
    },

    addTransfer(transfer) {
        const transfers = this.getTransfers();
        transfer.id = 'TR' + Date.now();
        transfers.push(transfer);
        localStorage.setItem(this.KEYS.TRANSFERS, JSON.stringify(transfers));
        return transfer;
    },

    updateTransfer(id, updates) {
        const transfers = this.getTransfers();
        const idx = transfers.findIndex(t => t.id === id);
        if (idx >= 0) {
            transfers[idx] = { ...transfers[idx], ...updates };
            localStorage.setItem(this.KEYS.TRANSFERS, JSON.stringify(transfers));
            return transfers[idx];
        }
        return null;
    },

    getSalaries() {
        return JSON.parse(localStorage.getItem(this.KEYS.SALARIES) || '[]');
    },

    addSalary(salary) {
        const salaries = this.getSalaries();
        salary.id = 'SAL' + Date.now();
        salaries.push(salary);
        localStorage.setItem(this.KEYS.SALARIES, JSON.stringify(salaries));
        return salary;
    },

    updateSalary(id, updates) {
        const salaries = this.getSalaries();
        const idx = salaries.findIndex(s => s.id === id);
        if (idx >= 0) {
            salaries[idx] = { ...salaries[idx], ...updates };
            localStorage.setItem(this.KEYS.SALARIES, JSON.stringify(salaries));
            return salaries[idx];
        }
        return null;
    },

    getNotifications(userId) {
        const notifs = JSON.parse(localStorage.getItem(this.KEYS.NOTIFICATIONS) || '[]');
        return notifs.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    addNotification(userId, type, title, message, link) {
        const notifs = JSON.parse(localStorage.getItem(this.KEYS.NOTIFICATIONS) || '[]');
        notifs.push({
            id: 'N' + Date.now(),
            userId,
            type,
            title,
            message,
            link: link || '#',
            read: false,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    },

    markNotificationRead(id) {
        const notifs = JSON.parse(localStorage.getItem(this.KEYS.NOTIFICATIONS) || '[]');
        const n = notifs.find(x => x.id === id);
        if (n) n.read = true;
        localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    },

    getLogs() {
        return JSON.parse(localStorage.getItem(this.KEYS.LOGS) || '[]');
    },

    addLog(action, details) {
        const logs = this.getLogs();
        logs.unshift({
            id: 'LOG' + Date.now(),
            action,
            details,
            timestamp: new Date().toISOString()
        });
        if (logs.length > 500) logs.pop();
        localStorage.setItem(this.KEYS.LOGS, JSON.stringify(logs));
    },

    getSession() {
        return JSON.parse(localStorage.getItem(this.KEYS.SESSION) || 'null');
    },

    setSession(user) {
        localStorage.setItem(this.KEYS.SESSION, JSON.stringify(user));
    },

    clearSession() {
        localStorage.removeItem(this.KEYS.SESSION);
    },

    getBattalions() {
        return JSON.parse(localStorage.getItem(this.KEYS.BATTALIONS) || '[]');
    }
};
