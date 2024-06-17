(function ($) {
  // Custom function to show an error for a given element ID
  $.fn.showError = function (id, errorMessage, insertAfter) {
    if (!document.getElementById(id)) {
      return;
    }

    let $element = $("#" + id);
    let $parent = $("#" + id).parent();
    insertAfter ? $parent.after(errorMessage) : $parent.append(errorMessage);
    // Check if the target element is a <select>
    if ($element.prop("tagName").toLowerCase() === "select") {
      // If it is a <select>, add the 'error-margin' class to its grandparent
      $element.closest(".form-type-select").addClass("error-margin");
    } else {
      // If it's not a <select>, add the 'error-margin' class to its parent
      $element.parent().addClass("error-margin");
    }
  };

  $.fn.showErrorDropdown = function (id, $error_message) {
    // Check if the element with the specified ID exists
    if (!document.getElementById(id)) {
      return;
    }

    var $element = $("#" + id);
    $element.parent().before($error_message);

    if ($element.prop("tagName").toLowerCase() === "select") {
      $element.parent().parent().addClass("error-margin");
    } else {
      $element.parent().addClass("error-margin");
      $element.closest(".dropdown").find(".fieldset-wrapper").addClass("show");
    }
  };

  // Custom function to scroll to top of the page
  $.fn.gotoElement = function ($id) {
    $([document.documentElement, document.body]).animate(
      {
        scrollTop: $($id).offset().top,
      },
      500
    );
  };

  // Update current page url
  $.fn.updatePageUrl = function () {
    let currentUrl = window.location.href;
    let newUrl = `${currentUrl}/thankyou`;
    window.history.pushState(null, "", newUrl);
  };

  // Custom function to scroll to first error msg element
  $.fn.gotoErrorElement = function () {
    var $errorMessage = $(".error-message:first");

    // Check if any error messages exist
    if ($errorMessage.length === 0) {
      return;
    }

    var middleOffset =
      $errorMessage.offset().top -
      $(window).height() / 2 +
      $errorMessage.outerHeight() / 2;

    // Scroll to the middle of the first error message
    $([document.documentElement, document.body]).animate(
      {
        scrollTop: middleOffset,
      },
      500
    );
  };

  // Set initial variables for form and unique key input
  this.$form = document.querySelector("#subscribe-form");
  this.$unique_key_input = $('input[name="unique_key"]');
  // Interests required flag
  let interestsRequiredArray = [];

  Drupal.behaviors.subscriptionForm = {
    attach: function (context, settings) {
      $(window, context)
        .once()
        // Trigger reload when the browser's history changes, typically due to back or forward navigation.
        .on("popstate", function (event) {
          var currentUrl = window.location.pathname;
          if (currentUrl === "/subscribe") {
            location.reload();
          }
        });

      // Override the styling of select field inside the two-column-wrapper.
      $(".two-columns-wrapper select", context).each(function () {
        // Cache the jQuery object representing the current select element.
        var $selectElement = $(this);
        // Check if the current select element has the class "show-error".
        if ($selectElement.hasClass("show-error")) {
          // Add the "error" class to the closest ancestor element with the class "form-type-select".
          $selectElement.closest(".form-type-select").addClass("error");
        } else {
          // If the class is not present, remove the "error" class.
          $selectElement.closest(".form-type-select").removeClass("error");
        }
      });

      // Attach click event to subscription option items
      $(".form-item-subscription-option", context)
        .once()
        .each(function () {
          $(this).on("click", toggleCheckbox);
        });

      // Attach click event to dropdown accordion items
      $(".dropdown .form-type-checkbox", context)
        .once()
        .each(function () {
          $(this).on("click", toggleCheckbox);
        });

      // Attach change event to subscription option checkboxes
      $('.form-item-subscription-option input[type="checkbox"]', context)
        .once()
        .each(function () {
          $(this).on("change", handleCheckboxChange);
        });

      moveFields();

      // Add focus and blur event handlers for form-text input fields
      $(
        ".form-type-textfield input, .form-type-email input, .form-item-state select",
        context
      )
        .once()
        .on("focus", function () {
          $(this).closest(".form-item").addClass("has-focus");
        })
        .on("blur", function () {
          if ($(this).val() === "") {
            $(this).closest(".form-item").removeClass("has-focus");
          }
        });

      // Toggle dropdown content on legend click
      $("legend", context)
        .once()
        .on("click", function () {
          $(this).toggleClass("active");
          let dropdownContent = $(this).parent().find(".fieldset-wrapper");
          dropdownContent.toggleClass("show");
        });
      // Attach change event to the "edit-professions" dropdown
      $("#edit-professions", context)
        .once()
        .change(handleEditProfessionsChange);
    },
  };

  /**
   * Move the Mobile & State fields under participation accordion
   * Move project other field under projects accordion
   */
  function moveFields() {
    if ($("#edit-interested-in-1").length) {
      $(".two-columns-wrapper")
        .once()
        .insertAfter($("#edit-interested-in-1").parent());
    }

    if ($(".form-item-project-type-other label").length) {
      $(".form-item-project-other")
        .once()
        .insertAfter($(".form-item-project-type-other label"));
    }
  }

  // Toggle the checkbox based on the clicked element
  function toggleCheckbox(target) {
    // Check if the project_other element is displayed
    let isProjectOtherDisplayed =
      $(".form-item-project-other").css("display") !== "none";
    // Check if the clicked target contains the project_other element
    let isProjectOtherInTarget =
      $(target.currentTarget).find(".form-item-project-other").length > 0;

    if (!isProjectOtherDisplayed) {
      // If project_other is not displayed, click the checkbox
      target.currentTarget.querySelector(".form-checkbox").click();

      if (isProjectOtherInTarget) {
        // If project_other is in the clicked target, enable the checkbox
        $(".form-item-project-type-other label").addClass("checkbox-enabled");
      }
    } else {
      if (isProjectOtherInTarget) {
        // If project_other is displayed and in the clicked target, remove checkbox enabled status on label click
        $(".form-item-project-type-other label").click(function () {
          $(this).removeClass("checkbox-enabled");
        });
      } else {
        // If project_other is displayed but not in the clicked target, click the checkbox
        target.currentTarget.querySelector(".form-checkbox").click();
      }
    }
  }

  // Handle the change event for "edit-professions" dropdown
  function handleEditProfessionsChange() {
    var selectedOption = $(this).find(":selected");
    // Check if the selected option is not "Profession (optional)"
    if (selectedOption.val() !== "") {
      $(".form-item-professions").addClass("has-focus");
      $(".fake-label, .form-item-professions select").addClass("active");
    } else {
      $(".form-item-professions").removeClass("has-focus");
      $(".fake-label, .form-item-professions select").removeClass("active");
    }
    if (selectedOption.val() == "Other") {
      $(".fake-label, .form-item-professions select").removeClass("active");
    }
  }
  // Handle the change event for checkboxes
  function handleCheckboxChange() {
    let formItem = $(this).closest(".form-item-subscription-option");
    let unique_key = formItem.data("uniqueKey").trim();
    let interests_required = formItem.data("interestsRequired");
    // Check if the checkbox is checked
    if ($(this).prop("checked")) {
      $unique_key_input.attr(
        "value",
        $unique_key_input.val() +
          ($unique_key_input.val() ? "," : "") +
          unique_key
      );
      if (interests_required == "yes") {
        interestsRequiredArray.push({
          key: unique_key,
          value: 1,
        });
      }
    } else {
      // If unchecked, remove the unique key and any trailing comma from the value attribute of the $unique_key_input element
      let regex = new RegExp("(^|,)" + unique_key + ",?", "g");
      $unique_key_input.attr(
        "value",
        $unique_key_input.val().replace(regex, "")
      );
      // Filter out the unique key from the interestsRequiredArray
      interestsRequiredArray = interestsRequiredArray.filter(
        (item) => item.key !== unique_key
      );
    }
    // Check if there are any items in the interestsRequiredArray with a value of 1
    if (interestsRequiredArray.some((item) => item.value === 1)) {
      $('input[name="interests_required"]').prop("checked", true);
      $(".input-hint").addClass("hidden");
    } else {
      $('input[name="interests_required"]').prop("checked", false);
      $(".input-hint").removeClass("hidden");
    }
  }
})(jQuery);
