// Vault File Manager - Secure File System

// Configuration
const CONFIG = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  GITHUB_REPO: 'your-username/your-repo', // Update this with your GitHub repo
  VAULT_PATH: 'private/vault' // Path where files are stored in GitHub
};

// Current state
let currentPath = [];
let fileStructure = {};

// Session management
function checkSession() {
  const sessionToken = sessionStorage.getItem('vault_session');
  const sessionExpiry = sessionStorage.getItem('vault_expiry');
  
  if (!sessionToken || !sessionExpiry) {
    window.location.href = './index.html';
    return false;
  }
  
  const now = Date.now();
  const expiry = parseInt(sessionExpiry);
  
  if (now >= expiry) {
    alert('SESSION EXPIRED. Please authenticate again.');
    logout();
    return false;
  }
  
  return true;
}

// Session timer update
function updateSessionTimer() {
  const sessionExpiry = sessionStorage.getItem('vault_expiry');
  if (!sessionExpiry) return;
  
  const now = Date.now();
  const expiry = parseInt(sessionExpiry);
  const remaining = Math.max(0, expiry - now);
  
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  
  document.getElementById('timeRemaining').textContent = 
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  if (remaining <= 0) {
    logout();
  }
}

// Logout function
function logout() {
  sessionStorage.removeItem('vault_session');
  sessionStorage.removeItem('vault_expiry');
  window.location.href = './index.html';
}

// Load file structure from localStorage (simulating GitHub structure)
function loadFileStructure() {
  const stored = localStorage.getItem('vault_files');
  if (stored) {
    try {
      fileStructure = JSON.parse(stored);
    } catch (e) {
      fileStructure = {
        folders: {},
        files: []
      };
    }
  } else {
    // Initialize with default structure
    fileStructure = {
      folders: {
        'research': {
          folders: {},
          files: [
            { name: 'notes.txt', type: 'text', size: '2.4 KB', date: new Date().toISOString() }
          ]
        },
        'projects': {
          folders: {},
          files: []
        },
        'documents': {
          folders: {},
          files: []
        }
      },
      files: [
        { name: 'readme.txt', type: 'text', size: '1.2 KB', date: new Date().toISOString() }
      ]
    };
    saveFileStructure();
  }
}

// Save file structure to localStorage
function saveFileStructure() {
  localStorage.setItem('vault_files', JSON.stringify(fileStructure));
}

// Get current folder based on path
function getCurrentFolder() {
  let folder = fileStructure;
  for (const pathPart of currentPath) {
    folder = folder.folders[pathPart];
  }
  return folder;
}

