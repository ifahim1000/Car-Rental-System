var categoryTypeErrorSpan = document.getElementById('categoryTypeError');
$(document).ready(function () {

    $('#toggleLink').removeClass('text-white');
    $('#toggleLink').addClass('bg-white');
    $('#toggleLink').addClass('text-black');
    $('#toggleLink').addClass('rounded-2');
    // Create Modal
    $("#addCategoryButton").click(function () {
        $("#addCategory").modal('show');
        $("#confirmInsertButton").css('display', 'initial');
        $("#confirmEditButton").css('display', 'none');
        $("#categoryType").val("");
        
        categoryTypeErrorSpan.textContent = '';

    });
    $("#cancelInsertButton").click(function () {
        $("#addCategory").modal('hide');
    });

    $("#confirmInsertButton").click(function () {

        var categoryType = $("#categoryType").val();
        var formData = {
            CategoryType: categoryType
        };
        var categoryTypeErrorSpan = document.getElementById('categoryTypeError');
        if (categoryType == '') {
            categoryTypeErrorSpan.textContent = "Please Enter a Category Type";
        }
        else {
            $("#addCategory").modal('hide');

            $.ajax({
                type: "POST",
                url: "/Settings/AddCategory",
                data: JSON.stringify(formData),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
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
    $(".delete-category").click(function () {

        var categoryId = $(this).data("category-id");
        $("#confirmDeleteButton").data("category-id", categoryId);
        $('#deleteConfirmationModal').modal('show');
    });

    $("#cancelDeleteButton").click(function () {
        $('#deleteConfirmationModal').modal('hide');
    });

    $("#confirmDeleteButton").click(function () {
        var categoryId = $(this).data("category-id");
        $('#deleteConfirmationModal').modal('hide');


        $.ajax({
            type: "POST",
            url: "/Settings/DeleteCategory",
            data: { id: categoryId },
            success: function (data) {
                location.reload();
            },
            error: function (error) {
                alert(error);
            }
        });
        
    });

    // Edit Modal

    $(".edit-category").click(function () {
        $(".modal-title").text("Edit category");
        var categoryTypeErrorSpan = document.getElementById('categoryTypeError');
        categoryTypeErrorSpan.textContent = '';
        var categoryId = $(this).data("category-id");
        $("#confirmEditButton").data("category-id", categoryId);
        $.ajax({
            type: "GET",
            url: "/Settings/GetCategoryById",
            data: { id: categoryId },
            success: function (data) {
                $("#addCategory").modal('show');
                $("#confirmInsertButton").css('display', 'none');
                $("#confirmEditButton").css('display', 'initial');
                $("#categoryType").val(data.categoryType);
            },
            error: function (error) {
                alert(error);
            }
        });
        
    });

    $("#confirmEditButton").click(function (e) {
        
        var categoryId = $(this).data("category-id");
        var categoryType = $("#categoryType").val();
        var formData = {
            CategoryId: categoryId,
            CategoryType: categoryType
        };

        var categoryTypeErrorSpan = document.getElementById('categoryTypeError');
        if (categoryType == '') {
            categoryTypeErrorSpan.textContent = "Please Enter a Category Type";
            e.preventDefault();
        }
        else {
            $("#addCategory").modal('hide');
            $.ajax({
                type: 'POST',
                url: '/Settings/UpdateCategory',
                data: JSON.stringify(formData),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    location.reload();
                },
                error: function (error) {
                    alert(error);
                }
            });
           
        }
        

    });


});

function validateCategory(inputElement) {
    var inputValue = inputElement.value;
    var regex = /^[a-zA-Z ]+$/;
    var categoryTypeErrorSpan = document.getElementById('categoryTypeError');
    categoryTypeErrorSpan.textContent = '';
    if (!regex.test(inputValue)) {
        categoryTypeErrorSpan.textContent = 'Please enter only letters a-z and spaces.';
        inputElement.value = '';
    }

    if (inputValue.length > 50) {
        categoryTypeErrorSpan.textContent = 'Input must not exceed 50 characters.';
        inputElement.value = '';
    }
}