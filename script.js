// Storage keys
const PROFILES_KEY = 'gooddoctor_profiles';
const REVIEWS_KEY = 'gooddoctor_reviews';

// Initialize data structures
let profiles = [];
let reviews = [];
let currentRating = 0;

// Utility function to escape HTML and prevent XSS
function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Load data from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    displayRecentReviews();
    setupFormHandlers();
});

// Load data from localStorage
function loadData() {
    const savedProfiles = localStorage.getItem(PROFILES_KEY);
    const savedReviews = localStorage.getItem(REVIEWS_KEY);
    
    profiles = savedProfiles ? JSON.parse(savedProfiles) : [];
    reviews = savedReviews ? JSON.parse(savedReviews) : [];
}

// Save data to localStorage
function saveData() {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

// Navigation
function showSection(sectionId, clickedButton) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked button if provided
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    // Refresh content based on section
    if (sectionId === 'home') {
        displayRecentReviews();
    } else if (sectionId === 'search') {
        searchProfiles();
    }
}

// Form Handlers
function setupFormHandlers() {
    // Profile form submission
    document.getElementById('profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        createProfile();
    });
    
    // Review form submission
    document.getElementById('reviewForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitReview();
    });
}

// Update profile form based on type
function updateProfileForm() {
    const profileType = document.getElementById('profileType').value;
    
    // Hide all conditional fields
    document.querySelectorAll('.conditional-fields').forEach(field => {
        field.style.display = 'none';
        // Reset required attributes
        field.querySelectorAll('input, select').forEach(input => {
            input.removeAttribute('required');
        });
    });
    
    // Show relevant fields
    if (profileType === 'doctor') {
        const doctorFields = document.getElementById('doctorFields');
        doctorFields.style.display = 'block';
        document.getElementById('specialization').setAttribute('required', 'required');
    } else if (profileType === 'hospital') {
        document.getElementById('hospitalFields').style.display = 'block';
    } else if (profileType === 'lab') {
        document.getElementById('labFields').style.display = 'block';
    }
}

// Create Profile
function createProfile() {
    const profileType = document.getElementById('profileType').value;
    const profileName = document.getElementById('profileName').value;
    
    // Check if profile already exists
    const existingProfile = profiles.find(p => 
        p.type === profileType && 
        p.name.toLowerCase() === profileName.toLowerCase()
    );
    
    if (existingProfile) {
        showMessage('error', 'A profile with this name already exists!');
        return;
    }
    
    // Create base profile with unique ID
    const profile = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        type: profileType,
        name: profileName,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        createdAt: new Date().toISOString(),
        reviewCount: 0,
        averageRating: 0
    };
    
    // Add type-specific fields
    if (profileType === 'doctor') {
        profile.specialization = document.getElementById('specialization').value;
        profile.qualification = document.getElementById('qualification').value;
        profile.experience = document.getElementById('experience').value;
        profile.workingHospital = document.getElementById('workingHospital').value;
        profile.department = document.getElementById('department').value;
    } else if (profileType === 'hospital') {
        profile.hospitalType = document.getElementById('hospitalType').value;
        profile.beds = document.getElementById('beds').value;
        profile.departments = document.getElementById('departments').value;
    } else if (profileType === 'lab') {
        profile.labServices = document.getElementById('labServices').value;
        profile.accreditation = document.getElementById('accreditation').value;
    }
    
    // Add to profiles array
    profiles.push(profile);
    saveData();
    
    // Show success message
    showMessage('success', 'Profile created successfully!');
    
    // Reset form
    document.getElementById('profileForm').reset();
    document.querySelectorAll('.conditional-fields').forEach(field => {
        field.style.display = 'none';
    });
    
    // Switch to add review section
    setTimeout(() => {
        showSection('add-review');
        loadProfiles();
    }, 2000);
}

// Load profiles for review form
function loadProfiles() {
    const reviewType = document.getElementById('reviewType').value;
    const reviewProfile = document.getElementById('reviewProfile');
    
    if (!reviewType) {
        reviewProfile.innerHTML = '<option value="">First select review type</option>';
        return;
    }
    
    const filteredProfiles = profiles.filter(p => p.type === reviewType);
    
    if (filteredProfiles.length === 0) {
        reviewProfile.innerHTML = '<option value="">No profiles found - please add one first</option>';
        return;
    }
    
    reviewProfile.innerHTML = '<option value="">Select a provider</option>';
    filteredProfiles.forEach(profile => {
        const option = document.createElement('option');
        option.value = profile.id;
        option.textContent = profile.name + (profile.city ? ` - ${profile.city}` : '');
        reviewProfile.appendChild(option);
    });
}

