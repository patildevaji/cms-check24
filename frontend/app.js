document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    
    const result = await response.json();
    
    if (result.success) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('home-page').style.display = 'block';
        loadContents();
    } else {
        alert('Invalid credentials');
    }
});

document.getElementById('content-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;
    const category = document.getElementById('category').value;
    const content = { title, body, category };
    
    const response = await fetch('http://localhost:3000/content', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
    });
    
    const contents = await response.json();
    renderContents(contents);
    document.getElementById('title').value = '';
    document.getElementById('body').value = '';
    document.getElementById('category').value = '';
});

document.getElementById('search').addEventListener('input', filterContents);
document.getElementById('category-filter').addEventListener('change', filterContents);

async function loadContents() {
    const response = await fetch('http://localhost:3000/content');
    const contents = await response.json();
    populateCategoryFilter(contents);
    renderContents(contents);
}

function populateCategoryFilter(contents) {
    const categoryFilter = document.getElementById('category-filter');
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    const categories = [...new Set(contents.map(content => content.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function renderContents(contents) {
    const contentList = document.getElementById('content-list');
    contentList.innerHTML = '';
    contents.forEach(content => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('content-id', content.id);
        
        const title = document.createElement('h3');
        title.textContent = content.title;
        card.appendChild(title);
        
        const body = document.createElement('p');
        body.textContent = content.body;
        card.appendChild(body);
        
        const category = document.createElement('p');
        category.className = 'category';
        category.textContent = `Category: ${content.category}`;
        card.appendChild(category);
        
        const editButton = createEditButton(content.id);
        const deleteButton = createDeleteButton(content.id);
        const buttonContainer = document.createElement('div');
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        card.appendChild(buttonContainer);
        
        contentList.appendChild(card);
    });
}

function createDeleteButton(id) {
    const button = document.createElement('button');
    button.textContent = 'Delete';
    button.onclick = async () => {
        const response = await fetch(`http://localhost:3000/content/${id}`, {
            method: 'DELETE'
        });
        const contents = await response.json();
        renderContents(contents);
    };
    return button;
}

function createEditButton(id) {
    const button = document.createElement('button');
    button.textContent = 'Edit';
    button.className = 'edit';
    button.onclick = () => {
        const card = document.querySelector(`[content-id="${id}"]`);
        const title = card.querySelector('h3').textContent;
        const body = card.querySelector('p').textContent;
        const category = card.querySelector('.category').textContent.replace('Category: ', '');

        const newTitle = prompt('Edit title:', title);
        const newBody = prompt('Edit body:', body);
        const newCategory = prompt('Edit category:', category);

        if (newTitle && newBody && newCategory) {
            updateContent(id, { title: newTitle, body: newBody, category: newCategory });
        }
    };
    return button;
}

async function updateContent(id, newContent) {
    const response = await fetch(`http://localhost:3000/content/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newContent)
    });
    const contents = await response.json();
    renderContents(contents);
}

function filterContents() {
    const query = document.getElementById('search').value.toLowerCase();
    const selectedCategory = document.getElementById('category-filter').value.toLowerCase();

    document.querySelectorAll('#content-list .card').forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const body = card.querySelector('p').textContent.toLowerCase();
        const category = card.querySelector('.category').textContent.toLowerCase().replace('category: ', '');

        
        const matchesQuery = title.includes(query) || body.includes(query);
        const matchesCategory = !selectedCategory || category === selectedCategory;

        card.style.display = (matchesQuery && matchesCategory) ? '' : 'none';
    });
}

function logout() {
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('home-page').style.display = 'none';
}
