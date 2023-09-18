function deleteEvent(){
    let btn =document.getElementById('deleteBtn')
    let id= btn.getAttribute('data-id')
    axios.delete('/events/delete/'+ id)
    .then((res)=>{
        console.log(res.data)
        alert('event was deleted')
        window.location.href ='/events'
        
    })
.catch((err)=>{
    console.log(err)
})
}
 
$(document).ready(function() {
    $('.togglePassword').on('click', function() {
        const passField = $($(this).data('target'));
        const toggleButton = $(this);
        const currentState = toggleButton.data('state');

        if (currentState === 'hide') {
            passField.attr('type', 'text');
            toggleButton.find('i').removeClass('fa-eye').addClass('fa-eye-slash');
            toggleButton.data('state', 'show');
        } else {
            passField.attr('type', 'password');
            toggleButton.find('i').removeClass('fa-eye-slash').addClass('fa-eye');
            toggleButton.data('state', 'hide');
        }
    });
});
function performSearch() {
    var query = document.getElementById("searchInput").value.toLowerCase();

    if (query === "login") {
        window.location.href = "/users/login";  
    } 
    else if (query === "sign up" || query === "register") {
        window.location.href = "/users/signup";
    }
    else if (query === "add new event" || query === "create event") {
        window.location.href = "/events/creat";
    }
    else if (query === "home" || query === "events") {
        window.location.href = "/events";
    }
    
    else {
        alert("No results found!");
    }
}
//upload avatar 

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader()

        reader.onload = function(e) {
            let image = document.getElementById("imagePlaceholder")
            image.style.display = "block"
            image.src = e.target.result

        }

        reader.readAsDataURL(input.files[0])
    }
} 