// Rating functionality
function setRating(rating) {
    currentRating = rating;
    document.getElementById('rating').value = rating;
    
    // Update star display
    document.querySelectorAll('.star').forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.classList.add('active');
            star.textContent = '★';
        } else {
            star.classList.remove('active');
            star.textContent = '☆';
        }
    });
}

// Submit Review
function submitReview() {
    const profileId = parseInt(document.getElementById('reviewProfile').value);
    const rating = parseInt(document.getElementById('rating').value);
    
    if (!profileId) {
        showMessage('error', 'Please select a provider');
        return;
    }
    
    if (!rating) {
        showMessage('error', 'Please select a rating');
        return;
    }
    
    const review = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        profileId: profileId,
        profileType: document.getElementById('reviewType').value,
        rating: rating,
        visitDate: document.getElementById('visitDate').value,
        title: document.getElementById('reviewTitle').value,
        content: document.getElementById('reviewText').value,
        behaviorRating: parseInt(document.getElementById('behaviorRating').value),
        waitTimeRating: parseInt(document.getElementById('waitTimeRating').value),
        cleanlinessRating: parseInt(document.getElementById('cleanlinessRating').value),
        proofType: document.getElementById('proofType').value,
        proofId: document.getElementById('proofId').value,
        reviewerName: document.getElementById('reviewerName').value || 'Anonymous',
        verified: true,
        createdAt: new Date().toISOString()
    };
    
    // Add review
    reviews.push(review);
    
    // Update profile statistics
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
        const profileReviews = reviews.filter(r => r.profileId === profileId);
        profile.reviewCount = profileReviews.length;
        profile.averageRating = profileReviews.reduce((sum, r) => sum + r.rating, 0) / profileReviews.length;
    }
    
    saveData();
    
    // Show success message
    showMessage('success', 'Review submitted successfully! Thank you for your feedback.');
    
    // Reset form
    document.getElementById('reviewForm').reset();
    currentRating = 0;
    document.querySelectorAll('.star').forEach(star => {
        star.classList.remove('active');
        star.textContent = '☆';
    });
    
    // Switch to home section after delay
    setTimeout(() => {
        showSection('home');
    }, 2000);
}

// Search Profiles
function searchProfiles() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    
    let filteredProfiles = profiles;
    
    // Apply type filter
    if (typeFilter !== 'all') {
        filteredProfiles = filteredProfiles.filter(p => p.type === typeFilter);
    }
    
    // Apply search term
    if (searchTerm) {
        filteredProfiles = filteredProfiles.filter(p => {
            return (
                p.name.toLowerCase().includes(searchTerm) ||
                (p.city && p.city.toLowerCase().includes(searchTerm)) ||
                (p.state && p.state.toLowerCase().includes(searchTerm)) ||
                (p.specialization && p.specialization.toLowerCase().includes(searchTerm)) ||
                (p.department && p.department.toLowerCase().includes(searchTerm)) ||
                (p.workingHospital && p.workingHospital.toLowerCase().includes(searchTerm)) ||
                (p.departments && p.departments.toLowerCase().includes(searchTerm))
            );
        });
    }
    
    displaySearchResults(filteredProfiles);
}

// Display Search Results
function displaySearchResults(filteredProfiles) {
    const resultsDiv = document.getElementById('searchResults');
    
    if (filteredProfiles.length === 0) {
        resultsDiv.innerHTML = `
            <div class="empty-state">
                <h3>No profiles found</h3>
                <p>Try different search terms or add a new profile</p>
            </div>
        `;
        return;
    }
    
    resultsDiv.innerHTML = filteredProfiles.map(profile => {
        const profileReviews = reviews.filter(r => r.profileId === profile.id);
        const stars = profile.averageRating > 0 ? '★'.repeat(Math.round(profile.averageRating)) + '☆'.repeat(5 - Math.round(profile.averageRating)) : 'No ratings yet';
        
        return `
            <div class="profile-card">
                <div class="profile-header">
                    <div>
                        <div class="profile-name">${escapeHtml(profile.name)}</div>
                        ${profile.specialization ? `<div style="color: #666; margin-top: 5px;">${escapeHtml(profile.specialization)}</div>` : ''}
                        ${profile.workingHospital ? `<div style="color: #666; font-size: 0.9rem; margin-top: 3px;">Working at: ${escapeHtml(profile.workingHospital)}</div>` : ''}
                    </div>
                    <span class="profile-type">${escapeHtml(profile.type)}</span>
                </div>
                <div class="profile-details">
                    ${profile.qualification ? `<p><strong>Qualification:</strong> ${escapeHtml(profile.qualification)}</p>` : ''}
                    ${profile.experience ? `<p><strong>Experience:</strong> ${escapeHtml(profile.experience)} years</p>` : ''}
                    ${profile.department ? `<p><strong>Department:</strong> ${escapeHtml(profile.department)}</p>` : ''}
                    ${profile.hospitalType ? `<p><strong>Type:</strong> ${escapeHtml(profile.hospitalType)}</p>` : ''}
                    ${profile.beds ? `<p><strong>Beds:</strong> ${escapeHtml(profile.beds)}</p>` : ''}
                    ${profile.departments ? `<p><strong>Departments:</strong> ${escapeHtml(profile.departments)}</p>` : ''}
                    ${profile.labServices ? `<p><strong>Services:</strong> ${escapeHtml(profile.labServices)}</p>` : ''}
                    ${profile.accreditation ? `<p><strong>Accreditation:</strong> ${escapeHtml(profile.accreditation)}</p>` : ''}
                    <p><strong>Location:</strong> ${escapeHtml(profile.city)}, ${escapeHtml(profile.state)}</p>
                    ${profile.phone ? `<p><strong>Phone:</strong> ${escapeHtml(profile.phone)}</p>` : ''}
                </div>
                <div class="profile-rating">
                    <span class="rating-stars">${stars}</span>
                    <span class="rating-count">(${profile.reviewCount} reviews)</span>
                </div>
                <button class="view-reviews-btn" onclick="viewProfileReviews('${escapeHtml(profile.id)}')">View Reviews</button>
            </div>
        `;
    }).join('');
}

