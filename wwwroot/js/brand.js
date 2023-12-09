var categoryTypeErrorSpan = document.getElementById('categoryTypeError');
var vehicleBrandTypeErrorSpan = document.getElementById('vehicleBrandTypeError');
$(document).ready(function () {

    $('#toggleLink').removeClass('text-white');

    $('#toggleLink').addClass('bg-white');
    $('#toggleLink').addClass('text-black');
    $('#toggleLink').addClass('rounded-2');

    // Create Modal
    $("#addBrandButton").click(function () {
        $(".modal-title").text("Add Brand");
        $("#addBrand").modal('show');
        $("#confirmInsertButton").css('display', 'initial');
        $("#confirmEditButton").css('display', 'none');
        $("#selectedCategory").val('');
        $("#vehicleBrand").val('');
        categoryTypeErrorSpan.textContent = '';
        vehicleBrandTypeErrorSpan.textContent = '';
    });
    $("#cancelInsertButton").click(function () {
        $("#addBrand").modal('hide');
    });

    $("#confirmInsertButton").click(function () {
        var selectCategory = $("#selectedCategory").val();
        var vehicleBrand = $("#vehicleBrand").val();
        var foundError = false;

        var formData = new FormData();
        formData.append("CategoryId", selectCategory);
        formData.append("BrandName", vehicleBrand);

        if (selectCategory == '') {
            foundError = true;
            categoryTypeErrorSpan.textContent = "Select a Category!!";
        }
        if (vehicleBrand == '') {
            foundError = true;
            vehicleBrandTypeErrorSpan.textContent = 'Fill Up Vehicle Brand';
        }
        if (!foundError) {
            $("#addBrand").modal('hide');
            $.ajax({
                type: "POST",
                url: "/Settings/AddBrand",
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

    //Delete
    $(".delete-brand").click(function () {

        var brandId = $(this).data("brand-id");
        $("#confirmDeleteButton").data("brand-id", brandId);
        $('#deleteConfirmationModal').modal('show');
    });

    $("#cancelDeleteButton").click(function () {
        $('#deleteConfirmationModal').modal('hide');
    });

    $("#confirmDeleteButton").click(function () {
        var brandId = $(this).data("brand-id");
        $('#deleteConfirmationModal').modal('hide');


        $.ajax({
            type: "POST",
            url: "/Settings/DeleteBrand",
            data: { id: brandId },
            success: function (data) {
                location.reload();
            },
            error: function (error) {
                alert(error);
            }
        });
    });

    // Edit Modal
    var tempBrandId;
    $(".edit-brand").click(function () {
        $(".modal-title").text("Edit Brand");
        var brandId = $(this).data("brand-id");
        tempBrandId = brandId;
        $.ajax({
            type: "GET",
            url: "/Settings/GetBrandById",
            data: { id: brandId },
            success: function (data) {
                $("#addBrand").modal('show');
                $("#confirmInsertButton").css('display', 'none');
                $("#confirmEditButton").css('display', 'initial');
                $("#selectedCategory").val(data.categoryId);
                $("#vehicleBrand").val(data.brandName);
            },
            error: function (error) {
                alert(error);
            }
        });

    });

    $("#confirmEditButton").click(function () {
       
        var brandId = tempBrandId;
        var selectCategory = $("#selectedCategory").val();
        var vehicleBrand = $("#vehicleBrand").val();

        var formData = new FormData();
        formData.append("BrandId", brandId);
        formData.append("CategoryId", selectCategory);
        formData.append("BrandName", vehicleBrand);

        if (vehicleBrand == '') {
            vehicleBrandTypeErrorSpan.textContent = 'Fill Up Vehicle Brand';
        }
        else {

            $.ajax({
                type: 'POST',
                url: '/Settings/UpdateBrand',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.success) {
                        $("#addBrand").modal('hide');
                        location.reload();
                    }
                    else {
                        vehicleBrandTypeErrorSpan.textContent = response.message;
                    }
                },
                error: function (error) {
                    alert("Internal Error!!");
                }
            });
        }

    });


});

function validateCategory(inputElement) {

    categoryTypeErrorSpan.textContent = "";
}

function validateBrand(inputElement) {
    var inputValue = inputElement.value;
    var regex = /^[a-zA-Z0-9 ]+$/;
    var vehicleBrandTypeErrorSpan = document.getElementById('vehicleBrandTypeError');
    vehicleBrandTypeErrorSpan.textContent = '';
    if (!regex.test(inputValue)) {
        vehicleBrandTypeErrorSpan.textContent = 'Please enter only letters a-z,0-9 and spaces.';
        inputElement.value = '';
    }

    if (inputValue.length > 50) {
        vehicleBrandTypeErrorSpan.textContent = 'Input must not exceed 50 characters.';
        inputElement.value = '';
    }
}
