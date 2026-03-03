// Custom Dialog Manager
class DialogManager {
    constructor() {
        this.dialog = document.getElementById('custom-dialog');
        this.title = document.getElementById('dialog-title');
        this.message = document.getElementById('dialog-message');
        this.confirmBtn = document.getElementById('dialog-confirm');
        this.cancelBtn = document.getElementById('dialog-cancel');
        
        this.callback = null;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.confirmBtn.addEventListener('click', () => {
            if (this.callback) {
                this.callback(true);
            }
            this.hide();
        });
        
        this.cancelBtn.addEventListener('click', () => {
            if (this.callback) {
                this.callback(false);
            }
            this.hide();
        });
        
        // Close on overlay click (optional)
        this.dialog.addEventListener('click', (e) => {
            if (e.target === this.dialog) {
                if (this.callback) {
                    this.callback(false);
                }
                this.hide();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.dialog.classList.contains('active')) {
                if (this.callback) {
                    this.callback(false);
                }
                this.hide();
            }
        });
    }
    
    show(options = {}) {
        const {
            title = 'Confirm Action',
            message = 'Are you sure?',
            type = 'info',
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            onConfirm = null
        } = options;
        
        // Set content
        this.title.textContent = title;
        this.message.textContent = message;
        this.confirmBtn.innerHTML = `<i class="fas fa-check"></i> ${confirmText}`;
        this.cancelBtn.innerHTML = `<i class="fas fa-times"></i> ${cancelText}`;
        
        // Set type class
        this.dialog.className = 'dialog-overlay';
        this.dialog.classList.add(type);
        
        // Set callback
        this.callback = onConfirm;
        
        // Show dialog
        this.dialog.classList.add('active');
        
        // Focus on confirm button
        setTimeout(() => this.confirmBtn.focus(), 100);
    }
    
    hide() {
        this.dialog.classList.remove('active');
        this.callback = null;
    }
    
    // Convenience methods
    confirm(options = {}) {
        this.show({
            type: 'warning',
            confirmText: 'Yes',
            cancelText: 'No',
            ...options
        });
    }
    
    alert(options = {}) {
        this.show({
            type: 'info',
            cancelText: 'Close',
            ...options
        });
    }
    
    success(options = {}) {
        this.show({
            type: 'success',
            ...options
        });
    }
    
    error(options = {}) {
        this.show({
            type: 'error',
            ...options
        });
    }
}

// Initialize dialog manager
const dialog = new DialogManager();