var categoryTypeErrorSpan = document.getElementById('categoryTypeError');
var vehicleBrandTypeErrorSpan = document.getElementById('vehicleBrandTypeError');
var vehicleModelTypeErrorSpan = document.getElementById('vehicleModelTypeError');
var vehicleCapacityTypeErrorSpan = document.getElementById('vehicleCapacityTypeError');
var totalQuantityTypeErrorSpan = document.getElementById('totalQuantityTypeError');
var vehicleImageTypeErrorSpan = document.getElementById('vehicleImageTypeError');
var tempVehicleId;
$(document).ready(function () {
    $('#toggleLink').removeClass('text-white');
    $('#toggleLink').addClass('bg-white');
    $('#toggleLink').addClass('text-black');
    $('#toggleLink').addClass('rounded-2');
    // Create Modal
    $("#addVehicleButton").click(function () {
        $("#addVehicle").modal('show');
        $(".modal-title").text("Add Vehicle");
        $("#confirmInsertButton").css('display', 'initial');
        $("#confirmEditButton").css('display', 'none');
        $("#selectedCategory").val('');
        $("#selectedBrand").val('');
        $("#selectedVehicleModel").val('');
        $("#vehicleCapacity").val('');
        $("#totalQuantity").val('');
        $("#vehicleImage").val('');
        $("#vehicleImageEdit").css('display', 'none');
        $('#showCarQuantityFields').css('display', 'none');
        $("#vehicleImage").css('display', 'block');
        $("#totalQuantity").prop("disabled", false);
        $("#editCarAddButton").css('display', 'none');
        categoryTypeErrorSpan.textContent = '';
        vehicleBrandTypeErrorSpan.textContent = '';
        vehicleModelTypeErrorSpan.textContent = '';
        vehicleCapacityTypeErrorSpan.textContent = '';
        totalQuantityTypeErrorSpan.textContent = '';
        vehicleImageTypeErrorSpan.textContent = '';

        var output = document.getElementById('output');
        output.style.width = "0px";
        output.style.height = "0px";
    });

    $("#cancelInsertButton").click(function () {
        $("#addVehicle").modal('hide');
    });

    $("#confirmInsertButton").click(function () {

        var selectCategory = $("#selectedCategory").val();
        var selectBrand = $("#selectedBrand").val();
        var selectVehicleModel = $("#selectedVehicleModel").val();
        var vehicleCapacity = $("#vehicleCapacity").val();
        var totalQuantity = $("#totalQuantity").val();

        if (!DetectErrors()) {
            $("#addVehicle").modal('hide');
            var formData = new FormData();
            formData.append("CategoryId", selectCategory);
            formData.append("BrandId", selectBrand);
            formData.append("VehicleModelId", selectVehicleModel);
            formData.append("VehicleCapacity", vehicleCapacity);
            formData.append("TotalQuantity", totalQuantity);
            formData.append("VehicleImage", $("#vehicleImage")[0].files[0]);
            formData.append("VehicleImageName", $("#vehicleImage")[0].files[0].name); 
            const formValues = getFormValues();
            const carsJson = JSON.stringify(formValues);
            formData.append("Cars", carsJson);
            $.ajax({
                type: "POST",
                url: "/Settings/AddVehicle",
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {

                    location.reload();
                },
                error: function (error) {
                    alert(error);
                }
            });
        }
    });

    // Delete Modal
    $(".delete-vehicle").click(function () {

        var vehicleId = $(this).data("vehicle-id");
        $("#confirmDeleteButton").data("vehicle-id", vehicleId);
        $('#deleteConfirmationModal').modal('show');
    });

    $("#cancelDeleteButton").click(function () {
        $('#deleteConfirmationModal').modal('hide');
    });

    $("#confirmDeleteButton").click(function () {
        var vehicleId = $(this).data("vehicle-id");
        $('#deleteConfirmationModal').modal('hide');


        $.ajax({
            type: "POST",
            url: "/Settings/DeleteVehicle",
            data: { id: vehicleId },
            success: function (data) {
                location.reload();
            },
            error: function (error) {
                alert(error);
            }
        });
    });


    
    // Edit Modal
    
    $(".edit-vehicle").click(function () {
        $(".modal-title").text("Edit Vehicle");
        $("#vehicleImageEdit").css('display', 'block');
        $("#vehicleImageEdit").css('cursor', 'pointer');
        $("#vehicleImage").css('display', 'none');
        var vehicleId = $(this).data("vehicle-id");
        tempVehicleId = vehicleId;
        $.ajax({
            type: "GET",
            url: "/Settings/GetVehicleById",
            data: { id: vehicleId },
            success: function (data) {
                $("#addVehicle").modal('show');
                $("#confirmInsertButton").css('display', 'none');
                $("#confirmEditButton").css('display', 'initial');
                $("#editCarAddButton").css('display', 'block');
                $('#showCarQuantityFields').css('display', 'block');
               
                $("#totalQuantity").prop("disabled", true);
                $("#formContainer").empty();
                $("#selectedCategory").val(data.transport.categoryId);
                GetBrand(data.transport.brandId, data.transport.vehicleModelId);
                
                $("#vehicleCapacity").val(data.transport.vehicleCapacity);
                $("#totalQuantity").val(data.transport.totalQuantity);
                
                generateFormGroups(data.transport.totalQuantity, data.transport.cars);
                $("#inlineFormInputGroup").attr('placeholder', data.transport.vehicleImageName);
                var output = document.getElementById('output');
                output.src = 'data:image;base64,' +data.transport.vehicleImageBase64 ;
                output.style.width = "200px";
                output.style.height = "200px";
               
            },
            error: function (error) {
                alert(error);
            }
        });

    });

    $("#confirmEditButton").click(function () {
        

        if (!DetectErrors()) {
            $("#addVehicle").modal('hide');
            var vehicleId = tempVehicleId;
            var selectCategory = $("#selectedCategory").val();
            var selectBrand = $("#selectedBrand").val();
            var selectVehicleModel = $("#selectedVehicleModel").val();
            var vehicleCapacity = $("#vehicleCapacity").val();
            var totalQuantity = $("#totalQuantity").val();

            var formData = new FormData();
            formData.append("VehicleId", vehicleId);
            formData.append("CategoryId", selectCategory);
            formData.append("BrandId", selectBrand);
            formData.append("VehicleModelId", selectVehicleModel);
            formData.append("VehicleCapacity", vehicleCapacity);
            formData.append("TotalQuantity", totalQuantity);

            const formValues = getFormValues();
            const carsJson = JSON.stringify(formValues);
            formData.append("Cars", carsJson);
            if ($("#vehicleImage").val()) {
                formData.append("VehicleImage", $("#vehicleImage")[0].files[0]);
                formData.append("VehicleImageName", $("#vehicleImage")[0].files[0].name);
            }
            else {
                formData.append("VehicleImageName", $("#inlineFormInputGroup").attr('placeholder'));
            }

            $.ajax({
                type: 'POST',
                url: '/Settings/UpdateVehicle',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    location.reload();
                },
                error: function (error) {
                    alert("Internal Error!!");
                }
            });
        }

    });


    $("#vehicleImageEdit").click(function () {
       
        $("#vehicleImage").click();
    });

    $("#editCarAddButton").click(function () {
        var totalquantity = $("#totalQuantity").val();
        totalquantity++;
        $("#totalQuantity").val(totalquantity);
        generateFormGroups(1, undefined, true);
       
    });
   

});

