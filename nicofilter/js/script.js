$.getVideoInfo = function(thisObject, id, callback){
    $.ajax({
        type: 'GET',
        url: 'https://ext.nicovideo.jp/api/getthumbinfo/' + id,
        dataType: 'html',
        success: function(data, textStatus, jqXHR){
            var url = $("watch_url", data).text();
            var userId = $("user_id", data).text();
            var name = $("user_nickname", data).text();
            var chId = $("ch_id", data).text();
            var chName = $("ch_name", data).text();
            // console.log("url: "+url+", id:"+userId+", name:"+name);
            if(url != undefined && id != '' && name != ''){
                var user = {"id":userId, "name":name, "url":url, "isUser":true};
                var str = JSON.stringify(user);
                chrome.storage.local.get(userId, function(result){
                    if(result[userId] != undefined){
                        callback(thisObject, JSON.parse(result[userId]));
                    }else{
                        var item = {};
                        item[userId] = str;
                        item[id] = userId;
                        chrome.storage.local.set(item, function(){
                            // console.log('item saved id:'+id);
                        });
                        callback(thisObject, user);
                    }
                });
            }else if(chId != '' && chName != ''){
                var user = {"id":chId, "name":chName, "url":url, "isUser":false};
                var str = JSON.stringify(user);
                chrome.storage.local.get(chId, function(result){
                    if(result[chId] != undefined){
                        callback(thisObject, JSON.parse(result[chId]));
                    }else{
                        var item = {};
                        item[chId] = str;
                        item[id] = chId;
                        chrome.storage.local.set(item, function(){
                            // console.log('item saved id:'+id);
                        });
                        callback(thisObject, user);
                    }
                });
            }else{
                console.log("error id="+id+": ");
                if(!url) url = "取得に失敗しました";
                if(!userId) userId = "取得に失敗しました";
                if(!name) name = "取得に失敗しました";
                chrome.storage.local.get(userId, function(item){
                    if(item[userId] != undefined){
                        callback(thisObject, JSON.parse(item[userId]));
                    }else{
                        callback(thisObject, {"id":userId, "name":name, "url":url});
                    }
                });
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("error id="+id+": ");
            console.log(errorThrown);
        },
        complete: function(jqXHR, textStatus){
        }
    });
};