// View Profile Reviews
function viewProfileReviews(profileId) {
    const profile = profiles.find(p => p.id === profileId);
    const profileReviews = reviews.filter(r => r.profileId === profileId);
    
    if (!profile) return;
    
    const resultsDiv = document.getElementById('searchResults');
    
    if (profileReviews.length === 0) {
        resultsDiv.innerHTML = `
            <div class="message info">
                <button onclick="searchProfiles()" style="float: right; background: none; border: none; cursor: pointer; font-size: 1.2rem;">×</button>
                <h3>${escapeHtml(profile.name)}</h3>
                <p>No reviews yet. Be the first to review!</p>
            </div>
        `;
        return;
    }
    
    const reviewsHTML = profileReviews.map(review => generateReviewHTML(review, profile)).join('');
    
    resultsDiv.innerHTML = `
        <div class="message info" style="display: flex; justify-content: space-between; align-items: center;">
            <h3>Reviews for ${escapeHtml(profile.name)}</h3>
            <button onclick="searchProfiles()" style="background: none; border: none; cursor: pointer; font-size: 1.5rem; padding: 0 10px;">×</button>
        </div>
        ${reviewsHTML}
    `;
}

// Generate Review HTML
function generateReviewHTML(review, profile = null) {
    if (!profile) {
        profile = profiles.find(p => p.id === review.profileId);
    }
    
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const date = new Date(review.visitDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    
    const aspectLabels = {
        behaviorRating: 'Behavior',
        waitTimeRating: 'Wait Time',
        cleanlinessRating: 'Cleanliness'
    };
    
    const aspectValues = {
        5: 'Excellent',
        4: 'Good',
        3: 'Average',
        2: 'Poor',
        1: 'Very Poor'
    };
    
    return `
        <div class="review-card">
            <div class="review-header">
                <div>
                    <div class="review-title">${escapeHtml(review.title)}</div>
                    <div class="review-meta">
                        <div class="review-rating">
                            <span class="review-stars">${stars}</span>
                            <span>${review.rating}/5</span>
                        </div>
                        <span>Visited: ${date}</span>
                        <span>By: ${escapeHtml(review.reviewerName)}</span>
                    </div>
                </div>
                ${review.verified ? '<span class="verified-badge">✓ Verified Visit</span>' : ''}
            </div>
            ${profile ? `<p style="color: #667eea; font-weight: 600; margin-bottom: 10px;">Review for: ${escapeHtml(profile.name)}</p>` : ''}
            <div class="review-content">${escapeHtml(review.content)}</div>
            <div class="review-aspects">
                <div class="aspect"><strong>Behavior:</strong> ${aspectValues[review.behaviorRating]}</div>
                <div class="aspect"><strong>Wait Time:</strong> ${aspectValues[review.waitTimeRating]}</div>
                <div class="aspect"><strong>Cleanliness:</strong> ${aspectValues[review.cleanlinessRating]}</div>
            </div>
            <div class="review-footer">
                <span>Proof: ${escapeHtml(review.proofType.replace('_', ' ').toUpperCase())}</span>
                <span>Posted: ${new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    `;
}

// Display Recent Reviews
function displayRecentReviews() {
    const recentReviewsList = document.getElementById('recentReviewsList');
    
    if (reviews.length === 0) {
        recentReviewsList.innerHTML = `
            <div class="empty-state">
                <h3>No reviews yet</h3>
                <p>Be the first to share your healthcare experience!</p>
            </div>
        `;
        return;
    }
    
    // Get last 5 reviews
    const recentReviews = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    
    recentReviewsList.innerHTML = recentReviews.map(review => generateReviewHTML(review)).join('');
}

// Show Message
function showMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    
    // Insert at the top of the active section
    const activeSection = document.querySelector('.section.active');
    activeSection.insertBefore(messageDiv, activeSection.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Add some sample data for demonstration (only if no data exists)
function addSampleData() {
    if (profiles.length === 0) {
        // Sample Doctors
        profiles.push({
            id: 1,
            type: 'doctor',
            name: 'Dr. Sarah Johnson',
            specialization: 'Cardiologist',
            qualification: 'MD, DM (Cardiology)',
            experience: '15',
            workingHospital: 'City General Hospital',
            department: 'Cardiology',
            address: '123 Medical Center Drive',
            city: 'Mumbai',
            state: 'Maharashtra',
            phone: '+91-9876543210',
            email: 'dr.sarah@example.com',
            createdAt: new Date().toISOString(),
            reviewCount: 2,
            averageRating: 4.5
        });
        
        profiles.push({
            id: 2,
            type: 'hospital',
            name: 'City General Hospital',
            hospitalType: 'private',
            beds: '500',
            departments: 'Cardiology, Orthopedics, Emergency, ICU, Pediatrics',
            address: '123 Medical Center Drive',
            city: 'Mumbai',
            state: 'Maharashtra',
            phone: '+91-9876543200',
            email: 'info@citygeneralhospital.com',
            createdAt: new Date().toISOString(),
            reviewCount: 1,
            averageRating: 4
        });
        
        profiles.push({
            id: 3,
            type: 'lab',
            name: 'HealthCare Diagnostics',
            labServices: 'Blood Tests, X-Ray, MRI, CT Scan, Ultrasound',
            accreditation: 'NABL, ISO 9001:2015',
            address: '456 Lab Street',
            city: 'Delhi',
            state: 'Delhi',
            phone: '+91-9876543220',
            email: 'info@healthcarediagnostics.com',
            createdAt: new Date().toISOString(),
            reviewCount: 1,
            averageRating: 5
        });
        
        // Sample Reviews
        reviews.push({
            id: 1001,
            profileId: 1,
            profileType: 'doctor',
            rating: 5,
            visitDate: '2024-01-15',
            title: 'Excellent care and professional behavior',
            content: 'Dr. Sarah Johnson is an outstanding cardiologist. She took time to explain my condition thoroughly and answered all my questions patiently. The treatment plan was effective and I am feeling much better now.',
            behaviorRating: 5,
            waitTimeRating: 4,
            cleanlinessRating: 5,
            proofType: 'op_id',
            proofId: 'OP123456',
            reviewerName: 'John Doe',
            verified: true,
            createdAt: new Date('2024-01-20').toISOString()
        });
        
        reviews.push({
            id: 1002,
            profileId: 1,
            profileType: 'doctor',
            rating: 4,
            visitDate: '2024-02-10',
            title: 'Good doctor but long wait time',
            content: 'Dr. Johnson is very knowledgeable and caring. However, the wait time was quite long. Overall satisfied with the consultation.',
            behaviorRating: 5,
            waitTimeRating: 2,
            cleanlinessRating: 4,
            proofType: 'prescription',
            proofId: 'RX789012',
            reviewerName: 'Anonymous',
            verified: true,
            createdAt: new Date('2024-02-12').toISOString()
        });
        
        reviews.push({
            id: 1003,
            profileId: 2,
            profileType: 'hospital',
            rating: 4,
            visitDate: '2024-01-20',
            title: 'Well-equipped hospital with good staff',
            content: 'The hospital has modern facilities and the staff is professional. The emergency department was quick to respond. Cleanliness could be improved in some areas.',
            behaviorRating: 4,
            waitTimeRating: 4,
            cleanlinessRating: 3,
            proofType: 'bill',
            proofId: 'BILL345678',
            reviewerName: 'Jane Smith',
            verified: true,
            createdAt: new Date('2024-01-22').toISOString()
        });
        
        reviews.push({
            id: 1004,
            profileId: 3,
            profileType: 'lab',
            rating: 5,
            visitDate: '2024-02-01',
            title: 'Fast and accurate results',
            content: 'Got my blood test results within 24 hours. The staff was courteous and the collection process was painless. Highly recommend this lab.',
            behaviorRating: 5,
            waitTimeRating: 5,
            cleanlinessRating: 5,
            proofType: 'report',
            proofId: 'RPT901234',
            reviewerName: 'Mike Wilson',
            verified: true,
            createdAt: new Date('2024-02-03').toISOString()
        });
        
        saveData();
    }
}

// Initialize sample data
addSampleData();