$(document).on("click", "#totalVehicle", function () {

    $("#detailsVehicleModal").modal('show');
    var vehicleId = $(this).data("vehicle-id");
    $.ajax({
        type: "GET",
        url: "/Settings/GetVehicleDetails",
        data: { id: vehicleId },
        success: function (data) {
            var detailsModal = $("#detailsModal");
            detailsModal.empty();

            $.each(data, function (index, car) {

                const rowDiv = document.createElement('div');
                rowDiv.classList.add('row');

                const col1Div = document.createElement('div');
                col1Div.classList.add('col', 'text-center','mb-3');
                col1Div.textContent = car.modelYear;

                const col2Div = document.createElement('div');
                col2Div.classList.add('col', 'text-center','mb-3');
                col2Div.textContent = car.numberPlate;

                rowDiv.appendChild(col1Div);
                rowDiv.appendChild(col2Div);
                detailsModal.append(rowDiv);
            });
        },
        error: function (error) {
            alert("Internal Error!!");
        }
    });
   

});


function GetBrand(brandId=0,vehicleModelId=0) {
    var selectCategory = $("#selectedCategory").val();
    var brandDropdown = $("#selectedBrand");
    brandDropdown.empty();
    brandDropdown.append("<option value=''>--Please Select Car Brand--</option>");
    if (selectCategory) {
        categoryTypeErrorSpan.textContent = "";
        $.ajax({
            type: "GET",
            url: "/Settings/GetBrandBasedOnCategory",
            data: { id: selectCategory },
            success: function (data) {
            $.each(data, function (index, brand) {
                    if (brand.brandId == brandId) {
                        brandDropdown.append("<option value='" + brand.brandId + "' selected>" + brand.brandName + "</option>");
                        GetVehicleModel(vehicleModelId);
                    }
                    else {
                        brandDropdown.append("<option value='" + brand.brandId + "'>" + brand.brandName + "</option>");
                    }
                });
                
            },
            error: function (error) {
                alert("Internal Error!!");
            }
        });
    }
    else {
        categoryTypeErrorSpan.textContent = "Select a Category";
    }

}

