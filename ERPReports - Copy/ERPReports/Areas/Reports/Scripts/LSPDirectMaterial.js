"use strict";
(function () {
    $(document).ready(function () {
        $("#StartDate,#EndDate").datepicker({
            autoclose: true,
            todayHighlight: true
        });
        $("#ProductCode1,#ProductCode2,#Model1,#Model2").select2({
            placeholder:"--Please Select--"
        });
    });
})();