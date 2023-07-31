var productName = document.getElementById("productName");
var productPrice = document.getElementById("productPrice");
var productCategory = document.getElementById('productCat');
var productDescription = document.getElementById('productDesc');
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var localStorageName = "productStorage";
var pList = [];
var checkedList = [];
var indexing;



//! ***********************************Add Products**********************************************
//? check if there is a local storage for the localStorageName or not  set local storage for the product
if (localStorage.getItem(localStorageName) !== null) {
    pList = JSON.parse(localStorage.getItem(localStorageName));
    showProducts(pList);
} else {
    pList = [];
}

//? set local storage for the product
function addProductStorage(pStorage) {
    localStorage.setItem("productStorage", JSON.stringify(pStorage));
}

//? create a function to add products and object to pList and add them to local storage
function addProducts() {

    if (Validation() == true) {
        var products = {
            pName: productName.value,
            pPrice: productPrice.value,
            pCategory: productCategory.value,
            pDescription: productDescription.value
        }
        updateInputValue();
        pList.push(products);
        addProductStorage(pList)
        showProducts(pList);
        clearValidation();
    } else {
        alert("Please fill all the fields");
    }
    
}

//? show products from local storage inside table in html
function showProducts(pShow) {
    var content = "";
    for (var i = 0; i < pShow.length; i++) {
        content += `
            <tr>
                <th> <input type="checkbox" class="form-check-input non-click" id ="checkBox${i}" oninput = "checkedProduct(${i})"> </th>
                <th class="text-white fw-bold" scope="row "> ${i + 1}</th>
                <td class="text-white fw-bold" > ${pShow[i].newPName ? pShow[i].newPName : pShow[i].pName}</td>
                <td class="text-white fw-bold" >${pShow[i].pPrice}</td>
                <td class="text-white fw-bold" >${pShow[i].pCategory}</td>
                <td class="text-white fw-bold" >${pShow[i].pDescription}</td>
                <td > <button class="btn btn-warning btn-sm text-uppercase fw-bold"  onclick = "updateProduct(${i})">Update</button> </td>
                <td > <button class="btn btn-danger btn-sm text-uppercase fw-bold " onclick = "delCurrentProduct(${i})">Delete</button> </td>
            </tr>
        `
    }
    document.getElementById("tbody").innerHTML = content;
}

//? function to clear input value
function updateInputValue(inputValue) {
    productName.value = inputValue ? inputValue.pName : '';
    productPrice.value = inputValue ? inputValue.pPrice : '';
    productCategory.value = inputValue ? inputValue.pCategory : "Select Category";
    productDescription.value = inputValue ? inputValue.pDescription : '';
}

//! ************************Delete  Product****************************

//? delete all products from local storage and send new plist to showProducts
function delAllProducts() {
    localStorage.clear();
    pList = [];
    showProducts(pList);
}

//? delete current product from local storage and send new plist to showProducts
function delCurrentProduct(iterator) {
    pList.splice(iterator, 1);
    localStorage.setItem(localStorageName, JSON.stringify(pList));
    showProducts(pList);
}

//? Push checked product to new list and delete checked product local storage and send new plist to showProducts

function checkedProduct(iterator) {
    var checkBox = document.getElementById(`checkBox${iterator}`);

    if (checkBox.checked) {
        checkedList.push(pList[iterator]);
    } else {
        checkedList = checkedList.filter(product => product !== pList[iterator]);
    }
    if (checkedList.length > 0) {
        document.getElementById('delSelectBtn').classList.remove('disabled');
    } else {
        document.getElementById('delSelectBtn').classList.add('disabled');
    }
}

//? delete checked product from local storage and send new plist to showProducts

function delCheckedProducts() {
    pList = pList.filter(product => !checkedList.includes(product));
    localStorage.setItem(localStorageName, JSON.stringify(pList));
    checkedList = [];
    showProducts(pList);
}

//! ***************************Update Product****************************

//? pull all products values from showProducts and put them in updateInputValue 
function updateProduct(iterator) {
    updateInputValue(pList[iterator]);
    addBtn.classList.add("d-none");
    updateBtn.classList.replace("d-none", "d-block");
    indexing = iterator;
}

//? assign new product values to pList and send new plist to showProducts and localStorage then clear inputs fields 
function editProduct() {
    pList[indexing].pName = productName.value;
    pList[indexing].pPrice = productPrice.value;
    pList[indexing].pCategory = productCategory.value;
    pList[indexing].pDescription = productDescription.value;
    localStorage.setItem(localStorageName, JSON.stringify(pList));
    showProducts(pList);
    addBtn.classList.replace("d-none", "d-block");
    updateBtn.classList.replace("d-block", "d-none");
    updateInputValue();
    clearValidation();
}

//! ***************************Search for Product****************************
//? create a function to search products and highlight it by using regex to crate new object that substring term and replace product name with it and highlight it inside pName
function searchProduct(searchTerm) {
    var foundedItems = [];
    var regex = new RegExp(searchTerm, "ig");
    for (var i = 0; i < pList.length; i++) {
        if (regex.test(pList[i].pName)) {
            pList[i].newPName = pList[i].pName.replace(regex, '<span class="text-danger">$&</span>');
            foundedItems.push(pList[i]);
        }
    }
    showProducts(foundedItems);
}

//! ***************************Validation for Product****************************
function checkValidate(vValue,regPattern) {
return regPattern.test(vValue);
}
function Validation() {
    var regexName = /^[A-Z][a-z]{2,8}([0-9]){0,2}$/g
    var regexPrice = /^([1-9][0-9]{3}|10000)$/
    var regex = /^[a-z0-9]{1,250}$/ig;

    //? pass regex and value to test it in checkValidation

    isValidName = checkValidate(productName.value,regexName);
    isValidPrice = checkValidate(productPrice.value,regexPrice);
    isValidCategory = productCategory.value !== "Select Category";
    isValidDescription = checkValidate(productDescription.value,regex);

    //? toggele validation depend on the isValid value

    productName.classList.toggle("is-valid", isValidName);
    productName.classList.toggle("is-invalid", !isValidName);
    productPrice.classList.toggle("is-valid", isValidPrice);
    productPrice.classList.toggle("is-invalid", !isValidPrice);
    productCategory.classList.toggle("is-valid", isValidCategory);
    productCategory.classList.toggle("is-invalid", !isValidCategory);
    productDescription.classList.toggle("is-valid", isValidDescription);
    productDescription.classList.toggle("is-invalid", !isValidDescription);
    isEmpty()
    return isValidName && isValidPrice && isValidCategory && isValidDescription && isEmpty();
}
function isEmpty(){
    isEmptyName = productName.value === "";
    isEmptyPrice = productPrice.value === "";
    isEmptyCategory = productCategory.value === "Select Category";
    isEmptyDescription = productDescription.value === "";

    if (isEmptyName){
        productName.classList.remove("is-invalid");
    }
    if (isEmptyPrice){
        productPrice.classList.remove("is-invalid");
    }
    if (isEmptyCategory){
        productCategory.classList.remove("is-invalid");
    }
    if (isEmptyDescription){
        productDescription.classList.remove("is-invalid");
    }
    return !isEmptyName && !isEmptyPrice && !isEmptyCategory && !isEmptyDescription;
}
function clearValidation() {
productName.classList.remove('is-valid');
productPrice.classList.remove('is-valid');
productCategory.classList.remove('is-valid');
productDescription.classList.remove('is-valid');
}



