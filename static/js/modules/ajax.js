
export function fetchData(url, func){
    $.getJSON(url, function(response){
        func(response);
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