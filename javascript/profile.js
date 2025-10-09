// DOM Elements
const profileForm = document.getElementById('profileForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const nimInput = document.getElementById('nim');
const phoneInput = document.getElementById('phoneNumber');
const birthDateInput = document.getElementById('birthDate');
const languageSelect = document.getElementById('language');
const bioInput = document.getElementById('bio');
const profileName = document.getElementById('profileName');
const profileInitial = document.getElementById('profileInitial');
const headerUserName = document.getElementById('headerUserName');
const userInitial = document.getElementById('userInitial');

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    checkAuthAndLoadProfile();
    initializeForm();
});

// Check authentication and load profile
function checkAuthAndLoadProfile() {
    const userData = localStorage.getItem('bobolingoUser');
    
    if (!userData) {
        // User not logged in, give option to login
        const wantsToLogin = confirm('You need to log in to access your profile.\n\nWould you like to go to the login page?');
        if (wantsToLogin) {
            window.location.href = 'login.html';
        } else {
            window.location.href = 'dashboard.html';
        }
        return;
    }
    
    const user = JSON.parse(userData);
    
    if (!user.isLoggedIn) {
        // User not logged in, give option to login
        const wantsToLogin = confirm('You need to log in to access your profile.\n\nWould you like to go to the login page?');
        if (wantsToLogin) {
            window.location.href = 'login.html';
        } else {
            window.location.href = 'dashboard.html';
        }
        return;
    }
    
    // Load user profile data
    loadProfileData(user);
}

// Load profile data into form
function loadProfileData(user) {
    // Update page elements
    const initial = user.name.charAt(0).toUpperCase();
    
    if (profileName) profileName.textContent = user.name;
    if (profileInitial) profileInitial.textContent = initial;
    if (headerUserName) headerUserName.textContent = user.name;
    if (userInitial) userInitial.textContent = initial;
    
    // Load form data
    if (fullNameInput) fullNameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (nimInput) nimInput.value = user.nim || '';
    
    // Load additional profile data from localStorage if available
    const profileData = localStorage.getItem('bobolingoProfile');
    if (profileData) {
        const profile = JSON.parse(profileData);
        
        if (phoneInput) phoneInput.value = profile.phoneNumber || '';
        if (birthDateInput) birthDateInput.value = profile.birthDate || '';
        if (languageSelect) languageSelect.value = profile.language || 'en';
        if (bioInput) bioInput.value = profile.bio || '';
        
        // Load preferences
        const emailNotifications = document.getElementById('emailNotifications');
        const dailyReminders = document.getElementById('dailyReminders');
        const weeklyProgress = document.getElementById('weeklyProgress');
        
        if (emailNotifications) emailNotifications.checked = profile.preferences?.emailNotifications || false;
        if (dailyReminders) dailyReminders.checked = profile.preferences?.dailyReminders || false;
        if (weeklyProgress) weeklyProgress.checked = profile.preferences?.weeklyProgress || false;
    }
}

// Initialize form functionality
function initializeForm() {
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Add input change handlers
    if (fullNameInput) {
        fullNameInput.addEventListener('input', function() {
            updateProfileDisplay();
        });
    }
    
    // Add avatar edit functionality
    const avatarEditBtn = document.querySelector('.avatar-edit-btn');
    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', function() {
            alert('Avatar upload functionality would be implemented here.\nFor now, the initial letter of your name is used.');
        });
    }
}

// Update profile display in real-time
function updateProfileDisplay() {
    const newName = fullNameInput.value.trim();
    if (newName) {
        const initial = newName.charAt(0).toUpperCase();
        
        if (profileName) profileName.textContent = newName;
        if (profileInitial) profileInitial.textContent = initial;
        if (headerUserName) headerUserName.textContent = newName.split(' ')[0]; // First name only
        if (userInitial) userInitial.textContent = initial;
    }
}