function GetVehicleModel(vehicleModelId=0) {
    var selectBrand = $("#selectedBrand").val();
    var vehicleModelDropdown = $("#selectedVehicleModel");
    vehicleModelDropdown.empty();
    vehicleModelDropdown.append("<option value=''>--Please Select Car Model--</option>");
    if (selectBrand) {
        vehicleBrandTypeErrorSpan.textContent = "";
        $.ajax({
            type: "GET",
            url: "/Settings/GetVehicleModelBasedOnBrand",
            data: { id: selectBrand },
            success: function (data) {
                if (vehicleModelId == 0) {
                    $.each(data, function (index, vehicleModel) {
                        vehicleModelDropdown.append("<option value='" + vehicleModel.vehicleModelId + "'>" + vehicleModel.vehicleModelName + "</option>");
                    });
                }
                if (vehicleModelId > 0) {
                    $.each(data, function (index, vehicleModel) {
                        if (vehicleModelId == vehicleModel.vehicleModelId) {
                            vehicleModelDropdown.append("<option value='" + vehicleModel.vehicleModelId + "' selected>" + vehicleModel.vehicleModelName + "</option>");
                        }
                        else {
                            vehicleModelDropdown.append("<option value='" + vehicleModel.vehicleModelId + "'>" + vehicleModel.vehicleModelName + "</option>");
                        }
                    });

                }
            },
            error: function (error) {
                alert("Internal Error!!");
            }
        });
    }
    else {
        vehicleBrandTypeErrorSpan.textContent = "Select a Brand";
    }

}

function validateVehicleModel() {
    var selectVehicleModel = $("#selectedVehicleModel").val();
    if (selectVehicleModel) {
        vehicleModelTypeErrorSpan.textContent = '';
    }
    else {
        vehicleModelTypeErrorSpan.textContent = "Select a Model";
    }
}

function validateCapacity(inputElement) {
    var inputValue = inputElement.value;
    var regex = /^\d+$/;
    var vehicleCapacityTypeErrorSpan = document.getElementById('vehicleCapacityTypeError');
    vehicleCapacityTypeErrorSpan.textContent = '';

    if (inputValue > 50) {
        vehicleCapacityTypeErrorSpan.textContent = 'Input must not exceed 50';
        inputElement.value = '';
    }
    if (!regex.test(inputValue)) {
        vehicleCapacityTypeErrorSpan.textContent = 'Please enter only numbers';
        inputElement.value = '';
    }
    

}

function validateModelYear(inputElement) {
    var inputValue = inputElement.value;
    var regex = /^\d+$/;
    var modelYearTypeErrorSpan = inputElement.parentElement.querySelector('#modelYearTypeError');
    modelYearTypeErrorSpan.textContent = '';

    var currentYear = new Date().getFullYear().toString();
    if (!regex.test(inputValue)) {
        modelYearTypeErrorSpan.textContent = 'Enter Year between 1990 and ' + currentYear;
        inputElement.value = '';
    }
    if (inputValue < 1990) {
        modelYearTypeErrorSpan.textContent = 'Enter Year between 1990 and ' + currentYear;
    }
    if (inputValue > new Date().getFullYear() ) {
        modelYearTypeErrorSpan.textContent = 'Enter Year between 1990 and ' + currentYear;
        inputElement.value = '';
    }
    
}

function validateNumberPlate(inputElement) {
    var inputValue = inputElement.value;
    var regex = /^[A-Za-z]{3}-[A-Za-z]{2,3}-\d{2}-\d{4}$/;
;
    var numberPlateTypeErrorSpan = inputElement.parentElement.querySelector('#numberPlateTypeError');
    numberPlateTypeErrorSpan.textContent = '';

    if (!regex.test(inputValue)) {
        numberPlateTypeErrorSpan.textContent = 'Provide Plate Like \'DHA-KA-XX-XXXX\' ';
    }
    inputElement.value=inputElement.value.toUpperCase();
    

}

