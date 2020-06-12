"use strict";
(function () {
    var Page = $D();
    var tblPage = "";
    var editIDPage = "";

    $(document).ready(function () {
        drawDatatables();
        $("#PageName").change(function () {
            validatePageName(this);
        });
        $("#Icon").change(function () {
            $("#lblIcon").attr("class", "");
            $("#lblIcon").addClass("float-right " + $(this).val());
        });
        $('#btnCancelPage').click(function () {
            cancelPageForm();
            CUI.setDatatableMaxHeight();
        });
        $("#btnGeneratePassword").click(function () {
            $("#Password").val(generatePassword());
            Page.parsleyValidate("frmPage");
        });
        $("#frmPage").submit(function (e) {
            e.preventDefault();
            savePage();
        });
        $('#tblPage tbody').on('click', 'tr', function () {
            dis_se_lectPageRow($(this));
        });
        $('#btnEditPage').click(function () {
            editPage();
        });
        $('#btnDeletePage').click(function () {
            Page.msg = "Are you sure you want to delete this Page?";
            Page.confirmAction().then(function (approve) {
                if (approve)
                    deletePage();
            });
        });

        //#Special Events
        tblPage.on('draw.dt', function () {
            CUI.dataTableID = "#tblPage";
            CUI.setDatatableMaxHeight();
        });
        $.listen('parsley:field:error', function (fieldInstance) {//Parsley Validation Error Event Listener
            setTimeout(function () { CUI.setDatatableMaxHeight(); }, 500);
        });
        //#Functions Here-------------------------------------------------------------------------------------------------------------------
        function drawDatatables() {
            if (!$.fn.DataTable.isDataTable('#tblPage')) {
                tblPage = $('#tblPage').DataTable({
                    processing: true,
                    serverSide: true,
                    "order": [[0, "asc"]],
                    "pageLength": 25,
                    "ajax": {
                        "url": "/MasterMaintenance/PageMaster/GetPageList",
                        "type": "POST",
                        "datatype": "json",
                    },

                    dataSrc: "data",
                    columns: [
                        { title: "ID", data: "ID" },
                        { title: "Group Label", data: "GroupLabel" },
                        { title: "Page Name", data: "PageName" },
                        { title: "Page Label", data: "PageLabel" },
                        { title: "URL", data: "URL" },
                        { title: "Has Sub", data: "HasSub" },
                        { title: "Parent Menu", data: "ParentMenu" },
                        { title: "ParentOrder", data: "ParentOrder" },
                        { title: "Order", data: "Order" },
                        { title: "Icon", data: "Icon" }
                    ],
                    "createdRow": function (row, data, dataIndex) {
                        $(row).attr('data-id', data.ID);
                        $(row).attr('data-PageName', data.PageName);
                    }
                })
            }
        }
        function validatePageName(self) {
            var pagename = $(self).val().trim();
            if (pagename) {
                Page.formAction = '/MasterMaintenance/PageMaster/ValidatePageName';
                Page.jsonData = { PageName: pagename }
                Page.sendData().then(function () {
                    var validPageName = Page.responseData.isValid;
                    if (!validPageName) {
                        Page.showError("PageName already exists. Please try another PageName");
                        $(self).val("");
                        $(self).focus();
                    } else {
                        $("#Email").focus();
                    }
                });
            }
        }
        function savePage() {
            Page.formData = $('#frmPage').serializeArray();
            Page.formAction = '/MasterMaintenance/PageMaster/SavePage';
            Page.setJsonData().sendData().then(function () {
                tblPage.ajax.reload(null, false);
                cancelPageTbl();
                cancelPageForm();
                CUI.closeCreatePanel();
            });
        }
        function cancelPageForm() {
            Page.clearFromData("frmPage");
            $('#PageName').prop('readonly', false);
            $("#btnSavePage .btnLabel").text(" Save");
            $("#lblIcon").text("");

        }
        function cancelPageTbl() {
            $('#btnEditPage').attr("disabled", "disabled");
            $('#btnDeletePage').attr("disabled", "disabled");
        }
        function dis_se_lectPageRow(PageRow) {
            if (PageRow.data("pagename")) {
                if (PageRow.hasClass('selected')) {
                    PageRow.removeClass('selected');
                    editIDPage = "";
                    $('#btnEditPage').attr("disabled", "disabled");
                    $('#btnDeletePage').attr("disabled", "disabled");
                }
                else {
                    tblPage.$('tr.selected').removeClass('selected');
                    PageRow.addClass('selected');
                    editIDPage = PageRow.data("pagename");
                    $('#btnEditPage').removeAttr("disabled");
                    $('#btnDeletePage').removeAttr("disabled");
                }
            }
        }
        function editPage() {
            Page.formAction = '/MasterMaintenance/PageMaster/GetPageDetails';
            if (Page.formAction) {
                Page.jsonData = { PageName: editIDPage };
                Page.sendData().then(function () {
                    populatePageData(Page.responseData.userData);
                    $('html, body').animate({
                        scrollTop: $(".btnCreateData").offset().top
                    }, 1000);
                });
            } else {
                Page.showError("Please try again.");
            }
        }
        function populatePageData(user) {
            $('#PageName').prop('readonly', true);
            $("#frmPage").parsley().reset();
            $("#btnSavePage .btnLabel").text(" Update");
            CUI.openCreatePanel();
            Page.populateToFormInputs(user, "#frmPage");
        }
        function deletePage() {
            Page.formAction = '/MasterMaintenance/PageMaster/DeletePage';
            Page.jsonData = { PageName: editIDPage };
            Page.sendData().then(function () {
                tblPage.ajax.reload(null, false);
                cancelPageTbl();
                cancelPageForm();
            });
        }
    });
})();
