/**
 * Authentication Module
 * Path-aware redirects work from both root and pages/ folder.
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

    function isInPagesFolder() {
        var path = window.location.pathname || '';
        return path.indexOf('/pages/') !== -1 || path.indexOf('\\pages\\') !== -1;
    }

    function getLoginUrl() {
        return isInPagesFolder() ? '../login.html' : 'login.html';
    }

    function getIndexUrl() {
        return isInPagesFolder() ? '../index.html' : 'index.html';
    }

    function getDashboardUrl(rank) {
        var name = (DASHBOARD_MAP[rank] || '').split('/').pop() || 'soldier-dashboard.html';
        return isInPagesFolder() ? name : (DASHBOARD_MAP[rank] || 'pages/soldier-dashboard.html');
    }

    function initAuth() {
        if (typeof DataStorage !== 'undefined') DataStorage.init();
    }

    function getSession() {
        return typeof DataStorage !== 'undefined' ? DataStorage.getSession() : null;
    }

    function redirectIfLoggedIn() {
        var session = getSession();
        if (session && DASHBOARD_MAP[session.rank]) {
            window.location.href = getDashboardUrl(session.rank);
        }
    }

    function requireAuth() {
        var session = getSession();
        if (!session) {
            window.location.href = getLoginUrl();
            return null;
        }
        return session;
    }

    function requireRole(allowedRoles) {
        var session = getSession();
        if (!session) {
            window.location.href = getLoginUrl();
            return null;
        }
        if (!allowedRoles.includes(session.rank)) {
            window.location.href = getDashboardUrl(session.rank);
            return null;
        }
        return session;
    }

    window.Auth = {
        RANKS,
        DASHBOARD_MAP,
        getLoginUrl,
        getIndexUrl,
        getDashboardUrl,
        init: initAuth,
        getSession,
        redirectIfLoggedIn,
        requireAuth,
        requireRole
    };
})();
