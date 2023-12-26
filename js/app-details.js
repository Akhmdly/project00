async function fetchBookDetails() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const title = urlParams.get('title') || 'No book name';
    const authors = urlParams.get('authors') || 'Author unknown';
    const description = urlParams.get('description') || 'No description';
    const category = urlParams.get('category') || 'Kategori Yok';
    const pageNum = urlParams.get('pageNum') || 'Sayfa Sayısı Bilinmiyor';
    const language = urlParams.get('language') || 'Dil Bilinmiyor';
    const thumbnail = urlParams.get('thumbnail') || '';

    const imageUrls = await fetchBookImages(title);
    
    return {
        title,
        authors,
        description,
        category,
        pageNum,
        language,
        thumbnail,
        imageUrls,
    };
}

async function fetchBookImages(title) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&maxResults=1`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
        const book = data.items[0];
        if (book.volumeInfo && book.volumeInfo.imageLinks) {
            return book.volumeInfo.imageLinks;
        }
    }

    return [];
}

async function showBookDetails() {
    const bookDetails = await fetchBookDetails();

    const bookImgContainer = document.querySelector('.bookImgContainer');
    bookImgContainer.innerHTML = "";

    if (bookDetails.imageUrls && bookDetails.imageUrls.thumbnail) {
        const bookPicture = document.createElement('img');
        bookPicture.alt = bookDetails.title;
        bookPicture.src = bookDetails.imageUrls.thumbnail;
        bookImgContainer.appendChild(bookPicture);
    }

    document.querySelector('.bTitle').textContent = bookDetails.title;
    document.querySelector('.bAuthors').textContent = (`Author(s): ${bookDetails.authors}`);
    document.querySelector('.description').textContent = bookDetails.description;
    document.querySelector('.bCategory').textContent = (`Category: ${bookDetails.category}`);
    document.querySelector('.pageNum').textContent = (`Page count: ${bookDetails.pageNum}`);
    document.querySelector('.language').textContent = (`Language: ${bookDetails.language}`);
}

showBookDetails();
