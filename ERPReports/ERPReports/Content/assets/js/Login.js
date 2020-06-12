'use strict';
(function () {
    var Login = $D();
    $(document).ready(function () {
        $("#Username").focus();
        $("#frmLogin").submit(function (e) {
            e.preventDefault();
            LoginMeIn();
        });

        //All Function --------------------------------------------------------------------------------
        function LoginMeIn() {
            Login.formData = $('#frmLogin').serializeArray();
            Login.setJsonData();
            Login.formAction = '/Login/LoginEntry';
            Login.sendData().then(function () {
                var login = Login.responseData;
                if (login.error) {
                    Login.showError(login.errmsg);
                    $("#Username").addClass("input-error");
                    $("#Password").addClass("input-error");
                    $("#Username").addClass("parsley-success");
                    $("#Password").addClass("parsley-success");
                    $("#Password").val("");
                } else {
                    $("#Username").removeClass("input-error");
                    $("#Password").removeClass("input-error");
                    $("#frmLogin > div.login-buttons > button").attr("disabled", true);
                    window.location = "/";
                }
            });
        }
    });
})();