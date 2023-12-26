const bookListElement = document.getElementById("bookList");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const categoryList = document.getElementById("categoryList");
const favoritesContainer = document.getElementById("favoritesContainer");

function showOneBookGenre() {
    const genres = ["Fiction", "novel", "cookbook", "self-help", "dramatic", "science fiction","Electronic journals", "painting", "NetWare","art", "essay", "poetry", "children", "programming","mystery","romance", "Education","religion"];

    const genrePromises = genres.map(genre => {
        const genreUrl = `https://www.googleapis.com/books/v1/volumes?q=${genre}&maxResults=40`;
        return fetch(genreUrl)
            .then(response => response.json())
            .then(data => data.items ? data.items[0] : null)
            .catch(err => {
                console.error(err);
                return null;
            });
    });

    Promise.all(genrePromises)
        .then(genreBooks => {
            const filteredBooks = genreBooks.filter(book => book !== null && book.volumeInfo.title && book.volumeInfo.imageLinks && book.volumeInfo.authors);
            displayBooks(filteredBooks);
        })
        .catch(err => {
            console.error(err);
            displayNoResults();
        });
}

if (searchInput.value.trim() === "") {
    showOneBookGenre();
}

function containsSearchTerm(book, searchTerm) {
    const lowerCaseTitle = book.volumeInfo.title.toLowerCase();
    return lowerCaseTitle.includes(searchTerm);
}

function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm === "") {
        alert("Please enter a book title !");
        return;
    }

    const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${searchTerm}&maxResults=40`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            const books = data.items || [];
            const filteredBooks = books.filter(book => containsSearchTerm(book, searchTerm));
            displayBooks(filteredBooks);
        })
        .catch(err => {
            console.error(err);
            displayNoResults();
        });
}

searchButton.addEventListener("click", performSearch);
searchInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        performSearch();
    }
});


function displayBooks(books) {
    bookListElement.innerHTML = "";

    if (books && books.length > 0) {
        books.forEach(book => {
            const { title, authors, imageLinks } = book.volumeInfo;

            if (title && authors && imageLinks && imageLinks.thumbnail) {
                const bookElement = document.createElement("div");
                bookElement.classList.add("book");

                const imageDiv = document.createElement("div");
                imageDiv.classList.add("imageDiv");

                const iconHeart = document.createElement("i");
                iconHeart.classList.add("far", "fa-heart", "iconHeart");

                iconHeart.addEventListener("click", () => toggleFavorite(bookElement, iconHeart, book));
                bookElement.appendChild(iconHeart);   

                const imageElement = document.createElement("img");
                imageElement.src = imageLinks.thumbnail;
                imageElement.alt = "book";

                const titleElement = document.createElement("p");
                titleElement.classList.add("book-title");
                titleElement.textContent = title;

                const authorElement = document.createElement("p");
                authorElement.classList.add("book-author");
                authorElement.textContent = `Author(s): ${authors.join(', ') || ''}`;

                const buttonElement = document.createElement("button");
                buttonElement.classList.add("book-btn");
                buttonElement.textContent = "Details";
                buttonElement.addEventListener("click", () => showDetails(book));

                imageDiv.appendChild(imageElement);
                bookElement.appendChild(imageDiv);
                bookElement.appendChild(titleElement);
                bookElement.appendChild(authorElement);
                bookElement.appendChild(buttonElement);
                bookListElement.appendChild(bookElement);
            }
        });
    } else {
        displayNoResults();
    }
}

function displayNoResults() {
    bookListElement.innerHTML = '<p class = "noResult" >Sorry, no search results were found.</p>';
}

function showDetails(book) {
    const bookDetails = {
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : null,
        category: book.volumeInfo.categories ? book.volumeInfo.categories.join(', ') : " -- ",
        pageNum: book.volumeInfo.pageCount || null,
        language: book.volumeInfo.language || null,
        description: book.volumeInfo.description || " "
    };

    const filteredDetails = Object.fromEntries(
        Object.entries(bookDetails).filter(([key, value]) => value !== null && value !== undefined && value !== "")
    );

    const queryString = Object.keys(filteredDetails)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filteredDetails[key])}`)
        .join('&');

    window.location.href = `index-details.html?${queryString}`;
}

