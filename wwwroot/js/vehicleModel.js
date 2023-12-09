var categoryTypeErrorSpan = document.getElementById('categoryTypeError');
var vehicleBrandTypeErrorSpan = document.getElementById('vehicleBrandTypeError');
var vehicleModelTypeErrorSpan = document.getElementById('vehicleModelTypeError');

$(document).ready(function () {
    $('#toggleLink').removeClass('text-white');
    $('#toggleLink').addClass('bg-white');
    $('#toggleLink').addClass('text-black');
    $('#toggleLink').addClass('rounded-2');

    // Create Modal
    $("#addVehicleModelButton").click(function () {
        $(".modal-title").text("Add Model");
        $("#addVehicleModel").modal('show');
        $("#confirmInsertButton").css('display', 'initial');
        $("#confirmEditButton").css('display', 'none');
        $("#selectedCategory").val('');
        $("#selectedBrand").val('');
        categoryTypeErrorSpan.textContent = '';
        vehicleBrandTypeErrorSpan.textContent = '';
        vehicleModelTypeErrorSpan.textContent = '';
    });
    $("#cancelInsertButton").click(function () {
        $("#addVehicleModel").modal('hide');
    });

    $("#confirmInsertButton").click(function () {
        var selectCategory = $("#selectedCategory").val();
        var selectBrand = $("#selectedBrand").val();
        var vehicleModel = $("#vehicleModel").val();
        var foundError = false;

        if (selectCategory == '') {
            foundError = true;
            categoryTypeErrorSpan.textContent = "Select a Category!!";
        }
        if (selectBrand == '') {
            foundError = true;
            vehicleBrandTypeErrorSpan.textContent = 'Fill Up Vehicle Brand';
        }
        if (vehicleModel == '' || vehicleModelTypeErrorSpan.textContent.length>0) {
            foundError = true;
            vehicleModelTypeErrorSpan.textContent = 'Enter a Vehicle Model';
        }
        if (!foundError) {
            $("#addVehicleModel").modal('hide');
            $.ajax({
                type: "POST",
                url: "/Settings/AddVehicleModel",
                data: { BrandId: selectBrand, VehicleModelName: vehicleModel },
                success: function (response) {
                    location.reload();
                },
                error: function (error) {
                    alert("Internal Error!!");
                }
            });
        }
    });


    //Delete 

    $(".delete-vehicleModel").click(function () {

        var vehicleModelId = $(this).data("vehiclemodel-id");
        $("#confirmDeleteButton").data("vehiclemodel-id", vehicleModelId);
        $('#deleteConfirmationModal').modal('show');
    });

    $("#cancelDeleteButton").click(function () {
        $('#deleteConfirmationModal').modal('hide');
    });

    $("#confirmDeleteButton").click(function () {
        var vehicleModelId = $(this).data("vehiclemodel-id");
        $('#deleteConfirmationModal').modal('hide');


        $.ajax({
            type: "POST",
            url: "/Settings/DeleteVehicleModel",
            data: { id: vehicleModelId },
            success: function (data) {
                location.reload();
            },
            error: function (error) {
                alert(error);
            }
        });
    });

    //Edit

    var tempvehicleModelId;
    $(".edit-vehicleModel").click(function () {
        $(".modal-title").text("Edit Model");
        var vehicleModelId = $(this).data("vehiclemodel-id");
        tempvehicleModelId = vehicleModelId;
        $.ajax({
            type: "GET",
            url: "/Settings/GetVehicleModelById",
            data: { id: vehicleModelId },
            success: function (data) {
                $("#addVehicleModel").modal('show');
                $("#confirmInsertButton").css('display', 'none');
                $("#confirmEditButton").css('display', 'initial');
                $("#selectedCategory").val(data.vehicleModelObject.categoryId);
                $("#vehicleModel").val(data.vehicleModelObject.vehicleModelName);
                var brandDropdown = $("#selectedBrand");
                brandDropdown.empty();
                brandDropdown.append("<option value=''>--Please Select Car Brand--</option>");
                $.each(data.brands, function (index, brand) {
                    if (brand.brandId === data.vehicleModelObject.brandId) {
                        brandDropdown.append("<option value='" + brand.brandId + "' selected>" + brand.brandName + "</option>");
                    }
                    else {
                        brandDropdown.append("<option value='" + brand.brandId + "'>" + brand.brandName + "</option>");
                    }
                });
            },
            error: function (error) {
                alert(error);
            }
        });

    });

    $("#confirmEditButton").click(function () {

        var selectCategory = $("#selectedCategory").val();
        var selectBrand = $("#selectedBrand").val();
        var vehicleModel = $("#vehicleModel").val();
        var foundError = false;

        var formData = new FormData();
        formData.append("VehicleModelId", tempvehicleModelId);
        formData.append("CategoryId", selectCategory);
        formData.append("BrandId", selectBrand);
        formData.append("VehicleModelName", vehicleModel);

        if (selectCategory == '') {
            foundError = true;
            categoryTypeErrorSpan.textContent = "Select a Category!!";
        }
        if (selectBrand == '') {
            foundError = true;
            vehicleBrandTypeErrorSpan.textContent = 'Fill Up Vehicle Brand';
        }
        if (vehicleModel == '' || vehicleModelTypeErrorSpan.textContent.length > 0) {
            foundError = true;
            vehicleModelTypeErrorSpan.textContent = 'Enter a Vehicle Model';
        }
        if (!foundError) {
            
            $.ajax({
                type: "POST",
                url: "/Settings/UpdateVehicleModel",
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.success) {
                        $("#addVehicleModel").modal('hide');;
                        location.reload();
                    }
                    else {
                        vehicleModelTypeErrorSpan.textContent = response.message;
                    }
                },
                error: function (error) {
                    alert("Internal Error!!");
                }
            });
        }

    });


});


function GetBrand() {
    var selectCategory = $("#selectedCategory").val();
    if (selectCategory) {
        categoryTypeErrorSpan.textContent = "";
        $.ajax({
            type: "GET",
            url: "/Settings/GetBrandBasedOnCategory",
            data: { id: selectCategory },
            success: function (data) {
                var brandDropdown = $("#selectedBrand");
                brandDropdown.empty();
                brandDropdown.append("<option value=''>--Please Select Car Brand--</option>");
                $.each(data, function (index, brand) {
                    brandDropdown.append("<option value='" + brand.brandId + "'>" + brand.brandName + "</option>");
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

function validateBrand(inputElement) {
    vehicleBrandTypeErrorSpan.textContent = '';
    vehicleModelTypeErrorSpan.textContent = '';
}

function validateVehicleModel(inputElement) {
    var inputValue = inputElement.value;
    var regex = /^[a-zA-Z0-9 ]+$/;
    var vehicleModelTypeErrorSpan = document.getElementById('vehicleModelTypeError');
    vehicleModelTypeErrorSpan.textContent = '';
    if (!regex.test(inputValue)) {
        vehicleModelTypeErrorSpan.textContent = 'Please enter only letters a-z,0-9 and spaces.';
        inputElement.value = '';
    }

    if (inputValue.length > 50) {
        vehicleModelTypeErrorSpan.textContent = 'Input must not exceed 50 characters.';
        inputElement.value = '';
    }
}