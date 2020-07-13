'use strict';

const heroesShowsList = document.getElementById('heroWrap'),
    selector = document.getElementById('colorselector'),
    error = document.querySelector('.error-page-wrap');
let dataArray = [],
    dataFilterArray = [],
    selectArray = [];

const iteratingArrayElemens = arg => {
    dataArray.forEach(item => {
        for(let key in item) {
            if (item.movies) {
                item.movies.forEach(elem => {
                    if (arg === 0) {
                        selectArray.push(elem.trim());
                    } else if (arg === 1 && selector.value === elem.trim()) {
                        dataFilterArray.push(item);
                    }
                });
            } else if (!item.movies && selector.value === 'other heroes') {
                dataFilterArray.push(item);
            } else {
                selectArray.push('other heroes');
            }
        }
    });
};

const createSelect = () => {
    iteratingArrayElemens(0);
    selectArray = [...new Set(selectArray)];
    selectArray.sort().forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = `${item}`;
        selector.appendChild(option);
    });
};

const createForms = array => {
    heroesShowsList.textContent = '';
    array.forEach(item => {
        const card = document.createElement('li');
        card.innerHTML = `
            <img src="${item.photo}" alt="${item.name}">
            <span>${item.name}</span>
        `;
        heroesShowsList.append(card);
    });
};

const selectTheMovie = () => {
    selector.addEventListener('change', () => {
        dataFilterArray = [];
        if (selector.value === 'All movies') {
            dataFilterArray = dataArray;
        }
        iteratingArrayElemens(1);
        dataFilterArray = [...new Set(dataFilterArray)];
        createForms(dataFilterArray);
    });
};

const createModal = target => {
    let alt = target.alt,
        textContent = target.textContent.trim();
       
    dataArray.forEach(item => {
        if (textContent === item.name || alt === item.name) {
            let { name, realName, species,
                citizenship, gender, birthDay,
                deathDay, status, actors, photo, movies } = item;

            realName = realName ? realName : '-';
            species = species ? species : '-';
            citizenship = citizenship ? citizenship : '-';
            birthDay = birthDay ? birthDay : '-';
            deathDay = deathDay ? deathDay : '-';
            movies = movies ? movies.join(', ') : '-';

            const modalCard = document.createElement('div');
            modalCard.classList.add('modal');
            modalCard.innerHTML = `
                <div class="IDcard modal-card">
                    <div class="head">
                        <div class="close">x</div>
                            <img src="${item.photo}" alt="${item.name}">
                            <span class="name">${item.name}</span>
                        </div>
                        <div class="info">
                            <ul>
                                <li>Gender <span>${gender}</span></li>
                                <li>Species <span>${species}</span></li>
                                <li>RealName <span>${realName}</span></li>
                                <li>Status <span>${status}</span></li>
                                <li>BirthDay <span>${birthDay}</span></li>
                                <li>DeathDay <span>${deathDay}</span></li>
                            </ul><br>
                            <ul>
                                <li>Actors <span>${actors}</span></li>
                                <li>Citizenship <span>${citizenship}</span></li>
                                <li>Movies:<span> ${movies}</span></li>
                                <li><span><br></span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            document.body.append(modalCard);
            modalCard.addEventListener('click', event => {
                if (event.target.closest('.close') ||
                    event.target.classList.contains('modal')) {
                    heroesShowsList.style.opacity = 1;
                    modalCard.style.display = 'none';
                }
            });
        }
    });
};

const initFunction = request => {
    selector.style.opacity = 1;
    const data = JSON.parse(request.responseText);
    dataArray = data;
    createSelect();
    createForms(dataArray);
    selectTheMovie();
};

const errorFunction = () => {
    error.style.display = 'block';
    selector.style.opacity = 0.3;
};

const getData = () => {
    error.style.display = 'none';
    const request  = new XMLHttpRequest();
    request.open('GET', './dbHeroes.json');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();
    request.addEventListener('readystatechange', event => {
        if (request.readyState !== 4) {
            return;
        }
        if (request.status === 200) {
            initFunction(request);
        } else {
            errorFunction();
        }
    });
};
getData();

heroesShowsList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    if (target.closest('#heroWrap')) {
        heroesShowsList.style.opacity = 0.3;
        createModal(target);
    }
});




    

