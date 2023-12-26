let signUpLink = document.querySelector('.orSingLink');
let textLog = document.querySelector('.textLog');
let loginBtn = document.querySelector('.login-button')
let orSign = document.querySelector('.orSign');
let isAccount = true;
let usernameLabel = document.querySelector('.usernameLabel');
let usernameInput = document.getElementById('username');
let loginForm = document.getElementById('myForm');
function updateTexts() {
    if (isAccount) {
        textLog.textContent = 'Sign up';
        loginBtn.textContent = 'Sign up';
        orSign.innerHTML = 'Already have an account? <a href="#" id="logInLink">Log in</a>';
        usernameLabel.style.display = 'block';
        usernameInput.style.display = 'block';
        usernameInput.removeAttribute('required');
    } else {
        textLog.textContent = 'Log in';
        loginBtn.textContent = 'Log in';
        orSign.innerHTML = 'Don\'t have an account? <a href="#" id="signUpLink">Sign up</a>';
        usernameLabel.style.display = 'none';
        usernameInput.style.display = 'none';
        usernameInput.removeAttribute('required');
    }

    let linkId = isAccount ? 'logInLink' : 'signUpLink';
    let link = document.getElementById(linkId);

    if (link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            isAccount = !isAccount;
            updateTexts();
            clearForm();
        });
    }
}
signUpLink.addEventListener('click', function(event) {
    event.preventDefault();
    isAccount = !isAccount;
    updateTexts();
    clearForm();
});

updateTexts();

function clearForm(){
    loginForm.reset();
}

loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
   
});

