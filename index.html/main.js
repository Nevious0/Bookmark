//Book class: represent a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class: Handle UI tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }
  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete"><i class="fas fa-trash"></i></a></td>
    `;
    list.appendChild(row);
  }

  //   delete book
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  // show alert
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#myForm");
    container.insertBefore(div, form);

    // make vanish in seconds
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  static clearFields() {
    document.querySelector("#myForm").reset();
  }
}

// Store class: handles storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book
document.querySelector("#myForm").addEventListener("submit", (e) => {
  e.preventDefault();
  // Get form value
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields!", "danger");
  } else {
    // instantiate a book
    const book = new Book(title, author, isbn);

    //   Add book to list
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // show success message
    UI.showAlert("Book Added", "success");

    //   clear fields
    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
  // remove book from UI
  UI.deleteBook(e.target);

  // Remove book from the store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // show message when book removed
  UI.showAlert("Book Removed", "warning");
});
