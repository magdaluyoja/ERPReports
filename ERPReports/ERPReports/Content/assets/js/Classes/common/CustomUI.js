; (function () {
    const CustomUI = function () {
        return new CustomUI.init();
    }
    CustomUI.init = function () {
        this.dataTableID = "";
        this.notifTable = "";
    }
    CustomUI.prototype = {
        setDatatableMaxHeight: function () {


            if (this.dataTableID) {
                var closestDiv = $(this.dataTableID).closest(".col-sm-12");
                if (closestDiv.length) {
                    var eTop = $(closestDiv).offset().top;
                    var windowHeight = $(window).height();
                    var containerID = this.dataTableID + "-container";
                    var adjust = $(this.dataTableID).data("adjust") || 0;
                    var pagingHeight = $(this.dataTableID + "_wrapper .pagination").height();
                    var divHeight = windowHeight - eTop - 70 - pagingHeight - adjust;
                    var containerHeight = divHeight;

                    $(closestDiv).attr("id", containerID.replace('#', ''));
                    $(closestDiv).css("max-height", containerHeight + "px");
                    $(closestDiv).addClass("fixed-tblcontainer");
                    //$(containerID).attr("data-scrollbar", "true");
                    //$(containerID).attr("data-height", "100%");
                    var x = screen.width;
                    if (x < 768)
                        $(closestDiv).css("max-height", "250px");
                    else {
                        //$(closestDiv).slimScroll({
                        //    height: containerHeight + 'px',
                        //    alwaysVisible: true,
                        //    size: '5px'
                        //});
                    }

                } else if ($("#tblPriceEstimation_filter").length) {
                    var eTop = $("#tblPriceEstimation_filter").offset().top;
                    var windowHeight = $(window).height();
                    var containerID = this.dataTableID + "-container";
                    var adjust = $(this.dataTableID).data("adjust") || 0;
                    var pagingHeight = $(this.dataTableID + "_wrapper .pagination").height();
                    var divHeight = windowHeight - eTop - 70 - pagingHeight - adjust;
                    var containerHeight = divHeight;
                    if (!$(".tbl-container-here").length) $(this.dataTableID).wrap("<div class='tbl-container-here'></div>");
                    $(".tbl-container-here").attr("id", containerID.replace('#', ''));
                    $(".tbl-container-here").css("max-height", containerHeight + "px");
                    $(".tbl-container-here").addClass("fixed-tblcontainer");
                }
            }
        },
        setDivMaxHeight: function (ID) {
            if (ID) {
                if (ID.length) {
                    var eTop = $(ID).offset().top;
                    var windowHeight = $(window).height();
                    var adjust = $(ID).data("adjust") || 0;
                    var divHeight = windowHeight - eTop - 70 - adjust;
                    var containerHeight = divHeight;
                    $(ID).css("max-height", containerHeight + "px");
                    $(ID).css("overflow-y", "auto");
                    //$(ID).addClass("fixed-tblcontainer");
                }
            }
        },
        createSelectOption: function (selectOptionsList) {
            var options = "<option value=''>--Please Select--</option>";
            if (selectOptionsList.length) {
                $.each(selectOptionsList, function (i, x) {
                    options += '<option value="' + x.value + '">' + x.text + '</option>';
                });
            }
            return options;
        },
        createSelect2: function (arrID, arrList) {
            var self = this;
            $.each(arrID, function (i, val) {
                if (arrList[i].length > 0) {
                    $(val).html(self.createSelectOption(arrList[i]));
                }
                $(val).select2({
                    placeholder: '--Please Select--',
                    allowClear: true
                });
            })
        },
        clearCustomError: function (id) {
            $("#" + id).removeClass("input-error");
            $("#err-" + id).text("");
            $("#err-" + id).removeClass("text-danger")
        },
        openCreatePanel: function () {
            var bodyID = $(".btnCreateData").data("panelbodyid");
            $(bodyID).show();
            $(bodyID).removeClass("tago");
            $(".btnCreateData")[0].children[0].className = "fa fa-minus";
            $(".btnCreateData").prop("title", "Collapse");
            CUI.setDatatableMaxHeight();
        },
        closeCreatePanel: function () {
            var bodyID = $(".btnCreateData").data("panelbodyid");
            $(bodyID).hide();
            $(bodyID).addClass("tago");
            $(".btnCreateData")[0].children[0].className = "fa fa-plus";
            $(".btnCreateData").prop("title", "Create");
            CUI.setDatatableMaxHeight();
        },
    }
    CustomUI.init.prototype = CustomUI.prototype;
    return window.CustomUI = window.$UI = CustomUI;
}());

const CUI = $UI();
$(document).ready(function () {
    $(window).resize(function () {
        CUI.setDatatableMaxHeight();
    });
    $('.tabs-with-datatable .nav-tabs a').on('shown.bs.tab', function (event) {
        CUI.dataTableID = "#tbl" + $(this).attr("href").replace("#", "");
        if ($.fn.DataTable.isDataTable(CUI.dataTableID)) {
            CUI.setDatatableMaxHeight();
        }
    });
    if ($("#iziModalError").length) {
        $(document).on('closing', '#iziModalError', function (e) {
            window.location.href = "/login";
        });
    }
    $('#loading_modal').on('hidden.bs.modal', function () {
        if ($('.modal:visible').length) {
            $('body').addClass('modal-open');
        }
    });
});
