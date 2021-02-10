export default class TypeWriter {

    // TODO : - Hot classes , Ignition and Turbo Fan

    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);     // Base 10 --> Decimal
        this.type();
        this.isDeleting = false;
    }

    type() {
        // Current index of word
        const current = this.wordIndex % this.words.length;

        // Get full text of current word
        const fullTxt = this.words[current]; 
        // Check if deleting phase
        if (this.isDeleting)
            this.txt = fullTxt.substring(0, this.txt.length - 1);  // Remove element
        else
            this.txt = fullTxt.substring(0, this.txt.length + 1);  // Add element
        
        // Insert txt into element
        this.txtElement.innerHTML = `<span className="app__header__text--type">${this.txt}</span>`;


        // Initial Type Speed
        let typeSpeed = 300;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        // If word is complete 
        if (!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.wait;

            // Set delete to true
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === "") { 
            this.isDeleting = false;

            // Move to next word
            this.wordIndex++;

            // Pause before start typing
            typeSpeed = 5000;
        }

        setTimeout(() => this.type(), typeSpeed)
    }
}