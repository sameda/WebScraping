const puppeteer = require('puppeteer'); // Require the Package we need...
const fs = require('fs');

let scrape = async () => { // Prepare scrape...
	// document.querySelector('.nav.next.taLnk.ui_button.primary').href
	// const allObjects = [];	
	
	const getPage = async url => {		
		// Scrape the data we want
		const page = await browser.newPage();
		await page.goto(url);
		await page.waitFor(500);
		const result = await page.evaluate(() => { 
			const allObjects = [];	
			if(window.location.href == "https://www.tripadvisor.com/Restaurant_Review-g60801-d1158752-Reviews-American_Bounty-Hyde_Park_New_York.html"){
				allObjects.push(
					{ 
						fullName: "",
						postDate: "",
						reviewTitle: "",
						postReview: "",
						starRating: "",
						averageRating: document.querySelector('.restaurants-detail-overview-cards-RatingsOverviewCard__overallRating--nohTl').innerText.trim()
					}
				);
			}
			
			let containers = document.querySelectorAll('.review-container');
			containers.forEach(x => {

				let fullName = x.querySelector('.info_text > div').innerText;
				let postDate = x.querySelector('.ratingDate').title
				let starRating = x.querySelector('.ui_bubble_rating').className.slice(-2)
				let reviewTitle = x.querySelector('.noQuotes').innerText;
				let postReview = x.querySelector('.partial_entry').innerText; 

				allObjects.push(
					{ 
						fullName: fullName,
						postDate: postDate,
						reviewTitle: reviewTitle,
						postReview: postReview,
						starRating: starRating,
						averageRating: 0
					}
				);
			});
			// if(document.querySelector('.nav.next.taLnk.ui_button.primary'))
			// 	return  allObjects.concat(that.getPages(document.querySelector('.nav.next.taLnk.ui_button.primary').href));
			// else		
			// const  overallObj = {
			// 	data: allObjects,
			// 	nextUrl: document.querySelector('.nav.next.taLnk.ui_button.primary') ? document.querySelector('.nav.next.taLnk.ui_button.primary').href : null
			// };	
			//return allObjects;
			return allObjects
		
		});
		await page.close();
	
		// // Recursively scrape the next page

		if (url == "https://www.tripadvisor.com/Restaurant_Review-g60801-d1158752-Reviews-or370-American_Bounty-Hyde_Park_New_York.html") {
		  return result;
		} else {
		  
		  let nextUrl = '';
		  let urlParts = url.split('-Reviews-or');
		  if(urlParts.length == 1){
				nextUrl = 'https://www.tripadvisor.com/Restaurant_Review-g60801-d1158752-Reviews-or20-American_Bounty-Hyde_Park_New_York.html'
		  }
		  else if(urlParts.length == 2){
			  let innerParts = urlParts[1].split('-');
			  if(innerParts.length > 1 ){
				  let pageNr =  parseInt(innerParts[0]);
				  let newNr = pageNr + 10
				  let twoMainParts = url.split('-or' + pageNr + '-');
				  if(twoMainParts.length == 2)
				  	nextUrl = twoMainParts[0] + '-or' + newNr + '-' + twoMainParts[1]
			  }
		  }
		  return result.concat(await getPage(nextUrl))
		}
	  };

	const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disabled-setuid-sandbox']}); // Prevent non-needed issues for *NIX
	 	
	const result = await getPage("https://www.tripadvisor.com/Restaurant_Review-g60801-d1158752-Reviews-American_Bounty-Hyde_Park_New_York.html");

	browser.close(); 
	return result; 
};

scrape().then((value) => { // Scrape and output the results...
	console.log(value); 
	fs.writeFile("./data/tripadvisor_reviews.json", JSON.stringify(value), function(err) {
		if(err) {
			return console.log(err);
		}
	
		console.log("The file was saved!");
	});
	
});