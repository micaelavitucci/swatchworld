// Simulated storage for swatches (in real app, use Firebase/LocalStorage for persistence)
let swatches = JSON.parse(localStorage.getItem('swatches')) || [];
let isAdmin = false;
const ADMIN_PASSWORD = 'tucontraseña_secreta'; // Cambia esto por tu contraseña personal (solo tú la sabes)

// Render swatches in gallery
function renderSwatches(filter = 'all', searchTerm = '') {
    const container = document.getElementById('swatchesContainer');
    container.innerHTML = '';
    const filtered = swatches.filter(swatch => {
        const matchesCategory = filter === 'all' || swatch.category === filter;
        const matchesSearch = swatch.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    filtered.forEach((swatch, index) => {
        const div = document.createElement('div');
        div.className = 'swatch-item';
        div.innerHTML = `
            ${swatch.file.type.startsWith('image/') ? `<img src="${swatch.fileUrl}" alt="${swatch.description}">` : `<video src="${swatch.fileUrl}" controls></video>`}
            <p>${swatch.description}</p>
            <small>Categoría: ${swatch.category}</small>
            ${isAdmin ? `<button onclick="deleteSwatch(${index})">Eliminar</button>` : ''}
        `;
        container.appendChild(div);
    });
}

// Upload handler (simulates; displays file as URL for preview. For real upload, see backend notes)
document.getElementById('uploadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const description = document.getElementById('description').value;
    const category = document.getElementById('uploadCategory').value;
    
    Array.from(fileInput.files).forEach(file => {
        const fileUrl = URL.createObjectURL(file); // Temp URL for preview (no watermark)
        swatches.push({ file, fileUrl, description, category });
    });
    localStorage.setItem('swatches', JSON.stringify(swatches));
    renderSwatches();
    alert('¡Swatch subido! Se muestra en la galería.');
    e.target.reset();
});

// Search function
function searchSwatches() {
    const searchTerm = document.getElementById('searchInput').value;
    renderSwatches(document.getElementById('categoryFilter').value, searchTerm);
}

// Category filter
document.getElementById('categoryFilter').addEventListener('change', (e) => {
    renderSwatches(e.target.value);
});

// Admin functions
function toggleAdmin() {
    document.getElementById('admin').style.display = 'block';
}

function loginAdmin() {
    const pass = document.getElementById('adminPass').value;
    if (pass === ADMIN_PASSWORD) {
        isAdmin = true;
        document.getElementById('adminContent').style.display = 'block';
        renderAdminList();
        alert('¡Bienvenida, Admin! Eres la única con derechos.');
    } else {
        alert('Contraseña incorrecta. Solo la admin puede acceder.');
    }
}

function logoutAdmin() {
    isAdmin = false;
    document.getElementById('adminContent').style.display = 'none';
    document.getElementById('admin').style.display = 'none';
}

function renderAdminList() {
    const list = document.getElementById('adminList');
    list.innerHTML = swatches.map((swatch, index) => `<li>${swatch.description} - <button onclick="deleteSwatch(${index})">Eliminar</button></li>`).join('');
}

function deleteSwatch(index) {
    if (confirm('¿Eliminar este swatch?')) {
        swatches.splice(index, 1);
        localStorage.setItem('swatches', JSON.stringify(swatches));
        renderSwatches();
        renderAdminList();
    }
}

// Initial render
renderSwatches();