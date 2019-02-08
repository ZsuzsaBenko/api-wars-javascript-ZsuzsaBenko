
export function fetchData(url, func){
    $.getJSON(url, function(response){
        func(response);
    });
}

export function sendData(url, data, func){
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      contentType: 'application/json;charset=UTF-8',
      success: func(data),

    });
}

export function spin(){
     $(document).ajaxStart(function(){
         $("#wait").css("display", "flex");
    });

    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
}