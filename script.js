document.addEventListener('DOMContentLoaded', () => {
    async function getImageOfTheDay(date) {
        const apiKey = '5VuqY1nNfFkKdWM7waVupiOwTjPMaKiPfaXvdO0f'; // Replace with your NASA API key
        const url = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch data from NASA API');
            }
            const data = await response.json();

            const currentImageContainer = document.getElementById('current-image-container');
            if (date === getCurrentDate()) {
                currentImageContainer.innerHTML = `
                    <h1>NASA Picture of the Day</h1>
                    <img src="${data.url}" alt="${data.title}" width="100%">
                    <p>${data.explanation}</p>
                `;
            } else {
                currentImageContainer.innerHTML = `
                    <h1>Picture on ${date}</h1>
                    <img src="${data.url}" alt="${data.title}" width="100%">
                    <p>${data.explanation}</p>
                `;
            }

            saveSearch(date);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch data from NASA API. Please try again later.');
        }
    }

    function getCurrentDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function saveSearch(date) {
        let searches = JSON.parse(localStorage.getItem('searches')) || [];
        searches.push(date);
        localStorage.setItem('searches', JSON.stringify(searches));
        addSearchToHistory();
    }

    function addSearchToHistory() {
        const searches = JSON.parse(localStorage.getItem('searches')) || [];
        const searchHistoryList = document.getElementById('search-history');
        searchHistoryList.innerHTML = '';
        searches.reverse();
        for (const search of searches) {
            const listItem = document.createElement('li');
            listItem.textContent = search;
            listItem.addEventListener('click', () => {
                getImageOfTheDay(search);
            });
            searchHistoryList.appendChild(listItem);
        }
    }

    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const selectedDate = document.getElementById('search-input').value;
        getImageOfTheDay(selectedDate);
    });

    const currentDate = getCurrentDate();
    getImageOfTheDay(currentDate);
    addSearchToHistory();
});
