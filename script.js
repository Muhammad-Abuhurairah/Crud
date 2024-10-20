const apiUrl = 'https://66f91ca02a683ce97310ef5d.mockapi.io/api/v1/posts'

let func = async () => { 
    await fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayData(data))
    .catch(error => alert(`error: ${error}`));
}

func();

function displayData(posts) {
    const postParent = document.getElementById('posts');
    postParent.innerHTML = '';

    for(let i = 0; i < posts.length; i++) {
        const post = posts[i];
        let time = new Date();
        const postDiv = document.createElement('div');
        postDiv.classList.add('posts');

        postDiv.innerHTML = ` 
            <div class="post">
                <div class="post-header">
                    <img src="${post.avatar}" alt="Avatar">
                    <div>
                        <h3>${post.name}(Developer)</h3>
                        <small>${time}</small>
                    </div>
                </div>
                <p>Title: <b>${post.title}</b>.</p>
                <p>Description: ${post.description}</p>
                <div class="actions">
                    <button class="edit-btn" onclick="editPost(${post.id})">Edit</button>
                    <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
                </div>
            </div>
        `;
        postParent.appendChild(postDiv);
    }
}

const form = document.getElementById("createPostForm");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('des').value;
    const avatar = document.getElementById('avatar').value;

    const newPost = {
        name: name,
        title: title,
        avatar: avatar,
        description: description,
        createdAt: new Date().toISOString()
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    })
    .then(response => response.json())
    .then(data => {
        alert("Your Data has been added!");
        func();
    })
    .catch(error => alert(`Error: ${error}`));
});

function deletePost(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert("Your Data has been deleted!");
        func();
    })
    .catch(error => alert(`An Error occurred: ${error}`));
}

function editPost(id) {
    fetch(`${apiUrl}/${id}`)
    .then(response => response.json())
    .then(data => formFill(data));

    function formFill(data) {
        const createForm = document.getElementById("create-post");
        createForm.style.display = "none";

        const updateForm = document.getElementById("update-post");
        updateForm.style.display = "block";
        
        document.getElementById('UpdatePostForm').name.value = data.name;
        document.getElementById('UpdatePostForm').title.value = data.title;
        document.getElementById('UpdatePostForm').des.value = data.description;
        document.getElementById('UpdatePostForm').avatar.value = data.avatar;

        document.getElementById("UpdatePostForm").addEventListener("submit", e => {
            e.preventDefault();
            const updatedPost = {
                name: document.getElementById('UpdatePostForm').name.value,
                title: document.getElementById('UpdatePostForm').title.value,
                description: document.getElementById('UpdatePostForm').des.value,
                avatar: document.getElementById('UpdatePostForm').avatar.value,
            };

            fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPost)
            })
            .then(response => response.json())
            .then(data => {
                alert("Your Data has been updated!");
                createForm.style.display = "block";
                updateForm.style.display = "none";
                func();
            })
            .catch(error => alert(`Error: ${error}`));
        });
    }
}