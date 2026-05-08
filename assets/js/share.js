
var image_share_url = "http://www.tbwa.com.my/xmas2017/gameScreen.png";
var url = domain = "http://www.tbwa.com.my/xmas2017/";
var social = {

   FacebookShare: function () {
	   window.open("https://www.facebook.com/sharer/sharer.php?u="+domain, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
       
   },

   TwitterShare: function () {
        window.open("https://twitter.com/home?status=SAVE SANTA! And spread the Christmas. Cheer to all that's near and dear! "+url, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");

   },

   FacebookShareWithScore: function (points) {
       window.open("https://www.facebook.com/sharer/sharer.php?u="+domain+"&title=I just scored "+points+" points on the TBWA KL Christmas Greeting!", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
       
   },


   TwitterShareWithScore: function (points) {
        window.open("https://twitter.com/home?status=I just scored "+points+" points on the SAVE SANTA!  %20%20%20%20%20 "+url, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");

   }

}
