const puppeteer = require('puppeteer'); // Require the Package we need...
const fs = require('fs');

let scrape = async () => { // Prepare scrape...
	
	const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disabled-setuid-sandbox']}); // Prevent non-needed issues for *NIX
	const page = await browser.newPage(); // Create request for the new page to obtain...

   // Replace with your Google Maps URL... Or Test the Microsoft one...
 	
	await page.goto("https://www.facebook.com/pg/AmericanBounty/reviews/?ref=page_internal");
	await page.waitFor(1000); // In case Server has JS needed to be loaded...
	await page.setViewport({
        width: 1200,
		height: 1000,
		isMobile: false
    });

    const result = await autoScroll(page).then(x => {
		return x;
	});

    await page.screenshot({
        path: 'fb.png',
        fullPage: true
    });
	// const result = await page.evaluate(() => { // Let's create variables and store values...
	// 	const allObjects = [];		
	// 	let containers = document.querySelectorAll('._5pcr.userContentWrapper');
	// 	containers.forEach(x => {
	// 		let fullName = x.querySelector('.fwb').innerText;
	// 		let postDate = x.querySelector('.timestampContent').innerText
	// 		let starRating = x.querySelector('._51mq.img.sp_GhtdmQRMndW.sx_af66d4') ?  x.querySelector('._51mq.img.sp_GhtdmQRMndW.sx_af66d4').innerText: ""
	// 		let recommendation = x.querySelector('.fcg') ? x.querySelector('.fcg').innerText : ""; 
	// 		let postReview = x.querySelector('._5pbx.userContent._3576').innerText; 

	// 		allObjects.push(
	// 			{ 
	// 				fullName: fullName,
	// 				postDate: postDate,
	// 				postReview: postReview,
	// 				starRating: starRating,
	// 				recommendation: recommendation
	// 			}
	// 		);
	// 	});
	
	// 	return  allObjects;
		
	// 	});

	browser.close(); // Close the Browser...
	return result; // Return the results with the Review...
};
async function autoScroll(page){
   return await page.evaluate(async () => {
		// window.scrollBy(0, document.body.scrollHeight);
         return await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 200;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
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
							starRating: ""
							,recommendation: "",
							averageRating: document.querySelector('._672g._1f47').innerText
						}
					);
					let containers = document.querySelectorAll('._5pcr.userContentWrapper');
					containers.forEach(x => {
						let fullName = x.querySelector('.fwb').innerText;
						let postDate = x.querySelector('.timestampContent').innerText
						let starRating = x.querySelector('._51mq.img.sp_GhtdmQRMndW.sx_af66d4') ?  x.querySelector('._51mq.img.sp_GhtdmQRMndW.sx_af66d4').innerText: ""
						let recommendation = x.querySelector('.fcg') ? x.querySelector('.fcg').innerText : ""; 
						let postReview = x.querySelector('._5pbx.userContent._3576').innerText; 
			
						allObjects.push(
							{ 
								fullName: fullName,
								postDate: postDate,
								postReview: postReview,
								starRating: starRating
								,recommendation: recommendation,
								averageRating: 0
							}
						);
					});
				
                    return resolve(allObjects);
                }
            }, 200);
        });
    });
}
scrape().then((value) => { // Scrape and output the results...
	console.log(value); // Yay, output the Results...
	fs.writeFile("./data/facebook_reviews.json", JSON.stringify(value), function(err) {
		if(err) {
			return console.log(err);
		}
	
		console.log("The file was saved!");
	});
	
});