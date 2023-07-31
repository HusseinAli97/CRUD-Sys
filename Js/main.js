//! ***********************************Enhanced Code ********************************
//? Encapsulate all the functions and Variables
var pManger = {
    // ! ***********************************Add Products**********************************************
    productName: document.getElementById("productName"),
    productPrice: document.getElementById("productPrice"),
    productCategory: document.getElementById('productCat'),
    productDescription: document.getElementById('productDesc'),
    addBtn: document.getElementById("addBtn"),
    updateBtn: document.getElementById("updateBtn"),
    localStorageName: "productStorage",
    pList: [],
    checkedList: [],
    indexing: 0,
    //! ***********************************functions*******************************************
    //? check if there is a local storage for the localStorageName or not  set local storage for the product
    invokedLocal: function () {
        if (localStorage.getItem(this.localStorageName) !== null) {
            this.pList = JSON.parse(localStorage.getItem(this.localStorageName));
            this.showProducts(this.pList);
        } else {
            this.pList = [];
        }
        this.showProducts(this.pList);
    },
    addProductStorage: function (pStorage) {
        localStorage.setItem(this.localStorageName, JSON.stringify(pStorage));
    },

    //! ***********************************Add Products************************************************
    //? create a function to add products and object to pList and add them to local storage
    addProducts: function () {
        //? check Validation before adding products
        if (this.validation()) {
            var products = {
                pName: this.productName.value,
                pPrice: this.productPrice.value,
                pCategory: this.productCategory.value,
                pDescription: this.productDescription.value,
                pLastUpdate: this.currentMoment()
            }
            this.pList.push(products);
            this.addProductStorage(this.pList);
            this.updateInputValue();
            this.showProducts(this.pList);
            this.clearValidation();
        } else {
            alert("Please fill all the fields With right Values");
        }
    },
    //! ***********************************Show Products*********************************************
    //? show products from local storage inside table in html
    showProducts: function (pShow) {
        var content = "";
        for (var i = 0; i < pShow.length; i++) {
            content += `
                <tr>
                    <th> <input type="checkbox" class="form-check-input non-click" id ="checkBox${i}" oninput = "pManger.pushCheckedProduct(${i})"> </th>
                    <th class="text-white fw-bold" scope="row "> ${i + 1}</th>
                    <td class="text-white fw-bold" > ${pShow[i].newProductName ? pShow[i].newProductName : pShow[i].pName}</td>
                    <td class="text-white fw-bold" >${pShow[i].pPrice}</td>
                    <td class="text-white fw-bold" >${pShow[i].pCategory}</td>
                    <td class="text-white fw-bold" >${pShow[i].pDescription}</td>
                    <td class="text-white fw-bold" >${pShow[i].pLastUpdate}</td>
                    <td > <button class="btn btn-warning btn-sm text-uppercase fw-bold"  onclick = "pManger.pullUpdateValue(${i})"><i class="fa-solid fa-pen-to-square"></i></button> </td>
                    <td > <button class="btn btn-danger btn-sm text-uppercase fw-bold " onclick = "pManger.delCurrentProduct(${i})"><i class="fa-solid fa-trash-can"></i></button> </td>
                </tr>
            `;
        }
        document.getElementById("tbody").innerHTML = content;
    },
    //! ***********************************Add Update Inputs**********************************************
    updateInputValue: function (inputValue) {
        this.productName.value = inputValue ? inputValue.pName : '';
        this.productPrice.value = inputValue ? inputValue.pPrice : '';
        this.productCategory.value = inputValue ? inputValue.pCategory : "Select Category";
        this.productDescription.value = inputValue ? inputValue.pDescription : '';
    },
    //! ***********************************Delete  Product*************************************************
    //? create a function to delete all products
    dellAllProducts: function () {
        var delConfirmation = window.confirm('Are you sure you want Delete All Products ?');
        if (delConfirmation) {
            localStorage.clear();
            this.pList = [];
            this.showProducts(this.pList);
        }
    },
    //? delete current product from local storage and send new plist to showProducts
    delCurrentProduct: function (iterator) {
        var delConfirmation = window.confirm('Are you sure you want Delete This Product ?');
        if (delConfirmation) {
            this.pList.splice(iterator, 1);
            this.addProductStorage(this.pList);
            this.showProducts(this.pList);
        }
    },
    //? push checked product to new list and delete checked product local storage and send new plist to showProducts
    pushCheckedProduct: function (iterator) {
        var checkedProduct = document.getElementById(`checkBox${iterator}`);
        checkedProduct.checked //? condition
            ? this.checkedList.push(this.pList[iterator])
            : this.checkedList = this.checkedList.filter(product => product !== this.pList[iterator]);
        this.checkedList.length > 0 //? condition
            ? document.getElementById('delSelectBtn').classList.remove('disabled')
            : document.getElementById('delSelectBtn').classList.add('disabled')
    },
    //? filter checked product from local storage and send new plist to showProducts
    delSelectedProducts: function () {
        var delConfirmation = window.confirm('Are you sure you want Delete Selected Products ?');
        if (delConfirmation) {
            this.pList = this.pList.filter(product => !this.checkedList.includes(product));
            this.addProductStorage(this.pList);
            this.checkedList = [];
            this.showProducts(this.pList);
            document.getElementById('delSelectBtn').classList.add('disabled')
        }
    },
    //! *******************************Update & Edit Product****************************
    //? pull all products values from showProducts and put them in updateInputValue 
    pullUpdateValue: function (currentIndex) {
        this.updateInputValue(this.pList[currentIndex]);
        this.addBtn.classList.add("d-none");
        this.updateBtn.classList.replace("d-none", "d-block");
        this.indexing = currentIndex;
    },
    //? push new product values to pList and send new plist to showProducts and localStorage then clear inputs fields 
    pushUpdateValue: function () {
        this.pList[this.indexing].pName = this.productName.value;
        this.pList[this.indexing].pPrice = this.productPrice.value;
        this.pList[this.indexing].pCategory = this.productCategory.value;
        this.pList[this.indexing].pDescription = this.productDescription.value;
        this.pList[this.indexing].pLastUpdate = this.currentMoment();
        this.addProductStorage(this.pList);
        this.showProducts(this.pList);
        this.updateInputValue();
        this.addBtn.classList.replace("d-none", "d-block");
        this.updateBtn.classList.replace("d-block", "d-none");
    },
    //! ********************************Search for Product**********************************
    //? create a function to search products and highlight it by using regex to crate new object that substring term and replace product name with it and highlight it inside pName
    searchProducts: function (searchTerm) {
        var foundedItems = [];
        for (var i = 0; i < this.pList.length; i++) {
            if (new RegExp(searchTerm, "ig").test(this.pList[i].pName)) {
                this.pList[i].newProductName = this.pList[i].pName.replace(new RegExp(searchTerm, "i"), '<span class="text-purple">$&</span>');
                foundedItems.push(this.pList[i]);
            }
            this.showProducts(foundedItems);
        }
    },
    //! ***************************Validation for Product****************************
    //? check function that receive 2 argument and return true or false & function check if input is empty or not
    checkValidate: function (vValue, regPattern) {
        return regPattern.test(vValue);
    },
    checkEmpty: function () {
        isNameEmpty = this.productName.value == "";
        isPriceEmpty = this.productPrice.value == "";
        isCategoryEmpty = this.productCategory.value == "Select Category";
        isDescriptionEmpty = this.productDescription.value == "";

        isNameEmpty ? this.productName.classList.remove("is-invalid") : null;
        isPriceEmpty ? this.productPrice.classList.remove("is-invalid") : null;
        isCategoryEmpty ? this.productCategory.classList.remove("is-invalid") : null;
        isDescriptionEmpty ? this.productDescription.classList.remove("is-invalid") : null;
    },
    //? function to check if all fields valid or not
    validation: function () {
        var regexName = /^[A-Z][a-z]{2,8}([0-9]){0,2}$/g
        var regexPrice = /^([1-9][0-9]{3}|10000)$/
        var regexDescription = /^[a-z0-9]{1,250}$/ig;
        var isNameValid = this.checkValidate(this.productName.value, regexName);
        var isPriceValid = this.checkValidate(this.productPrice.value, regexPrice);
        var isCategoryValid = this.productCategory.value !== "Select Category";
        var isDescriptionValid = this.checkValidate(this.productDescription.value, regexDescription);
        this.productName.classList.toggle("is-valid", isNameValid);
        this.productName.classList.toggle("is-invalid", !isNameValid);
        this.productPrice.classList.toggle("is-valid", isPriceValid);
        this.productPrice.classList.toggle("is-invalid", !isPriceValid);
        this.productCategory.classList.toggle("is-valid", isCategoryValid);
        this.productCategory.classList.toggle("is-invalid", !isCategoryValid);
        this.productDescription.classList.toggle("is-valid", isDescriptionValid);
        this.productDescription.classList.toggle("is-invalid", !isDescriptionValid);
        this.checkEmpty()
        return isNameValid && isPriceValid && isCategoryValid && isDescriptionValid;
    },
    clearValidation: function () {
        this.productName.classList.remove('is-valid');
        this.productPrice.classList.remove('is-valid');
        this.productCategory.classList.remove('is-valid');
        this.productDescription.classList.remove('is-valid');
    },
    //! ***********************************Add Date Of Edit************************************************
    currentMoment: () => { return moment().format("ddd,DMMMM,h:mmA"); },
}
pManger.invokedLocal();
