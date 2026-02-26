/**
 * Login, Register, Forgot Password - runs only the init for the form present on the page.
 */
(function () {

  Auth.init();

  var loginForm = document.getElementById('loginForm');
  var regForm = document.getElementById('regForm');
  var forgotForm = document.getElementById('forgotForm');

  if (loginForm) {
    Auth.redirectIfLoggedIn();
    var serviceId = document.getElementById('serviceId');
    var password = document.getElementById('loginPassword');
    var loginBtn = document.getElementById('loginBtn');
    var sendOtpBtn = document.getElementById('sendOtpBtn');
    var otpGroup = document.getElementById('otpGroup');
    var otp = document.getElementById('loginOtp');
    var otpVerified = false;
    const SIMULATED_OTP = '123456';

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
    function validateServiceIdStrict(id) {
      return /^[A-Za-z]{4}\d{6}$/.test(id);
    }
    function validatePasswordProfessional(pw) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pw);
    }
    function validateStep1() {
      let valid = true;
      clearError(serviceId);
      clearError(document.getElementById('loginMobileOrEmail'));
      clearError(document.getElementById('loginRole'));
      if (!serviceId.value.trim() || !validateServiceIdStrict(serviceId.value.trim())) {
        showError(serviceId, 'Format: 4 letters + 6 digits (e.g. ABCD123456)');
        valid = false;
      }
      var mobileOrEmail = document.getElementById('loginMobileOrEmail');
      if (!mobileOrEmail.value.trim()) {
        showError(mobileOrEmail, 'Required');
        valid = false;
      }
      var role = document.getElementById('loginRole');
      if (!role.value) {
        showError(role, 'Select role');
        valid = false;
      }
      return valid;
    }
    function validateLogin() {
      var valid = true;
      clearError(serviceId);
      clearError(password);
      if (!otpVerified) {
        showError(otp, 'OTP not verified');
        valid = false;
      }
      if (!serviceId.value.trim() || !validateServiceIdStrict(serviceId.value.trim())) {
        showError(serviceId, 'Format: 4 letters + 6 digits (e.g. ABCD123456)');
        valid = false;
      }
      if (!password.value) {
        showError(password, 'Password is required');
        valid = false;
      } else if (!validatePasswordProfessional(password.value)) {
        showError(password, 'Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char');
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
      otp.value = '';
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
      if (!validateLogin()) return;
      var sid = serviceId.value.trim();
      var pwd = password.value;
      // Hardcoded fake credentials
      const fakeUsers = [
        { serviceId: 'ADMN123456', password: 'Admin@123', rank: 'Admin' },
        { serviceId: 'COLN123456', password: 'Col@1234', rank: 'Colonel' },
        { serviceId: 'LIEU123456', password: 'Lieut@12', rank: 'Lieutenant' },
        { serviceId: 'ACCO123456', password: 'Acc@1234', rank: 'Accountant' },
        { serviceId: 'SOLD123456', password: 'Sold@123', rank: 'Soldier' }
      ];
      var matchedFake = fakeUsers.find(u => u.serviceId === sid && u.password === pwd && document.getElementById('loginRole').value === u.rank);
      if (matchedFake) {
        // Simulate session for fake user
        DataStorage.setSession({
          serviceId: matchedFake.serviceId,
          rank: matchedFake.rank,
          password: matchedFake.password,
          name: matchedFake.rank,
          email: '',
          mobile: '',
          blocked: false
        });
        DataStorage.addLog('LOGIN', 'User ' + matchedFake.serviceId + ' logged in (FAKE)');
        window.location.href = Auth.getDashboardUrl(matchedFake.rank);
        return;
      }
      // Fallback to localStorage for other users
      var user = DataStorage.getUser(sid);
      if (!user || user.password !== pwd) {
        showError(serviceId, 'Invalid credentials or account blocked');
        return;
      }
      DataStorage.setSession(user);
      DataStorage.addLog('LOGIN', 'User ' + user.serviceId + ' logged in');
      window.location.href = Auth.getDashboardUrl(user.rank);
    });
  }

  if (regForm) {
            // --- Service ID and Password Validation for Registration ---
            function validateServiceIdStrict(id) {
              return /^[A-Za-z]{4}\d{6}$/.test(id);
            }
            function validatePasswordProfessional(pw) {
              // At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
              return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pw);
            }
        // --- Address Data ---
        const countryStateDistrict = {
          India: {
            Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
            Delhi: ['New Delhi', 'South Delhi', 'Dwarka'],
            Karnataka: ['Bangalore', 'Mysore', 'Hubli']
          },
          USA: {
            California: ['Los Angeles', 'San Francisco'],
            Texas: ['Houston', 'Dallas'],
            Florida: ['Miami', 'Orlando']
          }
        };
        function populateDropdown(select, options) {
          select.innerHTML = '<option value="">-- Select --</option>';
          options.forEach(opt => {
            const o = document.createElement('option');
            o.value = o.textContent = opt;
            select.appendChild(o);
          });
        }
        // Main address
        const countrySel = document.getElementById('country');
        const stateSel = document.getElementById('state');
        const districtSel = document.getElementById('district');
        populateDropdown(countrySel, Object.keys(countryStateDistrict));
        countrySel.addEventListener('change', function() {
          const states = countryStateDistrict[this.value] ? Object.keys(countryStateDistrict[this.value]) : [];
          populateDropdown(stateSel, states);
          populateDropdown(districtSel, []);
        });
        stateSel.addEventListener('change', function() {
          const dists = countryStateDistrict[countrySel.value] && countryStateDistrict[countrySel.value][this.value] ? countryStateDistrict[countrySel.value][this.value] : [];
          populateDropdown(districtSel, dists);
        });
        // Guardian address
        const guardianCountry = document.getElementById('guardianCountry');
        const guardianState = document.getElementById('guardianState');
        const guardianDistrict = document.getElementById('guardianDistrict');
        if (guardianCountry && guardianState && guardianDistrict) {
          populateDropdown(guardianCountry, Object.keys(countryStateDistrict));
          guardianCountry.addEventListener('change', function() {
            const states = countryStateDistrict[this.value] ? Object.keys(countryStateDistrict[this.value]) : [];
            populateDropdown(guardianState, states);
            populateDropdown(guardianDistrict, []);
          });
          guardianState.addEventListener('change', function() {
            const dists = countryStateDistrict[guardianCountry.value] && countryStateDistrict[guardianCountry.value][this.value] ? countryStateDistrict[guardianCountry.value][this.value] : [];
            populateDropdown(guardianDistrict, dists);
          });
        }
        // --- Age Calculation ---
        function setAge(dobInputId, ageInputId) {
          const dob = document.getElementById(dobInputId);
          const age = document.getElementById(ageInputId);
          if (!dob || !age) return;
          dob.addEventListener('change', function() {
            if (dob.value) {
              const birth = new Date(dob.value);
              const today = new Date();
              let years = today.getFullYear() - birth.getFullYear();
              const m = today.getMonth() - birth.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) years--;
              age.value = years >= 0 ? years : '';
            } else {
              age.value = '';
            }
          });
        }
        setAge('fatherDob', 'fatherAge');
        setAge('motherDob', 'motherAge');
        setAge('spouseDob', 'spouseAge');
        // --- Guardian Logic ---
        function guardianSectionHandler(relationSelId) {
          const relSel = document.getElementById(relationSelId);
          const guardianSection = document.getElementById('guardianAddressSection');
          if (!relSel || !guardianSection) return;
          relSel.addEventListener('change', function() {
            if (relSel.value === 'Guardian') {
              guardianSection.style.display = 'block';
            } else {
              guardianSection.style.display = 'none';
            }
          });
        }
        guardianSectionHandler('fatherRelation');
        guardianSectionHandler('motherRelation');
        guardianSectionHandler('spouseRelation');
        // --- Freeze Dates ---
        function freezeFutureDates(inputId) {
          const inp = document.getElementById(inputId);
          if (inp) inp.max = new Date().toISOString().split('T')[0];
        }
        freezeFutureDates('dob');
        freezeFutureDates('fatherDob');
        freezeFutureDates('motherDob');
        freezeFutureDates('spouseDob');
        // Joining date: cannot be in future
        freezeFutureDates('joiningDate');
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
        2: ['firstName', 'lastName', 'dob', 'regMobile', 'regEmail', 'address'],
        3: ['fatherFirstName', 'fatherLastName', 'motherFirstName', 'motherLastName', 'emergencyContact', 'regPassword']
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
        if (id === 'regServiceId' && el.value && !validateServiceIdStrict(el.value)) {
          err.textContent = 'Format: 4 letters + 6 digits (e.g. ABCD123456)';
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
        if (id === 'regPassword' && el.value && !validatePasswordProfessional(el.value)) {
          err.textContent = 'Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char';
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
        firstName: document.getElementById('firstName').value.trim(),
        middleName: document.getElementById('middleName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('regEmail').value.trim(),
        mobile: document.getElementById('regMobile').value.trim(),
        battalion: document.getElementById('battalion').value.trim() || '-',
        joiningDate: document.getElementById('joiningDate').value,
        dob: document.getElementById('dob').value,
        address: {
          country: document.getElementById('country').value,
          state: document.getElementById('state').value,
          district: document.getElementById('district').value,
          address: document.getElementById('address').value.trim(),
          zip: document.getElementById('zipCode').value.trim()
        },
        photo: photoData,
        blocked: false,
        family: {
          father: {
            firstName: document.getElementById('fatherFirstName').value.trim(),
            middleName: document.getElementById('fatherMiddleName').value.trim(),
            lastName: document.getElementById('fatherLastName').value.trim(),
            dob: document.getElementById('fatherDob').value,
            age: document.getElementById('fatherAge').value,
            relation: document.getElementById('fatherRelation').value
          },
          mother: {
            firstName: document.getElementById('motherFirstName').value.trim(),
            middleName: document.getElementById('motherMiddleName').value.trim(),
            lastName: document.getElementById('motherLastName').value.trim(),
            dob: document.getElementById('motherDob').value,
            age: document.getElementById('motherAge').value,
            relation: document.getElementById('motherRelation').value
          },
          spouse: {
            firstName: document.getElementById('spouseFirstName').value.trim(),
            middleName: document.getElementById('spouseMiddleName').value.trim(),
            lastName: document.getElementById('spouseLastName').value.trim(),
            dob: document.getElementById('spouseDob').value,
            age: document.getElementById('spouseAge').value,
            relation: document.getElementById('spouseRelation').value
          },
          guardian: (document.getElementById('fatherRelation').value === 'Guardian' || document.getElementById('motherRelation').value === 'Guardian' || document.getElementById('spouseRelation').value === 'Guardian') ? {
            country: document.getElementById('guardianCountry').value,
            state: document.getElementById('guardianState').value,
            district: document.getElementById('guardianDistrict').value,
            address: document.getElementById('guardianAddress').value.trim(),
            zip: document.getElementById('guardianZipCode').value.trim(),
            mobile: document.getElementById('guardianMobile').value.trim()
          } : null
        },
        emergencyContact: document.getElementById('emergencyContact').value.trim()
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
