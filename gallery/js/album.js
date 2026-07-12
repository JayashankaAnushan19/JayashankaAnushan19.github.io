let photos = [];
let currentIndex = 0;

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

async function loadAlbum() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('album');
    const root = document.getElementById('album-root');

    if (!slug) {
        root.innerHTML = '<div class="empty-state">No album specified.</div>';
        return;
    }

    let meta = null;
    try {
        const albums = await (await fetch('albums.json')).json();
        meta = albums.find((a) => a.slug === slug) || null;
    } catch (err) {
        console.warn('Could not load albums.json', err);
    }

    const slugPath = encodeURIComponent(slug);

    let data;
    try {
        data = await (await fetch(`${slugPath}/images.json`)).json();
    } catch (err) {
        root.innerHTML = `<div class="empty-state">Could not load album "<code>${escapeHtml(slug)}</code>". Make sure <code>${escapeHtml(slug)}/images.json</code> exists.</div>`;
        return;
    }

    photos = (data.images || []).map((img) => ({
        src: `${slugPath}/${encodeURIComponent(img.file)}`,
        caption: img.caption || ''
    }));

    document.title = `${meta ? meta.title : slug} — Jay Gallery`;

    const metaLine = meta ? [meta.location, meta.year].filter(Boolean).join(' · ') : '';

    document.getElementById('album-header').innerHTML = `
        <a class="back-link" href="index.html">← All Albums</a>
        <h1>${escapeHtml(meta ? meta.title : slug)}</h1>
        ${metaLine ? `<div class="meta">${escapeHtml(metaLine)}</div>` : ''}
        ${meta && meta.description ? `<p class="description">${escapeHtml(meta.description)}</p>` : ''}
    `;

    if (photos.length === 0) {
        root.innerHTML = '<div class="empty-state">This album has no photos yet.</div>';
        return;
    }

    root.innerHTML = photos.map((p, i) => `
        <figure data-index="${i}">
            <img src="${p.src}" alt="${escapeHtml(p.caption)}" loading="lazy">
        </figure>
    `).join('');

    root.querySelectorAll('figure').forEach((fig) => {
        fig.addEventListener('click', () => openLightbox(Number(fig.dataset.index)));
    });
}

function openLightbox(index) {
    currentIndex = index;
    renderLightbox();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function renderLightbox() {
    const photo = photos[currentIndex];
    document.getElementById('lb-image').src = photo.src;
    document.getElementById('lb-image').alt = photo.caption;
    document.getElementById('lb-count').textContent = `${currentIndex + 1} / ${photos.length}`;
    document.getElementById('lb-caption-text').textContent = photo.caption || '';
}

function showNext() {
    currentIndex = (currentIndex + 1) % photos.length;
    renderLightbox();
}

function showPrev() {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    renderLightbox();
}

document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-next').addEventListener('click', showNext);
document.getElementById('lb-prev').addEventListener('click', showPrev);

document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!document.getElementById('lightbox').classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
});

loadAlbum();