function fetchBooksByGenre(genre) {
    const genreUrl = `https://www.googleapis.com/books/v1/volumes?q=${genre}&maxResults=40`;
    fetch(genreUrl)
        .then(response => response.json())
        .then(data => {
            const books = data.items;
            displayBooks(books.filter(book => book.volumeInfo.title && book.volumeInfo.imageLinks && book.volumeInfo.authors));
        })
        .catch(err => {
            console.error(err);
            displayNoResults();
        });
}

categoryList.addEventListener("click", function (event) {
    if (event.target.tagName === "LI") {
        const selectedGenre = event.target.getAttribute("data-category");
        fetchBooksByGenre(selectedGenre);
    }
});


function fetchBooksByAuthors(author) {
    const authorURL = `https://www.googleapis.com/books/v1/volumes?q=${author}&maxResults=40`;
    fetch(authorURL)
        .then(response => response.json())
        .then(data => {
            const books = data.items;
            displayBooks(books.filter(book => book.volumeInfo.title && book.volumeInfo.imageLinks && book.volumeInfo.authors));
        })
        .catch(err => {
            console.error(err);
            displayNoResults();
        });
}

categoryList.addEventListener("click", function (event) {
    if (event.target.tagName === "LI") {
        const selectedAuthor = event.target.getAttribute("data-author");
        fetchBooksByAuthors(selectedAuthor);
    }
});
/* slider*/
let currentSlide = 0;
const sliderItems = document.querySelectorAll('.slider-item');
const totalSlides = sliderItems.length;

function showSlide(index) {
    sliderItems.forEach(item => {
        item.classList.remove('active');
    });

    if (index < 0) {
        currentSlide = totalSlides - 1;
    } else if (index >= totalSlides) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }

    sliderItems[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

setInterval(nextSlide, 4000); 
showSlide(currentSlide);

/* FAVORITES */
function updateFavorites() {
    favoritesContainer.innerHTML = "";

    if (favorites.length > 0) {
        favorites.forEach(favorite => {
            const favoriteElement = document.createElement("div");
            favoriteElement.classList.add("favorite-book");

            const titleElement = document.createElement("p");
            titleElement.textContent = favorite.volumeInfo.title;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.classList.add("removeFavBtn")
            removeButton.addEventListener("click", () => removeFavorite(favorite));

            favoriteElement.appendChild(titleElement);
            favoriteElement.appendChild(removeButton);
            favoritesContainer.appendChild(favoriteElement);
        });
    } else {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No favorites yet.";
        favoritesContainer.appendChild(emptyMessage);
    }
}

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function toggleFavorite(bookElement, iconHeart, book) {
    const isFavorite = iconHeart.classList.contains("fas");
    
    if (isFavorite) {
        iconHeart.classList.remove("fas");
        iconHeart.classList.add("far");
        iconHeart.style.color = '';
        const index = favorites.findIndex(favorite => favorite.id === book.id);
        if (index !== -1) {
            favorites.splice(index, 1);
        }
    } else {
        iconHeart.classList.remove("far");
        iconHeart.classList.add("fas");
        iconHeart.style.color = 'red';
        favorites.push(book);
    }
    updateFavorites();
    saveFavoritesToLocalStorage(); 
}

function toggleFavoritesPopup() {
    const favoritesPopup = document.getElementById("favoritesPopup");
    favoritesPopup.classList.toggle("active");

    if (favoritesPopup.classList.contains("active")) {
        updateFavorites();
    }
}

function saveFavoritesToLocalStorage() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function removeFavorite(book) {
    const index = favorites.findIndex(favorite => favorite.id === book.id);
    if (index !== -1) {
        favorites.splice(index, 1);
        updateFavorites();
        saveFavoritesToLocalStorage(); 

        const bookElements = document.querySelectorAll('.book');
        bookElements.forEach(element => {
            const title = element.querySelector('.book-title').textContent;
            if (title === book.volumeInfo.title) {
                const heartIcon = element.querySelector('.iconHeart');
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                heartIcon.style.color = '';
            }
        });
    }
}


document.querySelector('.category-p').addEventListener('click', function () {
    this.classList.toggle('activeCategory');
});
