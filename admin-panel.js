// admin-panel.js - ИСПРАВЛЕННАЯ ВЕРСИЯ
class AdminPanel {
    constructor() {
        this.sections = JSON.parse(localStorage.getItem('adminSections')) || [];
        this.currentAdmin = 'Levi Ackerman';
        this.isAdminMode = localStorage.getItem('adminSession') === 'true';
    }

    init() {
        this.setupAdminStyles();
        this.renderAdminInterface();
        this.setupEventListeners();
        this.loadExistingSections();
    }

    renderAdminInterface() {
        this.removeAdminInterface();
        
        if (this.isAdminMode) {
            this.renderAdminSections();
            this.showAdminIndicator();
        }
        
        this.updateAdminButton();
    }

    renderAdminSections() {
        const adminSectionsHTML = `
            <!-- Admin Dashboard Section -->
            <section class="admin-dashboard-section py-5" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="admin-header-card card card-custom fade-in">
                                <div class="card-body card-body-custom">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="d-flex align-items-center">
                                            <div class="admin-avatar me-3">LA</div>
                                            <div>
                                                <h4 class="card-title-custom mb-1">${this.currentAdmin}</h4>
                                                <p class="text-muted mb-0">Administrator Mode</p>
                                            </div>
                                        </div>
                                        <div class="admin-controls">
                                            <button class="btn btn-custom me-2" id="adminAddSectionBtn">
                                                <i class="fas fa-plus me-2"></i>Add Section
                                            </button>
                                            <button class="btn btn-outline-custom" id="adminExitBtn">
                                                <i class="fas fa-user me-2"></i>Exit Admin Mode
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Admin Content Management Section -->
            <section class="admin-content-section py-5">
                <div class="container">
                    <h3 class="aca-section-title fade-in">Content Management</h3>
                    
                    <div class="row mb-4">
                        <div class="col-md-3">
                            <div class="admin-stat-card card card-custom text-center">
                                <div class="card-body">
                                    <i class="fas fa-layer-group fa-2x text-primary mb-3"></i>
                                    <h3 class="counter-number">${this.sections.length}</h3>
                                    <p class="card-text-custom">Total Sections</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="admin-stat-card card card-custom text-center">
                                <div class="card-body">
                                    <i class="fas fa-user fa-2x text-success mb-3"></i>
                                    <h3 class="counter-number">1</h3>
                                    <p class="card-text-custom">Active Admin</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="admin-stat-card card card-custom text-center">
                                <div class="card-body">
                                    <i class="fas fa-edit fa-2x text-warning mb-3"></i>
                                    <h3 class="counter-number">${this.sections.filter(s => new Date(s.updatedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}</h3>
                                    <p class="card-text-custom">Updated Today</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="admin-stat-card card card-custom text-center">
                                <div class="card-body">
                                    <i class="fas fa-tags fa-2x text-info mb-3"></i>
                                    <h3 class="counter-number">${new Set(this.sections.map(s => s.category)).size}</h3>
                                    <p class="card-text-custom">Categories</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="card card-custom">
                                <div class="card-body card-body-custom">
                                    <div class="d-flex justify-content-between align-items-center mb-4">
                                        <h4 class="card-title-custom mb-0">Manage Sections</h4>
                                        <button class="btn btn-custom btn-sm" id="adminQuickAddBtn">
                                            <i class="fas fa-plus me-2"></i>Quick Add
                                        </button>
                                    </div>
                                    
                                    <div class="admin-sections-list" id="adminSectionsList">
                                        ${this.renderSectionsList()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        const $heroSection = $('.aca-hero');
        if ($heroSection.length) {
            $heroSection.after(adminSectionsHTML);
        } else {
            $('body').prepend(adminSectionsHTML);
        }
    }

    renderSectionsList() {
        if (this.sections.length === 0) {
            return `
                <div class="text-center py-5">
                    <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No Sections Created Yet</h5>
                    <p class="text-muted">Start by adding your first content section!</p>
                    <button class="btn btn-custom mt-2" onclick="adminPanel.showAddSectionModal()">
                        <i class="fas fa-plus me-2"></i>Create First Section
                    </button>
                </div>
            `;
        }

        return this.sections.map(section => `
            <div class="admin-section-item card mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h5 class="section-title mb-2">${section.title}</h5>
                            <p class="section-preview text-muted mb-2">${section.content.substring(0, 120)}...</p>
                            <div class="section-meta">
                                <span class="badge bg-primary me-2">${section.category}</span>
                                <small class="text-muted">
                                    <i class="fas fa-user me-1"></i>${section.author} • 
                                    <i class="fas fa-calendar me-1"></i>${new Date(section.createdAt).toLocaleDateString()}
                                </small>
                            </div>
                        </div>
                        <div class="col-md-4 text-end">
                            <div class="btn-group">
                                <button class="btn btn-outline-primary btn-sm" onclick="adminPanel.editSection('${section.id}')">
                                    <i class="fas fa-edit me-1"></i>Edit
                                </button>
                                <button class="btn btn-outline-danger btn-sm" onclick="adminPanel.deleteSection('${section.id}')">
                                    <i class="fas fa-trash me-1"></i>Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupAdminStyles() {
        $('#admin-panel-styles').remove();

        const styles = `
            <style id="admin-panel-styles">
                /* Admin Dashboard Styles */
                .admin-dashboard-section {
                    border-bottom: 3px solid #B22234;
                }

                .admin-header-card {
                    background: linear-gradient(135deg, #3C3B6E 0%, #2A2A5E 100%) !important;
                    color: white;
                }

                .admin-header-card .card-title-custom,
                .admin-header-card .text-muted {
                    color: white !important;
                }

                .admin-avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #B22234 0%, #9e1c2d 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 20px;
                }

                .admin-controls .btn {
                    border-radius: 25px;
                    padding: 10px 20px;
                    font-weight: 600;
                }

                .admin-stat-card {
                    transition: all 0.3s ease;
                    border: none;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }

                .admin-stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }

                .admin-stat-card .counter-number {
                    font-size: 2.5rem;
                    font-weight: bold;
                    margin: 10px 0;
                    background: linear-gradient(135deg, #3C3B6E, #B22234);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .admin-section-item {
                    transition: all 0.3s ease;
                    border: none;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                }

                .admin-section-item:hover {
                    transform: translateX(5px);
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
                }

                .section-title {
                    color: #3C3B6E;
                    font-weight: 600;
                }

                .section-preview {
                    font-size: 0.9rem;
                    line-height: 1.4;
                }

                .admin-sections-list {
                    max-height: 600px;
                    overflow-y: auto;
                }

                /* Admin Mode Indicator */
                .admin-mode-indicator {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: linear-gradient(135deg, #B22234, #9e1c2d);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    z-index: 9999;
                    box-shadow: 0 4px 15px rgba(178, 34, 52, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    animation: slideInRight 0.5s ease;
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                /* Modal Styles */
                .admin-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 10001;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .admin-modal-content {
                    background: white;
                    border-radius: 15px;
                    padding: 30px;
                    width: 90%;
                    max-width: 600px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .admin-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #e9ecef;
                }

                .admin-modal-title {
                    color: #3C3B6E;
                    font-weight: 600;
                    font-size: 1.5rem;
                    margin: 0;
                }

                .close-admin-modal {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                    padding: 5px;
                    border-radius: 4px;
                    transition: background 0.3s ease;
                }

                .close-admin-modal:hover {
                    background: #f8f9fa;
                }

                .admin-form-group {
                    margin-bottom: 20px;
                }

                .admin-form-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #3C3B6E;
                }

                .admin-form-control {
                    width: 100%;
                    padding: 12px 15px;
                    border: 2px solid #e8e8e8;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .admin-form-control:focus {
                    border-color: #3C3B6E;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(60, 59, 110, 0.1);
                }

                .admin-form-actions {
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 1px solid #e9ecef;
                }

                /* Dark theme styles */
                .dark-theme .admin-dashboard-section {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
                }

                .dark-theme .admin-header-card {
                    background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%) !important;
                }

                .dark-theme .admin-stat-card {
                    background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%);
                }

                .dark-theme .admin-section-item {
                    background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%);
                }

                .dark-theme .section-title {
                    color: #ffffff;
                }

                .dark-theme .admin-modal-content {
                    background: #1a1a2e;
                    color: #e8e8e8;
                }

                .dark-theme .admin-modal-title {
                    color: #ffffff;
                }

                .dark-theme .admin-form-control {
                    background: #0f3460;
                    border-color: rgba(255, 255, 255, 0.2);
                    color: #e8e8e8;
                }

                .dark-theme .admin-form-control:focus {
                    border-color: #B22234;
                    box-shadow: 0 0 0 3px rgba(178, 34, 52, 0.2);
                }

                .dark-theme .close-admin-modal:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            </style>
        `;

        $('head').append(styles);
    }

    setupEventListeners() {
        // Add section button
        $(document).on('click', '#adminAddSectionBtn', () => {
            this.showAddSectionModal();
        });

        // Quick add button
        $(document).on('click', '#adminQuickAddBtn', () => {
            this.showAddSectionModal();
        });

        // Exit admin mode
        $(document).on('click', '#adminExitBtn', () => {
            this.exitAdminMode();
        });
    }

    showAddSectionModal(section = null) {
        const isEdit = section !== null;
        const modalHTML = `
            <div class="admin-modal-overlay" id="adminSectionModal">
                <div class="admin-modal-content">
                    <div class="admin-modal-header">
                        <h3 class="admin-modal-title">${isEdit ? 'Edit Section' : 'Add New Section'}</h3>
                        <button class="close-admin-modal">&times;</button>
                    </div>
                    <form id="adminSectionForm">
                        <div class="admin-form-group">
                            <label class="admin-form-label" for="adminSectionTitle">Section Title</label>
                            <input type="text" class="admin-form-control" id="adminSectionTitle" 
                                   value="${isEdit ? section.title : ''}" 
                                   placeholder="Enter section title..." required>
                        </div>
                        <div class="admin-form-group">
                            <label class="admin-form-label" for="adminSectionContent">Content</label>
                            <textarea class="admin-form-control" id="adminSectionContent" rows="6" 
                                      placeholder="Enter section content..." required>${isEdit ? section.content : ''}</textarea>
                        </div>
                        <div class="admin-form-group">
                            <label class="admin-form-label" for="adminSectionCategory">Category</label>
                            <select class="admin-form-control" id="adminSectionCategory">
                                <option value="general" ${isEdit && section.category === 'general' ? 'selected' : ''}>General</option>
                                <option value="music" ${isEdit && section.category === 'music' ? 'selected' : ''}>Music</option>
                                <option value="cuisine" ${isEdit && section.category === 'cuisine' ? 'selected' : ''}>Cuisine</option>
                                <option value="sports" ${isEdit && section.category === 'sports' ? 'selected' : ''}>Sports</option>
                                <option value="movies" ${isEdit && section.category === 'movies' ? 'selected' : ''}>Movies</option>
                                <option value="landmarks" ${isEdit && section.category === 'landmarks' ? 'selected' : ''}>Landmarks</option>
                                <option value="holidays" ${isEdit && section.category === 'holidays' ? 'selected' : ''}>Holidays</option>
                            </select>
                        </div>
                        <div class="admin-form-actions">
                            <button type="button" class="btn btn-outline-custom" id="adminCancelBtn">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-custom">
                                <i class="fas fa-save me-2"></i>
                                ${isEdit ? 'Update Section' : 'Add Section'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        $('body').append(modalHTML);

        const closeModal = () => {
            $('#adminSectionModal').remove();
        };

        $('.close-admin-modal').on('click', closeModal);
        $('#adminCancelBtn').on('click', closeModal);

        $('#adminSectionForm').on('submit', (e) => {
            e.preventDefault();
            this.saveSection(section?.id, isEdit);
            closeModal();
        });

        $(document).on('click', '#adminSectionModal', (e) => {
            if (e.target.id === 'adminSectionModal') {
                closeModal();
            }
        });
    }

    saveSection(sectionId = null, isEdit = false) {
        const title = $('#adminSectionTitle').val();
        const content = $('#adminSectionContent').val();
        const category = $('#adminSectionCategory').val();

        if (!title || !content) {
            alert('Please fill in all fields');
            return;
        }

        const section = {
            id: isEdit ? sectionId : Date.now().toString(),
            title,
            content,
            category,
            createdAt: isEdit ? this.sections.find(s => s.id === sectionId).createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: this.currentAdmin
        };

        if (isEdit) {
            const index = this.sections.findIndex(s => s.id === sectionId);
            this.sections[index] = section;
        } else {
            this.sections.unshift(section);
        }

        this.saveToLocalStorage();
        this.renderAdminInterface();
        this.addNotification(`Section "${title}" ${isEdit ? 'updated' : 'added'} successfully`, 'success');
    }

    deleteSection(sectionId) {
        if (confirm('Are you sure you want to delete this section?')) {
            this.sections = this.sections.filter(s => s.id !== sectionId);
            this.saveToLocalStorage();
            this.renderAdminInterface();
            this.addNotification('Section deleted successfully', 'success');
        }
    }

    editSection(sectionId) {
        const section = this.sections.find(s => s.id === sectionId);
        if (section) {
            this.showAddSectionModal(section);
        }
    }

    loadExistingSections() {
        // Sections are loaded in renderSectionsList()
    }

    saveToLocalStorage() {
        localStorage.setItem('adminSections', JSON.stringify(this.sections));
    }

    addNotification(message, type = 'info') {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            alert(message);
        }
    }

    enterAdminMode() {
        const password = prompt('Enter admin password:');
        if (password === 'admin123') {
            localStorage.setItem('adminSession', 'true');
            this.isAdminMode = true;
            this.renderAdminInterface();
            this.addNotification('Welcome to administrator mode!', 'success');
        } else if (password !== null) {
            alert('Incorrect password!');
        }
    }

    exitAdminMode() {
        if (confirm('Exit administrator mode and return to visitor view?')) {
            localStorage.setItem('adminSession', 'false');
            this.isAdminMode = false;
            this.renderAdminInterface();
            this.addNotification('Exited administrator mode', 'info');
        }
    }

    showAdminIndicator() {
        this.removeAdminIndicator();
        const indicator = $('<div>', {
            class: 'admin-mode-indicator',
            id: 'adminModeIndicator',
            html: '<i class="fas fa-shield-alt"></i> Administrator Mode'
        });
        $('body').append(indicator);
    }

    removeAdminIndicator() {
        $('#adminModeIndicator').remove();
    }

    removeAdminInterface() {
        $('.admin-dashboard-section, .admin-content-section').remove();
        this.removeAdminIndicator();
    }

    updateAdminButton() {
        const $adminAccessBtn = $('#adminAccessBtn');
        if ($adminAccessBtn.length) {
            if (this.isAdminMode) {
                $adminAccessBtn.html('<i class="fas fa-user me-2"></i>Visitor Mode')
                    .css('background', 'linear-gradient(135deg, #6c757d, #5a6268)');
            } else {
                $adminAccessBtn.html('<i class="fas fa-shield-alt me-2"></i>Admin Mode')
                    .css('background', 'linear-gradient(135deg, #28a745, #20c997)');
            }
        }
    }
}

// Глобальные функции
function toggleAdminMode() {
    if (!window.adminPanel) {
        window.adminPanel = new AdminPanel();
    }
    
    const isAdmin = localStorage.getItem('adminSession') === 'true';
    if (isAdmin) {
        window.adminPanel.exitAdminMode();
    } else {
        window.adminPanel.enterAdminMode();
    }
}

function initAdminSystem() {
    window.adminPanel = new AdminPanel();
    
    const $adminAccessBtn = $('#adminAccessBtn');
    if ($adminAccessBtn.length) {
        $adminAccessBtn.on('click', toggleAdminMode);
    }

    if (localStorage.getItem('adminSession') === 'true') {
        window.adminPanel.renderAdminInterface();
    }
}

// СИСТЕМА ЛОГИНА - УПРОЩЕННАЯ ВЕРСИЯ
function initLoginSystem() {
    console.log('Initializing login system...');
    
    // Инициализация пользователей по умолчанию
    initializeDefaultUsers();

    // Обработчики вкладок
    $('.tab-btn').on('click', function() {
        $('.tab-btn').removeClass('active');
        $('.form-content').removeClass('active');
        $(this).addClass('active');
        $('#' + $(this).data('tab') + 'Form').addClass('active');
        $('#successMessage').hide();
        $('#welcome').removeClass('show');
    });

    // Гостевой вход - УПРОЩЕННАЯ ВЕРСИЯ
    $('#guestBtn').on('click', function() {
        console.log('Guest button clicked');
        localStorage.setItem('currentUserRole', 'guest');
        localStorage.setItem('currentUserName', 'Guest');
        // Немедленный переход без подтверждения
        window.location.href = 'home.html';
    });

    // Форма логина
    $('#loginFormElement').on('submit', function(e) {
        e.preventDefault();
        console.log('Login form submitted');
        
        const email = $('#loginEmail').val().trim();
        const password = $('#loginPassword').val();
        
        // Простая валидация
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        // Проверка пользователей
        const storedUsers = JSON.parse(localStorage.getItem('acaUsers')) || [];
        const user = storedUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUserRole', 'user');
            localStorage.setItem('currentUserName', user.name);
            showWelcome(user);
        } else {
            alert("Invalid email or password. Try: user@example.com / password123");
        }
    });

    // Форма регистрации
    $('#registerFormElement').on('submit', function(e) {
        e.preventDefault();
        console.log('Register form submitted');
        
        const name = $('#registerName').val().trim();
        const email = $('#registerEmail').val().trim();
        const password = $('#registerPassword').val();
        const confirmPassword = $('#registerConfirmPassword').val();

        // Простая валидация
        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        const storedUsers = JSON.parse(localStorage.getItem('acaUsers')) || [];
        
        if (storedUsers.find(u => u.email === email)) {
            alert('Email already registered.');
            return;
        }

        // Регистрация обычного пользователя
        storedUsers.push({ name, email, password });
        localStorage.setItem('acaUsers', JSON.stringify(storedUsers));
        
        $('#successMessage').html('<i class="fas fa-check-circle"></i> Registration successful! You can now log in.');
        $('#successMessage').show();
        $(this).trigger('reset');
        
        setTimeout(() => {
            $('[data-tab="login"]').trigger('click');
        }, 2000);
    });

    function showWelcome(user) {
        const $welcome = $('#welcome');
        const role = localStorage.getItem('currentUserRole');
        const roleText = role === 'admin' ? 'Administrator' : role === 'user' ? 'User' : 'Guest';
        $welcome.text(`Welcome back, ${user.name}! (${roleText})`);
        $welcome.addClass('show');
        
        // Немедленный переход
        setTimeout(() => {
            console.log('Redirecting to home.html...');
            window.location.href = "home.html";
        }, 1000);
    }

    function initializeDefaultUsers() {
        if (!localStorage.getItem('acaUsers')) {
            const defaultUsers = [
                { name: "John Doe", email: "user@example.com", password: "password123" },
                { name: "Jane Smith", email: "jane@example.com", password: "password123" }
            ];
            localStorage.setItem('acaUsers', JSON.stringify(defaultUsers));
            console.log('Default users initialized');
        }
    }
}

// ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ
$(document).ready(function() {
    console.log('Document ready, initializing systems...');
    
    const path = window.location.pathname;
    console.log('Current path:', path);
    
    // Определяем на какой странице находимся
    if (path.includes('index.html') || path.endsWith('/') || path === '/') {
        console.log('Initializing login page...');
        initLoginSystem();
    } else if (path.includes('home.html')) {
        console.log('Initializing home page...');
        initAdminSystem();
    } else {
        console.log('Initializing admin system...');
        initAdminSystem();
    }
});

// Глобальные функции
window.toggleAdminMode = toggleAdminMode;
window.adminPanel = null;