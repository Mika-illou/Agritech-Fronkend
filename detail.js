/* ==========================================================
   detail.js — détail d'un blog (?id=...) + commentaires
   Dépend de app.js
   ========================================================== */
(function () {
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get('id');
    const blog = getBlog(blogId);

    const detail = document.getElementById('blogDetail');
    const commentsSection = document.getElementById('commentsSection');
    const formSection = document.getElementById('commentFormSection');

    // Blog introuvable (id absent, ou blog supprimé)
    if (!blog) {
        detail.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3>Ce blog n'existe pas ou a été supprimé.</h3>
                <a href="formation.html" class="btn btn-success rounded-pill px-4 mt-3">
                    <i class="bi bi-arrow-left"></i> Retour aux formations
                </a>
            </div>`;
        commentsSection.classList.add('d-none');
        formSection.classList.add('d-none');
        return;
    }

    /* ----- Article ----- */
    const author = getUserById(blog.authorId);
    document.title = blog.title;
    detail.innerHTML = `
        <div class="col-lg-4 mb-4">
            <div class="card p-4 bg-warning rounded-4 shadow">
                <img src="./image/${esc(author ? author.avatar : 'avatar-4.jpeg')}" class="rounded-circle mx-auto d-block" width="200" alt="Auteur">
                <h3 class="text-center mt-3 fw-bold">${esc(author ? author.name : 'Auteur inconnu')}</h3>
                <p class="text-center text-muted fw-semibold">${esc(author ? author.role : '')}</p>
                <p class="text-center px-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio quos officiis
                    excepturi ullam odit facere ad nihil laborum.
                </p>
                <div class="reso-social d-flex justify-content-center gap-4 fs-3 mt-3">
                    <i class="bi bi-facebook"></i>
                    <i class="bi bi-instagram"></i>
                    <i class="bi bi-twitter-x"></i>
                    <i class="bi bi-linkedin"></i>
                </div>
            </div>
            <div class="card p-4 rounded-4 shadow mt-5">
                <h3 class="text-center mt-3 fw-bold">Catégorie</h3>
                <p class="text-center text-success px-2">${esc(blog.category)}</p>
            </div>
        </div>
        <div class="col-lg-8">
            <h1 class="fw-bold mb-3">${esc(blog.title)}</h1>
            <img src="./image/${esc(blog.image)}" class="img-fluid rounded mb-3 w-100" alt="${esc(blog.title)}">
            <p class="text-muted">
                By ${esc(author ? author.name : 'Auteur inconnu')} | Published on ${fmtDate(blog.createdAt)}
            </p>
            <p style="white-space: pre-line;">${esc(blog.content)}</p>
        </div>`;

    /* ----- Commentaires ----- */
    const list = document.getElementById('commentList');
    const countEl = document.getElementById('commentCount');
    const form = document.getElementById('commentForm');
    const fName = document.getElementById('commentName');
    const fEmail = document.getElementById('commentEmail');
    const fText = document.getElementById('commentText');

    function renderComments() {
        // Uniquement les commentaires de CE blog
        const comments = getComments()
            .filter(c => String(c.blogId) === String(blog.id))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        countEl.textContent = comments.length; // compteur toujours à jour

        list.innerHTML = comments.length
            ? comments.map(c => `
                <div class="comment-box d-flex justify-content-between">
                    <div>
                        <strong>${esc(c.author)}</strong>${c.email ? ` <span>(${esc(c.email)})</span>` : ''}
                        <div class="mt-3">
                            <small>${fmtDateTime(c.createdAt)}</small>
                            <p class="mb-0" style="white-space: pre-line;">${esc(c.text)}</p>
                        </div>
                    </div>
                    <i class="bi bi-reply reply-icon"></i>
                </div>`).join('')
            : '<p class="text-muted">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>';
    }

    // Utilisateur connecté : nom et email préremplis, non modifiables
    function prepareForm() {
        const user = getCurrentUser();
        if (user) {
            fName.value = user.name;
            fEmail.value = user.email;
            fName.readOnly = true;
            fEmail.readOnly = true;
        } else {
            fName.readOnly = false;
            fEmail.readOnly = false;
        }
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const user = getCurrentUser();
        const author = (user ? user.name : fName.value).trim();
        const text = fText.value.trim();
        if (!author || !text) {
            form.classList.add('was-validated');
            return;
        }
        const comments = getComments();
        comments.push({
            id: Date.now(),
            blogId: blog.id,
            author: author,
            email: (user ? user.email : fEmail.value).trim(),
            text: text,
            createdAt: new Date().toISOString()
        });
        saveComments(comments);

        fText.value = '';
        if (!user) { fName.value = ''; fEmail.value = ''; }
        form.classList.remove('was-validated');
        renderComments();
    });

    prepareForm();
    renderComments();
})();
