var selectedErrorArr = new Array();

function errors(id,label,min,max)
{
	var errorArray = new Array();
	errorArray[0] = "Please fill the required fields!";
	errorArray[1] = "Please fill the valid e-mail address!.";
	errorArray[2] = "Please fill the valid phone number!.";
	errorArray[3] = "Fields are not matching!.";
	errorArray[4] = sprintf('%s should have minimum %s character length!.',label,min);
	errorArray[5] = sprintf('%s should have maximum %s character length!.',label,max);
	return errorArray[id];
}
function doValidate(form,url)
{
    selectedErrorArr = [];
    var err = false;
    var temp_err = false;
    
    var errMessage = "";
    var type,attrType,dataType,is_required;

    $('#'+form + ' .input-group').each(function () {

        //Variable oluşturma - creating variables
        var el = $(this);

        type = el.attr('type');
        attrType = el.attr('data-type');
        is_required = el.attr('data-required');
        is_require_match = el.attr('data-match');
        min_length = el.attr('data-min');
		max_length = el.attr('data-max');
		label = el.attr('data-label');
        dataType = null;


        //Type attribute yok ise data-type sorgulama - if type attribute not exist, checking for data-type
		if (typeof attrType !== typeof undefined && attrType !== false) {
                dataType = attrType;
        }
		else
		{
			if (typeof type !== typeof undefined && type !== false) {
				dataType = type;
			}
        }
		
		
        


        //Gerekli alan konrolü - checking required fields
       if(is_required == "true") {
           switch (dataType) {
               case "text":
                   err = emptyValidation(el) == true ? true : err;
                   temp_err = emptyValidation(el);
                   if(temp_err) pushErrorMessage(0,el);
                   else el.removeClass('input-error');
                   break;
              case "password":
                   err = emptyValidation(el) == true ? true : err;
                   temp_err = emptyValidation(el);
                   if(temp_err) pushErrorMessage(0,el);
                   else el.removeClass('input-error');
                   break;
               case "select":
                   err = emptyValidation(el) == true ? true : err;
                   temp_err = emptyValidation(el);
                   if(temp_err) pushErrorMessage(0,el);
                   else el.removeClass('input-error');
                   break;
               case "email":
                   err = emailValidation(el) == true ? true : err;
                   temp_err = emailValidation(el);
                   if(temp_err) pushErrorMessage(1,el);
                   else el.removeClass('input-error');
                   break;
               case "tel":
                   err = phoneValidation(el) == true ? true : err;
                   temp_err = phoneValidation(el);
                   if(temp_err) pushErrorMessage(2,el);
                   else el.removeClass('input-error');
                   break;
               case "file":
                   err = emptyValidation(el) == true ? true : err;
                   temp_err = emptyValidation(el);
                   if(temp_err) pushErrorMessage(0,el);
                   else el.removeClass('input-error');
                   break;
               case "radio":
               case "checkbox":
                   err = radiocheckboxValidation(el) == true ? true : err;
                   temp_err = radiocheckboxValidation(el);
                   if(temp_err) pushErrorMessage(0,el);
                   else el.removeClass('input-error');
                   break;
               default:
                   sweetAlert("Bir hata meydana geldi!.", "", "error");
                   return false;
                   break;

           }
       }

       //Şifre veya değer eşleştirme - Making match passwords and values
        if(is_require_match == "true")
          err = checkMatch(el,form);
        
		if(typeof min_length !== typeof undefined && min_length !== false){
			checkLength(el,min_length,max_length,label);
		}
		
		if(typeof max_length !== typeof undefined && max_length !== false){
			checkLength(el,min_length,max_length,label);
		}
		
		
    });

    
    

    if (err == false) {
        var form = $('#' + form).serialize();
        dataPost(form,url);
    }
    else
    {
        for(var i = 0;i < this.selectedErrorArr.length; i++)
        {
            errMessage += selectedErrorArr[i] + "\n";
        }
        sweetAlert(errMessage, "", "error");
    }


}

function dataPost(form,url)
{
	$.ajax({
            url: url,
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


function emptyValidation(el)
{
    var elValue = el.val();
    elValue = elValue != null ? elValue.trim() : elValue;
    if(elValue == "" || elValue == null || elValue === undefined)
    {
        el.addClass('input-error');
        return true;
    }
    else {
        el.removeClass('input-error');
        return false;
    }
}

function emailValidation(el)
{
    var elValue = el.val();
    if (validateEmail(elValue) === false) {

        el.addClass('input-error');
        return true;
    }
    else {
        el.removeClass('input-error');
        return false;
    }
}

function phoneValidation(el)
{
    var elValue = el.val();
    if (validatePhone(elValue) === false) {

        el.addClass('input-error');
        return true;
    }
    else {
        el.removeClass('input-error');
        return false;
    }
}

function radiocheckboxValidation(el)
{
    if($('input[name='+el.attr('name')+']:checked').length<=0)
    {
        el.addClass('input-error');
        return true;
    }
    else{
        el.removeClass('input-error');
        return false;
    }
}


function phoneMask(formArray)
{
	for(var i = 0;i < formArray.length;i++) {
        $("#" + formArray[i]).find($('*[data-type="tel"]')).each(function(){
            $(this).mask('(999) 999-9999');
        });
    }
}

function pushErrorMessage(id,el,label,min,max)
{
	var errorMessage = "";
	errorMessage = errors(id,label,min,max);
	if(jQuery.inArray(errorMessage, this.selectedErrorArr) !== -1)
	{
		el.addClass('input-error');
		return;
	}
	else
	{
		el.addClass('input-error');
		selectedErrorArr.push(errorMessage);
	}
	
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function validatePhone(phone) {
    var re = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
    return re.test(phone);
}

function checkLength(el,min,max,label)
{
	var err = false;
	var value = el.val();
	var length = value.length;
	err = emptyValidation(el);
	if(!err)
	{
		if(typeof min !== typeof undefined && typeof max == typeof undefined)
		{
			if(length < min)
			{
				err = true;
				pushErrorMessage(4,el,label,min,max);
			}
			else
				el.removeClass('input-error');
		}
		else if(typeof min == typeof undefined && typeof max !== typeof undefined)
		{
			if(length > max)
			{
				err = true;
				pushErrorMessage(5,el,label,min,max);
			}
			else
				el.removeClass('input-error');
		}
		else
		{
			if(length > max || length < min)
			{
				err = true;
				pushErrorMessage("4",el,label,min,max);
				pushErrorMessage("5",el,label,min,max);
			}
			else
				el.removeClass('input-error');
		}
	}
	
	return err;
}


function checkMatch(el,form)
{
  var my_arr = new Array();;
  var err = false;
  var temp = "";
  var rel = el.attr('data-rel');
  
  $('input[data-rel="'+ rel +'"]').each(function() {
      var dis_val = $(this).val();
	  err = emptyValidation($(this));
	  my_arr.push(dis_val);
  });
  
  err = my_arr.allValuesSame();
  if(err)
  {
	$('input[data-rel="'+ rel +'"]').addClass('input-error');
	this.err_arr = new Array("3");
    pushErrorMessage(3,el);
  }
  return err;
}

Array.prototype.allValuesSame = function() {

    for(var i = 1; i < this.length; i++)
    {
        if(this[i] !== this[0])
            return true;
    }
	
    return false;
}

function sprintf( format )
{
  for( var i=1; i < arguments.length; i++ ) {
    format = format.replace( /%s/, arguments[i] );
  }
  return format;
}
