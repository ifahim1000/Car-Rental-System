var startdateTypeErrorSpan = document.getElementById('startdateTypeError');
var vehicleQuantityTypeErrorSpan = document.getElementById('vehicleQuantityTypeError');
var bookedCarNumberErrorSpan = document.getElementById('bookedCarNumberError');
var tempVehicleId;
var selectedCars = [];
$(document).ready(function () {

    // Create Booking

    $("#home").removeClass('text-white');
    $("#home").addClass('bg-white');
    $("#home").addClass('text-black');
    $("#home").addClass('rounded-2');
    $(".book-car").click(function () {
        //openAvailableCarModal();
        selectedCars = [];
        getVehicleInformation(this);
       
       


        $.ajax({
            type: "GET",
            url: "/Home/GetVehicleAvailabilityById",
            data: { VehicleId: vehicleId, VehicleModelName: vehicleModelName, VehicleCapacity: vehicleCapacity, StartDate: todayDate, EndDate: todayDate },
            success: function (data) {
                if (data.message) {
                    openLogInModal();
                }
                else {                    
                    $("#bookingFormContainer").html(data);
                    $("#bookVehicle").modal('show');
                  
                }
                
            },
            error: function (error) {
                alert(error);
            }
        });
    });

});

$(document).on("click", "#cancelInsertButton", function () {
    selectedCars = [];
    $("#bookVehicle").modal('hide');
});

$(document).on("click", "#confirmInsertButton", function () {

    var vehicleId = tempVehicleId;
    var startDate = $("#startdate").val();
    var endDate = $("#enddate").val();

    var foundError = false;
    if (startDate > endDate || startDate < getTodaysDate().substring(0, 10)) {
        foundError = true;
        startdateTypeErrorSpan.textContent = "Select Valid Date Range!!";
    }
    if (selectedCars.length==0) {
        foundError = true;
        $('#bookedCarNumberError').text("Select Cars To Book");
    }
    if (!foundError) {

        var formData = new FormData();
        formData.append("VehicleId", vehicleId);
        formData.append("StartDate", startDate);
        formData.append("EndDate", endDate);
        const carsJson = JSON.stringify(selectedCars);
        formData.append("Cars", carsJson);

        $("#bookVehicle").modal('hide');

        $.ajax({
            type: "POST",
            url: "/Home/AddBooking",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    alert(response.message);
                    location.reload();
                }
                else {
                    alert(response.message);
                }

            },
            error: function (error) {
                alert("Internal Error!!");
            }
        });

    }


});

$(document).on("click", '.toggle-color', function () {
    var carId = this.getAttribute('data-car-id');
    $(this).toggleClass('btn-primary btn-warning');
    let pos = 0;
    for (var i = 0; i < selectedCars.length; i++) {
        if (selectedCars[i] == carId) {
            pos = 1;
        }
    }
    if (pos == 1) {
        const position = selectedCars.indexOf(carId);
        selectedCars.splice(position, 1);
        
    }
    else {
        selectedCars.push(carId);
    }
    if (selectedCars.length > 0) {
        $('#bookedCarNumberError').text('');
    }
    
});



function getTodaysDate() {
    var today = new Date();
    var year = today.getFullYear();
    var month = (today.getMonth() + 1).toString().padStart(2, '0');
    var day = today.getDate().toString().padStart(2, '0');
    var hours = today.getHours().toString().padStart(2, '0');
    var minutes = today.getMinutes().toString().padStart(2, '0');
    var seconds = today.getSeconds().toString().padStart(2, '0');
    var date = year + '-' + month + '-' + day;
    var time = hours + ':' + minutes + ':' + seconds;

    return date + ' ' + time;
}

function validateDate() {
    var startdateTypeErrorSpan = document.getElementById('startdateTypeError');
    startdateTypeErrorSpan.textContent = "";
    var startDate = $("#startdate").val();
    var endDate = $("#enddate").val();
    selectedCars = [];


    var differenceMs = new Date(endDate) - new Date(startDate);

    // Convert milliseconds to days
    var differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    if (startDate > endDate || startDate < getTodaysDate().substring(0, 10) ) {
        startdateTypeErrorSpan.textContent = "Select Valid Date Range!!";
        $("#totalQuantity").val("");
        $("#allAvailableCar").empty();
    }
    else if (differenceDays >= 7)
    {
        startdateTypeErrorSpan.textContent = "Can Not Rent For More Than 7 days! ";
        $("#totalQuantity").val("");
        $("#allAvailableCar").empty();
    }
    else {
        $.ajax({
            type: "GET",
            url: "/Home/GetVehicleAvailabilityById",
            data: { VehicleId: tempVehicleId, VehicleModelName: $("#vehicleModel").val(), VehicleCapacity: $("#vehicleCapacity").val(), StartDate: $("#startdate").val(), EndDate: $("#enddate").val() },

            success: function (data) {

                $("#bookingFormContainer").html(data);
                $("#startdate").val(startDate);
                $("#enddate").val(endDate);

            },
            error: function (error) {
                alert(error);
            }
        });
    }
}

function getVehicleInformation(element) {
    $("#confirmInsertButton").css('display', 'initial');
    $("#vehicleQuantity").val('');
    var vehicleId = $(element).data("vehicle-id");
    tempVehicleId = vehicleId;
    var card = $(element).closest('.card');
    var vehicleModelName = card.find('.card-title').text();
    var cardText = card.find('.card-text').html();
    var vehicleCapacity = cardText.match(/<i.*?><\/i>\s+(\d+)\s+People/);
    if (vehicleCapacity !== null && vehicleCapacity.length > 1) {
        vehicleCapacity = vehicleCapacity[1];
    } else {
        vehicleCapacity = "";
    }
    var todayDate = getTodaysDate();

}


