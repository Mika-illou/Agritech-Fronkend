/* ==========================================================
   app.js — base de données (localStorage), session et navbar
   À inclure sur TOUTES les pages (avant les autres scripts).
   ========================================================== */

const KEY_USERS = 'agritech_users';
const KEY_BLOGS = 'agritech_blogs';
const KEY_COMMENTS = 'agritech_comments';
const KEY_SESSION = 'agritech_session';

/* ---------- Petits utilitaires ---------- */
function dbGet(key, fallback) {
    try {
        const v = JSON.parse(localStorage.getItem(key));
        return v === null || v === undefined ? fallback : v;
    } catch (e) {
        return fallback;
    }
}
function dbSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
function esc(str) {
    // Protège contre l'injection HTML (le contenu vient des utilisateurs)
    return String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}
const pad = n => String(n).padStart(2, '0');
function fmtDate(iso) {
    const d = new Date(iso);
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
function fmtDateTime(iso) {
    const d = new Date(iso);
    return `${fmtDate(iso)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/* ---------- Données de départ ---------- */
// Les 4 membres de la section "Our Teams" de home.html (nom et rôle identiques)
const SEED_USERS = [
    { id: 1, name: 'Malika Malikattou', role: 'Spécialiste Environnement', email: 'malika@agritech.com', password: 'malika123', avatar: 'avatar-4.jpeg' },
    { id: 2, name: 'Leila Leilatou', role: 'Spécialiste en Production Végétale', email: 'leila@agritech.com', password: 'leila123', avatar: 'avatar-4.jpeg' },
    { id: 3, name: 'Amir Amirou', role: 'Spécialiste en Viticulture', email: 'amir@agritech.com', password: 'amir123', avatar: 'avatar-2.jpg' },
    { id: 4, name: 'Abdou Abdourahmane', role: 'Spécialiste en gestion des sols et des eaux', email: 'abdou@agritech.com', password: 'abdou123', avatar: 'avatar-2.jpg' }
];

const LOREM = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae unde natus, culpa eius aliquam adipisci labore itaque dolorem. ';

// [titre, catégorie, id auteur, année, mois, jour] — les 10 cartes de formation.html
const SEED_BLOGS = [
    ['Ultricies nec', 'Désertification', 2, 2015, 8, 29],
    ['Cras dapibus', 'Désertification', 2, 2015, 7, 2],
    ['Lorem dolor', 'Pépiniéres', 4, 2015, 2, 19],
    ['Ultricies nec', 'Désertification', 2, 2015, 8, 29],
    ['Cras dapibus', 'Désertification', 2, 2015, 7, 2],
    ['Lorem dolor', 'Pépiniéres', 4, 2015, 2, 19],
    ['Ultricies nec', 'Désertification', 2, 2015, 8, 29],
    ['Cras dapibus', 'Désertification', 2, 2015, 7, 2],
    ['Lorem dolor', 'Pépiniéres', 4, 2015, 2, 19],
    ['Ultricies nec', 'Désertification', 3, 2014, 9, 16]
];
// Nombre de commentaires affichés à l'origine sur chaque carte
const SEED_COMMENT_COUNTS = [5, 2, 4, 5, 2, 4, 5, 2, 4, 7];

const SEED_COMMENT_SAMPLES = [
    ['Mariam', 'mariam76@example.com', 'Merci du partage.'],
    ['Idi', 'idi6@example.com', 'Formation intéressante!'],
    ['Mariam', 'mariam95@example.com', 'Merci du partage.'],
    ['Ramatou', 'ramatou97@example.com', 'Excellente Formation!'],
    ['Salissou', 'salissou31@example.com', 'J’ai trouvé cet article très utile.'],
    ['Oumma', 'oumma73@example.com', 'Formation intéressante!'],
    ['Mariam', 'mariam42@example.com', 'Excellente Formation!']
];

function seedDB() {
    if (!localStorage.getItem(KEY_USERS)) {
        dbSet(KEY_USERS, SEED_USERS);
    }
    if (!localStorage.getItem(KEY_BLOGS)) {
        const blogs = SEED_BLOGS.map((b, i) => ({
            id: i + 1,
            title: b[0],
            category: b[1],
            authorId: b[2],
            image: `Blog-img-${i + 1}.jpg`,
            content: LOREM.repeat(6).trim(),
            createdAt: new Date(b[3], b[4] - 1, b[5]).toISOString()
        }));
        dbSet(KEY_BLOGS, blogs);
    }
    if (!localStorage.getItem(KEY_COMMENTS)) {
        const comments = [];
        SEED_COMMENT_COUNTS.forEach((n, i) => {
            for (let k = 0; k < n; k++) {
                const s = SEED_COMMENT_SAMPLES[k];
                comments.push({
                    id: (i + 1) * 100 + k,
                    blogId: i + 1,
                    author: s[0],
                    email: s[1],
                    text: s[2],
                    createdAt: new Date(2025, 11, 1, 6 - k, 14, 53).toISOString()
                });
            }
        });
        dbSet(KEY_COMMENTS, comments);
    }
}

/* ---------- Accès aux données ---------- */
const getUsers = () => dbGet(KEY_USERS, []);
const getBlogs = () => dbGet(KEY_BLOGS, []);
const saveBlogs = list => dbSet(KEY_BLOGS, list);
const getComments = () => dbGet(KEY_COMMENTS, []);
const saveComments = list => dbSet(KEY_COMMENTS, list);
const getBlog = id => getBlogs().find(b => String(b.id) === String(id));
const getUserById = id => getUsers().find(u => String(u.id) === String(id));
const countComments = blogId => getComments().filter(c => String(c.blogId) === String(blogId)).length;

/* ---------- Session ---------- */
function getCurrentUser() {
    const id = localStorage.getItem(KEY_SESSION) || sessionStorage.getItem(KEY_SESSION);
    return id ? getUserById(id) || null : null;
}
function login(email, password, remember) {
    const user = getUsers().find(
        u => u.email.toLowerCase() === String(email).trim().toLowerCase() && u.password === password
    );
    if (!user) return null;
    // "Se souvenir de moi" → session persistante, sinon session de l'onglet seulement
    (remember ? localStorage : sessionStorage).setItem(KEY_SESSION, user.id);
    return user;
}
function logout() {
    localStorage.removeItem(KEY_SESSION);
    sessionStorage.removeItem(KEY_SESSION);
    window.location.reload();
}

/* ---------- Navbar : nom de l'utilisateur + bouton Déconnexion ---------- */
function updateNav() {
    const user = getCurrentUser();
    if (!user) return; // non connecté : on garde le bouton "Connect" d'origine

    const navs = new Set();
    document.querySelectorAll('.button_connect').forEach(btn => {
        const nav = btn.closest('nav');
        if (nav) navs.add(nav);
    });
    navs.forEach(nav => {
        nav.innerHTML = `
            <div class="d-flex align-items-center justify-content-center flex-wrap gap-3">
                <span class="user-badge fw-bold text-black text-nowrap">
                    Hello, ${esc(user.name)}
                </span>
                <button type="button" class="btn-logout btn btn-danger rounded-5 fw-bold text-nowrap  text-light px-4 py-2">
                    Disconnect <i class="bi bi-box-arrow-right"></i>
                </button>
            </div>`;
    });
    document.querySelectorAll('.btn-logout').forEach(b => b.addEventListener('click', logout));
}

seedDB();
document.addEventListener('DOMContentLoaded', updateNav);
