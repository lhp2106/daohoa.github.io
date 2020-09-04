/**
 * Created by hiepnh on 8/4/17.
 */
function require(url, callback)
{
    var e = document.createElement("script");
    e.src = url;
    e.type="text/javascript";
    e.addEventListener('load', callback);
    document.getElementsByTagName("body")[0].appendChild(e);
}


function loadList(list, i, callback)
{
    require(list[i], function()
    {
        if(i < list.length-1)
        {
            loadList(list, i+1, callback);
        }
        else
        {
            callback();
        }
    });
};