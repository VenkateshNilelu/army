/**
 * Static Data for Military Organization
 */

const StaticData = {
    battalions: [
        {
            id: 'B1',
            name: '1st Battalion Delhi',
            location: 'Delhi Cantonment',
            commandingOfficer: 'Col. Rajesh Kumar',
            totalStrength: 250,
            headquarters: 'Defence Colony, Delhi',
            established: '2015',
            operationalArea: 'North India Region'
        },
        {
            id: 'B2',
            name: '2nd Battalion Mumbai',
            location: 'Mumbai Cantonment',
            commandingOfficer: 'Col. Suresh Patel',
            totalStrength: 280,
            headquarters: 'Mumbai HQ',
            established: '2016',
            operationalArea: 'Western Region'
        },
        {
            id: 'B3',
            name: '3rd Battalion Kolkata',
            location: 'Kolkata Cantonment',
            commandingOfficer: 'Col. Amit Verma',
            totalStrength: 220,
            headquarters: 'Kolkata Garrison',
            established: '2017',
            operationalArea: 'Eastern Region'
        }
    ],

    soldiers: [
        {
            id: 'SOL001',
            name: 'Vikram Singh',
            serviceId: 'SOL001',
            rank: 'Soldier',
            battalion: 'B1',
            joiningDate: '2020-01-15',
            experience: '4 years 1 month',
            position: 'Infantry'
        },
        {
            id: 'SOL002',
            name: 'Rajesh Kumar',
            serviceId: 'SOL002',
            rank: 'Soldier',
            battalion: 'B1',
            joiningDate: '2021-03-20',
            experience: '3 years 10 months',
            position: 'Support Staff'
        },
        {
            id: 'SOL003',
            name: 'Arjun Patel',
            serviceId: 'SOL003',
            rank: 'Soldier',
            battalion: 'B2',
            joiningDate: '2020-06-10',
            experience: '3 years 8 months',
            position: 'Logistics'
        },
        {
            id: 'SOL004',
            name: 'Amir Khan',
            serviceId: 'SOL004',
            rank: 'Soldier',
            battalion: 'B2',
            joiningDate: '2021-05-15',
            experience: '2 years 9 months',
            position: 'Medical Staff'
        }
    ],

    lieutenants: [
        {
            id: 'LIE001',
            name: 'Lt. Amit Sharma',
            serviceId: 'LIE001',
            rank: 'Lieutenant',
            battalion: 'B1',
            joiningDate: '2018-04-10',
            experience: '6 years 10 months'
        },
        {
            id: 'LIE002',
            name: 'Lt. Priya Nair',
            serviceId: 'LIE002',
            rank: 'Lieutenant',
            battalion: 'B2',
            joiningDate: '2019-02-15',
            experience: '5 years 11 months'
        }
    ],

    colonels: [
        {
            id: 'COL001',
            name: 'Col. Rajesh Kumar',
            serviceId: 'COL001',
            rank: 'Colonel',
            battalion: 'B1',
            joiningDate: '2015-06-15',
            experience: '10 years 7 months'
        },
        {
            id: 'COL002',
            name: 'Col. Suresh Patel',
            serviceId: 'COL002',
            rank: 'Colonel',
            battalion: 'B2',
            joiningDate: '2016-08-20',
            experience: '9 years 5 months'
        }
    ],

    salaries: [
        { id: 'SAL001', soldierId: 'SOL001', soldierName: 'Vikram Singh', month: '2025-01', total: 32500, status: 'Paid' },
        { id: 'SAL002', soldierId: 'SOL001', soldierName: 'Vikram Singh', month: '2024-12', total: 32000, status: 'Paid' },
        { id: 'SAL003', soldierId: 'SOL001', soldierName: 'Vikram Singh', month: '2024-11', total: 31500, status: 'Paid' },
        { id: 'SAL004', soldierId: 'SOL002', soldierName: 'Rajesh Kumar', month: '2025-01', total: 30000, status: 'Pending' },
        { id: 'SAL005', soldierId: 'SOL002', soldierName: 'Rajesh Kumar', month: '2024-12', total: 29500, status: 'Paid' },
        { id: 'SAL006', soldierId: 'SOL002', soldierName: 'Rajesh Kumar', month: '2024-11', total: 29000, status: 'Paid' },
        { id: 'SAL007', soldierId: 'SOL003', soldierName: 'Arjun Patel', month: '2025-01', total: 33000, status: 'Pending' },
        { id: 'SAL008', soldierId: 'SOL003', soldierName: 'Arjun Patel', month: '2024-12', total: 32500, status: 'Paid' },
        { id: 'SAL009', soldierId: 'SOL003', soldierName: 'Arjun Patel', month: '2024-11', total: 32000, status: 'Paid' },
        { id: 'SAL010', soldierId: 'SOL004', soldierName: 'Amir Khan', month: '2025-01', total: 28500, status: 'Paid' },
        { id: 'SAL011', soldierId: 'SOL004', soldierName: 'Amir Khan', month: '2024-12', total: 28000, status: 'Paid' },
        { id: 'SAL012', soldierId: 'SOL004', soldierName: 'Amir Khan', month: '2024-11', total: 27500, status: 'Paid' },
        { id: 'SAL013', lieutenantId: 'LIE001', lieutenantName: 'Lt. Amit Sharma', month: '2025-01', total: 55000, status: 'Paid' },
        { id: 'SAL014', lieutenantId: 'LIE001', lieutenantName: 'Lt. Amit Sharma', month: '2024-12', total: 55000, status: 'Paid' },
        { id: 'SAL015', lieutenantId: 'LIE001', lieutenantName: 'Lt. Amit Sharma', month: '2024-11', total: 54500, status: 'Paid' },
        { id: 'SAL016', lieutenantId: 'LIE001', lieutenantName: 'Lt. Amit Sharma', month: '2024-10', total: 54500, status: 'Paid' },
        { id: 'SAL017', lieutenantId: 'LIE001', lieutenantName: 'Lt. Amit Sharma', month: '2024-09', total: 54000, status: 'Paid' },
        { id: 'SAL018', lieutenantId: 'LIE001', lieutenantName: 'Lt. Amit Sharma', month: '2024-08', total: 54000, status: 'Paid' },
        { id: 'SAL019', lieutenantId: 'LIE002', lieutenantName: 'Lt. Priya Nair', month: '2025-01', total: 56000, status: 'Paid' },
        { id: 'SAL020', lieutenantId: 'LIE002', lieutenantName: 'Lt. Priya Nair', month: '2024-12', total: 56000, status: 'Paid' },
        { id: 'SAL021', lieutenantId: 'LIE002', lieutenantName: 'Lt. Priya Nair', month: '2024-11', total: 55500, status: 'Paid' },
        { id: 'SAL022', lieutenantId: 'LIE002', lieutenantName: 'Lt. Priya Nair', month: '2024-10', total: 55500, status: 'Paid' },
        { id: 'SAL023', lieutenantId: 'LIE002', lieutenantName: 'Lt. Priya Nair', month: '2024-09', total: 55000, status: 'Paid' },
        { id: 'SAL024', lieutenantId: 'LIE002', lieutenantName: 'Lt. Priya Nair', month: '2024-08', total: 55000, status: 'Paid' },
        { id: 'SAL025', colonelId: 'COL001', colonelName: 'Col. Rajesh Kumar', month: '2025-01', total: 85000, status: 'Paid' },
        { id: 'SAL026', colonelId: 'COL001', colonelName: 'Col. Rajesh Kumar', month: '2024-12', total: 85000, status: 'Paid' },
        { id: 'SAL027', colonelId: 'COL001', colonelName: 'Col. Rajesh Kumar', month: '2024-11', total: 84500, status: 'Paid' },
        { id: 'SAL028', colonelId: 'COL001', colonelName: 'Col. Rajesh Kumar', month: '2024-10', total: 84500, status: 'Paid' },
        { id: 'SAL029', colonelId: 'COL001', colonelName: 'Col. Rajesh Kumar', month: '2024-09', total: 84000, status: 'Paid' },
        { id: 'SAL030', colonelId: 'COL001', colonelName: 'Col. Rajesh Kumar', month: '2024-08', total: 84000, status: 'Paid' },
        { id: 'SAL031', colonelId: 'COL002', colonelName: 'Col. Suresh Patel', month: '2025-01', total: 87000, status: 'Paid' },
        { id: 'SAL032', colonelId: 'COL002', colonelName: 'Col. Suresh Patel', month: '2024-12', total: 87000, status: 'Paid' },
        { id: 'SAL033', colonelId: 'COL002', colonelName: 'Col. Suresh Patel', month: '2024-11', total: 86500, status: 'Paid' },
        { id: 'SAL034', colonelId: 'COL002', colonelName: 'Col. Suresh Patel', month: '2024-10', total: 86500, status: 'Paid' },
        { id: 'SAL035', colonelId: 'COL002', colonelName: 'Col. Suresh Patel', month: '2024-09', total: 86000, status: 'Paid' },
        { id: 'SAL036', colonelId: 'COL002', colonelName: 'Col. Suresh Patel', month: '2024-08', total: 86000, status: 'Paid' }
    ],

    transfers: [
        {
            id: 'TR001',
            soldierId: 'SOL001',
            soldierName: 'Vikram Singh',
            from: 'Delhi Cantonment (B1)',
            to: 'Mumbai Cantonment (B2)',
            date: '2023-06-15',
            status: 'Approved',
            reason: 'Career Development'
        },
        {
            id: 'TR002',
            soldierId: 'SOL001',
            soldierName: 'Vikram Singh',
            from: 'Mumbai Cantonment (B2)',
            to: 'Delhi Cantonment (B1)',
            date: '2024-01-10',
            status: 'Approved',
            reason: 'Home Station Transfer'
        },
        {
            id: 'TR003',
            soldierId: 'SOL002',
            soldierName: 'Rajesh Kumar',
            from: 'Delhi Cantonment (B1)',
            to: 'Kolkata Cantonment (B3)',
            date: '2024-03-20',
            status: 'Approved',
            reason: 'Operational Requirement'
        },
        {
            id: 'TR004',
            soldierId: 'SOL003',
            soldierName: 'Arjun Patel',
            from: 'Mumbai Cantonment (B2)',
            to: 'Delhi Cantonment (B1)',
            date: '2024-08-05',
            status: 'Pending',
            reason: 'Promotion Related'
        },
        {
            id: 'TR005',
            soldierId: 'SOL004',
            soldierName: 'Amir Khan',
            from: 'Mumbai Cantonment (B2)',
            to: 'Bangalore (B4)',
            date: '2024-11-30',
            status: 'Approved',
            reason: 'Special Assignment'
        },
        {
            id: 'TR006',
            lieutenantId: 'LIE001',
            lieutenantName: 'Lt. Amit Sharma',
            from: 'Delhi Cantonment (B1)',
            to: 'Kolkata Cantonment (B3)',
            date: '2023-09-12',
            status: 'Approved',
            reason: 'Staff College Posting'
        },
        {
            id: 'TR007',
            lieutenantId: 'LIE001',
            lieutenantName: 'Lt. Amit Sharma',
            from: 'Kolkata Cantonment (B3)',
            to: 'Delhi Cantonment (B1)',
            date: '2024-04-20',
            status: 'Approved',
            reason: 'Operational Posting'
        },
        {
            id: 'TR008',
            lieutenantId: 'LIE001',
            lieutenantName: 'Lt. Amit Sharma',
            from: 'Delhi Cantonment (B1)',
            to: 'Pune Training Center',
            date: '2024-10-15',
            status: 'Approved',
            reason: 'Training Instructor'
        },
        {
            id: 'TR009',
            lieutenantId: 'LIE002',
            lieutenantName: 'Lt. Priya Nair',
            from: 'Mumbai Cantonment (B2)',
            to: 'Delhi Cantonment (B1)',
            date: '2024-07-15',
            status: 'Approved',
            reason: 'Administrative Transfer'
        },
        {
            id: 'TR010',
            lieutenantId: 'LIE002',
            lieutenantName: 'Lt. Priya Nair',
            from: 'Delhi Cantonment (B1)',
            to: 'Bangalore HQ',
            date: '2023-12-10',
            status: 'Approved',
            reason: 'Headquarters Posting'
        },
        {
            id: 'TR011',
            lieutenantId: 'LIE002',
            lieutenantName: 'Lt. Priya Nair',
            from: 'Bangalore HQ',
            to: 'Mumbai Cantonment (B2)',
            date: '2024-05-25',
            status: 'Approved',
            reason: 'Operational Requirement'
        },
        {
            id: 'TR012',
            colonelId: 'COL001',
            colonelName: 'Col. Rajesh Kumar',
            from: 'Delhi Cantonment (B1)',
            to: 'Kolkata Cantonment (B3)',
            date: '2022-03-15',
            status: 'Approved',
            reason: 'High Command Posting'
        },
        {
            id: 'TR013',
            colonelId: 'COL001',
            colonelName: 'Col. Rajesh Kumar',
            from: 'Kolkata Cantonment (B3)',
            to: 'Delhi Cantonment (B1)',
            date: '2024-01-10',
            status: 'Approved',
            reason: 'Battalion Command'
        },
        {
            id: 'TR014',
            colonelId: 'COL001',
            colonelName: 'Col. Rajesh Kumar',
            from: 'Delhi Cantonment (B1)',
            to: 'Army Headquarters',
            date: '2024-09-20',
            status: 'Approved',
            reason: 'Senior Administrative Role'
        },
        {
            id: 'TR015',
            colonelId: 'COL002',
            colonelName: 'Col. Suresh Patel',
            from: 'Mumbai Cantonment (B2)',
            to: 'Strategic Command Center',
            date: '2023-06-10',
            status: 'Approved',
            reason: 'Strategic Operations'
        },
        {
            id: 'TR016',
            colonelId: 'COL002',
            colonelName: 'Col. Suresh Patel',
            from: 'Strategic Command Center',
            to: 'Mumbai Cantonment (B2)',
            date: '2024-02-20',
            status: 'Approved',
            reason: 'Battalion Command'
        },
        {
            id: 'TR017',
            colonelId: 'COL002',
            colonelName: 'Col. Suresh Patel',
            from: 'Mumbai Cantonment (B2)',
            to: 'Defense Ministry',
            date: '2024-11-05',
            status: 'Approved',
            reason: 'Policy Planning'
        }
    ],

    getBattalionById(battalionId) {
        return this.battalions.find(b => b.id === battalionId);
    },

    getBattalions() {
        return this.battalions;
    },

    getSoldiersByBattalion(battalionId) {
        return this.soldiers.filter(s => s.battalion === battalionId);
    },

    getSalariesBySoldier(soldierId) {
        return this.salaries.filter(s => s.soldierId === soldierId);
    },

    getSalariesByLieutenant(lieutenantId) {
        return this.salaries.filter(s => s.lieutenantId === lieutenantId);
    },

    getSalariesByBattalion(battalionId) {
        const battalionSoldiers = this.soldiers.filter(s => s.battalion === battalionId);
        return this.salaries.filter(s => battalionSoldiers.some(bs => bs.id === s.soldierId));
    },

    getSalariesByColonel(colonelId) {
        return this.salaries.filter(s => s.colonelId === colonelId);
    },

    getTransfersInitiatedByLieutenant(lieutenantId) {
        // For a lieutenant, show transfers related to their soldiers
        return this.transfers;
    },

    getTransfersByLieutenant(lieutenantId) {
        return this.transfers.filter(t => t.lieutenantId === lieutenantId);
    },

    getTransfersByColonel(colonelId) {
        return this.transfers.filter(t => t.colonelId === colonelId);
    },

    getTransfersBySoldier(soldierId) {
        return this.transfers.filter(t => t.soldierId === soldierId);
    }
};
