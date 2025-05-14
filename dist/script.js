document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');

    // Helper functions for error handling
    const showError = (input, errorElement, message) => {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        if (input.type === 'radio') {
            // For radio buttons, highlight the fieldset or container
            input.closest('fieldset').classList.add('border-red-500', 'border', 'rounded-md', 'p-2');
        } else {
            input.classList.add('border-red-500');
        }
    };

    const clearError = (input, errorElement) => {
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
        if (input.type === 'radio') {
            input.closest('fieldset').classList.remove('border-red-500', 'border', 'rounded-md', 'p-2');
        } else {
            input.classList.remove('border-red-500');
        }
    };

    // Validate age (must be 18+)
    const isOver18 = (dateString) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 18;
        }
        return age >= 18;
    };

    // Set max date to today
    document.getElementById('dateOfBirth').max = new Date().toISOString().split('T')[0];

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Reset errors
        document.querySelectorAll('.text-red-500').forEach((error) => {
            error.textContent = '';
            error.classList.add('hidden');
        });
        form.querySelectorAll('input').forEach((input) => {
            input.classList.remove('border-red-500');
        });
        form.querySelectorAll('fieldset').forEach((fieldset) => {
            fieldset.classList.remove('border-red-500', 'border', 'rounded-md', 'p-2');
        });

        // Check if all fields are empty
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const dateInput = document.getElementById('dateOfBirth');
        const passwordInput = document.getElementById('password');
        const gender = document.querySelector('input[name="gender"]:checked');

        const allFieldsEmpty =
            !firstNameInput.value.trim() &&
            !lastNameInput.value.trim() &&
            !emailInput.value.trim() &&
            !phoneInput.value.trim() &&
            !dateInput.value &&
            !passwordInput.value &&
            !gender;

        const generalError = document.getElementById('general-error');
        if (allFieldsEmpty) {
            generalError.textContent = 'Please fill in all fields.';
            generalError.classList.remove('hidden');
            [firstNameInput, lastNameInput, emailInput, phoneInput, dateInput, passwordInput].forEach(
                (input) => {
                    input.classList.add('border-red-500');
                }
            );
            // Highlight gender fieldset
            document
                .querySelector('input[name="gender"]')
                .closest('fieldset')
                .classList.add('border-red-500', 'border', 'rounded-md', 'p-2');
            firstNameInput.focus();
            return; // Stop further validation
        } else {
            generalError.textContent = '';
            generalError.classList.add('hidden');
        }

        // First Name
        const firstName = firstNameInput.value.trim();
        const firstNameError = document.getElementById('firstName-error');
        if (!firstName) {
            showError(firstNameInput, firstNameError, 'First name is required.');
            isValid = false;
        } else if (!/^[A-Za-z]{2,}$/.test(firstName)) {
            showError(firstNameInput, firstNameError, 'First name must be at least 2 letters.');
            isValid = false;
        } else {
            clearError(firstNameInput, firstNameError);
        }

        // Last Name
        const lastName = lastNameInput.value.trim();
        const lastNameError = document.getElementById('lastName-error');
        if (!lastName) {
            showError(lastNameInput, lastNameError, 'Last name is required.');
            isValid = false;
        } else if (!/^[A-Za-z]{2,}$/.test(lastName)) {
            showError(lastNameInput, lastNameError, 'Last name must be at least 2 letters.');
            isValid = false;
        } else {
            clearError(lastNameInput, lastNameError);
        }

        // Gender
        const genderError = document.getElementById('gender-error');
        const genderInput = document.querySelector('input[name="gender"]');
        if (!gender) {
            showError(genderInput, genderError, 'Please select a gender.');
            isValid = false;
        } else {
            clearError(genderInput, genderError);
        }

        // Email
        const email = emailInput.value.trim();
        const emailError = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showError(emailInput, emailError, 'Email is required.');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError(emailInput, emailError, 'Please enter a valid email address.');
            isValid = false;
        } else {
            clearError(emailInput, emailError);
        }

        // Phone
        const phone = phoneInput.value.trim();
        const phoneError = document.getElementById('phone-error');
        const phoneRegex = /^\+?[\d-]{10,15}$/;
        if (!phone) {
            showError(phoneInput, phoneError, 'Phone number is required.');
            isValid = false;
        } else if (!phoneRegex.test(phone)) {
            showError(phoneInput, phoneError, 'Please enter a valid phone number (10-15 digits).');
            isValid = false;
        } else {
            clearError(phoneInput, phoneError);
        }

        // Date of Birth
        const dateOfBirth = dateInput.value;
        const dateError = document.getElementById('dateOfBirth-error');
        if (!dateOfBirth) {
            showError(dateInput, dateError, 'Date of birth is required.');
            isValid = false;
        } else if (!isOver18(dateOfBirth)) {
            showError(dateInput, dateError, 'You must be at least 18 years old.');
            isValid = false;
        } else {
            clearError(dateInput, dateError);
        }

        // Password
        const password = passwordInput.value;
        const passwordError = document.getElementById('password-error');
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!password) {
            showError(passwordInput, passwordError, 'Password is required.');
            isValid = false;
        } else if (!passwordRegex.test(password)) {
            showError(
                passwordInput,
                passwordError,
                'Password must be 8+ characters with at least one letter and one number.'
            );
            isValid = false;
        } else {
            clearError(passwordInput, passwordError);
        }

        // Focus on first error
        if (!isValid) {
            const firstError = document.querySelector('.text-red-500:not(.hidden)');
            if (firstError) {
                const inputId = firstError.id.replace('-error', '');
                const input = document.getElementById(inputId);
                if (input) input.focus();
            }
        }

        // Submit if valid
        if (isValid) {
            alert('Form submitted successfully!');
            form.submit();
        }

        const button = document.getElementById('mybutton')
        button.addEventListener('click', () => {
            alert ('Button Clicked!')
        })
    });

    // Real-time validation
    form.querySelectorAll('input').forEach((input) => {
        input.addEventListener('input', () => {
            const errorElement = document.getElementById(`${input.id}-error`);
            if (input.type === 'radio') {
                if (document.querySelector('input[name="gender"]:checked')) {
                    clearError(input, errorElement);
                }
            } else if (input.value.trim()) {
                clearError(input, errorElement);
            }
        });
    });
});