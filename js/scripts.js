
//add dynamic mark up for the gallary

const createGallery = (person) => {
    $('#gallery')
        .append(
            `<div class="card">
                <div class="card-img-container">
                    <img class=card-img src=${person.picture.medium} alt="profile picture"></img>
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
                    <p class="card-text">${person.email}</p>
                <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
            </div>
            </div>`
        )
}

//create Modal

const createModal = (person) => {
        $(`
            <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src=${person.picture.large} alt="profile picture">
                        <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                        <p class="modal-text">${person.email}</p>
                        <p class="modal-text cap">${person.location.city}</p>
                        <hr>
                        <p class="modal-text">${person.phone}</p>
                        <p class="modal-text">${person.location.street}</p>
                        <p class="modal-text">${person.dob.date}</p>
                    </div>
            </div>
    `).insertAfter('#gallery');
}

//fetch data back with a Promise from api end point
const fetchFunc = (funcGallery) => { 
    fetch('https://randomuser.me/api/?results=12')
        .then(res =>{
            if(res.ok){
                return res.json();
            } else {
                throw new Error('oops, something went wrong');
            }
            }
        )
        .then(data => {
            data.results.map(person => {    
                funcGallery(person); 
            });
            
            $(".card").each((index, element) => {
                $(element).on('click', (e) => {
                    createModal(data.results[index]);
                    $(".modal-close-btn").click((e) => {
                        $('.modal-container').hide();
                    })
                })
            })
        })
        .catch((e)=>{
            console.log(e);
        }
    );
}

fetchFunc(createGallery);