// Handle profile form submission
function handleProfileUpdate(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(profileForm);
    const profileData = {
        name: formData.get('fullName'),
        email: formData.get('email'),
        nim: formData.get('nim'),
        phoneNumber: formData.get('phoneNumber'),
        birthDate: formData.get('birthDate'),
        language: formData.get('language'),
        bio: formData.get('bio'),
        preferences: {
            emailNotifications: document.getElementById('emailNotifications').checked,
            dailyReminders: document.getElementById('dailyReminders').checked,
            weeklyProgress: document.getElementById('weeklyProgress').checked
        },
        updatedAt: new Date().toISOString()
    };
    
    // Validate form data
    if (!validateProfileForm(profileData)) {
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Simulate save process
    setTimeout(() => {
        saveProfileData(profileData);
        showSuccessMessage('Profile updated successfully!');
        hideLoadingState();
    }, 1500);
}

// Validate profile form
function validateProfileForm(data) {
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate name
    if (!data.name || data.name.trim().length < 2) {
        showFieldError(fullNameInput, 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate email
    if (!data.email || !isValidEmail(data.email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate NIM if provided
    if (data.nim && !isValidNIM(data.nim)) {
        showFieldError(nimInput, 'NIM should contain only numbers');
        isValid = false;
    }
    
    // Validate phone number if provided
    if (data.phoneNumber && !isValidPhone(data.phoneNumber)) {
        showFieldError(phoneInput, 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

// Validation helper functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidNIM(nim) {
    return /^\d+$/.test(nim);
}

function isValidPhone(phone) {
    return /^[\+]?[\d\s\-\(\)]{10,}$/.test(phone);
}

// Save profile data
function saveProfileData(profileData) {
    // Update user data in localStorage
    const userData = JSON.parse(localStorage.getItem('bobolingoUser'));
    userData.name = profileData.name;
    userData.email = profileData.email;
    userData.nim = profileData.nim;
    
    localStorage.setItem('bobolingoUser', JSON.stringify(userData));
    
    // Save extended profile data
    localStorage.setItem('bobolingoProfile', JSON.stringify(profileData));
}

// Show/Hide loading state
function showLoadingState() {
    const submitBtn = profileForm.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;
}

function hideLoadingState() {
    const submitBtn = profileForm.querySelector('button[type="submit"]');
    submitBtn.classList.remove('loading');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
    submitBtn.disabled = false;
}

// Success/Error message functions
function showSuccessMessage(message) {
    removeExistingMessages();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message success';
    messageDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    profileForm.parentElement.insertBefore(messageDiv, profileForm);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.parentElement.removeChild(messageDiv);
        }
    }, 3000);
}

function showErrorMessage(message) {
    removeExistingMessages();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message error';
    messageDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    profileForm.parentElement.insertBefore(messageDiv, profileForm);
}

function removeExistingMessages() {
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => {
        if (msg.parentElement) {
            msg.parentElement.removeChild(msg);
        }
    });
}

// Field error functions
function showFieldError(input, message) {
    input.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc2626;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    
    input.parentElement.appendChild(errorDiv);
}

function clearFormErrors() {
    const errorInputs = document.querySelectorAll('.form-input.error');
    const errorMessages = document.querySelectorAll('.field-error');
    
    errorInputs.forEach(input => input.classList.remove('error'));
    errorMessages.forEach(error => {
        if (error.parentElement) {
            error.parentElement.removeChild(error);
        }
    });
}

// Sign out function
function signOut() {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to sign out?\\n\\nYou will be redirected to the home page.');
    
    if (confirmed) {
        // Show loading state
        const signoutBtn = document.querySelector('.signout-btn');
        signoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing out...';
        signoutBtn.disabled = true;
        
        // Clear user data after a short delay
        setTimeout(() => {
            localStorage.removeItem('bobolingoUser');
            localStorage.removeItem('bobolingoProfile');
            
            // Redirect to home page
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Auto-save functionality (optional)
function enableAutoSave() {
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            // Auto-save after 2 seconds of no changes
            clearTimeout(window.autoSaveTimer);
            window.autoSaveTimer = setTimeout(() => {
                console.log('Auto-saving profile...');
                // You could implement auto-save here
            }, 2000);
        });
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (profileForm) {
            profileForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to cancel/clear errors
    if (e.key === 'Escape') {
        clearFormErrors();
        removeExistingMessages();
    }
});

// Initialize auto-save when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Uncomment to enable auto-save
    // enableAutoSave();
});