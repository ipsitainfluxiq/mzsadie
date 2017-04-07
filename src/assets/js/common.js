$(document).ready(function(){
    $(".menulink").click(function(){
        $(".menulist").slideToggle("slow");
    });
	
	
	 $("#slider1").responsiveSlides({
      
        speed: 800,
		 timeout: 8000
	
      });
      
      $('.lyfehairhandhead').click(function(){
      
      $('.lyfehairhandcontent').hide();
      $(this).next().show(3000);
      });
	 
	 
});

function view_more()
{
    window.location.href=$('.lyfe_performance_class').attr("href");
}
function shop_now()
{
    window.location.href=$('.shop_class').attr("href");
}
