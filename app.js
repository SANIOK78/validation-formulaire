// Objet qui va contenir tous champs du form
const inputsValidity = {        // Cet objet sera modiffié chaque fois
    user: false,                // qu'on valid un champs 
    email: false,
    password: false, 
    passwordConfirmation: false
}

// Ciblage des champs 
const form = document.querySelector("form");
const container = document.querySelector(".container");

form.addEventListener("submit", handleForm);

// variable qui va servir a gérer l'annimation 
let isAnimating = false;

function handleForm(e) {
    e.preventDefault()
  
    const keys = Object.keys(inputsValidity);
  // On return dans un nouveau tab tous les input pas validées
    const errorInputs = keys.filter(key => !inputsValidity[key] );
    
  // On va annimer l'input qui contient encore des erreurs
   //"errorInputs.length" => si true, y a encore des champs pas validé
    if(errorInputs.length && !isAnimating) {    
        isAnimating = true;                      
        container.classList.add("shake");    //rajout du classCss: "shake"
    
        // au bout de 400ms on retire la classe "shake"
        setTimeout(() => {
            container.classList.remove("shake")
            isAnimating = false;
        }, 400)
    
        errorInputs.forEach(input => {
            const index = keys.indexOf(input)
            showValidation({index: index, validation: false})
        })

    } else {
        alert("Données envoyées avec succès.")
    }
  
}
  
const validationIcons = document.querySelectorAll(".icone-verif");
const validationTexts = document.querySelectorAll(".error-msg");
const userInput = document.querySelector(".form-group:nth-child(1) input")

userInput.addEventListener("blur", userValidation);   
userInput.addEventListener("input", userValidation);   
  
function userValidation(){
    if(userInput.value.length >= 3) {
        showValidation({index: 0, validation: true });

        inputsValidity.user = true;  //pour dir que ce champs est validé

    } else {
        showValidation({index: 0, validation: false });
        inputsValidity.user = false;
    }
}

// Function qui va permettre de faire l'affichage en fonction de 2 cas :
// "true" => la saisie correspond aux valuers attendu
// "false" => valeurs erronées
// ca prend en argument un objet et on recuper via destructuring 2 variables
function showValidation({index, validation}) {

    if(validation){
        validationIcons[index].style.display = "inline";
        validationIcons[index].src = "ressources/check.svg";
       // On test si on a un text personnalise en cas d'erreur  
        if(validationTexts[index])  validationTexts[index].style.display = "none";

    } else {
        validationIcons[index].style.display = "inline";
        validationIcons[index].src = "ressources/error.svg";
      // On test si on a un text personnalise en cas d'erreur
        if(validationTexts[index]) validationTexts[index].style.display = "block";
    }
}

const mailInput = document.querySelector(".form-group:nth-child(2) input")
mailInput.addEventListener("blur", mailValidation)
mailInput.addEventListener("input", mailValidation)

// REGEX : model de chaine de caracters qu'on va imposer (attendre) que 
// l'utilisateur rentre, imposer certaines regles au saisit de l'email
const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

function mailValidation() {

    // On test la valeur d'input "email"
    if(regexEmail.test(mailInput.value)){
        showValidation({index: 1, validation: true });

        inputsValidity.email = true;

    } else {
        showValidation({index: 1, validation: false });
        inputsValidity.email = false;
    }
}

// Ciblage du champe 'password'
const pswInput = document.querySelector(".form-group:nth-child(3) input")
// Ecoute des événement dessus
pswInput.addEventListener("blur", passwordValidation)
pswInput.addEventListener("input", passwordValidation)
  
const passwordVerification = {     
    length: false,                
    symbol: false,                 
    number: false
}
  
const regexList = {                
    symbol: /[^a-zA-Z0-9\s]/,     // ici on demande un "symbol"
    number: /[0-9]/                // demande chiffres
}

// La valeur du mot de passe qu'on va créer
let passwordValue;
  
function passwordValidation() {
    passwordValue = pswInput.value;
    let validationResult = 0;

  //Pour chaque propriéte de l'objet "passwordVerification"
    for(const prop in passwordVerification) {         
        if(prop === "length") {                     
            if(passwordValue.length < 6) {             
                passwordVerification.length = false;

            } else {
                passwordVerification.length = true;
                validationResult++;               
            }
            continue;           
        }
  
        if(regexList[prop].test(passwordValue)) {
            passwordVerification[prop] = true;
            validationResult++; 

        } else {
            passwordVerification[prop] = false;
        }
    }
    
    if(validationResult !== 3) {
        showValidation({index: 2, validation: false});
        inputsValidity.password = false;  
                  
    } else {
        showValidation({index: 2, validation: true}) ;
        inputsValidity.password = true;       
    }

    // Affichage de la puissance du MdPasse
    passwordStrength();

}

// Ciblage des div pour l'affichage
const lines = document.querySelectorAll(".lines div")
  
function passwordStrength(){
    // pour tester la longueur du MdPass
    const passwordLength = pswInput.value.length;
    
    if(!passwordLength) {
        addLines(0);

    } else if(passwordLength > 9 && passwordVerification.symbol && passwordVerification.number) {        
        addLines(3);

    } else if(passwordLength > 6 && passwordVerification.symbol || passwordVerification.number) { 
        addLines(2);

    } else {
        addLines(1)
    }
  
    function addLines(numberOfLines) {
        // Pour chaque ligne 
        lines.forEach((el, index) => {
            if(index < numberOfLines) {
                el.style.display = "block"
            } else {
                el.style.display = "none"
            }
        })
    }
  
    if(validationIcons[3].style.display === "inline") {
        confirmPassword();
    }
}
  
// On cible le champs "confirm input" 
const confirmInput = document.querySelector(".form-group:nth-child(4) input")

// Ecoute des évenements "blur" et "input" et execution de callback
confirmInput.addEventListener("blur", confirmPassword)
confirmInput.addEventListener("input", confirmPassword)
  
function confirmPassword() {
    // Récuperation de la valeur de champs
    const confirmedValue = confirmInput.value;
  
    // Si champs vide
    if(!confirmedValue && !passwordValue) {
        validationIcons[3].style.display = "none";
    }
    else if(confirmedValue !== passwordValue) {
        showValidation({index: 3, validation: false}); 
        inputsValidity.passwordConfirmation = false; 
    }
    else {
        showValidation({index: 3, validation: true}); 
        inputsValidity.passwordConfirmation = true;       
    }
}