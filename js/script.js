
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
	var $street = $('#street').val();
	var $city = $('#city').val();
	$body.append('<img class="bgimg" src="">');
	$('.bgimg').attr('src', 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + $street +', ' + $city);
	$('#greeting').text('So you want to live in ' + $city + '?');
	
	// load NY Times articles
	var formattedCity = $city.replace(' ', '-').replace(',', '');
	var nytimesAPI = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="+ formattedCity +"&sort=newest&api-key=494d0cd17d2dab05ff6e6d4f7328e8ac:1:72666109";
	$.getJSON(nytimesAPI, function(response){
		$nytHeaderElem.text('New York Times Articles About ' + $city);
		$.each(response, function(i, data){
			var info = new Object;
			info = data;
			$(info.docs).each(function(index, data, info) {
				var url = this.web_url;
				var description = this.lead_paragraph;
				var heading = this.headline.main;
				info = '<li class="article"><a href="'+url+'">'+heading+'</a><p>'+description+'</p></li>';
				var entry = $('#nytimes-articles').append(info);
				if ( index === 4 ) {
					return false;
				}
			});
		});
	}).error(function(e) {
		$nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
	});
	
	// load wikipedia links
	var title = $city.replace(' ', '%20').replace(',', '')
	var wikiLink = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+title+'&format=json&callback=wikiCallback';
	var wikiRequestTimeout = setTimeout(function() {
		$wikiElem.text('Failed to get wikipedia resources');
	}, 8000);
	$.ajax( {
		url: wikiLink,
		dataType: 'jsonp',
		success: function(data) {
		   var articleList = data[1];
		   for (var i = 0; i < articleList.length; i++) {
			   articleStr = articleList[i];
			   var url = 'https://en.wikipedia.org/wiki/' + articleStr;
			   $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
		   };
		   clearTimeout(wikiRequestTimeout);
		}
	} );
	
    return false;
	
};

$('#form-container').submit(loadData);
