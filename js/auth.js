/**
 * Authentication Module
 */

(function() {
    const RANKS = ['Soldier', 'Lieutenant', 'Colonel', 'Accountant', 'Admin'];
    const DASHBOARD_MAP = {
        Soldier: 'pages/soldier-dashboard.html',
        Lieutenant: 'pages/lieutenant-dashboard.html',
        Colonel: 'pages/colonel-dashboard.html',
        Accountant: 'pages/accountant-dashboard.html',
        Admin: 'pages/admin-dashboard.html'
    };

    function initAuth() {
        if (typeof DataStorage !== 'undefined') DataStorage.init();
    }

    function getSession() {
        return typeof DataStorage !== 'undefined' ? DataStorage.getSession() : null;
    }

    function redirectIfLoggedIn() {
        const session = getSession();
        if (session && DASHBOARD_MAP[session.rank]) {
            window.location.href = DASHBOARD_MAP[session.rank];
        }
    }

    function requireAuth() {
        const session = getSession();
        if (!session) {
            window.location.href = 'login.html';
            return null;
        }
        return session;
    }

    function requireRole(allowedRoles) {
        const session = requireAuth();
        if (!session) return null;
        if (!allowedRoles.includes(session.rank)) {
            const dash = DASHBOARD_MAP[session.rank];
            window.location.href = dash || 'index.html';
            return null;
        }
        return session;
    }

    window.Auth = {
        RANKS,
        DASHBOARD_MAP,
        init: initAuth,
        getSession,
        redirectIfLoggedIn,
        requireAuth,
        requireRole
    };
})();
