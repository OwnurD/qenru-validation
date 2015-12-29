/**
 * qenru Form Validation v1.0.0
 * http://plugin.softbax.com/qenruValidation
 *
 * Copyright 2015, Turhan Onur Dogucu - http://onurdogucu.com ( Under Construction )
 * Written while dreaming about validating meaning of life...
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
 var canFormSubm = false;
 var selectedErrorArr = new Array();

 var defaults = {

    // GENERAL
    url: '/',
    ajaxRequest: false,
    dataType: 'html',
    requestMethod: 'post',
    alertType: 'inner',
    phoneMask : false,

    // CALLBACKS
    ajaxOnSuccess: function() {},
    ajaxOnError: function() {},
  }

  function errors(id,label,min,max)
  {
    label = label === undefined ? "" : label;
    var errorArray = new Array();
    errorArray[0] = label == "" ? "Fill the required field(s) !" : sprintf('Please Fill the %s field !.',label);;
    errorArray[1] = "Email must be in correct format !";
    errorArray[2] = "Phone Number must be in correct format !";
    errorArray[3] = "Values are not matching!";
    errorArray[4] = sprintf('%s field should have min. %s characters length !.',label,min);
    errorArray[5] = sprintf('%s field should have max. %s characters length !.',label,max);
    return errorArray[id];
  }
  $.fn.qValidate = function(options)
  {
    var validate = {};
  // kullanıcının tanımladığı ve varsayılan ayarları birleştirme - merge user-defined options with the defaults
  validate.settings = $.extend({}, defaults, options);
  var self = this;
  

  var isPhoneMask = validate.settings.phoneMask;
  if(isPhoneMask) phoneMask(self.attr('id'));

  this.submit(function(e){
    if(canFormSubm)
    {
      return;
    }
    else
    {
      var form = self.attr('id');
      var url = validate.settings.url;
      var ajax = validate.settings.ajaxRequest;
      var postDataType = validate.settings.dataType;
      var requestMethod = validate.settings.requestMethod;
      var alertType = validate.settings.alertType;
      var ajaxOnSuccess = validate.settings.ajaxOnSuccess;
      var ajaxOnError = validate.settings.ajaxOnError;

      selectedErrorArr = [];
      var err = false;
      var checkErr = false;
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

          //Type attribute yok ise data-type sorgulama - if type attribute not exist or invalid for field, checking for data-type
          if (typeof attrType !== typeof undefined && attrType !== false) {
            dataType = attrType;
          }
          else
          {
            if (typeof type !== typeof undefined && type !== false) 
            {
              dataType = type;
            }
          }





          //Gerekli alan konrolü - checking required fields
          if(is_required == "true") {
           switch (dataType) {
             case "text":
             err = emptyValidation(el) == true ? true : err;
             temp_err = emptyValidation(el);
             if(temp_err) pushErrorMessage(0,el,label,null,null,alertType); //id,el,label,min,max,alertType
             else removeErrorFromField(el,alertType);
             break;
             case "password":
             err = emptyValidation(el) == true ? true : err;
             temp_err = emptyValidation(el);
             if(temp_err) pushErrorMessage(0,el,label,null,null,alertType); //id,el,label,min,max,alertType
             else removeErrorFromField(el,alertType);
             break;
             case "select":
             err = emptyValidation(el) == true ? true : err;
             temp_err = emptyValidation(el);
             if(temp_err) pushErrorMessage(0,el,label,null,null,alertType); //id,el,label,min,max,alertType
             else removeErrorFromField(el,alertType);
             break;
             case "email":
             err = emailValidation(el) == true ? true : err;
             temp_err = emailValidation(el);
             if(temp_err) pushErrorMessage(1,el,label,null,null,alertType); //id,el,label,min,max,alertType
             else removeErrorFromField(el,alertType);
             break;
             case "tel":
             err = phoneValidation(el) == true ? true : err;
             temp_err = phoneValidation(el);
             if(temp_err) pushErrorMessage(2,el,label,null,null,alertType); //id,el,label,min,max,alertType
             else removeErrorFromField(el,alertType);
             break;
             case "file":
             err = emptyValidation(el) == true ? true : err;
             temp_err = emptyValidation(el);
             if(temp_err) pushErrorMessage(0,el,label,null,null,alertType); //id,el,label,min,max,alertType
             else removeErrorFromField(el,alertType);
             break;
             case "radio":
             case "checkbox":
             err = radiocheckboxValidation(el) == true ? true : err;
             temp_err = radiocheckboxValidation(el);
             if(temp_err) pushErrorMessage(0,el,label,null,null,alertType); //id,el,label,min,max,alertType
             else removeErrorFromField(el,alertType);
             break;
             default:
             sweetAlert("An Error Occured! Try again later.", "", "error");
             return false;
             break;

           }
         }

         //Şifre veya değer eşleştirme - Making match passwords and values
         if(is_require_match == "true")
         {

          err =  checkErr = checkMatch(el,form,alertType,err);
          console.log(err);
        }

        if(!checkErr)
        {
          if(typeof min_length !== typeof undefined && min_length !== false)
          {
           err = checkLength(el,min_length,max_length,label,alertType);
         }

         if(typeof max_length !== typeof undefined && max_length !== false)
         {
           err = checkLength(el,min_length,max_length,label,alertType);
         }
       }


     });




if (!err && ajax) {
  var form = $('#' + form).serialize();
  dataPost(form,url,postDataType,requestMethod,ajaxOnSuccess,ajaxOnError);
  e.preventDefault();
}
else
{
  if(alertType == "sweetalert")
  {
    if(!err)
    {
      canFormSubm = true;
      //sweetAlert("Form successfully validated", "", "success");
      self.submit();
    }
    else
    {
      canFormSubm = false;
      e.preventDefault();
      for(var i = 0;i < selectedErrorArr.length; i++)
      {
        errMessage += selectedErrorArr[i] + "\n";
      }
      sweetAlert(errMessage, "", "error");
    }
  }
  else
  {
    if(!err)
    {
      canFormSubm = true;
      self.submit();
    }
    else
    {
      e.preventDefault();
      canFormSubm = false;
    }
  }
}
}
});

}



function addErrorToField(el,alertType)
{
  el.addClass('input-error');
  if(alertType == "inline") el.next('span').addClass('active');
}

function removeErrorFromField(el,alertType)
{
  el.removeClass('input-error');
  if(alertType == "inline") 
  {
    el.next('span.form-error').removeClass('active');
    el.parent().next('span.form-error').removeClass('active');
  }
}

function emptyValidation(el)
{
  var elValue = el.val();
  elValue = elValue != null ? elValue.trim() : elValue;
  if(elValue == "" || elValue == null || elValue === undefined)
  {
    addErrorToField(el);
    return true;
  }
  else {
    removeErrorFromField(el);
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




function checkLength(el,min,max,label,alertType)
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
				pushErrorMessage(4,el,label,min,max,alertType);
			}
			else
				removeErrorFromField(el,alertType);
		}
		else if(typeof min == typeof undefined && typeof max !== typeof undefined)
		{
			if(length > max)
			{
				err = true;
				pushErrorMessage(5,el,label,min,max,alertType);
			}
			else
				removeErrorFromField(el,alertType);
		}
		else
		{
			if(length > max || length < min)
			{
				err = true;
				pushErrorMessage("4",el,label,min,max,alertType);
				pushErrorMessage("5",el,label,min,max,alertType);
			}
			else
				removeErrorFromField(el,alertType);
		}
	}
	
	return err;
}


function checkMatch(el,form,alertType,err)
{
  var my_arr = new Array();;
  var err = false;
  var temp = "";
  var rel = el.attr('data-rel');
  
  $('input[data-rel="'+ rel +'"]').each(function() {
    var dis_val = $(this).val();
    my_arr.push(dis_val);
  });
  
  err = my_arr.allValuesSame();
  if(err)
  {
   $('input[data-rel="'+ rel +'"]').addClass('input-error');
   this.err_arr = new Array("3");
   pushErrorMessage(3,el,"",null,null,alertType);
 }
 return err;
}

function pushErrorMessage(id,el,label,min,max,alertType)
{
  var errorMessage = "";
  errorMessage = errors(id,label,min,max);
  if(alertType == "sweetalert")
  {
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
  else
  {
    el.addClass('input-error');
    el.parent().next('span').html(errorMessage).addClass('active');
    el.next('span').html(errorMessage).addClass('active');
  }
  
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

function phoneMaskArray(formArray)
{
  for(var i = 0;i < formArray.length;i++) {
    $("#" + formArray[i]).find($('*[data-type="tel"]')).each(function(){
      $(this).mask('(999) 999-9999');
    });
  }
}

function phoneMask(formArray)
{
  $("#" + formArray).find($('*[data-type="tel"]')).each(function(){
    $(this).mask('(999) 999-9999');
  });
}


function validateEmail(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}

function validatePhone(phone) {
  var re = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
  return re.test(phone);
}

function dataPost(form,url,postDataType,requestMethod,ajaxOnSuccess,ajaxOnError)
{
  $.ajax({
    url: url,
    dataType : postDataType,
    type: requestMethod,
    data: form,
    success: ajaxOnSuccess,
    error: ajaxOnError
  });

}
