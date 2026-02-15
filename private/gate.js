// Security configuration
const CONFIG = {
  PASSWORD: "robo2026", // Change this to your secure password
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
  MAX_ATTEMPTS: 5,
  LOCKOUT_TIME: 5 * 60 * 1000 // 5 minutes lockout after max attempts
};

// Simple encryption for session storage (base64 encoding for basic obfuscation)
function encrypt(text) {
  return btoa(text + '|' + Date.now());
}

function decrypt(encrypted) {
  try {
    const decoded = atob(encrypted);
    const [text, timestamp] = decoded.split('|');
    return { text, timestamp: parseInt(timestamp) };
  } catch {
    return null;
  }
}

// Check if user is locked out
function checkLockout() {
  const lockoutData = localStorage.getItem('vault_lockout');
  if (lockoutData) {
    const lockout = JSON.parse(lockoutData);
    const timeRemaining = lockout.until - Date.now();
    
    if (timeRemaining > 0) {
      const minutes = Math.ceil(timeRemaining / 60000);
      showError(`SYSTEM LOCKED. Too many failed attempts. Try again in ${minutes} minute(s).`);
      document.getElementById('password').disabled = true;
      return true;
    } else {
      localStorage.removeItem('vault_lockout');
      localStorage.removeItem('vault_attempts');
    }
  }
  return false;
}

// Track failed attempts
function trackFailedAttempt() {
  let attempts = parseInt(localStorage.getItem('vault_attempts') || '0');
  attempts++;
  localStorage.setItem('vault_attempts', attempts.toString());
  
  if (attempts >= CONFIG.MAX_ATTEMPTS) {
    const lockoutUntil = Date.now() + CONFIG.LOCKOUT_TIME;
    localStorage.setItem('vault_lockout', JSON.stringify({ until: lockoutUntil }));
    showError(`SECURITY BREACH DETECTED! System locked for 5 minutes.`);
    document.getElementById('password').disabled = true;
    
    // Auto-reload after lockout expires
    setTimeout(() => {
      location.reload();
    }, CONFIG.LOCKOUT_TIME);
  } else {
    const remaining = CONFIG.MAX_ATTEMPTS - attempts;
    showError(`ACCESS DENIED! ${remaining} attempt(s) remaining before lockout.`);
  }
}

// Show error message
function showError(message) {
  const errorEl = document.getElementById('error');
  errorEl.textContent = message;
  errorEl.classList.add('show');
  
  // Play error sound effect (optional, visual feedback only)
  setTimeout(() => {
    errorEl.classList.remove('show');
  }, 5000);
}

// Show loading state
function showLoading(show) {
  const loadingEl = document.getElementById('loading');
  if (show) {
    loadingEl.classList.add('show');
  } else {
    loadingEl.classList.remove('show');
  }
}

// Simulate encryption verification delay (adds to security feel)
function simulateEncryption() {
  return new Promise(resolve => {
    setTimeout(resolve, 800 + Math.random() * 400);
  });
}

// Main authentication function
async function authenticate() {
  // Check if locked out
  if (checkLockout()) {
    return;
  }

  const input = document.getElementById("password").value;
  
  if (!input) {
    showError("AUTHENTICATION KEY REQUIRED");
    return;
  }

  // Show loading state
  showLoading(true);
  
  // Simulate encryption/decryption process
  await simulateEncryption();
  
  if (input === CONFIG.PASSWORD) {
    // Create encrypted session token
    const sessionToken = encrypt('authenticated');
    const sessionExpiry = Date.now() + CONFIG.SESSION_TIMEOUT;
    
    // Store session data
    sessionStorage.setItem('vault_session', sessionToken);
    sessionStorage.setItem('vault_expiry', sessionExpiry.toString());
    
    // Log access (timestamp)
    const accessLog = JSON.parse(localStorage.getItem('vault_access_log') || '[]');
    accessLog.push({
      timestamp: new Date().toISOString(),
      ip: 'hidden', // GitHub Pages doesn't have server-side access
      status: 'success'
    });
    // Keep only last 10 entries
    if (accessLog.length > 10) accessLog.shift();
    localStorage.setItem('vault_access_log', JSON.stringify(accessLog));
    
    // Clear failed attempts
    localStorage.removeItem('vault_attempts');
    
    // Redirect to vault
    showLoading(false);
    window.location.href = "./vault.html";
  } else {
    showLoading(false);
    trackFailedAttempt();
    
    // Log failed attempt
    const accessLog = JSON.parse(localStorage.getItem('vault_access_log') || '[]');
    accessLog.push({
      timestamp: new Date().toISOString(),
      ip: 'hidden',
      status: 'failed'
    });
    if (accessLog.length > 10) accessLog.shift();
    localStorage.setItem('vault_access_log', JSON.stringify(accessLog));
    
    // Clear password field
    document.getElementById('password').value = '';
  }
}

// Check for lockout on page load
window.addEventListener('DOMContentLoaded', () => {
  checkLockout();
  
  // Auto-focus password field
  document.getElementById('password').focus();
});
