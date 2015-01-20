(function() {

  var onLoad = function() {
    assignEventHandlers();
  };

  var assignEventHandlers = function() {
    var btnMount = document.querySelector("#btnMount");
    btnMount.addEventListener("click", function(e) {
      onClickedBtnMount();
    });
  };

  var onClickedBtnMount = function() {
    var btnMount = document.querySelector("#btnMount");
    event.preventDefault();
    btnMount.setAttribute("disabled", "true");
    document.getElementById("toast-mount-attempt").show();
    var request = {
      type: "mount"
    };
    chrome.runtime.sendMessage(request, function(response) {
      console.log(response);
      if (response.success) {
        document.getElementById("toast-mount-success").show();
        window.setTimeout(function() {
          window.close();
        }, 2000);
      } else {
        var toast = document.getElementById("toast-mount-fail");
        if (response.error) {
          toast.setAttribute("text", error);
        }
        toast.show();
        btnMount.removeAttribute("disabled");
      }
    });
  };

  var setMessageResources = function() {
    var selector = "data-message";
    var elements = document.querySelectorAll("[" + selector + "]");

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];

      var messageID = element.getAttribute(selector);
      var messageText = chrome.i18n.getMessage(messageID);

      switch(element.tagName.toLowerCase()) {
        case "paper-button":
          var textNode = document.createTextNode(messageText);
          element.appendChild(textNode);
          break;
        case "paper-input":
        case "paper-dropdown":
          element.setAttribute("label", messageText);
          break;
        case "paper-toast":
          element.setAttribute("text", messageText);
          break;
        case "h1":
        case "title":
          var textNode = document.createTextNode(messageText);
          element.appendChild(textNode);
          break;
      }
    }
  };

  window.addEventListener("load", function(e) {
    onLoad();
  });

  setMessageResources();

})();