key = config.API_KEY;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('searchForm').addEventListener('submit', (e) => {
    let search = document.getElementById('searchText').value;
    getMovies(search);
    e.preventDefault();
  })
});

// Generate UI for search page
function getMovies(input) {
  axios.get(`http://www.omdbapi.com/?s=${input}&type=movie&apikey=${key}`)
    .then((response) => {

      if (response.data.Response === 'True') {
        let movies = response.data.Search;
        let output = '';
        movies.forEach((movie, index) => {
          output += `
            <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
              <div class="card text-center mb-4">
                ${generateImage(movie.Poster)}
                <h5 class="pt-2 px-1">${movie.Title}</h5>
                <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">More Info</a>
              </div>
            </div>
          `;
        });
  
        document.getElementById('movies').innerHTML = output;
      } else {
        let output = `
          <h2 class="container pt-5" style="text-align:center">No results found.</h2>
        `;
        document.getElementById('movies').innerHTML = output;
      }
    })
    .catch((err) => console.log(err))
}

function movieSelected(id) {
  // Store movie ID in session storage
  sessionStorage.setItem('movieId', id);

  // Go to movie details page
  window.location = 'item.html';
  return false;
}

// Generate UI for individual movie detail page
function getMovie(){
  let movieId = sessionStorage.getItem('movieId');

  axios.get(`http://www.omdbapi.com/?i=${movieId}&apikey=${key}`)
    .then((response) => {
      console.log(response);
      let movie = response.data;

      let output = `
        <div class="row">
          <div class="col-lg-5 col-xl-4" id="poster">
            ${generateImage(movie.Poster)}
          </div>
          <div class="col-lg-7 col-xl-8" id="details">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Release Date:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rating:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>Runtime:</strong> ${movie.Runtime}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Starring:</strong> ${movie.Actors}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
            </ul>
          </div>
        </div>
        <div class="pt-3">
          <div>
            <h3>Plot</h3>
            ${movie.Plot}
            <hr class="bg-dark">
          </div>
          <div class="container pt-1 text-center">
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-info col-md-3 mr-2 mb-3">View IMDB</a>
            <a href="index.html" class="btn btn-info col-md-3 mb-3">Go Back to Search</a>
          </div>
        </div>
      `;

      document.getElementById('movie').innerHTML = output;
      });
}

function generateImage(poster) {
  let image;

  if (poster !== "N/A") {
    image = poster;
  } else { 
    image = '../img/imagenotfound.png';
  }

  return `<img src="${image}" class="img-fluid"></img>`;
}