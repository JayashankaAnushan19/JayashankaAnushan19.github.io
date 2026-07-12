async function loadAlbums() {
    const grid = document.getElementById('album-grid');
    const empty = document.getElementById('empty-state');

    let albums;
    try {
        const res = await fetch('albums.json');
        albums = await res.json();
    } catch (err) {
        console.error('Could not load albums.json', err);
        albums = [];
    }

    if (!albums || albums.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'block';
        return;
    }

    const cards = await Promise.all(albums.map(renderAlbumCard));
    grid.innerHTML = cards.join('');
}

async function renderAlbumCard(album) {
    let cover = album.cover || '';
    let count = album.count || 0;
    const slugPath = encodeURIComponent(album.slug);

    if (!cover || !album.count) {
        try {
            const res = await fetch(`${slugPath}/images.json`);
            const data = await res.json();
            const images = data.images || [];
            cover = cover || data.cover || (images[0] && images[0].file) || '';
            count = count || images.length;
        } catch (err) {
            console.warn(`Could not load images.json for album "${album.slug}"`, err);
        }
    }

    const coverSrc = cover ? `${slugPath}/${encodeURIComponent(cover)}` : '';
    const meta = [album.location, album.year].filter(Boolean).join(' · ');
    const photoLabel = count === 1 ? '1 photo' : `${count} photos`;

    return `
        <a class="album-card" href="album.html?album=${encodeURIComponent(album.slug)}">
            ${coverSrc ? `<img src="${coverSrc}" alt="${escapeHtml(album.title)}" loading="lazy">` : ''}
            <div class="card-info">
                <h2>${escapeHtml(album.title)}</h2>
                <div class="meta">${escapeHtml(meta)}${meta ? ' · ' : ''}${photoLabel}</div>
            </div>
        </a>
    `;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

loadAlbums();
