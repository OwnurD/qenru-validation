function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

jQuery(document).ready(function () {
    $('.phone').mask('(999) 999-9999');
});

$('#btnContact').click(function () {
    var err = false;
    var errMessage = "";
    $('.input-qenru').each(function () {
        var ths = $(this);
        if (ths.val() == "" || ths.val() == null || ths.val() === undefined) {
            err = true;
            errMessage = "Lütfen boş alan bırakmayın!.\n";
            $(this).css('border-bottom', '1px solid red');
        }
        else
        {
            $(this).css('border-bottom', '1px solid #919191');
        }
    });
    var email = $('.email').val();
    if (email != null && email != "" && email != undefined)
    {
        if (validateEmail(email) == false) {
            err = true;
            errMessage += "Lütfen geçerli bir email adresi giriniz!.";
            $('.email').css('border-bottom', '1px solid red');
        }
        else
        {
            $('.email').css('border-bottom', '1px solid #919191');
        }
    }



    if (err == false) {
        var form = $('#formContact').serialize();
        $.ajax({
            url: "/Contact/ContactForm",
            type: "POST",
            data: form,
            success: function (response) {
                if (response.success) {
                    swal({
                        title: response.data,
                        type: 'success',
                        html: response.script
                    });
                    //swal(response.data, response.script, "success");
                    $('.confirm').click(function () {
                        location.reload();
                    });
                }
                else {
                    sweetAlert(response.data, "", "error");
                }
            },
            error: function (xhr) {

            }
        });
    }
    else
        sweetAlert(errMessage, "", "error");
});
