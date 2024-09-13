async function main() {

  createHomePage();

}

main();


function createHomePage(isMainPage,products, selectedProduct) {
    const main = document.getElementById("main");
    main.innerHTML += `
      <div id="welcome" class=" m-4 text-center">
        <p>
          <h1>Welcome to Meme Dealers!</h1>
          <h6>Your One-Stop Shop for the Internet's Funniest (and Most Ridiculous) Memes</h6><br>
          <h4>Are you under 30, addicted to meme culture, and so internet savvy you could probably speak in GIFs?<br> Well, you've come to the right place!<h4><br>  
          <h4>At Meme Dealers, we're not just selling memes; we're dealing them out like candy at a parade.<br> Whether you're looking for the latest viral sensation or that obscure meme that only true internet connoisseurs will recognize, we've got it all.</h4>
  
          <br><h1>Why Choose Meme Dealers?</h1><br>
  
          <h5><b>Trending Memes Galore</b>:<br> Browse through our collection of the internet's freshest and most hilarious memes.
          Updated so frequently, you’ll wonder if we have a meme time machine (we don’t, or do we?).<br>
          <br><b>Purchase & Own</b>:<br> Found a meme that speaks to your soul? Buy it and make it yours. Who said you can’t own a piece of the internet?<br>
          <br><b>Made with Love (and a Dash of Sarcasm)</b>:<br> Unlike those other meme sites run by corporate bots, every meme here is curated by real humans who laugh, cry, and occasionally snort milk out of their noses while scrolling through the interwebs.
          <br>Why are you still reading this? Start browsing, and let the meme magic begin!</h5><br>
  
          <h2>Meme Dealers:<br> Where every click is a chuckle, and every purchase is a punchline.</h2>
        </p>
        <a href="/webshop" class="btn btn-primary" id="shopLink">Webshop</a>
      </div>  
    `;
}

