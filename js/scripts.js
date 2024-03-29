let matchNames = [];
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
    
    let date = new Date(person.dob.date);
    
    let string = person.location.street.name.split(" "); //split the stree into an array
    let streetNumber = person.location.street.number;
    for(let i=0;i < string.length;i++){
        string[i] = string[i].charAt(0).toUpperCase() + string[i].substring(1); //go through each array, convert arrayfirst to Upper then concat with the rest
    }
    //code inspiring from https://stackoverflow.com/questions/32589197/capitalize-first-letter-of-each-word-in-a-string-javascript
    let newStreet= string.join(" ");  //put them together again*/
 
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
                        <p class="modal-text">${newStreet} ${streetNumber}</p>
                        <p class="modal-text">Birthday: ${date.getUTCMonth()+1}-${date.getUTCDate()}-${date.getUTCFullYear()}</p>
                    </div>
            </div>
    `).insertAfter('#gallery');
}

//insert toggle forward / back

const createToggleBack_Forward = () => {
    
    $('.modal-container').append(`
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    `);
}


//implment toggle forward and back

const toggleForward = (data,index) => {
    $("#modal-next").on('click', () => {
        $('.modal-container').remove(); //remove the previous conatiner
        createModal(data[index]);
        createToggleBack_Forward();
        if(index === $('.card').length-1){
            toggleForward(data, 0); //if reach the end, reset the first item
        } else {
            toggleForward(data, index+1); //recursive call the function
        }
        //let indexNew = index + 1; //always + 1 for next modal
        
        $(".modal-close-btn").click((e) => {
            $('.modal-container').remove();
        })
        
        
        if((index-1) === -1){
            toggleBack(data,$('.card').length-1); // if reach the front, reset to the last item
        } else {
            toggleBack(data,index-1); // for move back 
        }
        
    })
    
}

const toggleBack = (data, index) => {
    $("#modal-prev").on('click', () => {
        $('.modal-container').remove();
        createModal(data[index]);
        createToggleBack_Forward();

        if((index-1) === -1){
            toggleBack(data, ($('.card').length)-1); //if reach the front, reset it to length
        } else {
            toggleBack(data, index-1);
        }

        
        $(".modal-close-btn").click((e) => {
            $('.modal-container').remove();//recursive call the function
        })
        
        if((index+1) === $('.card').length){
            toggleForward(data,0); //if reach the end, reset and start from front
        } else {
            toggleForward(data,index+1);// for move forward
        }
        
    })
}


//insert search bar

const searchBar = () => {
    $(`
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
        </form>
    `).insertAfter('.search-container');
}

//searchFunctionCheck
const searchFunc = (name) => {
    if(name.text().includes($('#search-input').val().toLowerCase())){
        return true //if one of the names includes from the search box, reture true
    } else {
        return false;
    }
}

//fetch data back with a Promise from api end point
const fetchFunc = (funcGallery) => { 
    fetch('https://randomuser.me/api/?results=12&nat=US') //return only US based employees
        .then(res =>{
            if(res.ok){
                return res.json(); //convert the string to json
            } else {
                throw new Error('oops, something went wrong');
            }
            }
        )
        .then(data => {
            data.results.map(person => {    
                funcGallery(person);  //create the gallary
            }); //gallery displayed

            searchBar();//insert the search bar
            
            $(".card").each((index, element) => {
                
                $(element).on('click', (e) => {
                    
                    let indexToggle1 = index;
                    let indexToggle2 = index;
                    createModal(data.results[index]); //when the card clicked, create the modal
                    createToggleBack_Forward(); //adding the move forward and back buttons
                    
                    if(index === $('.card').length-1){
                        indexToggle1 = -1; //reset if reach the end
                    } 
                    toggleForward(data.results, indexToggle1+1); //call move forward function
 
                    if(index === 0){
                        indexToggle2 = $('.card').length; //reset if reach the front
                    } 
                    toggleBack(data.results, indexToggle2-1); //call move back function
                    
                
                    $(".modal-close-btn").click((e) => {
                        $('.modal-container').remove();
                    })
                })
            }) //modal display

            //search based on submit button
            $("#serach-submit").on('click' ,(e) => {
                e.preventDefault();
                $(".card #name").each((index,element) => {
                    if(searchFunc($(element))){
                        $($(".card")[index]).show();//passing the list of names to the search function, show if true
                    } else {
                        $($(".card")[index]).hide();
                    }
                })
            })

            //search based real time keyboard input
            $("#search-input").on('keyup' ,(e) => {
                e.preventDefault();
                $(".card #name").each((index,element) => {
                    if(searchFunc($(element))){
                        $($(".card")[index]).show();//passing the list of names to the search function
                    } else {
                        $($(".card")[index]).hide();
                    }
                })
            })
        })
        .catch((e)=>{
            console.log(e);
        }
    );
}

fetchFunc(createGallery);