// Render files and folders
function renderFiles() {
  const grid = document.getElementById('fileGrid');
  const folder = getCurrentFolder();
  
  grid.innerHTML = '';
  
  // Update breadcrumb
  updateBreadcrumb();
  
  // Check if empty
  const hasFolders = Object.keys(folder.folders).length > 0;
  const hasFiles = folder.files && folder.files.length > 0;
  
  if (!hasFolders && !hasFiles) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">📂</div>
        <p>NO FILES OR FOLDERS</p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem;">Create a new folder or upload files to get started</p>
      </div>
    `;
    return;
  }
  
  // Render folders
  for (const [folderName, folderData] of Object.entries(folder.folders)) {
    const folderEl = document.createElement('div');
    folderEl.className = 'folder-item';
    folderEl.innerHTML = `
      <div class="delete-btn" onclick="deleteFolder('${folderName}'); event.stopPropagation();">✕</div>
      <div class="folder-icon">📁</div>
      <div class="folder-name">${folderName}</div>
      <div class="file-meta">${Object.keys(folderData.folders).length} folders • ${folderData.files.length} files</div>
    `;
    folderEl.onclick = () => navigateToFolder(folderName);
    grid.appendChild(folderEl);
  }
  
  // Render files
  if (folder.files) {
    for (const file of folder.files) {
      const fileEl = document.createElement('div');
      fileEl.className = 'file-item';
      
      const icon = getFileIcon(file.type);
      
      fileEl.innerHTML = `
        <div class="delete-btn" onclick="deleteFile('${file.name}'); event.stopPropagation();">✕</div>
        <div class="file-icon">${icon}</div>
        <div class="file-name">${file.name}</div>
        <div class="file-meta">${file.size || 'Unknown'} • ${new Date(file.date).toLocaleDateString()}</div>
      `;
      fileEl.onclick = () => openFile(file);
      grid.appendChild(fileEl);
    }
  }
}

// Get file icon based on type
function getFileIcon(type) {
  const icons = {
    'pdf': '📄',
    'doc': '📝',
    'docx': '📝',
    'txt': '📃',
    'video': '🎬',
    'mp4': '🎬',
    'webm': '🎬',
    'audio': '🎵',
    'mp3': '🎵',
    'wav': '🎵',
    'image': '🖼️',
    'jpg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️'
  };
  return icons[type] || '📎';
}

// Update breadcrumb navigation
function updateBreadcrumb() {
  const pathEl = document.getElementById('currentPath');
  if (currentPath.length === 0) {
    pathEl.innerHTML = '';
  } else {
    const parts = currentPath.map((part, index) => {
      return `<span> / </span><a href="#" onclick="navigateToIndex(${index}); return false;">${part}</a>`;
    });
    pathEl.innerHTML = parts.join('');
  }
}

// Navigation functions
function navigateToRoot() {
  currentPath = [];
  renderFiles();
}

function navigateToFolder(folderName) {
  currentPath.push(folderName);
  renderFiles();
}

function navigateToIndex(index) {
  currentPath = currentPath.slice(0, index + 1);
  renderFiles();
}

// Create folder
function showCreateFolderModal() {
  document.getElementById('createFolderModal').classList.add('show');
  document.getElementById('folderName').value = '';
  document.getElementById('folderName').focus();
}

function createFolder() {
  const folderName = document.getElementById('folderName').value.trim();
  
  if (!folderName) {
    alert('ERROR: Folder name cannot be empty');
    return;
  }
  
  // Validate folder name (no special characters)
  if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
    alert('ERROR: Folder name can only contain letters, numbers, hyphens, and underscores');
    return;
  }
  
  const folder = getCurrentFolder();
  
  if (folder.folders[folderName]) {
    alert('ERROR: Folder already exists');
    return;
  }
  
  folder.folders[folderName] = {
    folders: {},
    files: []
  };
  
  saveFileStructure();
  renderFiles();
  closeModal('createFolderModal');
  
  // Note: In a real GitHub implementation, you would create a .gitkeep file in this folder
  console.log('NOTE: To persist this folder in GitHub, create a .gitkeep file inside:', 
              [...currentPath, folderName].join('/'));
}

// Delete folder
function deleteFolder(folderName) {
  if (!confirm(`DELETE FOLDER "${folderName}"?\n\nThis action cannot be undone.`)) {
    return;
  }
  
  const folder = getCurrentFolder();
  delete folder.folders[folderName];
  
  saveFileStructure();
  renderFiles();
}

// Delete file
function deleteFile(fileName) {
  if (!confirm(`DELETE FILE "${fileName}"?\n\nThis action cannot be undone.`)) {
    return;
  }
  
  const folder = getCurrentFolder();
  folder.files = folder.files.filter(f => f.name !== fileName);
  
  saveFileStructure();
  renderFiles();
}

// Upload file (simulated - in real implementation, this would use GitHub API)
function uploadFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  
  input.onchange = (e) => {
    const files = Array.from(e.target.files);
    const folder = getCurrentFolder();
    
    files.forEach(file => {
      const fileType = getFileType(file.name);
      
      folder.files.push({
        name: file.name,
        type: fileType,
        size: formatFileSize(file.size),
        date: new Date().toISOString(),
        // Note: In real implementation, you would upload to GitHub here
        // For demo purposes, we're just storing metadata
        localFile: URL.createObjectURL(file) // Store blob URL for demo viewing
      });
    });
    
    saveFileStructure();
    renderFiles();
    
    alert(`${files.length} file(s) added to vault.\n\nNOTE: To persist in GitHub, commit and push these files to:\n${CONFIG.VAULT_PATH}/${currentPath.join('/')}/`);
  };
  
  input.click();
}

// Get file type from filename
function getFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  
  const typeMap = {
    'pdf': 'pdf',
    'doc': 'doc',
    'docx': 'docx',
    'txt': 'txt',
    'mp4': 'mp4',
    'webm': 'webm',
    'avi': 'video',
    'mp3': 'mp3',
    'wav': 'wav',
    'ogg': 'audio',
    'jpg': 'jpg',
    'jpeg': 'jpg',
    'png': 'png',
    'gif': 'gif',
    'webp': 'image'
  };
  
  return typeMap[ext] || 'unknown';
}

// Format file size
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Open file viewer
function openFile(file) {
  const modal = document.getElementById('mediaModal');
  const title = document.getElementById('mediaTitle');
  const body = document.getElementById('mediaBody');
  
  title.textContent = `📁 ${file.name}`;
  body.innerHTML = '';
  
  // Handle different file types
  if (['mp4', 'webm', 'video'].includes(file.type)) {
    // Video player
    const video = document.createElement('video');
    video.id = 'videoPlayer';
    video.controls = true;
    video.autoplay = true;
    
    if (file.localFile) {
      video.src = file.localFile;
    } else {
      video.innerHTML = `<p>Video file: ${file.name}</p><p>In a real implementation, this would load from GitHub.</p>`;
    }
    
    body.appendChild(video);
  } 
  else if (['mp3', 'wav', 'audio'].includes(file.type)) {
    // Audio player
    const audio = document.createElement('audio');
    audio.id = 'audioPlayer';
    audio.controls = true;
    audio.autoplay = true;
    
    if (file.localFile) {
      audio.src = file.localFile;
    } else {
      body.innerHTML = `<p>Audio file: ${file.name}</p><p>In a real implementation, this would load from GitHub.</p>`;
    }
    
    body.appendChild(audio);
  }
  else if (['jpg', 'png', 'gif', 'image'].includes(file.type)) {
    // Image viewer
    const img = document.createElement('img');
    img.id = 'imageViewer';
    
    if (file.localFile) {
      img.src = file.localFile;
    } else {
      img.alt = 'Image would load from GitHub';
      body.innerHTML = `<p>Image file: ${file.name}</p><p>In a real implementation, this would load from GitHub.</p>`;
    }
    
    body.appendChild(img);
  }
  else if (file.type === 'pdf') {
    // PDF viewer
    body.innerHTML = `
      <div id="pdfViewer">
        <h3>📄 PDF DOCUMENT</h3>
        <p>File: ${file.name}</p>
        <p>Size: ${file.size}</p>
        <br>
        <p>In a real implementation with GitHub integration, this would display the PDF using:</p>
        <ul style="margin-left: 2rem; margin-top: 1rem;">
          <li>PDF.js library for rendering</li>
          <li>Fetch from GitHub raw content URL</li>
          <li>Display with pagination controls</li>
        </ul>
        ${file.localFile ? `<br><p>Local file available - would display here</p>` : ''}
      </div>
    `;
  }
  else if (['doc', 'docx'].includes(file.type)) {
    // Document viewer
    body.innerHTML = `
      <div id="docViewer">
        <h3>📝 WORD DOCUMENT</h3>
        <p>File: ${file.name}</p>
        <p>Size: ${file.size}</p>
        <br>
        <p>In a real implementation with GitHub integration, this would display the document using:</p>
        <ul style="margin-left: 2rem; margin-top: 1rem;">
          <li>Mammoth.js library for .docx conversion</li>
          <li>Fetch from GitHub raw content URL</li>
          <li>Convert to HTML for viewing</li>
        </ul>
        ${file.localFile ? `<br><p>Local file available - would display here</p>` : ''}
      </div>
    `;
  }
  else if (file.type === 'txt') {
    // Text viewer
    body.innerHTML = `
      <div id="docViewer">
        <h3>📃 TEXT FILE</h3>
        <p>File: ${file.name}</p>
        <br>
        <pre style="background: rgba(0,255,0,0.05); padding: 1rem; border: 1px solid rgba(0,255,0,0.3); overflow: auto;">
Sample text content would appear here.
In a real implementation, this would fetch and display the file content from GitHub.
        </pre>
      </div>
    `;
  }
  else {
    // Unknown file type
    body.innerHTML = `
      <div id="docViewer">
        <h3>📎 FILE</h3>
        <p>File: ${file.name}</p>
        <p>Type: ${file.type}</p>
        <p>Size: ${file.size}</p>
        <br>
        <p>File viewer not available for this type.</p>
      </div>
    `;
  }
  
  modal.classList.add('show');
}

// Close modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('show');
  
  // Stop any playing media
  const video = document.getElementById('videoPlayer');
  const audio = document.getElementById('audioPlayer');
  if (video) video.pause();
  if (audio) audio.pause();
}

// Refresh files
function refreshFiles() {
  loadFileStructure();
  renderFiles();
}

// Load access log
function loadAccessLog() {
  const logContainer = document.getElementById('accessLog');
  const accessLog = JSON.parse(localStorage.getItem('vault_access_log') || '[]');
  
  if (accessLog.length === 0) {
    logContainer.innerHTML = '<div class="log-entry">No access logs available</div>';
    return;
  }
  
  logContainer.innerHTML = '';
  accessLog.reverse().forEach(entry => {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${entry.status === 'success' ? 'log-success' : 'log-failed'}`;
    logEntry.innerHTML = `
      <span>${new Date(entry.timestamp).toLocaleString()}</span>
      <span>${entry.status.toUpperCase()}</span>
    `;
    logContainer.appendChild(logEntry);
  });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  // Check session
  if (!checkSession()) {
    return;
  }
  
  // Load file structure
  loadFileStructure();
  
  // Render initial files
  renderFiles();
  
  // Load access log
  loadAccessLog();
  
  // Update session timer every second
  updateSessionTimer();
  setInterval(updateSessionTimer, 1000);
  
  // Close modals on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('createFolderModal');
      closeModal('mediaModal');
    }
  });
  
  // Close modals on background click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
});

// Instructions for GitHub integration
console.log(`
╔══════════════════════════════════════════════════════════════╗
║  VAULT FILE MANAGER - GITHUB INTEGRATION INSTRUCTIONS        ║
╚══════════════════════════════════════════════════════════════╝

To integrate with your GitHub repository:

1. Create the vault folder structure:
   - Create a 'private/vault' directory in your repo
   - Add folders as needed
   - Each folder needs at least one file (use .gitkeep for empty folders)

2. Update CONFIG.GITHUB_REPO in vault.js with your repo details

3. For full functionality, implement GitHub API calls:
   - Use GitHub Contents API to list/create/delete files
   - Requires authentication token (store securely)
   - Example: https://api.github.com/repos/USER/REPO/contents/private/vault

4. File viewing:
   - PDFs: Use PDF.js library
   - Word docs: Use Mammoth.js library
   - Media: Load via GitHub raw content URLs

Current implementation uses localStorage for demo purposes.
All folder/file operations are simulated locally.
`);
