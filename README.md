# qenru-validation
General Form Validation

Features:

- Required fields validation
- Values of fields matching validation
- Checkbox & Radio input validation
- Min & Max character length validation
- Alert style option ( inline , sweet alert )
- Input mask options
- Input file validation
- Ajax form request
- Ajax method & other attributes management
- Ajax response management ( via functions )


Demo is available at http://plugin.softbax.com/qenruValidation/

Standart input structure should be like below :

<input class="input-group" /> // validating inputs or elements which has "input-group" class attribute.
<span class="form-error"></span> // you should add this after input, if you want to show error as "inline" style

data-required = "true" -> Specify required field
data-label = "<label>" -> Specify input this attribute, if you want to add error name for related input
data-min = "<number>" -> Specify minimum value length
data-max = "<number>" -> Specify maximum value length
data-match = "true" -> Specify more than 1 field to check them if match or not.
data-rel = "<number>" -> Works with data-match attribute and stands for checking the same data-rel value.

Example for data-match and data-rel :

"<input type="password" data-required="true" data-match="true" data-rel="1" data-min="3" placeholder="Password"/>"
"<input type="password" data-required="true" data-match="true" data-rel="1" data-min="3" placeholder="Password Again"/>"

"<input type="text" data-required="true" data-match="true" data-rel="2" data-type="email" placeholder="Email"/>"
"<input type="text" data-required="true" data-match="true" data-rel="2" data-type="email" placeholder="Email Again"/>"


