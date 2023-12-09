$(document).ready(function () {
    $("#allrides").removeClass('text-white');
    $("#myrides").removeClass('text-white');
    $("#allrides").addClass('bg-white');
    $("#allrides").addClass('text-black');
    $("#myrides").addClass('bg-white');
    $("#myrides").addClass('text-black');
    $("#myrides").addClass('rounded-2');
    $("#allrides").addClass('rounded-2');

    //Delete Modal
    $(".delete-booking").click(function () {

        var bookingId = $(this).data("booking-id");
        $("#confirmDeleteButton").data("booking-id", bookingId);
        $('#deleteConfirmationModal').modal('show');
    });
    $("#cancelDeleteButton").click(function () {
        $('#deleteConfirmationModal').modal('hide');
    });

    $("#confirmDeleteButton").click(function () {
        var bookingId = $(this).data("booking-id");
        $('#deleteConfirmationModal').modal('hide');


        $.ajax({
            type: "POST",
            url: "/Rides/DeleteBooking",
            data: { id: bookingId },
            success: function (data) {
                location.reload();
            },
            error: function (error) {
                alert(error);
            }
        });
    });

    $(".terminate-booking").click(function () {

        var bookingId = $(this).data("booking-id");
        $("#confirmReturnButton").data("booking-id", bookingId);
        $('#returnConfirmationModal').modal('show');
    });

    $("#cancelReturnButton").click(function () {
        $('#returnConfirmationModal').modal('hide');
        
    });
    $("#confirmReturnButton").click(function () {
        var bookingId = $(this).data("booking-id");
        $('#returnConfirmationModal').modal('hide');


        $.ajax({
            type: "POST",
            url: "/Rides/ReturnBooking",
            data: { id: bookingId },
            success: function (data) {
                location.reload();
            },
            error: function (error) {
                alert(error);
            }
        });
    });

    

});

$(document).on("click", "#bookedVehicle", function () {

    var bookingId = $(this).data("booking-id");
    $.ajax({
        type: "GET",
        url: "Rides/GetBookedCars",
        data: { id: bookingId },
        success: function (data) {
            $("#detailsModal").html(data);
            $("#bookedCarModal").modal("show");

        },
        error: function (error) {
            alert("Internal Error!!");
        }

    });



});