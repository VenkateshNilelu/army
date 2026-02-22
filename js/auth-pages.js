/**
 * Login, Register, Forgot Password - runs only the init for the form present on the page.
 */
(function () {
  Auth.init();

  var loginForm = document.getElementById('loginForm');
  var regForm = document.getElementById('regForm');
  var forgotForm = document.getElementById('forgotForm');

  if (loginForm) {
     // Auth.redirectIfLoggedIn(); // Disabled to stop auto redirect from login page
    document.querySelectorAll('.quick-login-btn').forEach(function (btn) {
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
    var serviceId = document.getElementById('serviceId');
    var rank = document.getElementById('rank');
    var mobileOrEmail = document.getElementById('mobileOrEmail');
    var otpGroup = document.getElementById('otpGroup');
    var otp = document.getElementById('otp');
    var sendOtpBtn = document.getElementById('sendOtpBtn');
    var loginBtn = document.getElementById('loginBtn');
    var otpVerified = false;
    var SIMULATED_OTP = '123456';

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function validateMobile(mob) {
      return /^[6-9]\d{9}$/.test(mob.replace(/\s/g, ''));
    }
    function showError(el, msg) {
      el.classList.add('error');
      var err = document.getElementById(el.id + 'Error');
      if (err) err.textContent = msg;
    }
    function clearError(el) {
      el.classList.remove('error');
      var err = document.getElementById(el.id + 'Error');
      if (err) err.textContent = '';
    }
    function validateStep1() {
      var valid = true;
      clearError(serviceId);
      clearError(rank);
      clearError(mobileOrEmail);
      if (!serviceId.value.trim()) {
        showError(serviceId, 'Service ID is required');
        valid = false;
      }
      if (!rank.value) {
        showError(rank, 'Please select your rank');
        valid = false;
      }
      var me = mobileOrEmail.value.trim();
      if (!me) {
        showError(mobileOrEmail, 'Mobile or Email is required');
        valid = false;
      } else if (!validateEmail(me) && !validateMobile(me)) {
        showError(mobileOrEmail, me.indexOf('@') !== -1 ? 'Invalid email format' : 'Enter valid 10-digit mobile');
        valid = false;
      }
      return valid;
    }

    sendOtpBtn.addEventListener('click', function () {
      if (!validateStep1()) return;
      otpGroup.style.display = 'block';
      otpVerified = false;
      loginBtn.disabled = true;
      sendOtpBtn.textContent = 'OTP Sent! Resend in 60s';
      sendOtpBtn.disabled = true;
      setTimeout(function () {
        sendOtpBtn.textContent = 'Resend OTP';
        sendOtpBtn.disabled = false;
      }, 60000);
    });

    otp.addEventListener('input', function () {
      if (otp.value === SIMULATED_OTP) {
        otpVerified = true;
        loginBtn.disabled = false;
        clearError(otp);
      } else {
        otpVerified = false;
        loginBtn.disabled = true;
      }
    });

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateStep1()) return;
      if (!otpVerified) {
        showError(otp, 'Enter valid OTP');
        return;
      }
      if (otp.value !== SIMULATED_OTP) {
        showError(otp, 'Invalid OTP');
        return;
      }
      var user = DataStorage.getUserByCredentials(serviceId.value.trim(), mobileOrEmail.value.trim());
      if (!user) {
        showError(serviceId, 'Invalid credentials or account blocked');
        return;
      }
      DataStorage.setSession(user);
      DataStorage.addLog('LOGIN', 'User ' + user.serviceId + ' logged in');
      window.location.href = Auth.getDashboardUrl(user.rank);
    });
  }

  if (regForm) {
    var currentStep = 1;
    var totalSteps = 3;
    var photoData = null;

    function showStep(n) {
      document.querySelectorAll('.form-step').forEach(function (s, i) {
        s.style.display = i + 1 === n ? 'block' : 'none';
      });
      document.getElementById('prevBtn').style.display = n > 1 ? 'inline-block' : 'none';
      document.getElementById('nextBtn').style.display = n < totalSteps ? 'inline-block' : 'none';
      document.getElementById('submitBtn').style.display = n === totalSteps ? 'inline-block' : 'none';
      ['step1Indicator', 'step2Indicator', 'step3Indicator'].forEach(function (id, i) {
        document.getElementById(id).className = i + 1 <= n ? 'step-active' : '';
      });
      currentStep = n;
    }

    function validateStep(n) {
      var valid = true;
      var ids = {
        1: ['regServiceId', 'regRank', 'battalion', 'joiningDate'],
        2: ['fullName', 'dob', 'regMobile', 'regEmail', 'address'],
        3: ['fatherName', 'motherName', 'emergencyContact', 'regPassword']
      };
      ids[n].forEach(function (id) {
        var el = document.getElementById(id);
        var err = document.getElementById(id + 'Error');
        if (!el) return;
        err.textContent = '';
        el.classList.remove('error');
        if (el.hasAttribute('required') && !el.value.trim()) {
          err.textContent = 'Required';
          el.classList.add('error');
          valid = false;
        }
        if (id === 'regMobile' && el.value && !/^[6-9]\d{9}$/.test(el.value)) {
          err.textContent = 'Valid 10-digit mobile';
          el.classList.add('error');
          valid = false;
        }
        if (id === 'regEmail' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
          err.textContent = 'Valid email';
          el.classList.add('error');
          valid = false;
        }
      });
      return valid;
    }

    document.getElementById('nextBtn').addEventListener('click', function () {
      if (validateStep(currentStep)) showStep(currentStep + 1);
    });
    document.getElementById('prevBtn').addEventListener('click', function () {
      showStep(currentStep - 1);
    });
    document.getElementById('profilePhoto').addEventListener('change', function (e) {
      var f = e.target.files[0];
      if (f) {
        var r = new FileReader();
        r.onload = function () { photoData = r.result; };
        r.readAsDataURL(f);
      }
    });

    regForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateStep(3)) return;
      var existing = DataStorage.getUser(document.getElementById('regServiceId').value.trim());
      if (existing) {
        document.getElementById('regServiceIdError').textContent = 'Service ID already exists';
        document.getElementById('regServiceId').classList.add('error');
        return;
      }
      var user = {
        id: document.getElementById('regServiceId').value.trim(),
        serviceId: document.getElementById('regServiceId').value.trim(),
        rank: document.getElementById('regRank').value,
        password: document.getElementById('regPassword').value,
        name: document.getElementById('fullName').value.trim(),
        email: document.getElementById('regEmail').value.trim(),
        mobile: document.getElementById('regMobile').value.trim(),
        battalion: document.getElementById('battalion').value.trim() || '-',
        joiningDate: document.getElementById('joiningDate').value,
        fatherName: document.getElementById('fatherName').value.trim(),
        motherName: document.getElementById('motherName').value.trim(),
        spouseName: document.getElementById('spouseName').value.trim() || '-',
        emergencyContact: document.getElementById('emergencyContact').value.trim(),
        dob: document.getElementById('dob').value,
        address: document.getElementById('address').value.trim(),
        photo: photoData,
        blocked: false
      };
      if (user.rank === 'Lieutenant' || user.rank === 'Soldier') user.reportsTo = '';
      DataStorage.addUser(user);
      alert('Registration successful! Please login.');
      window.location.href = Auth.getLoginUrl();
    });

    showStep(1);
  }

  if (forgotForm) {
    forgotForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var sid = document.getElementById('fpServiceId').value.trim();
      var email = document.getElementById('fpEmail').value.trim();
      var user = DataStorage.getUser(sid);
      if (!user || user.email !== email) {
        document.getElementById('fpServiceIdError').textContent = 'No account found with these details';
        return;
      }
      alert('Password reset link sent to ' + email + ' (simulated). In production, check your inbox.');
      window.location.href = Auth.getLoginUrl();
    });
  }
})();
