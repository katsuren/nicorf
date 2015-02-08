$(function(){
    function updateRanking(rankingElement, userData){
        // console.log(userData['id']+': '+userData['name']);
        var p = rankingElement.find("p.itemTime");
        var html = p.html();
        html = html + "<br/>BY： <a href=\"http://www.nicovideo.jp/user/" + userData['id'] + "\">" + userData['name'] + "</a>";
        p.html(html);
    };

    chrome.storage.local.get("watchList", function(item){
        var watchList = item["watchList"];
        if (!watchList) {
            watchList = {};
        } else {
            watchList = JSON.parse(watchList);
        }

        $("li.item.videoRanking").each(function(){
            var thisObject = $(this);
            var videoId = thisObject.data('id');
            chrome.storage.local.get(videoId, function(item){
                var userId = item[videoId];
                // console.log('got userId:'+userId+" - videoId of "+videoId);
                if(!userId){
                    $.getVideoInfo(thisObject, videoId, function(elem, user){
                        updateRanking(elem, user);
                    });
                }else{
                    chrome.storage.local.get(userId, function(item){
                        var user = item[userId];
                        // console.log('got user data:'+user);
                        if(!user){
                            $.getVideoInfo(thisObject, videoId, function(elem, user){
                                updateRanking(elem, user);
                            });
                        }else{
                            userData = JSON.parse(user);
                            updateRanking(thisObject, userData);
                        }
                    });
                }
            });

            if (watchList[videoId]) {
                console.log("videoId:"+videoId+"---"+watchList[videoId]);
                thisObject.css({opacity:0.3});
                var numWrap = thisObject.find("div.rankingNumWrap");
                numWrap.append('<p>視聴済み:'+watchList[videoId]+'回</p>');
            }
        });
    });
});

