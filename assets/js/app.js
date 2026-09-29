var cl = console.log;

const BASE_URL = `https://gaurav-1st-db-default-rtdb.firebaseio.com/`;
const POST_URL = `${BASE_URL}/posts.json`

// let postArr = [];
const state = {
    postArr: []
}

const postForm = document.getElementById("postForm")

const addBtn = document.getElementById("addBtn")
const updateBtn = document.getElementById("updateBtn")
const cancelBtn = document.getElementById("cancelBtn")
const addResultPost = document.getElementById("addResultPost")
const addFetchedCard = document.getElementById("addFetchedCard")
let spinner = document.getElementById("spinner")

//========================= Create ===================================
function CreateNewPost(eve) {
    eve.preventDefault();

    const title = document.getElementById("title")
    const body = document.getElementById("body")

    let newPostObj = {
        title: title.value,
        body: body.value
    }

    let xhr = new XMLHttpRequest()
    spinner.classList.remove("d-none")
    xhr.open("POST", POST_URL)
    xhr.setRequestHeader("contentType", "application/json")
    xhr.setRequestHeader("Auth", "JWT FROM LS")
    xhr.send(JSON.stringify(newPostObj))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            // cl(res) name : -p233rf43f3f
            //Not adding LSM
            let card = document.createElement("div")
            card.id = res.name
            card.className = "card mb-2 resultCard";
            card.innerHTML = `          <div class="card-body resultPost">
                                                <h3> ${newPostObj.title} </h3>

                                                <div>
                                                    <p> ${newPostObj.body} </p>
                                                </div>
                                                <div class="d-flex justify-content-end">
                                                    <button onClick="editPost(this)" class="btn btn-primary shadow">EDIT</button>
                                                    <button onClick="deletePost(this)" class="btn btn-danger shadow ml-2">REMOVE</button>
                                                </div>
                                            </div>`
            addResultPost.append(card)
             showSnackBar("Added!", "New Post Added Successfully!!!")
            postForm.reset()
            spinner.classList.add("d-none")
        } else {
            spinner.classList.remove("d-none")
            cl("something went wrong")
        }
    }

}

//========================= Read ===================================
function fetchPosts() {
    let xhr = new XMLHttpRequest()
    spinner.classList.remove("d-none")
    xhr.open("GET", POST_URL)
    xhr.send(null)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            // cl(res)
            for (const key in res) {
                res[key].id = key
                state.postArr.unshift(res[key])
            }
            // cl(state.postArr)
            let result = ""
            state.postArr.forEach((ele, i) => {

                result += `<div class="card mb-2 resultCard" id=${ele.id}>
                                            <div class="card-body resultPost">
                                                <h3> ${ele.title} </h3>

                                                <div>
                                                    <p>${ele.body} </p>
                                                </div>
                                                <div class="d-flex justify-content-end">
                                                    <button onClick="editPost(this)" class="btn btn-primary shadow">EDIT</button>
                                                    <button onClick="deletePost(this)" class="btn btn-danger shadow ml-2">REMOVE</button>
                                                </div>
                                            </div>
                                        </div>`
            })
            addResultPost.innerHTML += result
            spinner.classList.add("d-none")

        } else {
            spinner.classList.add("d-none")
            cl("something went wrong")
        }
    }
}
fetchPosts()
//========================= Edit ===================================
function editPost(ele) {
    let EDIT_ID = ele.closest(".card").id
    let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}.json`
    let xhr = new XMLHttpRequest()
    spinner.classList.remove("d-none")
    xhr.open("GET", EDIT_URL)
    xhr.send(null)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)

            const title = document.getElementById("title")
            const body = document.getElementById("body")

            title.value = res.title
            body.value = res.body

            addBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")
            localStorage.setItem("EDIT_ID", EDIT_ID)
            spinner.classList.add("d-none")
        } else {
            spinner.classList.add("d-none")
            cl("something went wrong")
        }
    }
}
//========================= Update ===================================
function updatePost(ele) {
    const title = document.getElementById("title")
    const body = document.getElementById("body")

    let UPDATE_ID = localStorage.getItem("EDIT_ID")
    localStorage.removeItem("EDIT_ID")
    let UPDATE_URL = `${BASE_URL}/posts/${UPDATE_ID}.json`

    let updatedPostObj = {
        title: title.value,
        body: body.value,
        id: UPDATE_ID
    }
    let xhr = new XMLHttpRequest();
    spinner.classList.remove("d-none")
    xhr.open("PATCH", UPDATE_URL);
    xhr.send(JSON.stringify(updatedPostObj))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)

            document.getElementById(UPDATE_ID).innerHTML = ` <div class="card-body resultPost">
                                                <h3> ${updatedPostObj.title} </h3>

                                                <div>
                                                    <p>${updatedPostObj.body} </p>
                                                </div>
                                                <div class="d-flex justify-content-end">
                                                    <button onClick="editPost(this)" class="btn btn-primary shadow">EDIT</button>
                                                    <button onClick="deletePost(this)" class="btn btn-danger shadow ml-2">REMOVE</button>
                                                </div>
                                            </div>`

            let getIndex = state.postArr.findIndex(ele => ele.id === UPDATE_ID)
            state.postArr[getIndex] = updatedPostObj

            showSnackBar("Updated!", "Post Modified Successfully!!!")

            addBtn.classList.remove("d-none")
            updateBtn.classList.add("d-none")
            postForm.reset()
            spinner.classList.add("d-none")
        } else {
            spinner.classList.add("d-none")
            cl("something went wrong")
        }
    }

}
//========================= Delete ===================================
function deletePost(ele) {
    let DELETE_ID = ele.closest(".card").id;
    let DELETE_URL = `${BASE_URL}/posts/${DELETE_ID}.json`
    Swal.fire({
        title: "Are you sure?",
        text: "This post deleted permanently from All Posts",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let xhr = new XMLHttpRequest()
            spinner.classList.remove("d-none")
            xhr.open("DELETE", DELETE_URL)
            xhr.send(null)
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    let res = JSON.parse(xhr.response)
                    ele.closest(".card").remove()
                    let getIndex = state.postArr.findIndex(ele => ele.id === UPDATE_ID)
                    state.postArr.splice(getIndex, 1)
                    spinner.classList.add("d-none")


                    showSnackBar("Deleted!!!", "Post deleted Successfully!")

                } else {
                    spinner.classList.add("d-none")
                    cl("something went wrong")
                }
            }

           
        }
    });

}
function showSnackBar(title, msg){
     Swal.fire({
                title: title,
                text: msg,
                icon: "success"
            });
}

postForm.addEventListener("submit", CreateNewPost)
updateBtn.addEventListener("click", updatePost)
cancelBtn.addEventListener("click", () => {
    postForm.reset();
})


























