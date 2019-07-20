const puppeteer = require('puppeteer'); // Require the Package we need...
const fs = require('fs');

let scrape = async () => { // Prepare scrape...
	
	const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disabled-setuid-sandbox']}); // Prevent non-needed issues for *NIX
	const page = await browser.newPage(); // Create request for the new page to obtain...

   // Replace with your Google Maps URL... Or Test the Microsoft one...
 	
	await page.goto("https://www.google.com/maps/place/American+Bounty+Restaurant/@41.745589,-73.9350087,17z/data=!4m7!3m6!1s0x89dd15e0f0d92f7b:0xe4a9fea14b269497!8m2!3d41.745589!4d-73.93282!9m1!1b1");
	await page.waitFor(1000); // In case Server has JS needed to be loaded...
	await page.setViewport({
        width: 1200,
        height: 100000
    });
	// await autoScroll(page);
    const result = await autoScroll(page).then(x => {
		return x;
	});

    await page.screenshot({
        path: 'yoursite.png',
        fullPage: true
    });
	// const result = await page.evaluate(() => { // Let's create variables and store values...
	// 	const allObjects = [];		
		
	// 	let containers = document.querySelectorAll('.section-review.ripple-container');
	// 	containers.forEach(x => {
	// 		let fullName = x.querySelector('.section-review-title').innerText; // Full Name
	// 		let postDate = x.querySelector('.section-review-publish-date').innerText; // Date Posted
	// 		let starRating = x.querySelector('.section-review-stars').getAttribute("aria-label"); // Star Rating
	// 		let postReview = x.querySelector('.section-review-text').innerText; // Review Posted by Full Name aka Poster

	// 		allObjects.push(
	// 			{ 
	// 				fullName: fullName,
	// 				postDate: postDate,
	// 				postReview: postReview,
	// 				starRating: starRating
	// 				}
	// 		);
	// 	});
	
	// 	return  allObjects;
		
	// 	});

	browser.close(); // Close the Browser...
	return result; // Return the results with the Review...
};
async function autoScroll(page){
   return await page.evaluate(async () => {
         return await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 200;
            var timer = setInterval(() => {
                var scrollHeight = document.querySelector('.section-listbox.section-scrollbox.scrollable-y.scrollable-show').scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
					clearInterval(timer);
						const allObjects = [];		
						
						allObjects.push(
							{ 
								fullName: "",
								postDate: "",
								postReview: "",
								starRating: "",
								averageRating: document.querySelector('.gm2-display-2').innerText
							
								}
						);
						let containers = document.querySelectorAll('.section-review.ripple-container');
						containers.forEach(x => {
							let fullName = x.querySelector('.section-review-title').innerText; // Full Name
							let postDate = x.querySelector('.section-review-publish-date').innerText; // Date Posted
							let starRating = x.querySelector('.section-review-stars').getAttribute("aria-label"); // Star Rating
							let postReview = x.querySelector('.section-review-text').innerText; // Review Posted by Full Name aka Poster

							allObjects.push(
								{ 
									fullName: fullName,
									postDate: postDate,
									postReview: postReview,
									starRating: starRating,
									averageRating: 0
								
									}
							);
						});
			
					// return  allObjects;
                    return resolve(allObjects);
                }
            }, 100);
        });
    });
}
scrape().then((value) => { // Scrape and output the results...
	console.log(value); // Yay, output the Results...
	fs.writeFile("./data/google_reviews.json", JSON.stringify(value), function(err) {
		if(err) {
			return console.log(err);
		}
	
		console.log("The file was saved!");
	});
	
});