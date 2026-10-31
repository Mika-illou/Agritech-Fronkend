/* ==========================================================
   formation.js — liste des blogs + ajout / édition / suppression
   Dépend de app.js
   ========================================================== */
(function () {
    const grid = document.getElementById('blogGrid');
    const btnAdd = document.getElementById('btnAddBlog');
    const form = document.getElementById('blogForm');
    const modalEl = document.getElementById('blogModal');
    const modal = new bootstrap.Modal(modalEl);

    const fId = document.getElementById('blogId');
    const fTitle = document.getElementById('blogTitle');
    const fCategory = document.getElementById('blogCategory');
    const fImage = document.getElementById('blogImage');
    const fContent = document.getElementById('blogContent');
    const modalTitle = document.getElementById('blogModalTitle');
    const authorStatus = document.getElementById('authorStatus');

    // Modal de confirmation de suppression
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const deleteTitle = document.getElementById('deleteModalTitle');
    const deleteName = document.getElementById('deleteBlogName');
    const btnConfirmDelete = document.getElementById('confirmDelete');
    let blogToDelete = null; // id du blog en attente de confirmation

    // Catégories proposées dans la liste déroulante
    const CATEGORIES = ['Désertification', 'Pépiniéres', 'Jardinnage', 'Contre-Saison'];

    // Sélecteur d'image : miniatures cliquables (sans nom de fichier)
    const IMAGES = Array.from({ length: 10 }, (_, i) => `Blog-img-${i + 1}.jpg`);

    function fillImages(selected) {
        const current = IMAGES.includes(selected) ? selected : IMAGES[0];
        fImage.innerHTML = IMAGES.map((img, i) => `
            <label class="m-0">
                <input type="radio" name="blogImageChoice" value="${img}" class="visually-hidden" ${img === current ? 'checked' : ''}>
                <img src="./image/${img}" alt="Image ${i + 1}">
            </label>`).join('');
    }

    // Remplit la liste déroulante des catégories (et sélectionne `selected` si fourni)
    function fillCategories(selected) {
        const list = [...CATEGORIES];
        // Si le blog a une catégorie qui n'est pas dans la liste, on l'ajoute pour ne pas la perdre
        if (selected && !list.includes(selected)) list.push(selected);

        fCategory.innerHTML =
            '<option value="" disabled selected>Jardinnage</option>' +
            list.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');

        if (selected) fCategory.value = selected;
    }

    function cardHTML(blog, user) {
        const author = getUserById(blog.authorId);
        const d = new Date(blog.createdAt);
        const excerpt = blog.content.length > 90 ? blog.content.slice(0, 90) + '…' : blog.content;
        const n = countComments(blog.id);

        // Deux boutons ronds sur l'image : Éditer à gauche, Supprimer à droite
        const actions = user ? `
            <button type="button" title="Éditer" aria-label="Éditer"
                class="btn btn-primary text-light rounded-circle shadow d-flex align-items-center justify-content-center position-absolute top-0 start-0 m-2 p-0 btn-edit"
                style="width:50px;height:50px;z-index:5;" data-id="${blog.id}">
                <i class="bi bi-pencil-square fs-5"></i>
            </button>
            <button type="button" title="Supprimer" aria-label="Supprimer"
                class="btn btn-danger text-light rounded-circle shadow d-flex align-items-center justify-content-center position-absolute top-0 end-0 m-2 p-0 btn-delete"
                style="width:50px;height:50px;z-index:5;" data-id="${blog.id}">
                <i class="bi bi-trash fs-5"></i>
            </button>` : '';

        return `
        <div class="col-12 col-sm-6 col-lg-4">
            <div class="position-relative img-wrapper text-center">
                <img src="./image/${esc(blog.image)}" class="img-fluid rounded custom-img" alt="${esc(blog.title)}">
                <div class="date-circle text-center">
                    <h5 class="m-0 fw-bold">${pad(d.getDate())}</h5>
                    <small>${pad(d.getMonth() + 1)}/${d.getFullYear()}</small>
                </div>
                ${actions}
            </div>
            <div class="text-block text-center">
                <p class="text-success fw-semibold mt-3">${esc(blog.category)}</p>
                <h4>${esc(blog.title)}</h4>
                <small class="text-secondary d-block">${esc(author ? author.name : 'Auteur inconnu')}</small>
                <small class="text-secondary d-block">Publié le ${fmtDate(blog.createdAt)}</small>
                <p class="mt-2">${esc(excerpt)}</p>
                <p><i class="bi bi-chat"></i> ${n} comment${n > 1 ? 's' : ''}</p>
                <a href="lien_voir_detail.html?id=${blog.id}" class="btn btn-success rounded-pill px-4">
                    Voir plus <i class="bi bi-box-arrow-up-right"></i>
                </a>
            </div>
        </div>`;
    }

    function render() {
        const user = getCurrentUser();
        const blogs = getBlogs();
        btnAdd.classList.toggle('d-none', !user);
        grid.innerHTML = blogs.length
            ? blogs.map(b => cardHTML(b, user)).join('')
            : '<p class="text-center text-muted">Aucun blog pour le moment.</p>';
    }

    /* ----- Ouverture du modal ----- */
    function openCreate() {
        const user = getCurrentUser();
        if (!user) return;
        form.reset();
        fillCategories();
        fillImages();
        form.classList.remove('was-validated');
        fId.value = '';
        modalTitle.textContent = 'Ajouter un blog';
        authorStatus.className = 'alert alert-info py-2';
        authorStatus.innerHTML = `<i class="bi bi-person-check"></i> Vous serez l'auteur de ce blog : <strong>${esc(user.name)}</strong>`;
        modal.show();
    }

    function openEdit(id) {
        const user = getCurrentUser();
        const blog = getBlog(id);
        if (!user || !blog) return;
        form.classList.remove('was-validated');
        fId.value = blog.id;
        fTitle.value = blog.title;
        fillCategories(blog.category);
        fillImages(blog.image);
        fContent.value = blog.content;
        modalTitle.textContent = 'Éditer le blog';

        // Affiche si l'utilisateur actuel est l'auteur du blog ou non
        const author = getUserById(blog.authorId);
        const isAuthor = String(blog.authorId) === String(user.id);
        if (isAuthor) {
            authorStatus.className = 'alert alert-success py-2';
            authorStatus.innerHTML = '<i class="bi bi-check-circle-fill"></i> Vous êtes l\'<strong>auteur</strong> de ce blog.';
        } else {
            authorStatus.className = 'alert alert-warning py-2';
            authorStatus.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Vous n'êtes <strong>pas l'auteur</strong> de ce blog (auteur : ${esc(author ? author.name : 'inconnu')}).`;
        }
        modal.show();
    }

    /* ----- Enregistrement (création ou modification) ----- */
    form.addEventListener('submit', e => {
        e.preventDefault();
        const user = getCurrentUser();
        if (!user) return;
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        const blogs = getBlogs();
        const data = {
            title: fTitle.value.trim(),
            category: fCategory.value,
            image: form.querySelector('input[name="blogImageChoice"]:checked').value,
            content: fContent.value.trim()
        };

        if (fId.value) {
            const blog = blogs.find(b => String(b.id) === String(fId.value));
            if (blog) Object.assign(blog, data); // l'auteur et la date de création ne changent pas
        } else {
            blogs.unshift({
                id: Date.now(),
                ...data,
                authorId: user.id,
                createdAt: new Date().toISOString()
            });
        }
        saveBlogs(blogs);
        modal.hide();
        render();
    });

    /* ----- Suppression (avec modal de confirmation) ----- */
    // Étape 1 : le clic sur la poubelle ouvre le modal
    function askDelete(id) {
        const blog = getBlog(id);
        if (!blog) return;
        blogToDelete = blog.id;
        deleteTitle.textContent = `Supprimer l'article "${blog.title}"`;
        deleteName.textContent = blog.title;
        deleteModal.show();
    }

    // Étape 2 : le clic sur « Confirmer » supprime vraiment
    btnConfirmDelete.addEventListener('click', () => {
        if (blogToDelete === null || !getCurrentUser()) return;
        saveBlogs(getBlogs().filter(b => String(b.id) !== String(blogToDelete)));
        saveComments(getComments().filter(c => String(c.blogId) !== String(blogToDelete)));
        blogToDelete = null;
        deleteModal.hide();
        render();
    });

    btnAdd.addEventListener('click', openCreate);
    grid.addEventListener('click', e => {
        const edit = e.target.closest('.btn-edit');
        const del = e.target.closest('.btn-delete');
        if (edit) openEdit(edit.dataset.id);
        if (del) askDelete(del.dataset.id);
    });

    render();
})();
