/**
 * Index (landing) + Notification view - runs only the init for elements present on the page.
 */
(function () {
  DataStorage.init();

  /* ---------- index: quick-login ---------- */
  var quickLogin = document.querySelectorAll('.quick-login');
  if (quickLogin.length) {
    quickLogin.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var role = this.dataset.role;
        var user = DataStorage.getUsers().find(function (u) { return u.rank === role; });
        if (user) {
          DataStorage.setSession(user);
          window.location.href = Auth.getDashboardUrl(role);
        }
      });
    });
  }

  /* ---------- notification-view ---------- */
  var backLink = document.getElementById('backLink');
  var notificationList = document.getElementById('notificationList');
  if (backLink && notificationList) {
    var session = Auth.getSession();
    if (!session) {
      window.location.href = Auth.getLoginUrl();
      return;
    }
    backLink.href = Auth.getDashboardUrl(session.rank);

    var notifs = DataStorage.getNotifications(session.id);
    if (notifs.length === 0) {
      notificationList.innerHTML = '<p>No notifications.</p>';
    } else {
      notificationList.innerHTML = notifs.map(function (n) {
        DataStorage.markNotificationRead(n.id);
        return (
          '<div class="notification-view-item">' +
            '<strong>' + n.title + '</strong>' +
            '<p>' + n.message + '</p>' +
            '<small>' + new Date(n.createdAt).toLocaleString() + '</small>' +
          '</div>'
        );
      }).join('');
    }
  }
})();
