document.addEventListener("DOMContentLoaded", (e) => {
  const secessionManager = new SecessionManager();
  secessionManager.loadBooks();
});

document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const ui = new Ui();
  if (
    ui.title.value === "" ||
    ui.author.value === "" ||
    ui.isbn.value === "" ||
    isNaN(Number(ui.isbn.value))
  ) {
    ui.showAllert("please fill out all inputs with valid information", "error");
    return;
  }
  ui.addBookToList();
  ui.clearInputValue();
  ui.showAllert("your book as been sucessfully added", "sucess");  
});

class Book {
  constructor(title, author, isbn) {
    (this.title = title), (this.author = author), (this.isbn = isbn);
  }
}

class Ui {
  constructor() {
    this.title = document.querySelector("#book-title");
    this.author = document.querySelector("#book-author");
    this.isbn = document.querySelector("#book-isbn");
    this.bookList = document.querySelector("#book-list");
    this.bookForm = document.querySelector("#book-form");
    this.container = document.querySelector("#container");
  }
  addBookToList(savedBook = null) {
    const book = Boolean(savedBook)
      ? savedBook
      : new Book(this.title.value, this.author.value, this.isbn.value);
    const newBookEntry = document.createElement("tr");
    newBookEntry.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        `;

    const removeButtonEntry = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.id = "remove-book";
    removeButton.className = "btn";
    removeButton.innerText = "remove";
    removeButton.addEventListener("click", (e) => {
      const ui = new Ui();
      ui.removeBookFromList(e.target);
      ui.showAllert("your book has been sucessfully removed", "sucess");
    });
    removeButtonEntry.appendChild(removeButton);
    newBookEntry.appendChild(removeButtonEntry);
    this.bookList.appendChild(newBookEntry);

    if (!Boolean(savedBook)) {
      const secessionManager = new SecessionManager();
      secessionManager.addBook(book);
    }
  }
  clearInputValue() {
    (this.title.value = ""), (this.author.value = ""), (this.isbn.value = "");
  }
  showAllert(message, className) {
    const alert = document.createElement("div");
    alert.className = `alert ${className}`;
    alert.textContent = message;
    this.container.insertBefore(alert, this.bookForm);
    setTimeout(() => {
      const ui = new Ui();
      ui.container.removeChild(alert);
    }, 2500);
  }
  removeBookFromList(target) {
    if (target.id === "remove-book") {
      target.parentElement.parentElement.remove();
      const secessionManager = new SecessionManager();
      secessionManager.removeBook(
        target.parentElement.previousElementSibling.innerText
      );
    }
  }
}

class SecessionManager {
  constructor() {
    this.books = Boolean(localStorage.getItem("books"))
      ? JSON.parse(localStorage.getItem("books"))
      : [];
  }
  addBook(book) {
    this.books.push(book);
    localStorage.setItem("books", JSON.stringify(this.books));
  }
  removeBook(isbn) {
    const book = this.books.find((book) => {
      return book.isbn === isbn;
    });
    if (Boolean(book)) {
      this.books.splice(this.books.indexOf(book), 1);
      localStorage.setItem("books", JSON.stringify(this.books));
    }
  }
  loadBooks() {
    this.books.forEach((book) => {
      const ui = new Ui();
      ui.addBookToList(book);
    });
  }
}
