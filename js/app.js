/**
 * Common Dashboard Application Logic
 */

(function() {
    function getSession() {
        return typeof DataStorage !== 'undefined' ? DataStorage.getSession() : null;
    }

    function renderNotifications() {
        const session = getSession();
        if (!session) return;
        const notifs = DataStorage.getNotifications(session.id);
        const unread = notifs.filter(n => !n.read).length;
        const badge = document.getElementById('notificationBadge');
        const dropdown = document.getElementById('notificationDropdown');
        const list = document.getElementById('notificationList');
        if (badge) badge.textContent = unread > 0 ? unread : '';
        if (list) {
            list.innerHTML = notifs.slice(0, 10).map(n => `
                <div class="notification-item ${n.read ? '' : 'unread'}" data-id="${n.id}" data-link="${n.link || '#'}">
                    <strong>${n.title}</strong>
                    <p style="margin: 0.3rem 0 0; font-size: 0.85rem;">${n.message}</p>
                </div>
            `).join('');
            list.querySelectorAll('.notification-item').forEach(el => {
                el.addEventListener('click', () => {
                    const id = el.dataset.id;
                    const link = el.dataset.link;
                    DataStorage.markNotificationRead(id);
                    if (link && link !== '#') window.location.href = link;
                    else window.location.href = 'notification-view.html?id=' + id;
                });
            });
        }
    }

    function toggleSideMenu() {
        const overlay = document.getElementById('sideMenuOverlay');
        const menu = document.getElementById('sideMenu');
        overlay.classList.toggle('active');
        menu.classList.toggle('active');
    }

    function getDefaultProfileImagePath() {
        var path = window.location.pathname || '';
        return (path.indexOf('/pages/') !== -1 || path.indexOf('\\pages\\') !== -1) ? '../assets/soldierprofilephoto.png' : 'assets/soldierprofilephoto.png';
    }

    function setupDashboardCommon() {
        const session = getSession();
        if (!session) return;
        const photoEl = document.getElementById('profilePhotoImg');
        const placeholder = document.getElementById('profilePhotoPlaceholder');
        const user = typeof DataStorage !== 'undefined' && session.id ? DataStorage.getUser(session.id) : null;
        const photo = (user && user.photo) || session.photo;
        if (photoEl) {
            if (photo) {
                photoEl.src = photo;
                photoEl.style.display = 'block';
                if (placeholder) placeholder.style.display = 'none';
                photoEl.onerror = function() {
                    photoEl.style.display = 'none';
                    photoEl.removeAttribute('src');
                    if (placeholder) placeholder.style.display = '';
                };
            } else {
                photoEl.style.display = 'none';
                if (placeholder) placeholder.style.display = '';
                photoEl.onerror = function() {
                    photoEl.style.display = 'none';
                    if (placeholder) placeholder.style.display = '';
                };
                photoEl.onload = function() {
                    photoEl.style.display = 'block';
                    if (placeholder) placeholder.style.display = 'none';
                };
                photoEl.src = getDefaultProfileImagePath();
            }
        }
        document.getElementById('profileRank') && (document.getElementById('profileRank').textContent = session.rank);
        document.getElementById('profileServiceId') && (document.getElementById('profileServiceId').textContent = session.serviceId);

        document.getElementById('profileTrigger')?.addEventListener('click', toggleSideMenu);
        document.getElementById('sideMenuOverlay')?.addEventListener('click', toggleSideMenu);
        document.getElementById('notificationBell')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('notificationDropdown')?.classList.toggle('active');
        });
        document.addEventListener('click', () => {
            document.getElementById('notificationDropdown')?.classList.remove('active');
        });
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            DataStorage.clearSession();
            window.location.href = Auth.getIndexUrl();
        });

        renderNotifications();
    }

    window.App = {
        getSession,
        renderNotifications,
        toggleSideMenu,
        setupDashboardCommon
    };
})();
