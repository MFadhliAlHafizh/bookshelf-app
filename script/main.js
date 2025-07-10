const bookshelf = [];
const RENDER_EVENT = 'render-bookshelf';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('bookForm');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBookshelf();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBookshelf() {
    const inputTitle = document.getElementById('bookFormTitle').value;
    const inputAuthor = document.getElementById('bookFormAuthor').value;
    const inputyear = document.getElementById('bookFormYear').value;

    const generateID = generateId();
    const inputCheckbox = generateIsComplete();
    
    const bookshelfObject = generateBookshelfObject(generateID, inputTitle, inputAuthor, inputyear, inputCheckbox);
    bookshelf.push(bookshelfObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateIsComplete() {
    const checkbox = document.getElementById("bookFormIsComplete");
    return checkbox.checked; 
}

function generateId() {
    return +new Date();
}

function generateBookshelfObject(id, title, author, year, isComplete) {
    return{
        'id': id,
        'title': title,
        'author': author,
        'year': Number(year),
        'isComplete': isComplete
    }
}

document.addEventListener(RENDER_EVENT, function() {
    console.log(bookshelf);

    const incompleteBookList = document.getElementById('incompleteBookList');
    incompleteBookList.innerHTML = '';
    
    const completeBookList = document.getElementById('completeBookList');
    completeBookList.innerHTML = '';

    for (const bookshelfItem of bookshelf) {
        if (!bookshelfItem.isComplete) {
            incompleteBookList.appendChild(makeBookshelf(bookshelfItem));
            incompleteBookList.removeAttribute('hidden');
        } else {
            completeBookList.appendChild(makeBookshelf(bookshelfItem));
            completeBookList.removeAttribute('hidden');
        }
    }
});

function makeBookshelf(bookshelfObject) {
        const textContainer = document.createElement('div');
        textContainer.setAttribute('data-bookid', bookshelfObject.id);
        textContainer.setAttribute('data-testid', 'bookItem');
        textContainer.classList.add('bookContainer');

        textContainer.innerHTML = `
            <h3 data-testid="bookItemTitle" class="bookItemTitle">${bookshelfObject.title}</h3>
                <p data-testid="bookItemAuthor" class="authorName">${bookshelfObject.author}</p>
                <p data-testid="bookItemYear" class="year">${bookshelfObject.year}</p>
                <div class="statusButton">
                <button data-testid="bookItemIsCompleteButton" class="completeButton">Selesai dibaca</button>
                <button data-testid="bookItemDeleteButton" class="deleteButton">Hapus Buku</button>
                </div>
        `;

        const completeButton = textContainer.querySelector('.completeButton');
        completeButton.addEventListener('click', function() {
            addBookToCompleted(bookshelfObject.id);
        });

        const deleteButton = textContainer.querySelector('.deleteButton');
        deleteButton.addEventListener('click', function() {
            deleteBook(bookshelfObject.id);
        });

        if (bookshelfObject.isComplete) {
            completeButton.innerText = 'Belum Selesai Dibaca';
            completeButton.addEventListener('click', function() {
                addBookToIncompleted(bookshelfObject.id);
            });
        }
        return textContainer;
}

function addBookToCompleted(bookshelfId) {
    const bookshelfTarget = findBookshelf(bookshelfId);

    if (bookshelfTarget == null) return;

    bookshelfTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookshelf(bookshelfId) {
    for (const bookshelfItem of bookshelf) {
      if (bookshelfItem.id === bookshelfId) {
        return bookshelfItem;
      }
    }
    return null;
}

function deleteBook(bookshelfId) {
    const bookshelfTarget = findBookshelfIndex(bookshelfId);

    if (bookshelfTarget === -1) return;

    bookshelf.splice(bookshelfTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookshelfIndex(bookshelfId) {
    for (const index in bookshelf) {
        if (bookshelf[index].id === bookshelfId) {
            return index;
        }
    }
    return -1
}

function addBookToIncompleted(bookshelfId) {
    const bookshelfTarget = findBookshelf(bookshelfId);
   
    if (bookshelfTarget == null) return;
   
    bookshelfTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const SAVED_EVENT = 'saved-bookshelf';
const STORAGE_KEY = 'BOOKSHELF_APP';

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bookshelf);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }   
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Maaf, browser Anda tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data !== null) {
        for (const book of data) {
            bookshelf.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.getElementById("searchBook").addEventListener("submit", function (event) {
    event.preventDefault();

    const searchBookInput = document.getElementById("searchBookTitle").value.toLowerCase();
    const bookItems = document.querySelectorAll("[data-testid='bookItem']");

    bookItems.forEach((book) => {
        const bookItemTitle = book.querySelector(".bookItemTitle");
        if (bookItemTitle) {
            const titleText = bookItemTitle.textContent.toLowerCase();
            if (titleText.includes(searchBookInput)) {
                book.style.display = "block"; 
            } else {
                book.style.display = "none"; 
            }
        }
    });
});