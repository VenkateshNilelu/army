/**
 * Index (landing) + Notification view - runs only the init for elements present on the page.
 */
(function () {
  DataStorage.init();

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