function validateTotalQuantity(inputElement) {

    var inputValue = inputElement.value;
    var regex = /^\d+$/;
    var totalQuantityTypeErrorSpan = document.getElementById('totalQuantityTypeError');
    totalQuantityTypeErrorSpan.textContent = ''; 
    if (!regex.test(inputValue)) {
        $('#showCarQuantityFields').css('display', 'none');
        totalQuantityTypeErrorSpan.textContent = 'Please enter only numbers';
        inputElement.value = '';
    }
    if (inputValue > 10 || inputValue == 0) {
        $('#showCarQuantityFields').css('display', 'none');
        totalQuantityTypeErrorSpan.textContent = 'Input must not exceed 10';
        inputElement.value = '';
    }
    if (inputValue > 0 && inputValue < 11) {
        $('#showCarQuantityFields').css('display', 'block');
        $("#formContainer").empty();
        generateFormGroups(inputValue);
    }

}

var loadFile = function (event) {
    vehicleImageTypeErrorSpan.textContent = '';
    var output = document.getElementById('output');
    output.style.width = "0px";
    output.style.height = "0px";
    var reader = new FileReader();
   
    reader.onload = function () {
        $("#vehicleImageEdit").css('display', 'none');
        $("#vehicleImage").css('display', 'block');
        var output = document.getElementById('output');
        output.style.width = "200px";
        output.style.height = "200px";
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
};

function generateFormGroups(numFormGroups,listCars=[],editAddButton = false) {
    const formContainer = document.getElementById('formContainer');
    for (let i = 0; i < numFormGroups; i++) {
        const mainDiv = document.createElement('div');
        mainDiv.classList.add('d-flex', 'justify-content-between', 'mb-3', 'bg-white', 'rounded-3', 'p-3');
        const firstFormGroup = document.createElement('div');
        firstFormGroup.classList.add('form-group', 'col-md-4');
        firstFormGroup.style.marginRight = '20px';

        const secondFormGroup = document.createElement('div');
        secondFormGroup.classList.add('form-group', 'col-md-6');

        const modelYearLabel = document.createElement('label');
        modelYearLabel.classList.add('mb-3', 'fw-bold');
        modelYearLabel.textContent = 'Model Year';

        const modelYearInput = document.createElement('input');
        modelYearInput.classList.add('form-control', 'mb-2');
        modelYearInput.setAttribute('type', 'number');
        modelYearInput.setAttribute('id', 'carModelYear');
        modelYearInput.setAttribute('oninput', 'validateModelYear(this)');
        if (listCars && listCars.length > 0) {
            modelYearInput.value = listCars[i].modelYear;
        }
        

        const modelYearError = document.createElement('span');
        modelYearError.classList.add('text-danger', 'fs-6', 'fw-bolder');
        modelYearError.setAttribute('id', 'modelYearTypeError');

        const numberPlateLabel = document.createElement('label');
        numberPlateLabel.classList.add('mb-3', 'fw-bold');
        numberPlateLabel.textContent = 'Number Plate';

        const numberPlateInput = document.createElement('input');
        numberPlateInput.classList.add('form-control', 'mb-2');
        numberPlateInput.setAttribute('id', 'carNumberPlate');
        numberPlateInput.setAttribute('oninput', 'validateNumberPlate(this)');
        if (listCars && listCars.length > 0) {
            numberPlateInput.value = listCars[i].numberPlate;
        }

        const numberPlateError = document.createElement('span');
        numberPlateError.classList.add('text-danger', 'fs-6', 'fw-bolder');
        numberPlateError.setAttribute('id', 'numberPlateTypeError');

        firstFormGroup.appendChild(modelYearLabel);
        firstFormGroup.appendChild(modelYearInput);
        firstFormGroup.appendChild(modelYearError);

        secondFormGroup.appendChild(numberPlateLabel);
        secondFormGroup.appendChild(numberPlateInput);
        secondFormGroup.appendChild(numberPlateError);

        mainDiv.appendChild(firstFormGroup);
        mainDiv.appendChild(secondFormGroup);
        if ((listCars && listCars.length > 0) || editAddButton) {
            const iconElement = document.createElement('i');
            iconElement.classList.add('fa', 'fa-times', 'text-danger', 'btn', 'p-0');
            iconElement.style.height = '10px';
            iconElement.setAttribute('aria-hidden', 'true');
            if (!editAddButton) {
                iconElement.setAttribute('data-car-id', listCars[i].carId);
                iconElement.setAttribute('onclick', `deleteCar(${listCars[i].carId})`);
            }
            else {
                iconElement.setAttribute('data-car-id', 0);
                iconElement.setAttribute('onclick', `deleteCar()`);
            }
            mainDiv.appendChild(iconElement);
        }

        if (editAddButton) {
            formContainer.insertBefore(mainDiv, formContainer.firstChild);
        }
        
        else {
            formContainer.appendChild(mainDiv);
        }

    }

}

function getFormValues() {
    const formGroups = document.querySelectorAll('#formContainer .d-flex');

    const values = [];

    formGroups.forEach(formGroup => {
        const modelYearInput = formGroup.querySelector('#carModelYear');
        const numberPlateInput = formGroup.querySelector('#carNumberPlate');
        const carIDElement = formGroup.querySelector(".fa-times");



        const modelYearValue = modelYearInput.value.trim();
        const numberPlateValue = numberPlateInput.value.trim();
        if (carIDElement) {
            const carId = carIDElement.getAttribute('data-car-id');
            if (modelYearValue && numberPlateValue) {
                values.push({
                    CarId: carId,
                    ModelYear: modelYearValue,
                    NumberPlate: numberPlateValue
                });
            }
        }
        else {
            if (modelYearValue && numberPlateValue) {
                values.push({
                    ModelYear: modelYearValue,
                    NumberPlate: numberPlateValue
                });
            }
        }

        
    });
    return values;
}

function checkModelWithNumberPlateErrors() {

    const formGroups = document.querySelectorAll('#formContainer .form-group');

    formGroups.forEach(formGroup => {
        const modelYearInput = formGroup.querySelector('#carModelYear');
        const numberPlateInput = formGroup.querySelector('#carNumberPlate');
        if (modelYearInput) {
            validateModelYear(modelYearInput);
        }
        if (numberPlateInput) {
            validateNumberPlate(numberPlateInput);
        }                
    });

    const numberPlateErrors = document.querySelectorAll('#formContainer #numberPlateTypeError');
    const modelYearErrors = document.querySelectorAll('#formContainer #modelYearTypeError');

    let hasErrors = false;

    numberPlateErrors.forEach(errorSpan => {
        if (errorSpan.textContent.length > 0) {
            hasErrors = true;
        }
    });

    modelYearErrors.forEach(errorSpan => {
        if (errorSpan.textContent.length>0) {
            hasErrors = true;
        }
    });
    return hasErrors;
}

function deleteCar(carId, listCars) {

    const formContainer = document.getElementById('formContainer');
    formContainer.addEventListener('click', function (event) {
        const clickedElement = event.target;

        if (clickedElement.classList.contains('fa-times')) {
            const divContainingCrossIcon = clickedElement.closest('.d-flex');
            if (divContainingCrossIcon) {
                divContainingCrossIcon.remove();
            }
        }
    });

    var totalquantity = $("#totalQuantity").val();
    totalquantity--;
    $("#totalQuantity").val(totalquantity);
 

}

function DetectErrors() {
   
    var selectCategory = $("#selectedCategory").val();
    var selectBrand = $("#selectedBrand").val();
    var selectVehicleModel = $("#selectedVehicleModel").val();
    var vehicleCapacity = $("#vehicleCapacity").val();
    var totalQuantity = $("#totalQuantity").val();
    var foundError = false;

    if (selectCategory == '') {
        foundError = true;
        categoryTypeErrorSpan.textContent = "Select a Category!!";
    }
    if (selectBrand == '') {
        foundError = true;
        vehicleBrandTypeErrorSpan.textContent = 'Fill Up Vehicle Brand';
    }
    if (selectVehicleModel == '') {
        foundError = true;
        vehicleModelTypeErrorSpan.textContent = 'Fill Up Vehicle Model';
    }
    if (vehicleCapacity == '') {
        foundError = true;
        vehicleCapacityTypeErrorSpan.textContent = 'Fill Up Vehicle Capacity';
    }
    if (totalQuantity == '') {
        foundError = true;
        totalQuantityTypeErrorSpan.textContent = 'Fill Up Vehicle Quantity';
    }
    if (vehicleImage == '') {
        foundError = true;
        vehicleImageTypeErrorSpan.textContent = 'Provide a Vehicle Image';
    }
    if (checkModelWithNumberPlateErrors()) {
        foundError = true;
    }
    return foundError;
}
