class FadeSequence {
    constructor() {
        this.mainMessage = document.querySelector('.main-message');
        this.typewriterText = document.getElementById('typewriter-text');
        this.typewriterCursor = document.getElementById('typewriter-cursor');
        this.signature = document.querySelector('.signature');
        this.letters = document.querySelectorAll('.letter');
        this.letterQueue = [];
        
        this.fullText = "Phase 1: Complete\nPhase 2: Loading...";
        this.currentText = "";
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        this.typewriterCursor.style.display = 'none';
        this.typeWriter();
    }
    
    typeWriter() {
        if (this.currentIndex < this.fullText.length) {
            this.currentText += this.fullText.charAt(this.currentIndex);
            
            this.typewriterText.innerHTML = this.currentText + '<span class="blinking-cursor">_</span>';
            
            this.currentIndex++;
            
            const typingSpeed = 50 + Math.random() * 100;
            setTimeout(() => this.typeWriter(), typingSpeed);
        } else {
            setTimeout(() => {
                this.fadeOutMainMessage();
            }, 3000);
        }
    }
    
    fadeOutMainMessage() {
        this.mainMessage.style.transition = 'opacity 1s ease-out';
        this.mainMessage.style.opacity = '0';
        
        setTimeout(() => {
            this.showSoon();
        }, 1000);
    }
    
    showSoon() {
        this.soonElement = document.createElement('div');
        this.soonElement.className = 'soon-message';
        
        document.body.appendChild(this.soonElement);
        
        this.soonText = "See you soon ;)";
        this.soonCurrentText = "";
        this.soonIndex = 0;
        
        setTimeout(() => {
            this.soonElement.classList.add('visible');
            this.typeSoon();
        }, 100);
    }
    
    typeSoon() {
        if (this.soonIndex < this.soonText.length) {
            this.soonCurrentText += this.soonText.charAt(this.soonIndex);
            this.soonElement.innerHTML = this.soonCurrentText + '<span class="blinking-cursor">_</span>';
            this.soonIndex++;
            
            const typingSpeed = 80 + Math.random() * 80;
            setTimeout(() => this.typeSoon(), typingSpeed);
        } else {
            setTimeout(() => {
                this.glitchOut();
            }, 3000);
        }
    }
    
    glitchOut() {
        let glitchCount = 0;
        const maxGlitches = 32; 
        
        const glitchInterval = setInterval(() => {
            if (Math.random() < 0.7) {
                this.soonElement.style.opacity = Math.random() < 0.4 ? '0' : '1';
            }
            
            
            if (Math.random() < 0.8) {
                this.soonElement.style.filter = `hue-rotate(${Math.random() * 360}deg) saturate(${2 + Math.random() * 4}) contrast(${0.5 + Math.random() * 2}) brightness(${0.3 + Math.random() * 1.4})`;
            }
            
            if (Math.random() < 0.8) {
                const glitchChars = '█▓▒░▄▀■□▪▫◘◙';
                const originalText = "See you soon ;)";
                let corruptedText = "";
                for (let i = 0; i < originalText.length; i++) {
                    if (Math.random() < 0.3) {
                        corruptedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    } else {
                        corruptedText += originalText[i];
                    }
                }
                this.soonElement.innerHTML = corruptedText;
            }
            
            glitchCount++;
            
            if (glitchCount >= maxGlitches) {
                clearInterval(glitchInterval);
                this.soonElement.style.display = 'none';
                
                setTimeout(() => {
                    this.fadeInSignature();
                }, 1000);
            }
        }, 60); 
    }
    
    fadeInSignature() {
        this.signature.style.transition = 'opacity 1.5s ease-out';
        this.signature.style.opacity = '1';
        
        setTimeout(() => {
            this.startLetterBreakdown();
        }, 2000);
    }
    
    startLetterBreakdown() {
        this.letterQueue = Array.from(this.letters);
        this.shuffleArray(this.letterQueue);
        
        this.fadeNextLetter();
    }
    
    fadeNextLetter() {
        if (this.letterQueue.length === 0) {
            return;
        }
        
        const letter = this.letterQueue.shift();
        letter.classList.add('fading');
        
        if (this.letterQueue.length > 0) {
            const delay = 300 + Math.random() * 1200;
            setTimeout(() => {
                this.fadeNextLetter();
            }, delay);
        }
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new FadeSequence();
    }, 100);
}); 