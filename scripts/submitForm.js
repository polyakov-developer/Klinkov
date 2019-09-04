const im_tel = new Inputmask("+7 (999) 999-99-99", {
  positionCaretOnClick: "radixFocus",
  showMaskOnHover: false,
  clearIncomplete: true
});

const validate = function (element) {
  if (element.value == "" || element.value == undefined) {
    element.classList.add("invalid");
    element.nextElementSibling.classList.add("invalid");
    return false;
  }

  return true;
}

const submitForm = function (e) {
  e.preventDefault();

  let form = e.target,
    formElements = Array.from(form.elements).filter(elem => elem.dataset.required === "true");
  formAction = form.action,
    formData = $(form).serializeArray(),
    formMethod = form.method,
    modalContent = form.querySelector(".modal-content"),
    isContinue = true;

  isContinue = formElements.every(validate);

  if (isContinue) {
    $.ajax({
      url: formAction,
      method: formMethod,
      data: formData,
      dataType: "JSON",
      success: function (responce) {
        if (responce.status == "success") {
          if (modalContent !== null) {
            let modalHeader = modalContent.querySelector(".modal-header"),
              modalBody = modalContent.querySelector(".modal-body"),
              modalFooter = modalContent.querySelector(".modal-footer");

            modalContent.removeChild(modalHeader);
            modalContent.classList.add("modal--success");
            modalBody.innerHTML = `
              <img src="/netcat_template/template/tpl_klinkov/assets/images/success.svg">
              <p>Ваша заявка принята! <br> Скоро мы свяжемся с вами.</p>
            `;

            modalFooter.innerHTML = `<button type="button" class="button" data-dismiss="modal">OK</button>`;

          } else {
            document.getElementById(form.id).reset();
            $("#successModal").modal();
          }
        }
      },
      error: function (jqXHR, status) {
        console.log("jqXHR: ", jqXHR);
        console.log("status: ", status);
      }
    });
  }
}

const formFieldFocusIn = function (e) {
  let input = e.target,
    label = document.getElementById(input.id).labels[0];

  label.classList.add("focus");

  input.classList.remove("invalid");
  input.nextElementSibling.classList.remove("invalid");
}

const formFieldFocusOut = function (e) {
  let input = e.target,
    label = document.getElementById(input.id).labels[0];

  if (input.value == "") {
    label.classList.remove("focus");
  }
}

const removeRequireds = function () {
  let formElements = document.querySelectorAll("form .field input, form .field textarea");

  formElements = [].map.call(formElements, function (obj) {
    if (obj.required === true) {
      obj.dataset.required = "true";
      obj.removeAttribute("required");
    }
  });
}();

const setMask = function () {
  let elems = document.querySelectorAll("input[type='tel']");

  elems = [].map.call(elems, function (obj) {
    if (obj.type == "tel") {
      im_tel.mask(obj);
    }
  });
}();