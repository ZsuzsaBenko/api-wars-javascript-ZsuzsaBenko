
export function fetchData(url, func){
    $.getJSON(url, function(response){
        func(response);
    });
}