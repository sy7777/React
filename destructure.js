const data = [
	{id:1, publicationDate:"1954-07-29", genres: "Science"},
	{id:2, publicationDate:"1964-07-29", genres: "fiction"},
	{id:3, publicationDate:"1974-07-29", genres: "humor"},
	{id:4, publicationDate:"1984-07-29", genres: "fantasy"},
]
function getBookById(id){
	return data.find(d=>d.id === id);
}
const genres = ["Science", "fiction", "humor", "fantasy"];
// destructure operator
const [firstG, secondG, ...theOthers] = genres;
console.log(firstG, secondG, theOthers);

// spread operator
const newGenres = [...genres, "short"];
console.log(newGenres);


const book = data[0];
console.log(book);
const updatedData = {book, publicationDate: "2024-5-14", pages:1210};
console.log(updatedData);

// template literals
const summary = `${firstG} is a book: ${2+1}`;
console.log(summary);

// ternaral operator
// page > 1000 ? "over 1000" : "less than 1000"
const selectedBook = getBookById(3);
const [id, publicationDate, ...theRest] = selectedBook;
console.log(selectedBook);

function getYear(){
	return str.split("-")[0];
}