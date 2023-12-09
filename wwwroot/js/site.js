$(document).ready(function () {
    // Nav Bar Drop Down
    $("#toggleLink").click(function () {
        dropdownShowAndHide();
    });
    // Log In Modal
    $("#logInButton").click(function () {
        openLogInModal();
    });
    $("#signInCancel").click(function () {
        $("#logInModal").modal('hide');
    });
    $("#signIn").click(function () {
        if (validSignInInformation()) { 
            sendRequestForSignIn();
        }
    });
    $("#logOutButton").click(function () {
        openLogOutModal();
    });
    //Register Modal
    $("#registrationLink, #signUpButton").click(function () {
        openRegistrationModal();
    });
    $("#registerCancel").click(function () {
        $("#signUpModal").modal('hide');
    });
    $("#register").click(function (event) {
        if (validateRegisterInformation()) {
            sendRequestForRegister();
        }
    });
    //Sorting
    initialTableSort();
    $('.sortIcon').on('click', function () {
        var sortObj = findTableNameAndSortOrder(this);
        sortTable(sortObj.TableName, sortObj.SortOrder, sortObj.Column);
    });
});


function sortTable(tableName, order, column) {
    var tbody = $('#' + tableName + ' tbody');
    var rows = tbody.find('tr').get();

    rows.sort(function (a, b) {
        var A = $(a).find('td:nth-child(' + column + ')').text().toUpperCase();
        var B = $(b).find('td:nth-child(' + column + ')').text().toUpperCase();

        if (order === 'asc') {
            return A.localeCompare(B);
        } else {
            return B.localeCompare(A);
        }
    });

    $.each(rows, function (index, row) {
        tbody.append(row);
    });
}
function validateMobile(inputElement) {
    var inputValue = inputElement.value;
    var regex = /^\d+$/; 
    var signUpErrorMobileNumber = document.getElementById('signUpErrorMobileNumber');
    signUpErrorMobileNumber.textContent = '';
    if (!regex.test(inputValue)) {
        signUpErrorMobileNumber.textContent ='Please enter only numbers';
        inputElement.value = '';
    }
    if (inputValue.length > 11) {
        signUpErrorMobileNumber.textContent ='Input must not exceed 11 characters';
        inputElement.value = '';
    }

}
function validatePassword(inputElement) {
    var inputValue = inputElement.value;
    var regex = /^[a-zA-Z0-9 ]+$/; 
    var passwordErrorSpan = document.getElementById('inputPasswordError');
    var signUpErrorInputPassword = document.getElementById('signUpErrorInputPassword');
    var signUpErrorRetypePassword = document.getElementById('signUpErrorRetypePassword');

    passwordErrorSpan.textContent = '';
    signUpErrorInputPassword.textContent = '';
    signUpErrorRetypePassword.textContent = '';
    if (!regex.test(inputValue)) {
        passwordErrorSpan.textContent = 'Please enter only letters a-z , numbers and spaces.';
        inputElement.value = '';
    }

    if (inputValue.length > 6) {
        passwordErrorSpan.textContent = 'Input must not exceed 6 characters.';
        inputElement.value = '';
    }
}
function validateUserName(inputElement) {
    var inputValue = inputElement.value;
    var regex = /^[a-zA-Z0-9]+$/; 
    var userNameErrorSpan = document.getElementById('userNameError');
    var signUpErrorSpan = document.getElementById('signUpErrorUserName');
    userNameErrorSpan.textContent = '';
    signUpErrorSpan.textContent = '';
    if (!regex.test(inputValue)) {
        userNameErrorSpan.textContent = 'Please enter only letters a-z and numbers.';
        signUpErrorSpan.textContent = 'Please enter only letters a-z ,and numbers.';
        inputElement.value = '';
    }

    if (inputValue.length > 50) {
        userNameErrorSpan.textContent = 'Input must not exceed 50 characters.';
        signUpErrorSpan.textContent = 'Input must not exceed 50 characters.';
        inputElement.value = '';
    }
    if ($("#sinUpUserName").val()) {
        $.ajax({
            type: "GET",
            url: "/Home/IsUserNameAvailable",
            data: { UserName: $("#sinUpUserName").val() },
            success: function (response) {
                if (!response.success) {
                    signUpErrorSpan.textContent = 'User Name Exists!!';
                }
            },
            error: function (error) {
                alert(error);
            }
        });
    }
}
function dropdownShowAndHide() {

    if ($("#navbarDropdown").css('display') === 'block') {
        $("#navbarDropdown").css('display', 'none');
    }
    else {
        $("#navbarDropdown").css('display', 'block');
    }
}
function openLogInModal() {
    $("#logInModal").modal('show');
    $("#userName").val("");
    $("#inputPassword").val("");
    $("#userNameError").text('');
    $("#inputPasswordError").text('');
}
function openRegistrationModal() {
    $("#signUpModal").modal('show');
    $("#logInModal").modal('hide');
    $("#sinUpUserName").val("");
    $("#signUpMobileNumber").val("");
    $("#signUpInputPassword").val("");
    $("#signUpRetypePassword").val("");
    $("#signUpErrorUserName").text("");
    $("#signUpErrorMobileNumber").text("");
    $("#signUpErrorInputPassword").text("");
    $("#signUpErrorRetypePassword").text("");
}
function validSignInInformation() {
    var validInfo = true;
    var userName = $("#userName").val();
    var userPassword = $("#inputPassword").val();

    if (userName == '' || userPassword == '') {
        if (userName == '') {
            $("#userNameError").text('User field cannot be empty');
            validInfo = false;
        }
        if (userPassword == '') {
            $("#inputPasswordError").text('Type Password to Log In');
            validInfo = false;
        }
    }
    return validInfo;
}
function sendRequestForSignIn() {

    $("#logInModal").modal('hide');
    var formData = {
        UserName: $("#userName").val(),
        UserPassword: $("#inputPassword").val()
    };
    
    $.ajax({
        type: "POST",
        url: "/Home/SignIn",
        data: JSON.stringify(formData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.success) {
                location.reload();
            }
            else {
                alert(response.message);
            }
        },
        error: function (error) {
            alert(error);
        }
    });
    
}
function openLogOutModal() {
    var confirmLogOut = false;
    if (confirm("Logging Out ??")) {
        confirmLogOut = true;
    } else {
        confirmLogOut = false;
    }
    if (confirmLogOut) {
        $.ajax({
            type: "POST",
            url: "/Home/LogOut",
            success: function (response) {
                window.location.href = "/Home/Index";
            },
            error: function (error) {
                alert(error);
            }
        });
    }
}
function validateRegisterInformation() {
    var validInfo = true;
    var userName = $("#sinUpUserName").val();
    var mobileNumber = $("#signUpMobileNumber").val();
    var userPassword = $("#signUpInputPassword").val();
    var userRetypePassword = $("#signUpRetypePassword").val();

    if (userName == '') {
        $("#signUpErrorUserName").text("Please Input a User Name");
        validInfo = false;
    }
    if (mobileNumber == '') {
        $("#signUpErrorMobileNumber").text("Please Input a Mobile Number");
        validInfo = false;
    }
    if (userPassword == '') {
        $("#signUpErrorInputPassword").text("Please Input a Password");
        validInfo = false;
    }
    if (userRetypePassword == '') {
        $("#signUpErrorRetypePassword").text("Please Retype Password");
        validInfo = false;
    }
    if (mobileNumber.length != 11) {
        $("#signUpErrorMobileNumber").text("Mobile Number should be 11 digits");
        validInfo = false;
    }
    if (userPassword != userRetypePassword) {
        $("#signUpErrorRetypePassword").text("Passwords don't match");
        validInfo = false;
    }
    if (signUpErrorUserName.textContent.length > 0) {
        validInfo = false;
    }
    return validInfo;
}
function sendRequestForRegister() {  
    $("#signUpModal").modal('hide');
    var formData = {
        UserName: $("#sinUpUserName").val(),
        MobileNumber: $("#signUpMobileNumber").val(),
        UserPassword: $("#signUpInputPassword").val(),
    };

    $.ajax({
        type: "POST",
        url: "/Home/Register",
        data: JSON.stringify(formData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            alert(response.message);
        },
        error: function (error) {
            alert(error);
        }
    });
}
function findTableNameAndSortOrder(element) {
    var tableName = $(element).closest('table').attr('id');
    $('.sortIcon').not(element).removeClass('fa-sort-up');
    $('.sortIcon').not(element).removeClass('fa-sort-down');
    $('.sortIcon').not(element).addClass('fa-sort');
    $('.sortIcon').not(element).addClass('asc');

    var sortOrder = 'desc';
    if ($(element).hasClass('asc')) {
        sortOrder = 'desc';
        $(element).removeClass('asc');
        $(element).addClass('desc');
    }
    else {
        sortOrder = 'asc';
        $(element).removeClass('desc');
        $(element).addClass('asc');
    }

    var clickedThead = $(element).closest('th');
    var column = clickedThead.index() + 1;

    if (sortOrder === 'asc') {
        sortOrder = 'desc';
        $(element).removeClass('fa-sort').addClass('fa-sort-down');
        $(element).removeClass('fa-sort-up').addClass('fa-sort-down');
    } else {
        sortOrder = 'asc';
        $(element).removeClass('fa-sort-down').addClass('fa-sort-up');
    }
    return {
        TableName: tableName,
        SortOrder: sortOrder,
        Column: column
    };
}
function initialTableSort() {
    var table = document.querySelector('table');
    if (table) {
        var tableName = table.getAttribute('id');
        if (tableName === 'vehicleTable') {
            sortTable(tableName, 'asc', 2);
        }
        else {
            sortTable(tableName, 'asc', 1);
        }
    }
}